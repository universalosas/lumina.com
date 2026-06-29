/* =========================================================
   LUMINA — Checkout Flow
   ========================================================= */

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping', eta: '5–7 business days', cost: 0 },
  { id: 'express', label: 'Express Shipping', eta: '2–3 business days', cost: 18 },
  { id: 'overnight', label: 'Overnight', eta: 'Next business day', cost: 39 }
];

const checkoutState = {
  shipping: 'standard',
  payMethod: 'card',
  selectedAddressId: state.addresses.find(a => a.isDefault)?.id || (state.addresses[0] && state.addresses[0].id),
  promo: null
};

function goToCheckout() {
  if (!state.cart.length) { showToast('Your cart is empty', 'warn'); return; }
  closeCart();
  hideAllMainViews();
  document.getElementById('checkout-view').hidden = false;
  renderCheckoutPage();
  window.scrollTo(0, 0);
}

function showHomeView() {
  hideAllMainViews();
  document.getElementById('home-view').hidden = false;
  window.scrollTo(0, 0);
}

function renderCheckoutPage() {
  renderShippingForm();
  renderShippingOptions();
  renderPaymentMethods();
  renderCheckoutSummary();
}

function renderShippingForm() {
  const wrap = document.getElementById('saved-address-pick');
  if (!state.addresses.length) { wrap.innerHTML = `<p style="color:var(--ink-soft);font-size:.86rem">No saved addresses yet — add one in your account.</p>`; return; }
  wrap.innerHTML = state.addresses.map(a => `
    <label class="saved-address-option ${checkoutState.selectedAddressId === a.id ? 'active' : ''}">
      <input type="radio" name="ship-address" value="${a.id}" ${checkoutState.selectedAddressId === a.id ? 'checked' : ''} data-action="select-address">
      <span>
        <b>${escapeHtml(a.label)} — ${escapeHtml(a.name)}</b>
        <span>${escapeHtml(a.line)}, ${escapeHtml(a.city)}, ${escapeHtml(a.region)}, ${escapeHtml(a.country)}</span>
      </span>
    </label>
  `).join('');
}

function selectAddress(id) {
  checkoutState.selectedAddressId = id;
  renderShippingForm();
}

function renderShippingOptions() {
  document.getElementById('shipping-options').innerHTML = SHIPPING_OPTIONS.map(o => `
    <label class="shipping-option ${checkoutState.shipping === o.id ? 'active' : ''}">
      <span class="left">
        <input type="radio" name="shipping" value="${o.id}" ${checkoutState.shipping === o.id ? 'checked' : ''} data-action="select-shipping">
        <span><b>${o.label}</b><span class="eta">${o.eta}</span></span>
      </span>
      <span class="cost">${o.cost === 0 ? 'FREE' : money(o.cost)}</span>
    </label>
  `).join('');
}

function selectShipping(id) {
  checkoutState.shipping = id;
  renderShippingOptions();
  renderCheckoutSummary();
}

const PAY_METHODS = [
  { id: 'card', label: 'Card', icon: 'credit-card' },
  { id: 'wallet', label: 'Digital Wallet', icon: 'wallet' },
  { id: 'bnpl', label: 'Buy Now, Pay Later', icon: 'calendar-clock' }
];

function renderPaymentMethods() {
  document.getElementById('payment-methods').innerHTML = PAY_METHODS.map(m => `
    <button class="pay-method-btn ${checkoutState.payMethod === m.id ? 'active' : ''}" data-action="select-pay-method" data-method="${m.id}">
      <i data-lucide="${m.icon}"></i>
      ${m.label}
    </button>
  `).join('');
  renderPayMethodFields();
  refreshIcons();
}

function selectPayMethod(id) {
  checkoutState.payMethod = id;
  renderPaymentMethods();
}

