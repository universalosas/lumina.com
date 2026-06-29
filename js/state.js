/* =========================================================
   LUMINA — App State & Utilities
   ========================================================= */

/* Neutral inline SVG placeholder used if a hotlinked product photo fails to
   load — keeps the layout intact instead of showing a broken-image icon. */
const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
     <rect width="600" height="600" fill="#f1efe9"/>
     <g fill="none" stroke="#c9c4b8" stroke-width="6">
       <rect x="160" y="180" width="280" height="240" rx="18"/>
       <circle cx="240" cy="250" r="22"/>
       <path d="M160 380l80-80 60 60 60-50 80 70" />
     </g>
   </svg>`
);


const STORAGE_KEYS = {
  cart: 'lumina_cart',
  wishlist: 'lumina_wishlist',
  account: 'lumina_account',
  orders: 'lumina_orders',
  addresses: 'lumina_addresses'
};

/* In-memory app state. We deliberately avoid localStorage per environment
   constraints in some sandboxes, but this build runs as static files served
   normally, so we layer a safe wrapper that falls back to memory only. */
const MemoryStore = (() => {
  const mem = {};
  let hasLocalStorage = false;
  try {
    const t = '__lumina_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    hasLocalStorage = true;
  } catch (e) { hasLocalStorage = false; }

  return {
    get(key, fallback) {
      if (hasLocalStorage) {
        try {
          const raw = window.localStorage.getItem(key);
          return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
      }
      return mem[key] !== undefined ? mem[key] : fallback;
    },
    set(key, value) {
      if (hasLocalStorage) {
        try { window.localStorage.setItem(key, JSON.stringify(value)); return; }
        catch (e) { /* fall through to memory */ }
      }
      mem[key] = value;
    }
  };
})();

const state = {
  cart: MemoryStore.get(STORAGE_KEYS.cart, []),
  wishlist: MemoryStore.get(STORAGE_KEYS.wishlist, []),
  account: MemoryStore.get(STORAGE_KEYS.account, null),
  orders: MemoryStore.get(STORAGE_KEYS.orders, []),
  addresses: MemoryStore.get(STORAGE_KEYS.addresses, [
    { id: 'a1', label: 'Home', name: 'Alex Morgan', line: '14 Sapele Road', city: 'Benin City', region: 'Edo State', country: 'Nigeria', isDefault: true }
  ]),
  filters: {
    categories: new Set(),
    colors: new Set(),
    minPrice: null,
    maxPrice: null,
    minRating: 0,
    collection: 'all',
    query: ''
  },
  sort: 'featured',
  page: 1,
  pageSize: 9,
  activeProductId: null,
  activeModalColorIdx: 0,
  activeModalImgIdx: 0,
  activeModalQty: 1,
  selectedSize: null,
  authMode: 'login'
};

function persist() {
  MemoryStore.set(STORAGE_KEYS.cart, state.cart);
  MemoryStore.set(STORAGE_KEYS.wishlist, state.wishlist);
  MemoryStore.set(STORAGE_KEYS.account, state.account);
  MemoryStore.set(STORAGE_KEYS.orders, state.orders);
  MemoryStore.set(STORAGE_KEYS.addresses, state.addresses);
}

/* --- Formatting helpers --- */
function money(n) {
  return `$${n.toFixed(2)}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function findProduct(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function formatOrderDate(d) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function formatOrderTime(d) {
  return new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/* --- Star rating renderer (signature mono+gold rating, not generic) --- */
function starsHtml(rating, size = 14) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let out = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      out += `<svg viewBox="0 0 24 24" fill="currentColor" width="${size}" height="${size}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>`;
    } else if (i === full && half) {
      out += `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><defs><linearGradient id="half${i}-${rating}"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half${i}-${rating})" stroke="currentColor" stroke-width="1" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>`;
    } else {
      out += `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="muted" width="${size}" height="${size}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>`;
    }
  }
  return out;
}

/* --- Toast --- */
let toastTimer = null;
function showToast(msg, icon = 'check') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  const iconWrap = document.getElementById('toast-icon');
  msgEl.textContent = msg;
  iconWrap.innerHTML = icon === 'check'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* --- Body scroll lock helper (for drawers/modals) --- */
let lockCount = 0;
function lockScroll() {
  lockCount++;
  document.body.classList.add('body-lock');
}
function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.body.classList.remove('body-lock');
}

/* --- Safe icon refresh: never let a missing/blocked icon CDN break the app --- */
function refreshIcons() {
  try {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  } catch (e) { /* icon library unavailable — fail silently, app still works */ }
}

function updateReveal() {
  document.querySelectorAll('.reveal:not(.active)').forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) el.classList.add('active');
  });
}
