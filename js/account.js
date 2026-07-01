/* =========================================================
   LUMINA — Auth & Account Dashboard
   ========================================================= */

function openAuthModal(mode = 'login') {
  state.authMode = mode;
  renderAuthModal();
  document.getElementById('auth-modal-overlay').classList.add('open');
  lockScroll();
}
function closeAuthModal() {
  document.getElementById('auth-modal-overlay').classList.remove('open');
  unlockScroll();
}
function switchAuthMode(mode) {
  state.authMode = mode;
  renderAuthModal();
}

function renderAuthModal() {
  const isLogin = state.authMode === 'login';
  document.getElementById('auth-modal-content').innerHTML = `
    <button class="icon-btn auth-close" data-action="close-auth" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <div class="auth-tabs">
      <button class="auth-tab ${isLogin ? 'active' : ''}" data-action="auth-switch" data-mode="login">Log in</button>
      <button class="auth-tab ${!isLogin ? 'active' : ''}" data-action="auth-switch" data-mode="register">Create account</button>
    </div>
    <h2>${isLogin ? 'Welcome back' : 'Join Lumina'}</h2>
    <p class="sub">${isLogin ? 'Log in to view orders, addresses, and your wishlist.' : 'Create an account to track orders and check out faster.'}</p>
    <form id="auth-form" novalidate>
      ${!isLogin ? `
      <div class="form-field" data-field="name">
        <label for="auth-name">Full name</label>
        <input id="auth-name" type="text" autocomplete="name" placeholder="Osaro Goodness">
        <div class="error-msg">Please enter your name.</div>
      </div>` : ''}
      <div class="form-field" data-field="email">
        <label for="auth-email">Email address</label>
        <input id="auth-email" type="email" autocomplete="email" placeholder="you@example.com">
        <div class="error-msg">Enter a valid email address.</div>
      </div>
      <div class="form-field" data-field="password">
        <label for="auth-password">Password</label>
        <input id="auth-password" type="password" autocomplete="${isLogin ? 'current-password' : 'new-password'}" placeholder="••••••••">
        <div class="error-msg">Password must be at least 6 characters.</div>
      </div>
      ${isLogin ? '' : `
      <label class="form-check"><input type="checkbox" id="auth-newsletter" checked> Send me product updates and offers</label>
      `}
      <button type="submit" class="btn btn-primary btn-block">${isLogin ? 'Log in' : 'Create account'}</button>
    </form>
    <p class="auth-switch">
      ${isLogin ? `New to Lumina? <button data-action="auth-switch" data-mode="register">Create an account</button>` : `Already have an account? <button data-action="auth-switch" data-mode="login">Log in</button>`}
    </p>
  `;
  document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const isLogin = state.authMode === 'login';
  let valid = true;

  const emailField = document.querySelector('[data-field="email"]');
  const emailInput = document.getElementById('auth-email');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
  emailField.classList.toggle('invalid', !emailOk);
  if (!emailOk) valid = false;

  const passField = document.querySelector('[data-field="password"]');
  const passInput = document.getElementById('auth-password');
  const passOk = passInput.value.length >= 6;
  passField.classList.toggle('invalid', !passOk);
  if (!passOk) valid = false;

  if (!isLogin) {
    const nameField = document.querySelector('[data-field="name"]');
    const nameInput = document.getElementById('auth-name');
    const nameOk = nameInput.value.trim().length > 1;
    nameField.classList.toggle('invalid', !nameOk);
    if (!nameOk) valid = false;
  }

  if (!valid) return;

  const name = isLogin ? (emailInput.value.split('@')[0]) : document.getElementById('auth-name').value.trim();
  state.account = {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email: emailInput.value.trim()
  };
  persist();
  closeAuthModal();
  updateAccountUI();
  showToast(isLogin ? `Welcome back, ${state.account.name}!` : `Account created — welcome, ${state.account.name}!`);
}

function logout() {
  state.account = null;
  persist();
  updateAccountUI();
  showHomeView();
  showToast('Logged out');
}

function updateAccountUI() {
  const btn = document.getElementById('account-btn');
  if (state.account) {
    btn.innerHTML = `<span class="account-pill-initial">${escapeHtml(state.account.name.charAt(0))}</span>`;
    btn.setAttribute('aria-label', `Account: ${state.account.name}`);
  } else {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    btn.setAttribute('aria-label', 'Account');
  }
}

