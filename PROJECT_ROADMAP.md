# Project Roadmap: Ulti Reps Minimalist E-Commerce

## Overview
**Project:** Ulti Reps Static E-Commerce Web App  
**Stack:** HTML5, Vanilla JS, Alpine.js, Tailwind CSS (CDN), localStorage/sessionStorage  
**Hosting:** Netlify/Vercel  
**Budget:** 4,000 PHP 
**Status:** Core storefront, cart, checkout, supporting pages, and Messenger handoff implemented.

## File Structure
ARCHWAY/
├── assets/          # Images (hero, mobile, logo, chart, feedback, history)
├── products/        # Product images (main + back gallery)
├── config.js        # Store metadata, products, images, socials, loader
├── site.js          # Alpine.js logic & shared state
├── index.html       # Homepage/shop
├── story.html       # Ulti Story
├── about.html       # About page
├── feedback.html    # Customer feedback
├── checkout.html    # Checkout & Messenger handoff
└── PROJECT_ROADMAP.md

## Implementation Status

### ✅ Completed Features
1. **Product Catalog** - 16 products in config.js (NIKE, CROCS, NEW RELEASE, HOT filter).
2. **Homepage UI** - Desktop/mobile hero sliders, fixed header, search, filters, product grid, quick view modal, size chart.
3. **Site Loader** - Configurable logo loader with timing/animation settings.
4. **Feedback Popup** - Bottom-right popup alternating Hot Style/Reviews with localStorage dismissal.
5. **Cart System** - localStorage persistence, quantity controls, size variants as separate lines.
6. **Checkout Flow** - Customer details, region-based shipping, payment options (GCash/Maya/Bank), order summary.
7. **Messenger Handoff** - Text order summary via Messenger link, cart cleared after submission.
8. **Supporting Pages** - Story, About, Feedback galleries with shared header/footer.

### ⚠️ Current Behavior
- **Receipt Upload** - File selector exists but receipt is sent manually via Messenger (no auto-upload to server).

## Cleanup & Optimization Items
- Remove unused fallback product code from site.js.
- Verify same-day delivery wording matches client policy.
- Replace placeholder payment details before launch.
- Verify all social/Messenger links.
- Confirm FAQ copy with client.
- Cross-page QA (header, cart, FAQ modal, responsive layout).
- Final purchase flow QA (desktop + mobile).

## Pre-Launch Checklist
- [ ] Finalize product names, prices, sizes, and images.
- [ ] Finalize hero, story, feedback, logo, and size-chart assets.
- [ ] Replace placeholder payment account details.
- [ ] Verify shipping/delivery wording and fees.
- [ ] Verify social and Messenger links.
- [ ] Review Help/FAQ copy with the client.
- [ ] Test cart persistence and size variants.
- [ ] Test receipt selector behavior and manual sending instructions.
- [ ] Test popup actions and dismissal.
- [ ] Test loader timing on desktop and mobile.
- [ ] Run responsive QA across all pages.
- [ ] Deploy to final hosting and perform a complete smoke test.

## Scope Summary
Static, config-driven storefront with product browsing, cart, checkout, supporting pages, and Messenger order handoff. No server-side dependencies. Product/content maintenance is handled directly in config.js.