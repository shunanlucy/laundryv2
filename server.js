const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONFIG_FILE = path.join(ROOT, 'telegram_config.json');

// Ensure data folder and orders.json exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// --- Config & Order Database Helpers ---
function getTelegramConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}

function loadOrders() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Failed to save orders:', e.message);
    return false;
  }
}

// --- Telegram Status & Message Formatters ---
const STATUS_META = {
  pending: { label: '⏳ PENDING PICKUP', icon: '⏳' },
  picked_up: { label: '🚚 PICKED UP', icon: '🚚' },
  paid: { label: '💳 PAID & PROCESSING', icon: '💳' },
  completed: { label: '✨ CLEANED & READY', icon: '✨' },
  delivered: { label: '🛵 DELIVERED', icon: '🛵' }
};

function formatTelegramOrderMessage(order) {
  const current = STATUS_META[order.status] || STATUS_META.pending;
  const serviceList = (order.services || []).map((s, idx) => `  ${idx + 1}. ${s}`).join('\n');
  const cleanPhone = String(order.phone || '').replace(/[^0-9]/g, '');

  return `🔔 *LAUNDRY ORDER #${order.bookingId}*
━━━━━━━━━━━━━━━━━━━━━
📍 *CURRENT STATUS:* *${current.label}*
${order.lastUpdated ? `🕒 _Updated: ${order.lastUpdated}_\n` : ''}━━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${order.fullName}
📞 *Phone:* ${order.phone}
📍 *Address:* ${order.address}
━━━━━━━━━━━━━━━━━━━━━
🧺 *Services:*
${serviceList}
📦 *Load:* ${order.weightOrQty || 'Standard'}
📅 *Pickup Slot:* ${order.pickupDate} (${order.pickupSlot})
${order.notes ? `📝 *Note:* ${order.notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━━
💬 *WhatsApp Customer:* https://wa.me/91${cleanPhone}`;
}

function getTelegramInlineKeyboard(bookingId, currentStatus) {
  return {
    inline_keyboard: [
      [
        { text: (currentStatus === 'picked_up' ? '✅ 🚚 Picked Up' : '🚚 Pickup'), callback_data: `st:${bookingId}:picked_up` },
        { text: (currentStatus === 'paid' ? '✅ 💳 Paid' : '💳 Paid'), callback_data: `st:${bookingId}:paid` }
      ],
      [
        { text: (currentStatus === 'completed' ? '✅ ✨ Complete' : '✨ Complete'), callback_data: `st:${bookingId}:completed` },
        { text: (currentStatus === 'delivered' ? '✅ 🛵 Delivered' : '🛵 Deliver'), callback_data: `st:${bookingId}:delivered` }
      ]
    ]
  };
}

// --- Telegram API Request Helper ---
function callTelegramApi(endpoint, payload, callback) {
  const config = getTelegramConfig();
  if (!config || !config.botToken) {
    if (callback) callback(new Error('Bot token not configured'));
    return;
  }

  const postData = JSON.stringify(payload);
  const req = https.request(`https://api.telegram.org/bot${config.botToken}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (callback) callback(null, parsed);
      } catch (err) {
        if (callback) callback(err);
      }
    });
  });

  req.on('error', (err) => {
    if (callback) callback(err);
  });

  req.write(postData);
  req.end();
}

// Update Telegram message when status changes (from Telegram or Admin panel)
function syncTelegramOrderMessage(order) {
  if (!order.telegramMessageId || !order.telegramChatId) return;

  const newText = formatTelegramOrderMessage(order);
  const newMarkup = getTelegramInlineKeyboard(order.bookingId, order.status);

  callTelegramApi('editMessageText', {
    chat_id: order.telegramChatId,
    message_id: order.telegramMessageId,
    text: newText,
    parse_mode: 'Markdown',
    reply_markup: newMarkup
  }, (err, res) => {
    if (err) console.warn('Telegram message sync warning:', err.message);
  });
}

// --- Long Polling Engine for Telegram Inline Buttons ---
let pollingActive = false;
let lastUpdateOffset = 0;

function pollTelegramUpdates() {
  const config = getTelegramConfig();
  if (!config || !config.botToken || !config.enabled) {
    setTimeout(pollTelegramUpdates, 5000);
    return;
  }

  const url = `https://api.telegram.org/bot${config.botToken}/getUpdates?offset=${lastUpdateOffset}&timeout=15`;
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.ok && Array.isArray(response.result)) {
          response.result.forEach(update => {
            lastUpdateOffset = update.update_id + 1;

            // Handle button clicks (callback queries)
            if (update.callback_query && update.callback_query.data) {
              const cq = update.callback_query;
              const dataStr = cq.data; // e.g. "st:SL-12345:picked_up"

              if (dataStr.startsWith('st:')) {
                const parts = dataStr.split(':');
                const bookingId = parts[1];
                const newStatus = parts[2];

                const orders = loadOrders();
                const targetOrder = orders.find(o => o.bookingId === bookingId);

                if (targetOrder) {
                  const nowStr = new Date().toLocaleTimeString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  targetOrder.status = newStatus;
                  targetOrder.lastUpdated = nowStr;
                  if (!targetOrder.history) targetOrder.history = [];
                  targetOrder.history.push({ status: newStatus, time: nowStr, by: 'Telegram' });

                  saveOrders(orders);

                  const meta = STATUS_META[newStatus] || { label: newStatus };

                  // 1. Send toast to Telegram user
                  callTelegramApi('answerCallbackQuery', {
                    callback_query_id: cq.id,
                    text: `✅ Order #${bookingId} marked as ${meta.label}`,
                    show_alert: false
                  });

                  // 2. Edit message text & buttons in Telegram
                  const updatedText = formatTelegramOrderMessage(targetOrder);
                  const updatedMarkup = getTelegramInlineKeyboard(bookingId, newStatus);

                  callTelegramApi('editMessageText', {
                    chat_id: cq.message.chat.id,
                    message_id: cq.message.message_id,
                    text: updatedText,
                    parse_mode: 'Markdown',
                    reply_markup: updatedMarkup
                  });
                } else {
                  callTelegramApi('answerCallbackQuery', {
                    callback_query_id: cq.id,
                    text: `Order #${bookingId} not found in database.`,
                    show_alert: true
                  });
                }
              }
            }
          });
        }
      } catch (e) {
        // Silent catch on parse error
      }
      setTimeout(pollTelegramUpdates, 1000);
    });
  }).on('error', (e) => {
    setTimeout(pollTelegramUpdates, 5000);
  });
}

