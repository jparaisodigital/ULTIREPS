# Project Roadmap: Minimalist E-Commerce (Static + Google Sheets)

## Project Overview
* **Project Name:** Static E-Commerce Web App (Google Sheets Backend + Cloudinary CDN)
* **Tech Stack:** Vanilla JavaScript, Tailwind CSS (via CDN), HTML5, Alpine.js (for reactive cart/modal states)
* **Hosting:** Netlify / Vercel (Zero database overhead)
* **Agreed Budget:** ₱4,000 PHP

---

## File Structure
```text
ARCHWAY/
├── assets/
│   └── css/ (or custom overrides)
├── config.js          # API endpoints, Google Sheet CSV/JSON URL, and configuration parameters
├── index.html         # Homepage (Hero slider, Search, Category filter, Product Grid)
├── cart.js / site.js  # Vanilla JS + Alpine.js logic for fetching products, cart drawer, and checkout
└── PROJECT_ROADMAP.md # This documentation file
```

---

## Architecture & Implementation Steps

### 1. Data Layer (Google Sheets as CMS)
* **Columns Required:**
  * `id` (Unique string/number, e.g., `PROD-001`)
  * `name` (Product name)
  * `category` (Apparel, Footwear, Accessories, etc.)
  * `price` (Numeric value for parsing)
  * `stock` (In Stock / Out of Stock or numeric inventory)
  * `image_url` (Cloudinary hosted optimized URL)
  * `featured` (TRUE/FALSE for hero or featured items)

### 2. Frontend & UI (Tailwind CSS + Minimalist Aesthetic)
* **Hero Section:** 3-image crossfade slider with smooth opacity transition, dark neutral gradient overlay, and clean typography.
* **Search & Filters:** Instant real-time text query and category filtering.
* **Product Grid:** Responsive layout with clean whitespace, sharp typography, and subtle image scaling on hover.

### 3. State Management & Checkout Flow (Alpine.js / Vanilla JS)
* **Cart Drawer:** Slide-over panel managing local state (`localStorage`), item quantity adjustment, and subtotal calculation.
* **Checkout Modal:** Clean form capturing customer name, address, contact number, and a GCash receipt file upload field.
* **Order Submission:** Direct transmission of order details to Telegram Bot API or email service (skipping automation tools like Make.com to keep it lightweight).

---

## Pricing Note (₱4,000 PHP Scope)
* Setup of static structure and Google Sheets data synchronization.
* UI implementation matching the requested minimalist premium direction.
* Client-side cart state and direct checkout/order transmission.