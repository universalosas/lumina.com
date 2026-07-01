/* =========================================================
   LUMINA — Product Quick-View Modal
   ========================================================= */

let pmActiveTab = 'details';

function openQuickView(productId) {
  const p = findProduct(productId);
  if (!p) return;
  state.activeProductId = p.id;
  state.activeModalImgIdx = 0;
  state.activeModalColorIdx = 0;
  state.activeModalQty = 1;
  state.selectedSize = p.sizes ? p.sizes[0] : null;
  pmActiveTab = 'details';
  renderQuickView();
  const overlay = document.getElementById('product-modal-overlay');
  overlay.classList.add('open');
  lockScroll();
}

function closeQuickView() {
  document.getElementById('product-modal-overlay').classList.remove('open');
  unlockScroll();
}

function renderQuickView() {
  const p = findProduct(state.activeProductId);
  if (!p) return;
  const isWishlisted = state.wishlist.includes(p.id);
  const gallery = p.gallery && p.gallery.length ? p.gallery : [p.img];
  const activeColor = p.colors[state.activeModalColorIdx] || p.colors[0];
  const lowStock = p.stock > 0 && p.stock <= 6;

  const reviews = REVIEWS[p.id] || [];
  const reviewAvg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : p.rating;

  document.getElementById('product-modal-content').innerHTML = `
    <div class="product-modal">
      <button class="pm-close" data-action="close-quickview" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div class="pm-gallery">
        <div class="pm-main-img"><img src="${gallery[state.activeModalImgIdx]}" alt="${escapeHtml(p.name)}" id="pm-main-img"></div>
        ${gallery.length > 1 ? `
        <div class="pm-thumbs">
          ${gallery.map((g, i) => `<img src="${g}" class="${i === state.activeModalImgIdx ? 'active' : ''}" data-action="pm-thumb" data-idx="${i}" alt="">`).join('')}
        </div>` : ''}
      </div>
      <div class="pm-info">
        <div class="pm-brand">${escapeHtml(p.brand)}</div>
        <h2>${escapeHtml(p.name)}</h2>
        <div class="pm-rating-row">
          <span class="stars">${starsHtml(p.rating, 15)}</span>
          <span style="font-size:.84rem;color:var(--ink-soft)">${p.rating.toFixed(1)}</span>
          <button class="" data-action="pm-tab-reviews" style="background:none;border:none;font-size:.82rem;color:var(--indigo);font-weight:600">${p.reviewCount} reviews</button>
        </div>

        <div class="pm-tabs">
          <button class="pm-tab ${pmActiveTab === 'details' ? 'active' : ''}" data-action="pm-tab" data-tab="details">Details</button>
          <button class="pm-tab ${pmActiveTab === 'reviews' ? 'active' : ''}" data-action="pm-tab" data-tab="reviews">Reviews (${reviews.length})</button>
        </div>

        <div id="pm-tab-panel">
          ${pmActiveTab === 'details' ? renderPmDetails(p, activeColor, lowStock, isWishlisted) : renderPmReviews(p, reviews, reviewAvg)}
        </div>
      </div>
    </div>
  `;
  refreshIcons(); wireAllImages();
}

