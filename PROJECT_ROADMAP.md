# Project Roadmap: Minimalist E-Commerce (Static + Google Sheets)

## Project Overview
* **Project Name:** Static E-Commerce Web App (Google Sheets Backend + Cloudinary CDN)
* **Tech Stack:** Vanilla JavaScript, Tailwind CSS (via CDN), HTML5, Alpine.js (cart, modals, checkout, help/FAQ states)
* **Hosting:** Netlify / Vercel (Zero database overhead)
* **Agreed Budget:** ₱4,000 PHP (₱2,000 downpayment received — ₱1,500 balance)
* **Status:** Core storefront + checkout UI complete. Order submission via Messenger (auto-opens with prefilled order summary). Google Sheets live sync pending client decision.

---

## File Structure
```text
ARCHWAY/
├── assets/
│   ├── hero.png, hero1.png, hero2.png       # Desktop hero slides
│   ├── mobile1-3.png                         # Mobile hero slides
│   ├── logo.png / logo-white.png
│   └── history/1 (1-15).jpg                  # Ulti Story gallery images
├── products/                                  # Product images (referenced in config.js)
├── config.js          # Store metadata, product catalog, socials, Sheets config
├── index.html          # Homepage (Hero slider, Search, Category filter, Product Grid, Quick View)
├── story.html          # Ulti Story — zero-gap image gallery page
├── about.html           # About page
├── checkout.html        # Checkout form (delivery, payment, order review)
├── site.js              # Alpine.js logic — products, cart, checkout, help modal, Messenger submission
└── PROJECT_ROADMAP.md  # This documentation file
```

---

## Architecture & Implementation Status

### 1. Data Layer (Google Sheets as CMS) — ⏳ Partially wired
* `site.js` already fetches Google Sheets CSV (`parseCSV`) as a **fallback**, but only triggers if `config.products` is empty.
* Right now, `config.js` has the full catalog hardcoded (16 products) — this is what's live on the site.
* **To activate live Google Sheets sync:** publish the sheet as CSV, drop the URL into `config.googleSheetCSV`, and clear/empty the `products` array in `config.js`.

### 2. Frontend & UI (Tailwind CSS + Minimalist Aesthetic) — ✅ Done
* **Hero Section:** separate desktop/mobile crossfade sliders, dark gradient overlay, config-driven images.
* **Header:** fixed, auto-hide on scroll, centered logo, mobile hamburger with centered nav links, Help button (desktop icon + mobile menu entry).
* **Help/FAQ Modal:** accordion-style FAQ modal, accessible from desktop header icon and mobile menu, covers shipping, payment, tracking, returns.
* **Search & Filters:** instant text query + category filtering on homepage.
* **Product Grid:** responsive grid, hover scaling, Quick View modal per product.
* **Ulti Story page:** dedicated gallery page with zero-gap image grid.

### 3. State Management & Checkout Flow — ✅ Done
* **Cart Drawer:** slide-over panel, persisted via `localStorage`, quantity adjustment, live subtotal.
* **Checkout Page:** full form — name, address, contact, region, delivery option (standard / same-day), payment method (GCash / Maya / bank transfer), receipt file upload, order summary/review step.
* **Order Submission:** on order confirm, cart clears and Messenger auto-opens in a new tab with the full order summary prefilled — no bot/backend needed.

---

## Next Steps (Pre-Launch Checklist)
1. **Google Sheets decision** — confirm with client: stick with hardcoded `config.products` (simpler, faster) or switch to live Sheets sync (easier for non-technical updates). If Sheets, publish sheet as CSV and verify `parseCSV` column mapping.
2. **Replace placeholder assets** — swap out any remaining "SAMPLE" product names/prices in `config.js`, confirm final product photos are in `/products/`.
3. **Socials cleanup** — `instagram` and `tiktok` in `config.js` still point to placeholder handles; Facebook/Messenger are already live.
4. **FAQ content sign-off** — current FAQ copy (shipping times, payment methods, returns policy) is a draft based on standard e-commerce practice; needs client-confirmed actual policy numbers before launch.
5. **Cross-page QA** — verify header/cart/help modal behave identically across all 4 pages (index, story, about, checkout) on both desktop and mobile.
6. **Deploy** — push to Netlify/Vercel, connect domain, final smoke test of full purchase flow (order → Messenger handoff).

---

## Pricing Note (₱4,000 PHP Scope)
* Setup of static structure and Google Sheets data synchronization.
* UI implementation matching the requested minimalist premium direction.
* Client-side cart state and direct checkout/order transmission via Messenger.
* **Payment status:** ₱2,000 downpayment received. ₱2,000 balance due upon completion/handoff.