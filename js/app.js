/**
 * The Supreme Laundry & Dry Cleaning
 * "We take care of your premium clothes"
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Constants & Config ---
  const WHATSAPP_PHONE = '919831930837';
  const CALL_PHONE = '+919831930837';
  const TELEGRAM_CONFIG = {
    botToken: '8867331648:AAEaqhsbKk0KP2SyX7EZy4OpNfcUCrVO9yg',
    chatId: '5851788285',
    enabled: true
  };

  // --- Header & Scroll Handling ---
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // --- Mobile Hamburger & Drawer ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(open) {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    if (isOpen) {
      hamburgerBtn.classList.add('active');
      mobileDrawer.classList.add('open');
      mobileBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      hamburgerBtn.classList.remove('active');
      mobileDrawer.classList.remove('open');
      mobileBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileMenu());
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // --- Multi-Step Booking Modal Logic ---
  const bookingModal = document.getElementById('bookingModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openBookingBtns = document.querySelectorAll('[data-action="open-booking"]');

  let currentStep = 1;
  const totalSteps = 3;

  const stepContents = document.querySelectorAll('.form-step-content');
  const stepBadges = document.querySelectorAll('.modal-step-badge');
  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnNextStep = document.getElementById('btnNextStep');
  const btnSubmitBooking = document.getElementById('btnSubmitBooking');
  const modalFooterActions = document.getElementById('modalFooterActions');
  const bookingConfirmationView = document.getElementById('bookingConfirmationView');

  // Booking Data Store
  const bookingData = {
    services: ['Soft Wash & Steam Iron'],
    weightOrQty: 'Medium Load (~10 kg / 2 Laundry Bags)',
    pickupDate: '',
    pickupSlot: 'Morning (8:00 AM - 11:00 AM)',
    notes: '',
    fullName: '',
    phone: '',
    address: '',
    bookingId: ''
  };

  function updateModalStepView() {
    stepContents.forEach(step => {
      const stepIndex = parseInt(step.getAttribute('data-step'), 10);
      step.classList.toggle('active', stepIndex === currentStep);
    });

    stepBadges.forEach(badge => {
      const stepIndex = parseInt(badge.getAttribute('data-step'), 10);
      badge.classList.remove('active', 'completed');
      if (stepIndex === currentStep) {
        badge.classList.add('active');
      } else if (stepIndex < currentStep) {
        badge.classList.add('completed');
      }
    });

    // Reset modal scroll to top
    const modalBody = bookingModal ? bookingModal.querySelector('.modal-body') : null;
    if (modalBody) modalBody.scrollTop = 0;

    // Control buttons
    if (btnPrevStep) {
      btnPrevStep.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
    }
    if (currentStep === totalSteps) {
      if (btnNextStep) btnNextStep.style.display = 'none';
      if (btnSubmitBooking) btnSubmitBooking.style.display = 'inline-flex';
    } else {
      if (btnNextStep) btnNextStep.style.display = 'inline-flex';
      if (btnSubmitBooking) btnSubmitBooking.style.display = 'none';
    }
  }

  function openModal(presetService) {
    // Close mobile drawer if open
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      toggleMobileMenu(false);
    }

    // Reset all checkboxes and card states first
    document.querySelectorAll('.service-option-card').forEach(card => {
      const input = card.querySelector('input');
      if (input) input.checked = false;
      card.classList.remove('selected');
    });

    if (presetService) {
      bookingData.services = [presetService];
      let matched = false;
      document.querySelectorAll('.service-option-card input').forEach(input => {
        const card = input.closest('.service-option-card');
        if (input.value.toLowerCase() === presetService.toLowerCase() ||
            input.value.toLowerCase().includes(presetService.toLowerCase()) ||
            presetService.toLowerCase().includes(input.value.toLowerCase())) {
          input.checked = true;
          card.classList.add('selected');
          matched = true;
        }
      });
      if (!matched) {
        // Default to first card if not matched
        const firstCard = document.querySelector('.service-option-card');
        if (firstCard) {
          const firstInput = firstCard.querySelector('input');
          if (firstInput) {
            firstInput.checked = true;
            firstCard.classList.add('selected');
            bookingData.services = [firstInput.value];
          }
        }
      }
    } else {
      // Default to first service
      const firstCard = document.querySelector('.service-option-card');
      if (firstCard) {
        const firstInput = firstCard.querySelector('input');
        if (firstInput) {
          firstInput.checked = true;
          firstCard.classList.add('selected');
          bookingData.services = [firstInput.value];
        }
      }
    }

    // Reset to step 1
    currentStep = 1;
    if (modalStepsBar) modalStepsBar.style.display = 'flex';
    if (modalFooterActions) modalFooterActions.style.display = 'flex';
    if (bookingConfirmationView) bookingConfirmationView.style.display = 'none';
    updateModalStepView();

    // Default tomorrow's date if empty
    const dateInput = document.getElementById('pickupDate');
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
      bookingData.pickupDate = dateInput.value;
    }

    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || '';
      openModal(serviceName);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('open')) {
      closeModal();
    }
  });

  // Step 1: Service selection cards (clean change listener)
  document.querySelectorAll('.service-option-card').forEach(card => {
    const input = card.querySelector('input');
    if (input) {
      input.addEventListener('change', () => {
        card.classList.toggle('selected', input.checked);

        // Refresh selected services
        const selected = [];
        document.querySelectorAll('.service-option-card input:checked').forEach(chk => {
          selected.push(chk.value);
        });
        bookingData.services = selected.length > 0 ? selected : ['Soft Wash & Steam Iron'];
      });
    }
  });

  // Step 2: Time slots
  document.querySelectorAll('.time-slot-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.time-slot-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      bookingData.pickupSlot = pill.getAttribute('data-slot') || pill.textContent.trim();
    });
  });

  // Navigation Steps
  if (btnNextStep) {
    btnNextStep.addEventListener('click', () => {
      if (currentStep === 1) {
        const qtySelect = document.getElementById('pickupQuantity');
        if (qtySelect) bookingData.weightOrQty = qtySelect.value;
      } else if (currentStep === 2) {
        const dateInput = document.getElementById('pickupDate');
        if (!dateInput.value) {
          showToast('Please select a pickup date.');
          dateInput.focus();
          return;
        }
        bookingData.pickupDate = dateInput.value;
        const notesInput = document.getElementById('pickupNotes');
        if (notesInput) bookingData.notes = notesInput.value;
      }

      if (currentStep < totalSteps) {
        currentStep++;
        updateModalStepView();
      }
    });
  }

  if (btnPrevStep) {
    btnPrevStep.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateModalStepView();
      }
    });
  }

  // Submit Booking
  if (btnSubmitBooking) {
    btnSubmitBooking.addEventListener('click', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('custName');
      const phoneInput = document.getElementById('custPhone');
      const addressInput = document.getElementById('custAddress');

      if (!nameInput.value.trim()) {
        showToast('Please enter your full name.');
        nameInput.focus();
        return;
      }
      if (!phoneInput.value.trim()) {
        showToast('Please enter your phone or WhatsApp number.');
        phoneInput.focus();
        return;
      }
      if (!addressInput.value.trim()) {
        showToast('Please enter your pickup address in New Town / Kolkata.');
        addressInput.focus();
        return;
      }

      bookingData.fullName = nameInput.value.trim();
      bookingData.phone = phoneInput.value.trim();
      bookingData.address = addressInput.value.trim();
      bookingData.bookingId = 'SL-' + Math.floor(10000 + Math.random() * 90000);

      // Save lead safely to localStorage
      try {
        localStorage.setItem('supreme_last_booking', JSON.stringify(bookingData));
      } catch (err) {
        // ignore storage errors
      }

      // Populate confirmation ticket
      document.getElementById('confBookingId').textContent = '#' + bookingData.bookingId;
      document.getElementById('confCustomer').textContent = bookingData.fullName;
      document.getElementById('confServices').textContent = bookingData.services.join(', ');
      document.getElementById('confDateTime').textContent = `${bookingData.pickupDate} (${bookingData.pickupSlot.split('(')[0].trim()})`;
      document.getElementById('confAddress').textContent = bookingData.address;

      // Format bullet-proof WhatsApp Bill (Clean line breaks and universal characters)
      const serviceRows = bookingData.services.map((s, idx) => `  (${idx + 1}) ${s}`).join('\n');
      
      const billLines = [
        '📋 *THE SUPREME LAUNDRY - PICKUP INVOICE*',
        '==============================',
        '🔖 *Order No:* #' + bookingData.bookingId,
        '📅 *Date:* ' + bookingData.pickupDate,
        '⏰ *Slot:* ' + bookingData.pickupSlot,
        '==============================',
        '👤 *CUSTOMER DETAILS*',
        '• Name: ' + bookingData.fullName,
        '• Phone: ' + bookingData.phone,
        '• Address: ' + bookingData.address,
        '==============================',
        '🧺 *SERVICES & LOAD*',
        serviceRows,
        '• Load Size: ' + bookingData.weightOrQty,
        '==============================',
        '💰 *BILL ESTIMATE*',
        '• Doorstep Pickup: FREE (Rs. 0)',
        '• Doorstep Delivery: FREE (Rs. 0)',
        '• Disinfection & Care: INCLUDED',
        '• Final Amount: Verified at doorstep',
        '=============================='
      ];
      
      if (bookingData.notes) {
        billLines.push('📝 *Special Note:* ' + bookingData.notes);
        billLines.push('==============================');
      }

      billLines.push('✨ *The Supreme Laundry Assurance:*');
      billLines.push('✔ 100% Individual Batch Wash (No mixing)');
      billLines.push('✔ Steam Ironing & Eco Fabric Care');
      billLines.push('');
      billLines.push('📍 Kalurmore Bus Stop, New Town, Kolkata');
      billLines.push('📞 Helpline: 9831930837 / 9007895400');
      billLines.push('==============================');
      billLines.push('_Please reply "CONFIRM" to lock this pickup!_');

      const billText = billLines.join('\n');
      const waMsg = encodeURIComponent(billText);
      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${waMsg}`;

      const confWhatsAppBtn = document.getElementById('confWhatsAppBtn');
      if (confWhatsAppBtn) {
        confWhatsAppBtn.href = waUrl;
      }

      // Auto open WhatsApp tab with the formatted bill
      try {
        window.open(waUrl, '_blank');
      } catch (err) {
        // Popups might be blocked on some browsers; fallback button is visible
      }

      // Send instant push alert to owner's phone via Telegram Bot
      sendTelegramOrderAlert(bookingData);

      // Hide form steps & footer & steps bar, show confirmation
      stepContents.forEach(step => step.classList.remove('active'));
      if (modalStepsBar) modalStepsBar.style.display = 'none';
      if (modalFooterActions) modalFooterActions.style.display = 'none';
      if (bookingConfirmationView) bookingConfirmationView.style.display = 'block';

      showToast('🎉 Pickup invoice generated! Sending bill to WhatsApp...');
    });
  }

  // --- Telegram Push Notification Dispatcher with Action Buttons ---
  function sendTelegramOrderAlert(orderData) {
    const serviceList = (orderData.services || []).map((s, idx) => `  (${idx + 1}) ${s}`).join('\n');
    const telegramMsg = 
`🔔 *NEW LAUNDRY ORDER RECEIVED!*
━━━━━━━━━━━━━━━━━━━━━
🔖 *Order ID:* #${orderData.bookingId}
👤 *Customer:* ${orderData.fullName}
📞 *Phone:* ${orderData.phone}
📍 *Address:* ${orderData.address}
━━━━━━━━━━━━━━━━━━━━━
🧺 *Services:*
${serviceList}
📦 *Load:* ${orderData.weightOrQty || 'Standard'}
📅 *Pickup Slot:* ${orderData.pickupDate} (${orderData.pickupSlot})
${orderData.notes ? `📝 *Note:* ${orderData.notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━━
💬 *WhatsApp Customer:* https://wa.me/91${String(orderData.phone || '').replace(/[^0-9]/g, '')}`;

    const inlineButtons = {
      inline_keyboard: [
        [
          { text: '🚚 Pickup', callback_data: `st:${orderData.bookingId}:picked_up` },
          { text: '💳 Paid', callback_data: `st:${orderData.bookingId}:paid` }
        ],
        [
          { text: '✨ Complete', callback_data: `st:${orderData.bookingId}:completed` },
          { text: '🛵 Deliver', callback_data: `st:${orderData.bookingId}:delivered` }
        ]
      ]
    };

    // 1. Try local server backend first (stores in database + syncs with Admin Panel)
    fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }).then(res => res.json()).then(data => {
      if (!data.ok && TELEGRAM_CONFIG.enabled && TELEGRAM_CONFIG.botToken && TELEGRAM_CONFIG.chatId) {
        dispatchDirectTelegram(orderData, telegramMsg, inlineButtons);
      }
    }).catch(() => {
      // Server not reachable (static host or LiveServer) -> Direct dispatch
      if (TELEGRAM_CONFIG.enabled && TELEGRAM_CONFIG.botToken && TELEGRAM_CONFIG.chatId) {
        dispatchDirectTelegram(orderData, telegramMsg, inlineButtons);
      }
    });
  }

  function dispatchDirectTelegram(orderData, text, replyMarkup) {
    fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: text,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup
      })
    }).catch(err => {
      console.warn('Direct Telegram dispatch note:', err.message);
    });
  }

  // --- Interactive Laundry Cost Estimator ---
  // Pricing tab switching
  const pricingTabBtns = document.querySelectorAll('.pricing-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  pricingTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pricingTabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Kilogram / Bulk Load Calculator (₹79/kg)
  let kgWeight = 6;
  const kgRate = 79;
  const kgValueDisplay = document.getElementById('calcKgValue');
  const kgTotalDisplay = document.getElementById('calcKgTotal');
  const btnKgMinus = document.getElementById('btnKgMinus');
  const btnKgPlus = document.getElementById('btnKgPlus');

  function updateKgTotal() {
    if (kgValueDisplay) kgValueDisplay.textContent = `${kgWeight} kg`;
    if (kgTotalDisplay) {
      const total = Math.round(kgWeight * kgRate);
      kgTotalDisplay.textContent = `₹${total}`;
    }
  }

  if (btnKgMinus) {
    btnKgMinus.addEventListener('click', () => {
      if (kgWeight > 3) {
        kgWeight -= 1;
        updateKgTotal();
      }
    });
  }
  if (btnKgPlus) {
    btnKgPlus.addEventListener('click', () => {
      if (kgWeight < 50) {
        kgWeight += 1;
        updateKgTotal();
      }
    });
  }

  // Garment Item Calculator (Exact Rates from The Supreme Laundry Rate Card)
  const garmentRates = {
    shirts: 90,     // Shirt/T-Shirt: ₹90 Dry Clean (or ₹40 Soft Wash & Iron)
    trousers: 110,  // Pant/Trouser: ₹110 Dry Clean (or ₹50 Soft Wash & Iron)
    suits: 350,     // Suit (2 Pcs): ₹350
    dresses: 200,   // Cotton Dress: ₹200 / Saree: ₹220
    bedding: 320    // Blanket Single: ₹320
  };

  const garmentCounts = {
    shirts: 2,
    trousers: 1,
    suits: 0,
    dresses: 0,
    bedding: 0
  };

  function updateGarmentTotal() {
    let subtotal = 0;
    for (const [key, count] of Object.entries(garmentCounts)) {
      subtotal += count * garmentRates[key];
    }
    const garmentTotalDisplay = document.getElementById('calcGarmentTotal');
    if (garmentTotalDisplay) {
      garmentTotalDisplay.textContent = `₹${subtotal}`;
    }
  }

  document.querySelectorAll('[data-garment]').forEach(control => {
    const key = control.getAttribute('data-garment');
    const minusBtn = control.querySelector('.btn-item-minus');
    const plusBtn = control.querySelector('.btn-item-plus');
    const countDisplay = control.querySelector('.item-count-val');

    if (minusBtn && plusBtn && countDisplay) {
      minusBtn.addEventListener('click', () => {
        if (garmentCounts[key] > 0) {
          garmentCounts[key]--;
          countDisplay.textContent = garmentCounts[key];
          updateGarmentTotal();
        }
      });
      plusBtn.addEventListener('click', () => {
        if (garmentCounts[key] < 30) {
          garmentCounts[key]++;
          countDisplay.textContent = garmentCounts[key];
          updateGarmentTotal();
        }
      });
    }
  });

  // Initialize Estimators
  updateKgTotal();
  updateGarmentTotal();

  // --- Service Area Checker (New Town, Salt Lake, Rajarhat, Kolkata) ---
  const areaCheckInput = document.getElementById('areaCheckInput');
  const areaCheckBtn = document.getElementById('areaCheckBtn');
  const areaResultMsg = document.getElementById('areaResultMsg');
  const areaPills = document.querySelectorAll('.area-tag-pill');

  const coveredKeywords = [
    'kalurmore', 'kalur more', 'new town', 'action area 1', 'action area 2', 'action area 3',
    'salt lake', 'rajarhat', 'sector v', 'kestopur', 'chinar park', 'baguiati',
    'uniworld', 'ecospace', 'city centre 2', 'dlf',
    '700160', '700156', '700135', '700157', 'kolkata'
  ];

  function verifyArea(query) {
    if (!query) {
      areaResultMsg.className = 'area-result-msg error';
      areaResultMsg.textContent = 'Please enter your pincode or locality.';
      return;
    }

    const clean = query.trim().toLowerCase();
    const isCovered = coveredKeywords.some(k => clean.includes(k) || k.includes(clean));

    if (isCovered || clean.length >= 3) {
      areaResultMsg.className = 'area-result-msg success';
      areaResultMsg.innerHTML = `✅ <strong>Great news!</strong> We offer free daily pickup & delivery in <strong>${escapeHtml(query)}</strong>. Schedule your pickup for tomorrow morning or evening!`;
    } else {
      areaResultMsg.className = 'area-result-msg success';
      areaResultMsg.innerHTML = `✅ Free doorstep pickup is available in <strong>${escapeHtml(query)}</strong> with fast turnaround across New Town & Kolkata.`;
    }
  }

  if (areaCheckBtn && areaCheckInput) {
    areaCheckBtn.addEventListener('click', () => {
      verifyArea(areaCheckInput.value);
    });
    areaCheckInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        verifyArea(areaCheckInput.value);
      }
    });
  }

  areaPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const areaName = pill.getAttribute('data-area') || pill.textContent.trim();
      if (areaCheckInput) areaCheckInput.value = areaName;
      verifyArea(areaName);
    });
  });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close others
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Dynamic WhatsApp CTAs ---
  const waCTABtns = document.querySelectorAll('[data-wa-action]');
  waCTABtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const customMsg = encodeURIComponent(
        'Hi The Supreme Laundry! I would like to book a laundry pickup or enquire about your services in New Town, Kolkata.'
      );
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${customMsg}`, '_blank');
    });
  });

  // --- Toast Utility ---
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
