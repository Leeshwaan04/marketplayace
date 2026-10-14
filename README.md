# ⚡ MARKETPLAYACE (`marketplayace.com`)

> **The Play-First Commerce & Creator Exchange**  
> Where items aren't just listed - they are experienced, unlocked, and played for.

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 🎮 What is Marketplayace?

Traditional e-commerce is stuck in static grids of cards, boring search bars, and passive checkouts. **Marketplayace** turns commerce into an interactive, high-energy gaming experience:

1. **🎯 Zero-Loss Reflex Mini-Games ("Play the Price")**:
   Shoppers can test their precision timing on the **Reflex Bar** to hit the bullseye and slash up to **25% to 35% off** any item before checkout.
2. **⏳ Dutch Reverse Auction Arena ("The Vault")**:
   Prices drop automatically every few seconds. Shoppers must decide: wait for an even cheaper price, or snag the item before another player beats them to it!
3. **👥 Multiplayer Squad Co-Op Checkout**:
   Group deals redesigned for multiplayer culture. When 3 players team up in a squad room, everyone unlocks wholesale Ace discounts.
4. **🎰 Ace Drop Spinner & Daily Perks**:
   Interactive drop wheel with procedural Web Audio sound synthesis, awarding daily coupons, VIP discount codes, and store credits.
5. **🛠️ Creator & Merchant Minting Terminal**:
   Sellers don't just set fixed prices - they configure "Play Rules", discount tolerances, and dynamic drop parameters.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js `v20+` or `v22+`
- `npm` or `pnpm`

### 2. Installation
```bash
git clone https://github.com/Leeshwaan04/marketplayace.git
cd marketplayace
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🏗️ Architecture & Tech Stack

```
marketplayace/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Sticky nav, live player ticker, Web Audio mute toggle
│   │   ├── Hero.tsx             # Animated hero & interactive Ace Drop Spinner
│   │   ├── ProductCard.tsx      # Rarity tiers, live spectators, quick add & play hooks
│   │   ├── ProductModal.tsx     # Full specs & Precision Reflex mini-game
│   │   ├── DropVault.tsx        # Real-time ticking Dutch reverse auction arena
│   │   ├── SquadShopping.tsx    # 3-player multiplayer squad room simulator
│   │   ├── SellerStudio.tsx     # Merchant listing & play-rules configuration
│   │   ├── CartDrawer.tsx       # Gamified savings breakdown, coupons, and escrow checkout
│   │   ├── DailyPerkModal.tsx   # Mystery tile scratch game for daily rewards
│   │   └── Footer.tsx           # Brand story, roadmap, and tech specs
│   ├── data/
│   │   └── mockProducts.ts      # Curated gaming tech, UGC mods, streetwear & drop data
│   ├── types/
│   │   └── index.ts             # TypeScript definitions for items, drops, squads
│   ├── utils/
│   │   └── audio.ts             # Zero-dependency procedural Web Audio API synthesizer
│   ├── App.tsx                  # Main app container & reactive game state
│   ├── index.css                # Tailwind CSS v4 styling & glassmorphism theme
│   └── main.tsx                 # React 19 entry point
├── package.json
└── vite.config.ts
```

---

## 🗺️ Roadmap & Future Horizons

- [x] **v1.0**: Interactive Play Floor, Reflex Mini-Games, Dutch Auction Arena, Squad Rooms, Procedural Web Audio.
- [ ] **v1.1**: Supabase integration for multi-player real-time presence and user authentication.
- [ ] **v1.2**: Stripe Connect split payouts for verified creators and merchants.
- [ ] **v2.0**: 2D Isometric / 3D Canvas spatial flea market floor where shoppers explore virtual booths as custom avatars.
- [ ] **v2.5**: Autonomous AI Ace Companion that negotiates bulk drops and finds squad partners automatically.

---

## 📄 License
MIT © [Leeshwaan04](https://github.com/Leeshwaan04/marketplayace)
