# Lumina — Premium Tech Essentials

A complete front-end e-commerce build: vanilla HTML, CSS, and JavaScript only
(no frameworks, no build step — open `index.html` or serve the folder).

## Structure

```
index.html                  Single-page app shell: header, all views, drawers, modals
css/
  tokens.css                 Design tokens, base styles, buttons, spec-strip motif
  header.css                 Header, nav, search bar + autocomplete UI
  hero.css                   Hero, marquee, value props, category strip, footer
  products.css               Filter sidebar, product grid, product card
  modals.css                 Cart/wishlist drawers, product quick-view modal
  account-checkout.css       Auth modal, account dashboard, checkout flow
  responsive.css             Breakpoint fine-tuning, shared motion keyframes
js/
  products-data.js           16-product catalog + categories + sample reviews
  state.js                   App state, in-memory/localStorage wrapper, utilities
  render-products.js         Product card markup, filtering/sorting, grid render
  filters.js                 Filter sidebar (category, price, color, rating)
  search.js                  Search autocomplete dropdown
  cart-wishlist.js           Cart + wishlist logic and drawer rendering
  product-modal.js           Product quick-view modal (gallery, variants, reviews)
  account.js                 Auth (login/register), account dashboard, addresses
  checkout.js                Shipping, payment method, promo code, order placement
  main.js                    Event delegation + app init
```

## Features implemented (front-end only — no backend/payment processing)

- **Responsive** across phone / tablet / desktop, tested at 375–1920px
- **Search** with live autocomplete suggestions
- **Filters**: category, price range, color, star rating — with active filter chips
- **Sort**: featured, newest, price, rating
- **Wishlist**: save, remove, share (demo), persists across reload
- **Cart**: quantity controls, line-item removal, persists across reload
- **Product quick-view modal**: image gallery, color/size variants, spec table,
  reviews tab with star breakdown
- **Accounts**: login/register with inline validation, order history with
  date + time, address book, logged-in wishlist view
- **Checkout**: saved-address selection, 3 shipping speeds with live pricing,
  3 payment method UIs, promo code (`LUMINA10` for 10% off), live order summary
  with tax calculation, order confirmation screen
- Toast notifications, skeleton-ready grid, empty states, scroll-reveal
  animations, reduced-motion support, full keyboard/focus handling

## Notes

- Product photos are hotlinked from Unsplash; if a CDN/image fails to load,
  a neutral placeholder SVG renders in its place automatically.
- Cart/wishlist/account data persists via `localStorage` where available,
  and falls back to in-memory state for the session otherwise.
- This is a front-end demo: checkout "processes" with a simulated delay and
  no real payment gateway is contacted.
