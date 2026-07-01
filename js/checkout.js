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
  { id: 'bnpl', label: 'Pay Later', icon: 'calendar-clock' },
  { id: 'crypto', label: 'Crypto', icon: 'bitcoin' }
];

function renderPaymentMethods() {
  document.getElementById('payment-methods').innerHTML = PAY_METHODS.map(m => `
    <button class="pay-method-btn ${checkoutState.payMethod === m.id ? 'active' : ''}" data-action="select-pay-method" data-method="${m.id}">
      <i data-lucide="${m.icon}"></i>
      ${m.label}
    </button>
  `).join('');
  renderPayMethodFields();
  refreshIcons(); wireAllImages();
}

function selectPayMethod(id) {
  checkoutState.payMethod = id;
  renderPaymentMethods();
}

const CRYPTO_WALLETS = [
  { id: 'bitcoin', label: 'Bitcoin (BTC)' },
  { id: 'ethereum', label: 'Ethereum (ETH)' },
  { id: 'coinbase', label: 'Coinbase Wallet' },
  { id: 'usdc', label: 'USDC' }
];

const BNPL_PLANS = [
  { id: '4pay', label: 'Pay in 4', desc: '4 interest-free installments every 2 weeks', depositFraction: 0.25 },
  { id: '3mo', label: '3-month plan', desc: '3 monthly payments, 0% APR', depositFraction: 1 / 3 },
  { id: '6mo', label: '6-month plan', desc: '6 monthly payments, 6.9% APR', depositFraction: 1 / 6 }
];
let bnplSelectedPlan = '4pay';

function renderPayMethodFields() {
  const wrap = document.getElementById('pay-method-fields');
  if (checkoutState.payMethod === 'card') {
    wrap.innerHTML = `
      <div class="form-field" data-field="cc-number">
        <label for="cc-number">Card number</label>
        <div style="position:relative">
          <input id="cc-number" class="payment-input" style="padding-left:42px" placeholder="0000 0000 0000 0000" inputmode="numeric" maxlength="19">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--ink-soft)"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
        </div>
        <div class="error-msg">Enter a valid 16-digit card number.</div>
      </div>
      <div class="form-row-split">
        <div class="form-field" data-field="cc-exp"><label for="cc-exp">Expiry</label><input id="cc-exp" class="payment-input" placeholder="MM/YY" maxlength="5"><div class="error-msg">Enter a valid future expiry (MM/YY).</div></div>
        <div class="form-field" data-field="cc-cvc"><label for="cc-cvc">CVC</label><input id="cc-cvc" class="payment-input" placeholder="123" maxlength="4" inputmode="numeric"><div class="error-msg">Enter a valid 3-4 digit CVC.</div></div>
      </div>`;
  } else if (checkoutState.payMethod === 'wallet') {
    wrap.innerHTML = `
      <div class="form-field" data-field="wallet-email">
        <label for="wallet-email">Wallet account email</label>
        <input id="wallet-email" class="payment-input" placeholder="you@example.com" type="email">
        <div class="error-msg">Enter the email linked to your digital wallet.</div>
      </div>
      <p style="font-size:.82rem;color:var(--ink-soft);background:var(--paper-dim);padding:14px 16px;border-radius:var(--r-md);margin-top:4px">You'll confirm this payment in your wallet app before the order is placed.</p>`;
  } else if (checkoutState.payMethod === 'crypto') {
    wrap.innerHTML = `
      <div class="form-field" data-field="crypto-network">
        <label for="crypto-network">Wallet network</label>
        <select id="crypto-network" class="payment-input">
          ${CRYPTO_WALLETS.map(w => `<option value="${w.id}">${escapeHtml(w.label)}</option>`).join('')}
        </select>
      </div>
      <div class="form-field" data-field="crypto-address">
        <label for="crypto-address">Your wallet address</label>
        <input id="crypto-address" class="payment-input" placeholder="e.g. bc1q... or 0x...">
        <div class="error-msg">Enter the wallet address you'll be paying from (at least 20 characters).</div>
      </div>
      <p style="font-size:.82rem;color:var(--ink-soft);background:var(--paper-dim);padding:14px 16px;border-radius:var(--r-md);margin-top:4px">We'll send a payment request to this address. Crypto payments are final once confirmed on-chain.</p>`;
  } else if (checkoutState.payMethod === 'bnpl') {
    wrap.innerHTML = `
      <div class="form-field" data-field="bnpl-plan">
        <label>Choose a payment plan</label>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
          ${BNPL_PLANS.map(p => `
            <label class="shipping-option ${bnplSelectedPlan === p.id ? 'active' : ''}" style="cursor:pointer">
              <span class="left">
                <input type="radio" name="bnpl-plan" value="${p.id}" ${bnplSelectedPlan === p.id ? 'checked' : ''} data-action="select-bnpl-plan">
                <span><b>${p.label}</b><span class="eta">${p.desc}</span></span>
              </span>
            </label>
          `).join('')}
        </div>
      </div>
      <div id="bnpl-deposit-note" style="font-size:.84rem;background:var(--indigo-tint);color:var(--indigo-dark);padding:14px 16px;border-radius:var(--r-md);margin-top:10px;font-weight:600"></div>
      <div class="form-field" data-field="bnpl-card" style="margin-top:14px">
        <label for="bnpl-card">Card for deposit &amp; future payments</label>
        <input id="bnpl-card" class="payment-input" placeholder="0000 0000 0000 0000" inputmode="numeric" maxlength="19">
        <div class="error-msg">A valid card is required to schedule your installments.</div>
      </div>`;
    updateBnplDepositNote();
  }
}

