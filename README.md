# SayaraApp | Mobile Car Services & Supplier Portal 🏎️

A high-performance Progressive Web App (PWA) designed to connect users with mobile car services, roadside assistance, and a comprehensive portal for auto parts suppliers across Iraq.

![Version](https://img.shields.io/badge/version-1.6.0-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-success)
![UI](https://img.shields.io/badge/UI-Modern-brightgreen)

## 🌟 Key Features

### 🛠️ Mobile Car Services

- **Multi-Branch Filtering**: Toggle between **Cars**, **Motorcycles**, and **Hybrids**.
- **Service Search**: Mechanics, Car Washes, Fuel Pumping, Locksmiths, and more.

### 📦 Supplier Portal (NEW)

- **80+ Verified Suppliers**: Connect with parts dealers across Hawler, Baghdad, Slemani, and beyond.
- **Smart Filtering**: Filter by brand (Toyota, Nissan, BMW, etc.) or category (Scrap, Parts, Repair).
- **Global Search**: Find any part or shop instantly with the real-time search bar.

### 📱 Unified Experience

- **One-Click Contact**: Integrated WhatsApp and Phone shortcuts.
- **Offline Support**: PWA capabilities powered by Service Workers.
- **Premium UI**: Clean, responsive design optimized for mobile-first interactions.

## 📁 Project Structure

```text
├── Delivery/           # Mobile car services module
├── Supplier/           # Auto parts supplier portal
├── peshanga.json       # Exhibition & Showroom data (Separated)
├── Form/               # Part request forms
├── AboutUs/            # Company information and stats
├── SocialMedia/        # Social links
├── Share/              # App sharing utilities
└── simple-server.js    # Local development server
```

## 🚀 Getting Started

### 1. Local Development

Run the local server:

```bash
node simple-server.js
```

The app will be available at `http://localhost:8080`.

### 2. Deployment

The project is optimized for **Vercel**. Simply connect the repository to Vercel for automatic deployment.

## 📋 Maintenance

### Adding Services

1. Update `Delivery/services.json`.
2. Add images to `Delivery/img/`.

### Managing Suppliers

1. **Adding Data**: Use `Supplier/merge_suppliers.js` to batch process new Excel/JSON data.
2. **Refining Data**: Use `Supplier/cleanup_suppliers.js` to automatically detect brands and categorize entries based on their descriptions.

## 📄 License

This project is for internal use. All rights reserved.

---
