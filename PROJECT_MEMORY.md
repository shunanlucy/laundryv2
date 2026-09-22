# The Supreme Laundry — Project Memory & Architecture Map

> **Purpose:** This file provides a complete, token-efficient index of the entire codebase. AI agents and developers should reference this file to jump directly to exact line ranges, modify components with surgical accuracy, and avoid reading large files into context.

---

## ⚡ Token-Saving Rules for Future Updates

1. **NEVER read the entire `index.html` or `css/styles.css` into context.**
   - Both files are large (87KB and 52KB). Reading them consumes ~35,000 tokens per prompt.
   - Always refer to the **Line Maps** below and use `view_file` with `StartLine` and `EndLine` for only the target block (max 40–80 lines).
2. **Use `replace_file_content` with exact chunk boundaries.**
   - Do not rewrite whole files.
3. **Verify every edit with the built-in test script:**
   - Run `node test_verification.js`. It validates all 59 integrity, brand, and layout checks in < 1 second.

---

## 🗺️ Codebase Map & Exact Line Index

### 1. `index.html` (Total Lines: ~1,720)

| Section # | Component / Section Name | Line Range | Key IDs & Classes |
| :--- | :--- | :--- | :--- |
| **01** | Header & Primary Navigation | L29 – L116 | `#siteHeader`, `#headerLogo`, `#mainNav`, `#headerBookBtn`, `#hamburgerBtn`, `#mobileDrawer` |
| **02** | Hero Section | L118 – L233 | `#home`, `.hero-title`, `.hero-subtitle`, `#heroBookPickupBtn`, `#heroCallNowBtn`, `#heroWhatsAppBtn` |
| **03** | Trust & Metrics Bar (Dark Teal) | L235 – L260 | `.metrics-bar`, `.metrics-grid`, `.metric-item` (50k+, 99.4%, 4.9★, 100%) |
| **04** | Services Rate Card (8 Services) | L261 – L458 | `#services`, `#service-ironing`, `#service-wash-iron`, `#service-dry-cleaning`, `#service-wash-fold`, `#service-bedding`, `#service-shoe`, `#service-specialized`, `#service-express` |
| **05** | How It Works (4 Steps) | L459 – L538 | `#how-it-works`, `.how-it-works-flow`, `.step-card` |
| **06** | Why Choose Us / Features | L540 – L703 | `#about`, `.benefits-grid`, `.showcase-split` |
| **07** | Pricing & Cost Estimator | L705 – L954 | `#pricing`, `.pricing-tabs`, `#calcTabKg`, `#calcTabGarments`, `#calcKgTotal`, `#calcGarmentTotal` |
| **08** | Customer Reviews & Ratings | L956 – L1103 | `#reviews`, `.reviews-grid`, `.review-card` |
| **09** | Service Areas & Pincode Checker | L1105 – L1197 | `#areas`, `#areaCheckInput`, `#areaCheckBtn`, `#areaResultMsg` |
| **10** | Frequently Asked Questions (FAQ) | L1199 – L1266 | `#faq`, `.faq-container`, `.faq-item` |
| **11** | Conversion CTA Banner | L1268 – L1318 | `#contact`, `.cta-banner-section`, `.cta-box` |
| **12** | Site Footer | L1320 – L1454 | `.site-footer`, `.footer-grid`, `.footer-contact-list` |
| **13** | Sticky Mobile Action Bar | L1456 – L1485 | `.mobile-sticky-bar`, `#mobileBarCallBtn`, `#mobileBarWhatsAppBtn`, `#mobileBarBookBtn` |
| **14** | Interactive 3-Step Booking Modal | L1487 – L1715 | `#bookingModal`, `#modalStepsBar`, `#pickupDate`, `#custName`, `#custPhone`, `#custAddress`, `#btnSubmitBooking` |

---

### 2. `css/styles.css` (Total Lines: ~2,730)

