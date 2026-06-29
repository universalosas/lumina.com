/* =========================================================
   LUMINA — Cart & Wishlist
   ========================================================= */

function cartKey(productId, color, size) {
  return `${productId}__${color || ''}__${size || ''}`;
}

function addToCart(productId, opts = {}) {
  const p = findProduct(productId);
  if (!p) return;
  const color = opts.color || p.colors[0].name;
  const size = opts.size || (p.sizes ? p.sizes[0] : null);
  const qty = opts.qty || 1;
  const key = cartKey(productId, color, size);

  const existing = state.cart.find(item => item.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ key, productId, color, size, qty });
  }
  persist();
  updateCartBadge();
  renderCartDrawer();
  showToast(`Added “${p.name}” to your cart`);
}

function removeFromCart(key) {
  state.cart = state.cart.filter(i => i.key !== key);
  persist();
  updateCartBadge();
  renderCartDrawer();
  if (!document.getElementById('checkout-view').hidden) renderCheckoutSummary();
}

function changeCartQty(key, delta) {
  const item = state.cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  persist();
  updateCartBadge();
  renderCartDrawer();
  if (!document.getElementById('checkout-view').hidden) renderCheckoutSummary();
}

function cartLines() {
  return state.cart.map(item => {
    const p = findProduct(item.productId);
    return p ? { ...item, product: p, lineTotal: p.price * item.qty } : null;
  }).filter(Boolean);
}

function cartSubtotal() {
  return cartLines().reduce((sum, l) => sum + l.lineTotal, 0);
}

function cartItemCount() {
  return state.cart.reduce((sum, i) => sum + i.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const count = cartItemCount();
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 400);
}

function renderCartDrawer() {
  const body = document.getElementById('cart-items');
  const lines = cartLines();

  if (!lines.length) {
    body.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>
        <h3>Your cart is empty</h3>
        <p>Items you add will show up here.</p>
      </div>`;
  } else {
    body.innerHTML = lines.map(l => `
      <div class="cart-item">
        <img src="${l.product.img}" alt="${escapeHtml(l.product.name)}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
        <div class="cart-item-info">
          <h4>${escapeHtml(l.product.name)}</h4>
          <div class="cart-item-meta">${l.color ? escapeHtml(l.color) : ''}${l.color && l.size ? ' · ' : ''}${l.size ? escapeHtml(l.size) : ''}</div>
          <div class="cart-item-row">
            <div class="qty-stepper">
              <button data-action="cart-qty" data-key="${l.key}" data-delta="-1" aria-label="Decrease quantity">−</button>
              <span>${l.qty}</span>
              <button data-action="cart-qty" data-key="${l.key}" data-delta="1" aria-label="Increase quantity">+</button>
            </div>
            <span class="cart-item-price">${money(l.lineTotal)}</span>
          </div>
        </div>
        <button class="cart-item-remove" data-action="cart-remove" data-key="${l.key}" aria-label="Remove item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg></button>
      </div>
    `).join('');
  }

  const subtotal = cartSubtotal();
  document.getElementById('cart-subtotal').textContent = money(subtotal);
  document.getElementById('cart-footer').style.display = lines.length ? 'block' : 'none';
  refreshIcons();
}

/* --- Wishlist --- */
function toggleWishlist(productId) {
  const idx = state.wishlist.indexOf(productId);
  const p = findProduct(productId);
  if (idx >= 0) {
    state.wishlist.splice(idx, 1);
    showToast(`Removed “${p.name}” from wishlist`);
  } else {
    state.wishlist.push(productId);
    showToast(`Saved “${p.name}” to wishlist`);
  }
  persist();
  updateWishlistBadge();
  renderProductGrid();
  renderWishlistDrawer();
  syncWishlistButtonsInModal();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  badge.textContent = state.wishlist.length;
  badge.classList.toggle('hidden', state.wishlist.length === 0);
}

function renderWishlistDrawer() {
  const body = document.getElementById('wishlist-items');
  const items = state.wishlist.map(findProduct).filter(Boolean);

  if (!items.length) {
    body.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        <h3>Your wishlist is empty</h3>
        <p>Tap the heart on any product to save it here.</p>
      </div>`;
  } else {
    body.innerHTML = items.map(p => `
      <div class="wishlist-item">
        <img src="${p.img}" alt="${escapeHtml(p.name)}" data-action="open-quickview" data-id="${p.id}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
        <div class="wishlist-item-info">
          <h4 data-action="open-quickview" data-id="${p.id}">${escapeHtml(p.name)}</h4>
          <div class="price">${money(p.price)}</div>
        </div>
        <div class="wishlist-item-actions">
          <button class="btn btn-accent" style="padding:8px 14px;font-size:.76rem" data-action="wishlist-add-to-cart" data-id="${p.id}">Add to cart</button>
          <button class="btn btn-ghost" style="padding:8px 14px;font-size:.76rem" data-action="toggle-wishlist" data-id="${p.id}">Remove</button>
        </div>
      </div>
    `).join('');
  }
  refreshIcons();
}

function shareWishlist(channel) {
  const items = state.wishlist.map(findProduct).filter(Boolean);
  const text = items.length
    ? `Check out my Lumina wishlist: ${items.map(p => p.name).join(', ')}`
    : 'Check out my Lumina wishlist!';
  if (channel === 'copy') {
    showToast('Wishlist link copied (demo)');
  } else {
    showToast(`Shared via ${channel} (demo)`);
  }
}
