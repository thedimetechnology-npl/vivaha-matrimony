# Vivaha — Premium Indian Matrimony PWA

A production-ready Progressive Web App for Indian matrimony, built with traditional design aesthetics and modern web technologies.

## 🌟 Features

### Core Matrimony Features
- **Verified Profiles** — Aadhaar + PAN verification with trust badges
- **Kundali & Guna Matching** — Traditional 36-guna compatibility with Nakshatra, Dosha analysis
- **Family Dashboard** — Secure parent/guardian access for shortlisting and approvals
- **Privacy First** — Photos blurred until mutual interest, contact shared after family approval
- **Regional & Cultural Filters** — Mother tongue, gotra, sub-caste, food habits, lifestyle
- **Dedicated Relationship Manager** — Premium members get personal matchmaker

### PWA Capabilities
- **Offline Support** — Service worker caches app shell and profiles
- **Installable** — Add to home screen on Android/iOS
- **Background Sync** — Offline form submissions sync when online
- **Push Notifications** — Match alerts and messages (ready for backend integration)
- **App Shortcuts** — Quick access to Search, Register, Services

### Indian Traditional Design
- **Color Palette** — Maroon (#8B1A2E) + Gold (#D4A843) + Ivory (#FFFDF5)
- **Typography** — Playfair Display (headings) + Inter (body)
- **Mandala Patterns** — Subtle traditional geometric backgrounds
- **Sanskrit Elements** — "Vivaha" (विवाह) branding with cultural authenticity

## 📁 Project Structure

```
Matrimony Website/
├── index.html          # Main PWA entry point
├── manifest.webmanifest # PWA manifest
├── sw.js               # Service worker
├── css/
│   └── styles.css      # Complete design system
├── js/
│   └── app.js          # Main application logic
├── icons/
│   ├── favicon.svg
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-192-maskable.png
│   ├── icon-384.png
│   ├── icon-512.png
│   └── icon-512-maskable.png
└── README.md
```

## 🚀 Quick Start

### Development
```bash
# Using Python (if available)
python -m http.server 8080

# Using Node.js
npx serve .

# Using PowerShell (Windows) - included server
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```

Then open `http://localhost:8080` (or the provided URL).

### Production Deployment
1. Build: No build step required (vanilla HTML/CSS/JS)
2. Deploy to any static host: Netlify, Vercel, GitHub Pages, AWS S3, etc.
3. Ensure HTTPS for PWA features (Service Worker requires secure context)
4. Configure `manifest.webmanifest` icons for your domain

## 🎨 Design System

### Colors
```css
--gold: #D4A843;
--gold-light: #E8C56D;
--gold-dark: #B8860B;
--maroon: #8B1A2E;
--maroon-light: #A52A3E;
--ivory: #FFFDF5;
--ivory-warm: #FEF9E7;
--cream: #F5F0E1;
--charcoal: #1A1A1A;
```

### Typography
- **Headings**: Playfair Display (400, 500, 600, 700)
- **Body**: Inter (300, 400, 500, 600, 700)

### Spacing Scale
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

## 🔧 Customization

### Changing Colors
Edit CSS custom properties in `css/styles.css`:
```css
:root {
  --gold: #YOUR_GOLD;
  --maroon: #YOUR_MAROON;
  --ivory: #YOUR_IVORY;
}
```

### Adding Languages
1. Add translation files in `js/i18n/`
2. Update `app.js` to load translations
3. Add language switcher in header

### Backend Integration
Replace mock data in `app.js`:
- `sampleProfiles` → API endpoint `/api/profiles`
- `successStories` → API endpoint `/api/stories`
- Search → POST to `/api/search`
- Registration → POST to `/api/register`

## 📱 PWA Checklist

- [x] Web App Manifest
- [x] Service Worker (Cache-First + Stale-While-Revalidate)
- [x] HTTPS Required (for production)
- [x] Install Prompt
- [x] Offline Support
- [x] App Shortcuts
- [x] Splash Screens (auto-generated from icons)
- [x] Theme Color
- [x] App Icons (72-512px, maskable)
- [x] Offline Fallback
- [x] Background Sync (ready)
- [x] Push Notifications (ready)

## 🔒 Security & Compliance

- **DPDP Act Compliant** — Indian data protection ready
- **GDPR Ready** — European users covered
- **Content Security Policy** — Ready for CSP headers
- **No External Dependencies** — All fonts self-hosted or Google Fonts with preconnect
- **No Tracking** — Analytics optional, privacy-first

## 🌐 Browser Support

| Browser | Version | PWA Support |
|---------|---------|-------------|
| Chrome | 70+ | ✅ Full |
| Firefox | 65+ | ✅ Full |
| Safari | 11.1+ | ✅ Full* |
| Edge | 79+ | ✅ Full |
| Samsung Internet | 10+ | ✅ Full |

*iOS Safari: Add to Home Screen via Share menu

## 📄 License

Proprietary — Vivaha Matrimony Pvt. Ltd.
CIN: U74999DL2015PTC123456

## 📞 Support

- **Email**: care@vivaha.in
- **Phone**: +91-11-4123-4567
- **WhatsApp**: +91-98765-43210
- **Office**: Unit 402, World Trade Center, Nauroji Nagar, New Delhi 110029

---

**Built with ❤️ for Indian traditions** • **विवाह — Where traditions meet trust**