function handleAccountClick() {
  if (state.account) {
    showAccountView();
  } else {
    openAuthModal('login');
  }
}

/* --- Account dashboard view --- */
function showAccountView(panel = 'orders') {
  hideAllMainViews();
  document.getElementById('account-view').hidden = false;
  renderAccountSidebar(panel);
  renderAccountPanel(panel);
  window.scrollTo(0, 0);
}

function renderAccountSidebar(activePanel) {
  if (!state.account) return;
  document.getElementById('account-profile-name').textContent = state.account.name;
  document.getElementById('account-profile-email').textContent = state.account.email;
  document.getElementById('account-avatar-initial').textContent = state.account.name.charAt(0).toUpperCase();
  document.querySelectorAll('.account-nav-link[data-panel]').forEach(link => {
    link.classList.toggle('active', link.dataset.panel === activePanel);
  });
}

function renderAccountPanel(panel) {
  document.querySelectorAll('.account-panel').forEach(p => p.hidden = p.dataset.panel !== panel);
  if (panel === 'orders') renderOrdersPanel();
  if (panel === 'addresses') renderAddressesPanel();
  if (panel === 'wishlist') renderAccountWishlistPanel();
}

function renderOrdersPanel() {
  const wrap = document.getElementById('orders-list');
  if (!state.orders.length) {
    wrap.innerHTML = `<div class="drawer-empty" style="padding:40px 0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>
      <h3>No orders yet</h3><p>Your order history will appear here after checkout.</p>
    </div>`;
    return;
  }
  wrap.innerHTML = state.orders.slice().reverse().map(o => `
    <div class="order-card">
      <div class="order-card-top">
        <div>
          <span class="order-id">${o.id}</span>
          <div class="order-date">${formatOrderDate(o.date)} at ${formatOrderTime(o.date)}</div>
        </div>
        <span class="order-status ${o.status}">${o.status === 'delivered' ? 'Delivered' : 'In transit'}</span>
      </div>
      <div class="order-items-preview">
        ${o.items.slice(0, 5).map(i => `<img src="${i.img}" alt="${escapeHtml(i.name)}">`).join('')}
      </div>
      <div class="order-card-bottom">
        <span style="color:var(--ink-soft)">${o.items.reduce((s, i) => s + i.qty, 0)} item${o.items.length === 1 ? '' : 's'}</span>
        <span class="order-total">${money(o.total)}</span>
      </div>
    </div>
  `).join('');
}

/* -----------------------------------------------
   ADDRESS PANEL — full CRUD with real form fields
   and browser Geolocation API auto-populate
   ----------------------------------------------- */

let addressFormMode = null; // null | 'add' | 'edit'
let addressFormEditId = null;

function renderAddressesPanel() {
  const wrap = document.getElementById('addresses-list');
  if (addressFormMode) {
    renderAddressForm(wrap);
    return;
  }
  const cards = state.addresses.map(a => `
    <div class="address-card ${a.isDefault ? 'default' : ''}">
      <b>${escapeHtml(a.label)}</b>
      <p>
        ${escapeHtml(a.name)}<br>
        ${escapeHtml(a.line)}${a.line2 ? '<br>' + escapeHtml(a.line2) : ''}<br>
        ${escapeHtml(a.city)}, ${escapeHtml(a.state || a.region)}, ${escapeHtml(a.zip || '')}<br>
        ${escapeHtml(a.country)}
      </p>
      <div class="address-actions">
        <button data-action="edit-address" data-id="${a.id}">Edit</button>
        ${!a.isDefault ? `<button data-action="set-default-address" data-id="${a.id}">Set as default</button>` : ''}
        <button data-action="remove-address" data-id="${a.id}" style="color:#c0392b">Remove</button>
      </div>
    </div>`).join('');

  wrap.innerHTML = cards + `
    <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">
      <button class="btn btn-ghost" data-action="show-address-form" data-mode="add">
        + Add new address
      </button>
      <button class="btn btn-ghost" id="use-location-btn" data-action="autofill-location" style="gap:8px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="10" stroke-dasharray="2 2"/></svg>
        Use my current location
      </button>
    </div>`;
  wireAllImages(wrap);
}

