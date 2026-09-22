# The Supreme Laundry - Premium Laundry & Dry Cleaning Website (v2)

A modern, high-converting responsive web platform and admin dashboard for **The Supreme Laundry**, featuring interactive multi-step booking, live price calculators, area service checker, and real-time Telegram order alerts.

## 🌟 Key Features

- **Modern Responsive Design**: Optimized for mobile, tablet, and desktop with a brand palette (`#092328`, `#12544F`, `#2A835F`, `#8BBB92`).
- **Interactive Multi-Step Booking**: Seamless 3-step modal flow for scheduling laundry pickup and delivery.
- **Dynamic Rate Estimator**: Dual-mode price calculator (Per-KG mode & Individual Garment tier selection).
- **Service Area Checker**: Instant verification for local delivery zones around Kalurmore & surrounding areas.
- **Admin Dashboard (`/admin.html`)**: Real-time order monitoring, status management (Pending, Confirmed, Completed, Cancelled), and search/filter controls.
- **Telegram Bot Notifications**: Instant alerts sent to the store owner's Telegram channel upon order submission.
- **Zero Heavy Framework Dependencies**: High-performance Vanilla HTML5, CSS3, and JavaScript, powered by a lightweight Node.js HTTP server.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/shunanlucy/laundryv2.git
cd laundryv2

# Install dependencies (optional development utilities)
npm install
```

### 3. Telegram Notifications Setup (Optional)
Copy `telegram_config.example.json` to `telegram_config.json` and insert your Telegram bot credentials:
```bash
cp telegram_config.example.json telegram_config.json
```
Edit `telegram_config.json`:
```json
{
  "botToken": "YOUR_TELEGRAM_BOT_TOKEN",
  "chatId": "YOUR_TELEGRAM_CHAT_ID",
  "enabled": true
}
```

### 4. Running the Website Locally
```bash
# Start the Node.js server
node server.js
```
The website will be live at:
- **Main Website**: [http://localhost:5173](http://localhost:5173)
- **Admin Panel**: [http://localhost:5173/admin.html](http://localhost:5173/admin.html)

### 5. Automated Verification Test
To run the automated suite testing all 59 core elements, rate card rules, and mobile contracts:
```bash
node test_verification.js
```

---

## 📁 Project Structure

```
laundy-v2/
├── index.html                  # Main customer-facing website
├── admin.html                  # Store administration order dashboard
├── server.js                   # Node.js backend & API endpoints
├── test_verification.js        # Automated test suite (59 assertions)
├── test_telegram.js            # Telegram notification test script
├── telegram_config.example.json# Template for Telegram configuration
├── css/
│   └── styles.css              # Custom styling & responsive layouts
├── js/
│   └── app.js                  # Frontend interactive controllers
├── assets/                     # Optimized visual assets
└── data/                       # Order data storage
```

---

## 📞 Contact & Support

- **Store**: The Supreme Laundry
- **Location**: Kalurmore Bus Stop, Kolkata, West Bengal
- **Phone**: +91 9831930837 / +91 9007895400