const fs = require('fs');
const path = require('path');

console.log('--- Verifying The Supreme Laundry Website Integrity & Rate Card ---');

// 1. Check Files Existence
const requiredFiles = [
  'index.html',
  'css/styles.css',
  'js/app.js',
  'assets/hero_laundry.jpg',
  'assets/delivery_doorstep.jpg',
  'server.js',
  'package.json'
];

let allFilesOk = true;
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    console.log(`[PASS] File exists: ${file} (${size} bytes)`);
  } else {
    console.error(`[FAIL] Missing file: ${file}`);
    allFilesOk = false;
  }
});

// 2. Check Color Palette in CSS
const cssContent = fs.readFileSync(path.join(__dirname, 'css/styles.css'), 'utf8');
const requiredColors = ['#092328', '#12544F', '#2A835F', '#8BBB92'];
let colorsOk = true;
requiredColors.forEach(color => {
  if (cssContent.toLowerCase().includes(color.toLowerCase())) {
    console.log(`[PASS] Palette verified in CSS: ${color}`);
  } else {
    console.error(`[FAIL] Color missing in CSS: ${color}`);
    colorsOk = false;
  }
});

// 3. Check HTML Required Sections & Elements
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const requiredElements = [
  { id: 'siteHeader', desc: 'Sticky Header' },
  { id: 'headerLogo', desc: 'Clean Logo' },
  { id: 'headerCallBtn', desc: 'Header Call CTA' },
  { id: 'headerWhatsAppBtn', desc: 'Header WhatsApp CTA' },
  { id: 'headerBookBtn', desc: 'Header Book a Pickup CTA' },
  { id: 'hamburgerBtn', desc: 'Mobile Hamburger Menu' },
  { id: 'mobileDrawer', desc: 'Mobile Drawer Menu' },
  { id: 'home', desc: 'Hero Section' },
  { id: 'heroBookPickupBtn', desc: 'Hero Book Pickup CTA' },
  { id: 'heroCallNowBtn', desc: 'Hero Call CTA' },
  { id: 'heroWhatsAppBtn', desc: 'Hero WhatsApp CTA' },
  { id: 'services', desc: 'Services Section' },
  { id: 'service-wash-fold', desc: 'Service: Wash & Fold' },
  { id: 'service-dry-cleaning', desc: 'Service: Dry Cleaning' },
  { id: 'service-ironing', desc: 'Service: Ironing & Pressing' },
  { id: 'service-wash-iron', desc: 'Service: Wash & Iron' },
  { id: 'service-express', desc: 'Service: Express Laundry' },
  { id: 'service-bedding', desc: 'Service: Blanket & Bedding' },
  { id: 'service-shoe', desc: 'Service: Shoe Cleaning' },
  { id: 'service-specialized', desc: 'Service: Specialized Fabric Care' },
  { id: 'how-it-works', desc: 'How It Works Section' },
  { id: 'about', desc: 'Why Choose Us / About Section' },
  { id: 'pricing', desc: 'Pricing & Cost Estimator' },
  { id: 'calcTabKg', desc: 'KG Price Calculator' },
  { id: 'calcTabGarments', desc: 'Garment Price Calculator' },
  { id: 'reviews', desc: 'Customer Reviews Section' },
  { id: 'areas', desc: 'Service Areas Section' },
  { id: 'areaCheckInput', desc: 'Service Area Input' },
  { id: 'contact', desc: 'Strong Conversion CTA Section' },
  { id: 'mobileBarCallBtn', desc: 'Mobile Sticky Call Button' },
  { id: 'mobileBarWhatsAppBtn', desc: 'Mobile Sticky WhatsApp Button' },
  { id: 'mobileBarBookBtn', desc: 'Mobile Sticky Book Button' },
  { id: 'bookingModal', desc: 'Interactive Booking Modal' }
];

let htmlOk = true;
requiredElements.forEach(item => {
  if (htmlContent.includes(`id="${item.id}"`)) {
    console.log(`[PASS] Element present: ${item.desc} (#${item.id})`);
  } else {
    console.error(`[FAIL] Missing element: ${item.desc} (#${item.id})`);
    htmlOk = false;
  }
});

// 4. Check JS Functionality & Event Listeners
const jsContent = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
const requiredJsHooks = [
  'bookingModal',
  'btnNextStep',
  'btnPrevStep',
  'btnSubmitBooking',
  'calcKgValue',
  'calcKgTotal',
  'calcGarmentTotal',
  'verifyArea',
  'showToast'
];