function renderAddressForm(wrap) {
  const isEdit = addressFormMode === 'edit';
  const existing = isEdit ? state.addresses.find(a => a.id === addressFormEditId) : null;
  const v = (f) => existing ? escapeHtml(existing[f] || '') : '';

  wrap.innerHTML = `
    <div class="address-form-card">
      <h3 style="margin:0 0 18px;font-size:1.1rem">${isEdit ? 'Edit address' : 'New address'}</h3>

      <div id="geo-status" style="display:none;margin-bottom:14px"></div>

      <div class="form-row-split">
        <div class="form-field" data-field="af-label">
          <label for="af-label">Label</label>
          <input id="af-label" value="${v('label') || 'Home'}" placeholder="e.g. Home, Work, Other">
          <div class="error-msg">Give this address a label.</div>
        </div>
        <div class="form-field" data-field="af-name">
          <label for="af-name">Full name</label>
          <input id="af-name" value="${v('name') || (state.account ? escapeHtml(state.account.name) : '')}" placeholder="Recipient name">
          <div class="error-msg">Enter the recipient's name.</div>
        </div>
      </div>

      <div class="form-field" data-field="af-line">
        <label for="af-line">Address line 1</label>
        <input id="af-line" value="${v('line')}" placeholder="Street number and name">
        <div class="error-msg">Enter the street address.</div>
      </div>
      <div class="form-field">
        <label for="af-line2">Address line 2 <span style="color:var(--ink-soft);font-weight:400">(optional)</span></label>
        <input id="af-line2" value="${v('line2')}" placeholder="Apartment, suite, unit, etc.">
      </div>

      <div class="form-row-split">
        <div class="form-field" data-field="af-city">
          <label for="af-city">City</label>
          <input id="af-city" value="${v('city')}" placeholder="City">
          <div class="error-msg">Enter the city.</div>
        </div>
        <div class="form-field" data-field="af-state">
          <label for="af-state">State / Region</label>
          <input id="af-state" value="${v('state') || v('region')}" placeholder="State or region">
          <div class="error-msg">Enter the state or region.</div>
        </div>
      </div>

      <div class="form-row-split">
        <div class="form-field" data-field="af-zip">
          <label for="af-zip">Postcode / ZIP</label>
          <input id="af-zip" value="${v('zip')}" placeholder="Postal code">
          <div class="error-msg">Enter the postcode or ZIP.</div>
        </div>
        <div class="form-field" data-field="af-country">
          <label for="af-country">Country</label>
          <input id="af-country" value="${v('country') || 'Nigeria'}" placeholder="Country">
          <div class="error-msg">Enter the country.</div>
        </div>
      </div>

      <div class="form-field">
        <label for="af-phone">Phone <span style="color:var(--ink-soft);font-weight:400">(optional)</span></label>
        <input id="af-phone" type="tel" value="${v('phone')}" placeholder="+234 800 000 0000">
      </div>

      <label class="form-check" style="margin-bottom:20px">
        <input type="checkbox" id="af-default" ${(!existing || existing.isDefault) ? 'checked' : ''}> Make this my default shipping address
      </label>

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" data-action="save-address-form">Save address</button>
        <button class="btn btn-ghost" data-action="cancel-address-form">Cancel</button>
        ${!isEdit ? `<button class="btn btn-ghost" data-action="autofill-location-form" style="margin-left:auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
          Auto-fill my location
        </button>` : ''}
      </div>
    </div>`;
}