function renderPayMethodFields() {
  const wrap = document.getElementById('pay-method-fields');
  if (checkoutState.payMethod === 'card') {
    wrap.innerHTML = `
      <div class="form-field">
        <label for="cc-number">Card number</label>
        <div style="position:relative">
          <input id="cc-number" class="payment-input" style="padding-left:42px" placeholder="0000 0000 0000 0000" inputmode="numeric">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--ink-soft)"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
        </div>
      </div>
      <div class="form-row-split">
        <div class="form-field"><label for="cc-exp">Expiry</label><input id="cc-exp" class="payment-input" placeholder="MM/YY"></div>
        <div class="form-field"><label for="cc-cvc">CVC</label><input id="cc-cvc" class="payment-input" placeholder="123"></div>
      </div>`;
  } else if (checkoutState.payMethod === 'wallet') {
    wrap.innerHTML = `<p style="font-size:.86rem;color:var(--ink-soft);background:var(--paper-dim);padding:16px;border-radius:var(--r-md)">You'll be redirected to your digital wallet app to confirm this payment securely.</p>`;
  } else {
    wrap.innerHTML = `<p style="font-size:.86rem;color:var(--ink-soft);background:var(--paper-dim);padding:16px;border-radius:var(--r-md)">Split this purchase into 4 interest-free installments. First payment charged today, the rest every 2 weeks.</p>`;
  }
}

function applyPromoCode() {
  const input = document.getElementById('promo-input');
  const code = input.value.trim().toUpperCase();
  const note = document.getElementById('promo-applied');
  if (code === 'LUMINA10') {
    checkoutState.promo = { code, type: 'percent', value: 10 };
    note.style.display = 'flex';
    note.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> LUMINA10 applied — 10% off`;
  } else if (code) {
    checkoutState.promo = null;
    note.style.display = 'flex';
    note.style.color = '#c0392b';
    note.innerHTML = `Code not recognized — try LUMINA10`;
  } else {
    checkoutState.promo = null;
    note.style.display = 'none';
  }
  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const lines = cartLines();
  const list = document.getElementById('summary-line-items');
  list.innerHTML = lines.map(l => `
    <div class="summary-line-item">
      <img src="${l.product.img}" alt="" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
      <div class="info">${escapeHtml(l.product.name)} × ${l.qty}</div>
      <div class="price">${money(l.lineTotal)}</div>
    </div>
  `).join('');

  const subtotal = cartSubtotal();
  const shippingOpt = SHIPPING_OPTIONS.find(o => o.id === checkoutState.shipping) || SHIPPING_OPTIONS[0];
  let discount = 0;
  if (checkoutState.promo && checkoutState.promo.type === 'percent') discount = subtotal * (checkoutState.promo.value / 100);
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + shippingOpt.cost + tax;

  document.getElementById('summary-subtotal').textContent = money(subtotal);
  document.getElementById('summary-shipping').textContent = shippingOpt.cost === 0 ? 'FREE' : money(shippingOpt.cost);
  document.getElementById('summary-tax').textContent = money(tax);
  document.getElementById('summary-discount-row').style.display = discount > 0 ? 'flex' : 'none';
  if (discount > 0) document.getElementById('summary-discount').textContent = `−${money(discount)}`;
  document.getElementById('summary-total').textContent = money(total);
}

function processPayment() {
  if (!state.account) {
    showToast('Please log in to complete checkout');
    openAuthModal('login');
    return;
  }
  if (!cartLines().length) return;

  const btn = document.getElementById('pay-button');
  btn.disabled = true;
  const originalText = btn.innerHTML;
  btn.innerHTML = `<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 12a9 9 0 1 1-9-9"/></svg> Processing...`;

  setTimeout(() => {
    const lines = cartLines();
    const subtotal = cartSubtotal();
    const shippingOpt = SHIPPING_OPTIONS.find(o => o.id === checkoutState.shipping) || SHIPPING_OPTIONS[0];
    let discount = 0;
    if (checkoutState.promo && checkoutState.promo.type === 'percent') discount = subtotal * (checkoutState.promo.value / 100);
    const tax = (subtotal - discount) * 0.075;
    const total = subtotal - discount + shippingOpt.cost + tax;

    const order = {
      id: 'LUM-' + Math.floor(100000 + Math.random() * 899999),
      date: new Date().toISOString(),
      status: 'transit',
      items: lines.map(l => ({ name: l.product.name, img: l.product.img, qty: l.qty, price: l.product.price })),
      total
    };
    state.orders.push(order);
    state.cart = [];
    checkoutState.promo = null;
    persist();
    updateCartBadge();
    renderCartDrawer();

    btn.disabled = false;
    btn.innerHTML = originalText;

    showConfirmation(order);
  }, 1800);
}

function showConfirmation(order) {
  hideAllMainViews();
  document.getElementById('confirm-view').hidden = false;
  document.getElementById('confirm-order-id').textContent = order.id;
  window.scrollTo(0, 0);
}
