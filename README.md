# Ulti Reps

A minimalist, responsive e-commerce storefront for browsing products, managing a cart, submitting secure pre-order reservations, and completing orders through Messenger.

**Live website:** https://ultireps.pages.dev

## Features

* Config-driven product catalog
* Product search and category filters
* NIKE, CROCS, New Release, and Hot Style collections
* Responsive desktop and mobile hero sliders
* Product quick-view modal
* Multi-image product galleries
* Product size selection and size chart
* Persistent shopping cart using `localStorage`
* Separate cart entries for different product sizes
* Customer checkout and order summary
* Copy-to-clipboard Messenger handoff
* Secure pre-order reservation form
* Payment-proof upload for pre-orders
* Unique reservation ID generation
* Google Sheets reservation records
* Google Drive payment-proof storage
* Cloudflare Turnstile verification
* Hot Style and customer-feedback popup
* Story, About, Feedback, and Help/FAQ pages
* Responsive desktop and mobile layouts

## Technology Stack

### Frontend

* HTML5
* Vanilla JavaScript
* Alpine.js
* Tailwind CSS CDN
* `localStorage`
* `sessionStorage`

### Services

* Cloudflare Pages
* Cloudflare Turnstile
* GitHub
* Google Apps Script
* Google Sheets
* Google Drive
* Messenger

## Project Structure

```text
ULTIREPS/
├── assets/              # Hero, logo, chart, feedback, and story images
├── products/            # Product main images and gallery images
├── config.js            # Store configuration and product catalog
├── site.js              # Alpine.js application logic and shared state
├── index.html           # Homepage, shop, and pre-order flow
├── checkout.html        # Cart checkout and Messenger handoff
├── story.html           # Ulti Story page
├── about.html           # About page
├── feedback.html        # Customer feedback page
└── README.md            # Public project documentation
```

## Running the Website Locally

This is primarily a static website, so no traditional application server is required.

For local development:

1. Open the project folder in Visual Studio Code.
2. Open `index.html`.
3. Start the project using the Live Server extension.
4. Open the localhost URL provided by Live Server.

Example:

```text
http://127.0.0.1:5500/index.html
```

The exact port may be different depending on the local environment.

## Updating Products

Products are maintained in `config.js`.

Example product entry:

```javascript
{
    id: 18,
    name: "Black Spiderman Neo x Crocs",
    price: 2099,
    category: "CROCS",
    hot: false,
    reserveAllowed: true,

    image_url: "products/1 (18).jpg",

    images: [
        "products/1 (18).jpg",
        "products/back/18 (1).webp",
        "products/back/18 (2).webp",
        "products/back/18 (3).webp",
        "products/back/18 (4).webp"
    ],

    sizes: [6, 7, 8, 9, 10, 11, 12, 13]
}
```

When adding or editing products:

* Use a unique product ID.
* Confirm the product name, price, category, and available sizes.
* Make sure every image exists in the exact configured folder.
* Match filename capitalization, spaces, parentheses, and extensions exactly.
* Avoid accidental extra spaces in filenames.
* Set `hot: true` only for products included in the Hot filter.
* Set `reserveAllowed: true` when pre-ordering is available.

## Checkout Flow

The regular checkout creates an order summary that customers can copy and paste into Messenger.

Shipping fees are confirmed through Messenger based on the customer’s delivery location. Same-day delivery may also be arranged separately through Messenger.

The regular checkout does not directly process online payments.

## Pre-Order Flow

The pre-order system supports:

* Customer details
* Product and size selection
* Quantity selection
* Required downpayment calculation
* Payment-proof validation
* Secure payment-proof upload
* Reservation ID generation
* Google Sheets reservation recording
* Messenger order-detail copying

Pre-order submissions are processed through a separately deployed Google Apps Script Web App.

## Security

Cloudflare Turnstile is used to protect the pre-order form from automated submissions.

Server-side verification checks:

* Turnstile token validity
* Approved website hostname
* Expected Turnstile action
* Expired or previously used tokens
* Missing security tokens

Additional backend protection includes input validation, duplicate protection, rate protection, and safe payment-proof cleanup.

## Sensitive Information

Never commit any of the following to this repository:

* Turnstile secret keys
* Google account credentials
* Apps Script secret properties
* Private Google Sheet or Drive identifiers
* Customer reservation data
* Payment proofs
* Passwords or access tokens
* Private client documentation
* `.env` files containing credentials

Turnstile secret keys and other backend configuration must remain in Google Apps Script Properties or another secure environment.

## Deployment

The production site is hosted on Cloudflare Pages.

Deployment flow:

```text
Local project
      ↓
Git commit and push
      ↓
GitHub main branch
      ↓
Automatic Cloudflare Pages deployment
```

To publish an update:

1. Review and test changes locally.
2. Commit the approved files.
3. Push the commit to the `main` branch.
4. Wait for the Cloudflare Pages deployment to succeed.
5. Hard-refresh and smoke-test the live website.

Google Apps Script backend changes are deployed separately through the Apps Script deployment manager.

## Production Notes

The current frontend uses the Tailwind CSS CDN. It works with the existing static storefront, but locally compiled Tailwind CSS is recommended as a future performance and reliability improvement.

The website is designed for a small-business storefront and Messenger-based order workflow. It is not a full inventory, payment-processing, or order-management platform.

## Maintenance

Before publishing product or content updates:

* Test the homepage and product quick view.
* Verify product images and gallery navigation.
* Test size variants and cart persistence.
* Test the regular checkout summary.
* Test the pre-order reservation flow.
* Verify the Google Sheets row and Google Drive proof link.
* Test desktop and mobile layouts.
* Confirm that Messenger and social links still work.
* Check the latest Cloudflare Pages deployment status.