// Start polling
pollTelegramUpdates();

// --- HTTP Server ---
const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // Set CORS headers for all API calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  // --- API 1: Telegram Notify & Save Order ---
  if (req.method === 'POST' && reqPath === '/api/telegram-notify') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const orderData = JSON.parse(body);
        const config = getTelegramConfig();

        // 1. Store order in database
        const orders = loadOrders();
        const existingIdx = orders.findIndex(o => o.bookingId === orderData.bookingId);

        const nowStr = new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit'
        });

        const orderRecord = {
          ...orderData,
          status: orderData.status || 'pending',
          createdAt: orderData.createdAt || nowStr,
          lastUpdated: nowStr,
          history: [{ status: 'pending', time: nowStr, by: 'Customer' }]
        };

        if (existingIdx >= 0) {
          orders[existingIdx] = { ...orders[existingIdx], ...orderRecord };
        } else {
          orders.unshift(orderRecord);
        }
        saveOrders(orders);

        // 2. Dispatch interactive Telegram Message with Buttons
        if (config && config.botToken && config.chatId && config.enabled) {
          const telegramMsg = formatTelegramOrderMessage(orderRecord);
          const markup = getTelegramInlineKeyboard(orderRecord.bookingId, orderRecord.status);

          callTelegramApi('sendMessage', {
            chat_id: config.chatId,
            text: telegramMsg,
            parse_mode: 'Markdown',
            reply_markup: markup
          }, (err, tgRes) => {
            if (!err && tgRes && tgRes.ok && tgRes.result) {
              // Store telegram message info for editing later
              orderRecord.telegramMessageId = tgRes.result.message_id;
              orderRecord.telegramChatId = config.chatId;
              saveOrders(orders);
            }
          });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, sent: true, order: orderRecord }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // --- API 2: Get All Orders (for Admin Panel) ---
  if (req.method === 'GET' && reqPath === '/api/admin/orders') {
    const orders = loadOrders();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, orders }));
  }

  // --- API 3: Update Order Status from Admin Panel ---
  if (req.method === 'POST' && reqPath === '/api/admin/order-status') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { bookingId, status } = JSON.parse(body);
        if (!bookingId || !status) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ ok: false, error: 'Missing bookingId or status' }));
        }

        const orders = loadOrders();
        const targetOrder = orders.find(o => o.bookingId === bookingId);

        if (!targetOrder) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ ok: false, error: 'Order not found' }));
        }

        const nowStr = new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit'
        });

        targetOrder.status = status;
        targetOrder.lastUpdated = nowStr;
        if (!targetOrder.history) targetOrder.history = [];
        targetOrder.history.push({ status, time: nowStr, by: 'Admin Dashboard' });

        saveOrders(orders);

        // Sync change back to Telegram message
        syncTelegramOrderMessage(targetOrder);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, order: targetOrder }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // --- Route to Admin Dashboard ---
  if (reqPath === '/admin' || reqPath === '/admin/') {
    reqPath = '/admin.html';
  }

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(ROOT, reqPath);

  // Prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
  console.log(`Admin Panel available at http://127.0.0.1:${PORT}/admin`);
});