function selectBnplPlan(id) {
  bnplSelectedPlan = id;
  renderPayMethodFields();
}

function updateBnplDepositNote() {
  const note = document.getElementById('bnpl-deposit-note');
  if (!note) return;
  const plan = BNPL_PLANS.find(p => p.id === bnplSelectedPlan);
  const total = checkoutGrandTotal();
  const deposit = total * plan.depositFraction;
  note.textContent = `Due today: ${money(deposit)} deposit · Remaining ${money(total - deposit)} billed per the schedule above.`;
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
      <img src="${l.product.img}" alt="">
      <div class="info">${escapeHtml(l.product.name)} × ${l.qty}</div>
      <div class="price">${money(l.lineTotal)}</div>
    </div>
  `).join('');

  const { subtotal, discount, shippingOpt, tax, total } = checkoutTotals();

  document.getElementById('summary-subtotal').textContent = money(subtotal);
  document.getElementById('summary-shipping').textContent = shippingOpt.cost === 0 ? 'FREE' : money(shippingOpt.cost);
  document.getElementById('summary-tax').textContent = money(tax);
  document.getElementById('summary-discount-row').style.display = discount > 0 ? 'flex' : 'none';
  if (discount > 0) document.getElementById('summary-discount').textContent = `−${money(discount)}`;
  document.getElementById('summary-total').textContent = money(total);

  refreshIcons(); wireAllImages();
  if (checkoutState.payMethod === 'bnpl') updateBnplDepositNote();
}

/* Single source of truth for checkout pricing math — used by both the
   summary display and the actual order-creation step, so they can never
   drift out of sync with each other. */
function checkoutTotals() {
  const subtotal = cartSubtotal();
  const shippingOpt = SHIPPING_OPTIONS.find(o => o.id === checkoutState.shipping) || SHIPPING_OPTIONS[0];
  let discount = 0;
  if (checkoutState.promo && checkoutState.promo.type === 'percent') discount = subtotal * (checkoutState.promo.value / 100);
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + shippingOpt.cost + tax;
  return { subtotal, discount, shippingOpt, tax, total };
}
function checkoutGrandTotal() { return checkoutTotals().total; }

/* --- Strict checkout validation ---
   Nothing here is decorative: every check below must pass before an order
   can be created. Returns { valid, firstInvalidEl } so the caller can both
   block submission and focus the user on what needs fixing. */
function validateCheckout() {
  let valid = true;
  let firstInvalidEl = null;
  const markInvalid = (fieldEl) => {
    if (!fieldEl) return;
    fieldEl.classList.add('invalid');
    if (!firstInvalidEl) firstInvalidEl = fieldEl;
    valid = false;
  };
  const clearInvalid = (fieldEl) => fieldEl && fieldEl.classList.remove('invalid');

  // 1. Cart must have items.
  if (!cartLines().length) return { valid: false, firstInvalidEl: null, reason: 'Your cart is empty.' };

  // 2. A real, selected shipping address is required.
  const addressExists = state.addresses.some(a => a.id === checkoutState.selectedAddressId);
  document.querySelectorAll('.saved-address-option').forEach(el => el.classList.remove('invalid-address'));
  if (!checkoutState.selectedAddressId || !addressExists) {
    valid = false;
    const addrWrap = document.getElementById('saved-address-pick');
    if (addrWrap) {
      addrWrap.classList.add('invalid');
      if (!firstInvalidEl) firstInvalidEl = addrWrap;
    }
  } else {
    document.getElementById('saved-address-pick')?.classList.remove('invalid');
  }

  // 3. Payment-method-specific required fields.
  if (checkoutState.payMethod === 'card' || checkoutState.payMethod === 'bnpl') {
    const numberFieldId = checkoutState.payMethod === 'card' ? 'cc-number' : 'bnpl-card';
    const numberInput = document.getElementById(numberFieldId);
    const numberField = numberInput?.closest('.form-field');
    const digitsOnly = (numberInput?.value || '').replace(/\D/g, '');
    if (digitsOnly.length < 13 || digitsOnly.length > 19) markInvalid(numberField); else clearInvalid(numberField);

    if (checkoutState.payMethod === 'card') {
      const expInput = document.getElementById('cc-exp');
      const expField = expInput?.closest('.form-field');
      const expMatch = /^(\d{2})\/(\d{2})$/.exec((expInput?.value || '').trim());
      let expOk = false;
      if (expMatch) {
        const month = Number(expMatch[1]);
        const year = 2000 + Number(expMatch[2]);
        if (month >= 1 && month <= 12) {
          const expiryDate = new Date(year, month, 0, 23, 59, 59);
          expOk = expiryDate.getTime() >= Date.now();
        }
      }
      if (!expOk) markInvalid(expField); else clearInvalid(expField);

      const cvcInput = document.getElementById('cc-cvc');
      const cvcField = cvcInput?.closest('.form-field');
      const cvcOk = /^\d{3,4}$/.test((cvcInput?.value || '').trim());
      if (!cvcOk) markInvalid(cvcField); else clearInvalid(cvcField);
    }
  } else if (checkoutState.payMethod === 'wallet') {
    const emailInput = document.getElementById('wallet-email');
    const emailField = emailInput?.closest('.form-field');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((emailInput?.value || '').trim());
    if (!emailOk) markInvalid(emailField); else clearInvalid(emailField);
  } else if (checkoutState.payMethod === 'crypto') {
    const addrInput = document.getElementById('crypto-address');
    const addrField = addrInput?.closest('.form-field');
    const addrOk = (addrInput?.value || '').trim().length >= 20;
    if (!addrOk) markInvalid(addrField); else clearInvalid(addrField);
  }

  return { valid, firstInvalidEl };
}

function processPayment() {
  if (!state.account) {
    showToast('Please log in to complete checkout');
    openAuthModal('login');
    return;
  }

  const result = validateCheckout();
  if (!result.valid) {
    if (result.reason) {
      showToast(result.reason, 'warn');
    } else {
      showToast('Please complete all required fields before placing your order', 'warn');
    }
    if (result.firstInvalidEl) {
      result.firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = result.firstInvalidEl.querySelector('input, select');
      if (input) input.focus();
    }
    return;
  }

  const btn = document.getElementById('pay-button');
  btn.disabled = true;
  const originalText = btn.innerHTML;
  btn.innerHTML = `<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 12a9 9 0 1 1-9-9"/></svg> Processing...`;

  setTimeout(() => {
    // Re-validate immediately before committing — guards against state
    // changing during the simulated processing delay (e.g. cart emptied
    // in another tab, address removed, etc.) so nothing slips through.
    const finalCheck = validateCheckout();
    if (!finalCheck.valid) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      showToast('Something changed before we could confirm — please review checkout', 'warn');
      return;
    }

    const lines = cartLines();
    const { total } = checkoutTotals();
    const address = state.addresses.find(a => a.id === checkoutState.selectedAddressId);

    const order = {
      id: 'LUM-' + Math.floor(100000 + Math.random() * 899999),
      date: new Date().toISOString(),
      status: 'transit',
      items: lines.map(l => ({ name: l.product.name, img: l.product.img, qty: l.qty, price: l.product.price })),
      total,
      paymentMethod: checkoutState.payMethod,
      shippingAddressId: address ? address.id : null
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