| Category | Description | Line Range | Key Variables / Classes |
| :--- | :--- | :--- | :--- |
| **Tokens** | Palette & Design Variables | L1 – L58 | `--color-dark`, `--color-primary`, `--color-secondary`, `--color-accent` |
| **Base** | Root Reset & Fluid Shield | L60 – L145 | `html` (overflow-x clip), `body`, `.container` (clamp padding) |
| **Typography**| Headings & Section Tags | L146 – L210 | `.section-title`, `.section-tag`, `.section-desc` |
| **Buttons** | Buttons & Pills | L211 – L308 | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-whatsapp`, `.btn-outline` |
| **Header** | Sticky Header & Drawer | L309 – L615 | `.site-header`, `.brand-logo`, `.header-actions`, `.hamburger-btn`, `.mobile-drawer` |
| **Hero** | Hero Grid, Badges & Image | L616 – L897 | `.hero-grid`, `.hero-title`, `.hero-trust-indicators`, `.hero-img-card`, `.floating-badge` |
| **Metrics** | 4-Column Stats Strip | L898 – L937 | `.metrics-bar`, `.metrics-grid`, `.metric-item`, `.metric-number` |
| **Services**| 8 Services Grid & Cards | L938 – L1060 | `.services-grid`, `.service-card`, `.service-price-tag` |
| **Process** | How It Works Cards | L1061 – L1147 | `.how-it-works-flow`, `.step-card`, `.step-number-badge` |
| **Pricing** | Pricing Tabs & Calculator | L1148 – L1459 | `.pricing-tabs`, `.pricing-grid`, `.calculator-card`, `.calc-row`, `.calc-total-box` |
| **Benefits**| Features & Split Showcase | L1460 – L1609 | `.benefits-grid`, `.benefit-card`, `.showcase-split` |
| **Reviews** | Customer Review Cards | L1610 – L1696 | `.reviews-grid`, `.review-card`, `.review-stars` |
| **Areas** | Pincode Checker & Timing | L1697 – L1863 | `.area-layout`, `.area-card-box`, `.area-checker-form`, `.schedule-card` |
| **FAQ** | Accordion Item Transitions | L1864 – L1927 | `.faq-container`, `.faq-item`, `.faq-question`, `.faq-answer` |
| **CTA** | Banner with Radial Glow | L1928 – L2005 | `.cta-banner-section`, `.cta-box`, `.cta-buttons` |
| **Footer** | 4-Column Footer Layout | L2006 – L2146 | `.site-footer`, `.footer-grid`, `.footer-links-list` |
| **Mobile Bar**| Sticky Action Bar + Notch | L2147 – L2227 | `.mobile-sticky-bar` (with safe-area-inset), `.mobile-bar-btn` |
| **Modal** | Multi-Step Booking Modal | L2228 – L2730 | `.modal-overlay`, `.modal-card`, `.form-step-content`, `.booking-success-box`, `.toast` |

---

### 3. `js/app.js` (Total Lines: ~556)

| Module | Purpose | Line Range | Functions & Handlers |
| :--- | :--- | :--- | :--- |
| **Config** | Phone & WhatsApp Config | L1 – L20 | `STORE_PHONE`, `WHATSAPP_PHONE` (`9831930837`) |
| **Header** | Scroll Shadow & Navbar | L12 – L21 | Header scroll class toggle |
| **Drawer** | Hamburger Menu Open/Close | L22 – L52 | `toggleMobileMenu(open)` |
| **Booking**| Multi-Step Modal Engine & WhatsApp Bill Generator | L53 – L375 | `openModal(presetService)`, `closeModal()`, `btnSubmitBooking` (Auto WhatsApp Bill) |
| **Estimator**| KG & Garment Cost Engines | L339 – L444 | `updateKgTotal()`, `updateGarmentTotal()`, Tab switching |
| **Area** | Delivery Checker & Areas | L445 – L495 | `verifyArea(query)`, Supported areas array |
| **FAQ** | Accordion expand/collapse | L496 – L509 | FAQ click toggles |
| **WhatsApp**| Global WhatsApp Clicker | L510 – L521 | `data-wa-action="true"` link generator |
| **Toast** | Micro-notifications | L522 – L556 | `showToast(message)` |

---

## 📋 Rate Card & Business Constants (Canonical Reference)

| Item / Service | Canonical Price | Pricing Unit | HTML ID Anchor |
| :--- | :--- | :--- | :--- |
| **Steam Ironing** | From ₹15 | per piece | `#service-ironing` |
| **Soft Wash & Steam Iron** | From ₹40 | per garment | `#service-wash-iron` |
| **Premium Dry Cleaning** | From ₹90 | per item | `#service-dry-cleaning` |
| **Everyday Wash & Fold** | From ₹79 | per kg | `#service-wash-fold` |
| **Blanket & Bedding** | From ₹320 | per piece | `#service-bedding` |
| **Shoe Cleaning** | From ₹160 | per pair | `#service-shoe` |
| **Sofa & Carpet Cleaning** | From ₹250 | per seat | `#service-specialized` |
| **Express Laundry Delivery**| +50% Extra | on standard tariff | `#service-express` |

- **Primary Phone & WhatsApp:** `+91 9831930837`
- **Secondary Hotline:** `+91 9007895400`
- **Address:** Near Kalurmore Bus Stop, New Town, Kolkata - 700156
- **Primary Brand Color Palette:**
  - Dark Charcoal Teal: `#092328`
  - Deep Pine Teal: `#12544F`
  - Active Emerald Green: `#2A835F`
  - Fresh Mint Sage: `#8BBB92`
  - Pure White Surface: `#FFFFFF`

---

## 🤖 Instant Telegram Bot Push Notification & Interactive Buttons
- **Bot Handle:** `@supreme_laundry_bot` (https://t.me/supreme_laundry_bot)
- **Config File:** [`telegram_config.json`](file:///d:/PROJECTS/laundy%20v2/telegram_config.json)
- **Server Route:** `POST /api/telegram-notify` (in [`server.js`](file:///d:/PROJECTS/laundy%20v2/server.js))
- **Interactive Action Buttons:** `[ 🚚 Pickup ]`, `[ 💳 Paid ]`, `[ ✨ Complete ]`, `[ 🛵 Delivered ]`
- **Frontend Trigger:** `sendTelegramOrderAlert()` (in [`js/app.js`](file:///d:/PROJECTS/laundy%20v2/js/app.js))
- **Test Script:** `node test_telegram.js` (fires instant test notification to owner's phone)

---

## 🎛️ Shopkeeper Admin Dashboard (`/admin`)
- **File:** [`admin.html`](file:///d:/PROJECTS/laundy%20v2/admin.html)
- **URL:** `http://127.0.0.1:5173/admin`
- **PIN Protection:** 4-digit unlock (`1234` default)
- **Database:** `data/orders.json` (stores orders, status, time, and history)
- **Live Sync:** Bi-directional sync between Telegram Bot inline buttons and Admin web dashboard every 4s.
- **REST Endpoints:**
  - `GET /api/admin/orders`
  - `POST /api/admin/order-status`