function renderPmDetails(p, activeColor, lowStock, isWishlisted) {
  return `
    <div class="pm-price-row">
      <span class="price">${money(p.price)}</span>
      ${p.compareAt ? `<span class="compare">${money(p.compareAt)}</span><span class="pill pill-sale">Save ${Math.round((1 - p.price / p.compareAt) * 100)}%</span>` : ''}
    </div>
    <p class="pm-desc">${escapeHtml(p.description)}</p>

    <div class="pm-option-group">
      <div class="pm-option-label"><span>Color</span><span class="sel">${escapeHtml(activeColor.name)}</span></div>
      <div class="pm-colors">
        ${p.colors.map((c, i) => `<button class="pm-color-swatch ${i === state.activeModalColorIdx ? 'active' : ''}" style="background:${c.hex}" data-action="pm-color" data-idx="${i}" title="${escapeHtml(c.name)}" aria-label="${escapeHtml(c.name)}"></button>`).join('')}
      </div>
    </div>

    ${p.sizes ? `
    <div class="pm-option-group">
      <div class="pm-option-label"><span>Size</span><span class="sel">${escapeHtml(state.selectedSize)}</span></div>
      <div class="pm-sizes">
        ${p.sizes.map(s => `<button class="pm-size-btn ${s === state.selectedSize ? 'active' : ''}" data-action="pm-size" data-size="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('')}
      </div>
    </div>` : ''}

    <div class="pm-add-row">
      <div class="qty-stepper pm-qty">
        <button data-action="pm-qty" data-delta="-1" aria-label="Decrease quantity">−</button>
        <span>${state.activeModalQty}</span>
        <button data-action="pm-qty" data-delta="1" aria-label="Increase quantity">+</button>
      </div>
      <button class="btn btn-accent btn-block" data-action="pm-add-to-cart" ${p.stock === 0 ? 'disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>
        ${p.stock === 0 ? 'Out of stock' : 'Add to cart'}
      </button>
      <button class="icon-btn pm-wishlist-btn ${isWishlisted ? 'active' : ''}" data-action="toggle-wishlist" data-id="${p.id}" aria-label="Toggle wishlist" style="border:1.5px solid var(--line); flex-shrink:0;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
    </div>
    <div class="pm-stock-note ${lowStock ? 'low' : ''}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
      ${p.stock === 0 ? 'Currently unavailable' : lowStock ? `Only ${p.stock} left in stock` : 'In stock, ready to ship'}
    </div>

    <div class="pm-specs">
      <table>
        ${p.specs.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join('')}
      </table>
    </div>
  `;
}

function renderPmReviews(p, reviews, avg) {
  return `
    <div class="review-summary">
      <div class="review-score">
        <b>${avg.toFixed(1)}</b>
        <span class="stars">${starsHtml(avg, 13)}</span>
        <span>${reviews.length} review${reviews.length === 1 ? '' : 's'}</span>
      </div>
      <p style="font-size:.82rem;color:var(--ink-soft);flex:1">Reviews are from verified Lumina customers who purchased this item.</p>
    </div>
    ${reviews.length ? reviews.map(r => `
      <div class="review-card">
        <div class="review-card-top">
          <b>${escapeHtml(r.author)}</b>
          <span>${formatOrderDate(r.date)}</span>
        </div>
        <span class="stars">${starsHtml(r.rating, 12)}</span>
        <div class="review-title">${escapeHtml(r.title)}</div>
        <div class="review-body">${escapeHtml(r.body)}</div>
      </div>
    `).join('') : `<p style="color:var(--ink-soft);font-size:.88rem;padding:20px 0">No written reviews yet for this product — be the first to leave one after your order arrives.</p>`}
  `;
}

function pmSwitchTab(tab) {
  pmActiveTab = tab;
  renderQuickView();
}

function pmChangeColor(idx) {
  state.activeModalColorIdx = idx;
  renderQuickView();
}
function pmChangeSize(size) {
  state.selectedSize = size;
  renderQuickView();
}
function pmChangeImg(idx) {
  state.activeModalImgIdx = idx;
  renderQuickView();
}
function pmChangeQty(delta) {
  state.activeModalQty = Math.max(1, state.activeModalQty + delta);
  renderQuickView();
}
function pmAddToCart() {
  const p = findProduct(state.activeProductId);
  if (!p) return;
  const color = p.colors[state.activeModalColorIdx].name;
  addToCart(p.id, { color, size: state.selectedSize, qty: state.activeModalQty });
}
function syncWishlistButtonsInModal() {
  if (document.getElementById('product-modal-overlay').classList.contains('open')) renderQuickView();
}