function showAddressForm(mode, editId = null) {
  addressFormMode = mode;
  addressFormEditId = editId;
  renderAddressesPanel();
  document.querySelector('.address-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelAddressForm() {
  addressFormMode = null;
  addressFormEditId = null;
  renderAddressesPanel();
}

function saveAddressForm() {
  let valid = true;
  const req = ['af-label', 'af-name', 'af-line', 'af-city', 'af-state', 'af-country'];
  let firstInvalid = null;
  req.forEach(id => {
    const input = document.getElementById(id);
    const field = input?.closest('.form-field');
    if (!input?.value.trim()) {
      field?.classList.add('invalid');
      if (!firstInvalid) firstInvalid = input;
      valid = false;
    } else {
      field?.classList.remove('invalid');
    }
  });
  if (!valid) {
    firstInvalid?.focus();
    showToast('Please fill in all required address fields', 'warn');
    return;
  }

  const isDefault = document.getElementById('af-default')?.checked;
  if (isDefault) state.addresses.forEach(a => a.isDefault = false);

  const data = {
    label: document.getElementById('af-label').value.trim(),
    name: document.getElementById('af-name').value.trim(),
    line: document.getElementById('af-line').value.trim(),
    line2: document.getElementById('af-line2')?.value.trim() || '',
    city: document.getElementById('af-city').value.trim(),
    state: document.getElementById('af-state').value.trim(),
    region: document.getElementById('af-state').value.trim(),
    zip: document.getElementById('af-zip')?.value.trim() || '',
    country: document.getElementById('af-country').value.trim(),
    phone: document.getElementById('af-phone')?.value.trim() || '',
    isDefault: isDefault
  };

  if (addressFormMode === 'edit' && addressFormEditId) {
    const idx = state.addresses.findIndex(a => a.id === addressFormEditId);
    if (idx >= 0) state.addresses[idx] = { ...state.addresses[idx], ...data };
  } else {
    data.id = 'a_' + Date.now();
    state.addresses.push(data);
  }

  persist();
  addressFormMode = null;
  addressFormEditId = null;
  renderAddressesPanel();
  showToast(addressFormMode === 'edit' ? 'Address updated' : 'Address saved');
}

/* --- Geolocation auto-fill ---
   Uses the browser's native Geolocation API + a free reverse-geocoding
   endpoint (no API key required) to populate city/region/country fields. */
async function autoFillLocation(targetFormId = null) {
  const statusEl = document.getElementById('geo-status') || document.getElementById('use-location-btn');
  const setStatus = (msg, isError = false) => {
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.style.display = 'block';
      statusEl.style.color = isError ? '#c0392b' : 'var(--sage)';
    }
  };

  if (!navigator.geolocation) {
    showToast('Geolocation not supported in this browser', 'warn');
    return;
  }

  setStatus('Locating you…');

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await resp.json();
        const addr = data.address || {};

        const fillField = (id, val) => {
          const el = document.getElementById(id);
          if (el && val) el.value = val;
        };

        fillField('af-city', addr.city || addr.town || addr.village || addr.county || '');
        fillField('af-state', addr.state || addr.region || '');
        fillField('af-zip', addr.postcode || '');
        fillField('af-country', addr.country || '');

        // If the panel is in list mode (not form mode), open an add form first
        if (!addressFormMode) {
          showAddressForm('add');
          setTimeout(() => {
            fillField('af-city', addr.city || addr.town || addr.village || addr.county || '');
            fillField('af-state', addr.state || addr.region || '');
            fillField('af-zip', addr.postcode || '');
            fillField('af-country', addr.country || '');
            setStatus('Location filled in! Complete the remaining fields.');
          }, 100);
        } else {
          setStatus('Location filled in! Complete the remaining fields.');
        }
      } catch (e) {
        showToast('Could not reverse-geocode your location. Fill in manually.', 'warn');
      }
    },
    (err) => {
      const msgs = {
        1: 'Location permission denied — please allow it in your browser settings.',
        2: 'Location unavailable — please fill in manually.',
        3: 'Location request timed out — please fill in manually.'
      };
      showToast(msgs[err.code] || 'Location error — please fill in manually.', 'warn');
    },
    { timeout: 10000, maximumAge: 60000 }
  );
}

function addDemoAddress() { showAddressForm('add'); }

function setDefaultAddress(id) {
  state.addresses.forEach(a => a.isDefault = (a.id === id));
  persist();
  renderAddressesPanel();
  showToast('Default address updated');
}
function removeAddress(id) {
  state.addresses = state.addresses.filter(a => a.id !== id);
  persist();
  renderAddressesPanel();
  showToast('Address removed');
}

function renderAccountWishlistPanel() {
  const wrap = document.getElementById('account-wishlist-grid');
  const items = state.wishlist.map(findProduct).filter(Boolean);
  if (!items.length) {
    wrap.innerHTML = `<div class="drawer-empty" style="padding:40px 0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      <h3>Nothing saved yet</h3><p>Save items you love and they'll show up here.</p>
    </div>`;
    return;
  }
  wrap.innerHTML = `<div class="product-grid">${items.map(productCardHtml).join('')}</div>`;
  refreshIcons(); wireAllImages();
}

function hideAllMainViews() {
  document.getElementById('home-view').hidden = true;
  document.getElementById('checkout-view').hidden = true;
  document.getElementById('account-view').hidden = true;
  document.getElementById('confirm-view').hidden = true;
}