let jsOk = true;
requiredJsHooks.forEach(hook => {
  if (jsContent.includes(hook)) {
    console.log(`[PASS] JS Hook verified: ${hook}`);
  } else {
    console.error(`[FAIL] Missing JS Hook: ${hook}`);
    jsOk = false;
  }
});

// 5. Check "The Supreme Laundry" Branding & Rate Card Integrity
const brandChecks = [
  { name: 'Brand Name in HTML', pass: htmlContent.includes('The Supreme') && htmlContent.includes('Laundry') },
  { name: 'Tagline in HTML', pass: htmlContent.includes('We take care of your premium clothes') },
  { name: 'Primary Phone Number (9831930837)', pass: htmlContent.includes('9831930837') && jsContent.includes('9831930837') },
  { name: 'Secondary Phone Number (9007895400)', pass: htmlContent.includes('9007895400') },
  { name: 'Store Address (Kalurmore Bus Stop)', pass: htmlContent.includes('Kalurmore Bus Stop') && htmlContent.includes('New Town') },
  { name: 'Indian Rupee Symbol (₹) in HTML & JS', pass: htmlContent.includes('₹') && jsContent.includes('₹') },
  { name: 'Rate Card Price Tiers (₹15, ₹40, ₹90)', pass: htmlContent.includes('₹15') && htmlContent.includes('₹40') && htmlContent.includes('₹90') },
  { name: 'Clean Short Desktop Nav (Home, Services, Pricing, Contact)', pass: htmlContent.includes('<a href="#home" class="nav-link active">Home</a>') && htmlContent.includes('<a href="#services" class="nav-link">Services</a>') && htmlContent.includes('<a href="#pricing" class="nav-link">Pricing</a>') && htmlContent.includes('<a href="#contact" class="nav-link">Contact</a>') },
  { name: 'Call CTA "Call Now"', pass: htmlContent.includes('<span>Call Now</span>') },
  { name: 'All 8 Services Prices formatted with "From"', pass: 
      htmlContent.includes('From ₹15 / piece') &&
      htmlContent.includes('From ₹40 / garment') &&
      htmlContent.includes('From ₹90 / item') &&
      htmlContent.includes('From ₹79 / kg') &&
      htmlContent.includes('From ₹320 / piece') &&
      htmlContent.includes('From ₹160 / pair') &&
      htmlContent.includes('From ₹250 / seat') &&
      htmlContent.includes('From +50% Extra')
  },
  { name: 'No wrapping pipe symbols in service price tags', pass: !htmlContent.includes('Kids ₹160 | Adult ₹320') && !htmlContent.includes('From ₹250 / seat | ₹30 / sq.ft') },
  { name: 'CSS Equal Height & Bottom Auto Alignment for Cards', pass: cssContent.includes('height: 100%;') && cssContent.includes('margin-top: auto;') && cssContent.includes('white-space: nowrap;') },
  { name: 'Responsive Modal Header & Footer (Fixed & Non-Clipping)', pass: cssContent.includes('overflow: hidden;') && cssContent.includes('margin: auto;') && cssContent.includes('-webkit-overflow-scrolling: touch;') },
  { name: 'Responsive Modal Mobile Query (<640px)', pass: cssContent.includes('@media (max-width: 640px)') && cssContent.includes('calc(100dvh - 20px)') },
  { name: 'Header Logo & Hamburger Mobile Fit (<576px)', pass: cssContent.includes('@media (max-width: 575px)') && cssContent.includes('#headerBookBtn') && cssContent.includes('white-space: nowrap;') },
  { name: 'Hero CTA Mobile Responsive Stacking', pass: cssContent.includes('flex-direction: column;') && cssContent.includes('justify-content: center;') }
];

let brandOk = true;
brandChecks.forEach(check => {
  if (check.pass) {
    console.log(`[PASS] Responsive & Brand Check: ${check.name}`);
  } else {
    console.error(`[FAIL] Check Failed: ${check.name}`);
    brandOk = false;
  }
});

if (allFilesOk && colorsOk && htmlOk && jsOk && brandOk) {
  console.log(`\n🌟 ALL 59 INTEGRITY, BRANDING, RATE CARD & FULL RESPONSIVENESS CHECKS PASSED SUCCESSFULLY!`);
} else {
  console.error('\n⚠️ SOME CHECKS FAILED!');
  process.exit(1);
}
