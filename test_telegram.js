const fs = require('fs');
const https = require('https');
const path = require('path');

const configPath = path.join(__dirname, 'telegram_config.json');
if (!fs.existsSync(configPath)) {
  console.error('❌ telegram_config.json not found!');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

if (!config.botToken || !config.chatId) {
  console.log('\n⚠️ Telegram Bot Token or Chat ID is not configured yet!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Follow these 2 quick steps:');
  console.log('1. Telegram app me @BotFather ko "/newbot" send karein aur BOT TOKEN copy karein.');
  console.log('2. Telegram app me @userinfobot ko "/start" send karein aur CHAT ID copy karein.');
  console.log('3. "telegram_config.json" me botToken aur chatId paste karke save karein.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
}

console.log('📡 Sending Test Notification to your Telegram phone app...');

const message = 
`🔔 *THE SUPREME LAUNDRY — TEST NOTIFICATION*
━━━━━━━━━━━━━━━━━━━━━
✅ *Status:* Bot Connected Successfully!
✨ Aapke phone par new laundry orders ke instant alerts aane ke liye taiyar hain.
━━━━━━━━━━━━━━━━━━━━━
📍 Store: Kalurmore Bus Stop, New Town, Kolkata
📞 Phone: 9831930837 / 9007895400`;

const payload = JSON.stringify({
  chat_id: config.chatId,
  text: message,
  parse_mode: 'Markdown'
});

const req = https.request(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.ok) {
        console.log('🎉 SUCCESS! Test notification sent to your Telegram phone app. Check your phone!');
      } else {
        console.error('❌ Telegram API Error:', response.description);
      }
    } catch (e) {
      console.error('Response parse error:', data);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Network request error:', err.message);
});

req.write(payload);
req.end();
