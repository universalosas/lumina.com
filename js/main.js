/* =========================================================
   LUMINA — Main Init & Event Delegation
   ========================================================= */

function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('drawer-scrim').classList.add('open');
  lockScroll();
}
function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  if (!document.getElementById('wishlist-drawer').classList.contains('open')) {
    document.getElementById('drawer-scrim').classList.remove('open');
  }
  unlockScroll();
}
function openWishlistDrawer() {
  renderWishlistDrawer();
  document.getElementById('wishlist-drawer').classList.add('open');
  document.getElementById('drawer-scrim').classList.add('open');
  lockScroll();
}
function closeWishlistDrawer() {
  document.getElementById('wishlist-drawer').classList.remove('open');
  if (!document.getElementById('cart-drawer').classList.contains('open')) {
    document.getElementById('drawer-scrim').classList.remove('open');
  }
  unlockScroll();
}
function closeAllDrawers() {
  closeCart();
  closeWishlistDrawer();
}

function openMobileNav() {
  document.getElementById('mobile-nav').classList.add('open');
  lockScroll();
}
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
  unlockScroll();
}

function openFiltersMobile() {
  document.getElementById('filters-panel').classList.add('open');
  lockScroll();
}
function closeFiltersMobile() {
  document.getElementById('filters-panel').classList.remove('open');
  unlockScroll();
}

/* --- Single delegated click handler for the whole document --- */
function handleDelegatedClick(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href').startsWith('#')) {
    e.preventDefault();
  }
  const action = el.dataset.action;

  switch (action) {
    case 'show-home': showHomeView(); break;
    case 'dismiss-toast': dismissToast(); break;
    case 'toggle-cart': document.getElementById('cart-drawer').classList.contains('open') ? closeCart() : (closeWishlistDrawer(), openCart()); break;
    case 'close-cart': closeCart(); break;
    case 'toggle-wishlist-drawer': document.getElementById('wishlist-drawer').classList.contains('open') ? closeWishlistDrawer() : (closeCart(), openWishlistDrawer()); break;
    case 'close-wishlist-drawer': closeWishlistDrawer(); break;
    case 'close-scrim': closeAllDrawers(); break;
    case 'go-to-checkout': goToCheckout(); break;
    case 'open-mobile-nav': openMobileNav(); break;
    case 'close-mobile-nav': closeMobileNav(); break;
    case 'account-click': closeMobileNav(); handleAccountClick(); break;
    case 'close-auth': closeAuthModal(); break;
    case 'auth-switch': switchAuthMode(el.dataset.mode); break;
    case 'logout': logout(); break;
    case 'account-nav': showAccountView(el.dataset.panel); break;

    case 'open-quickview': openQuickView(el.dataset.id); break;
    case 'close-quickview': closeQuickView(); break;
    case 'pm-thumb': pmChangeImg(Number(el.dataset.idx)); break;
    case 'pm-color': pmChangeColor(Number(el.dataset.idx)); break;
    case 'pm-size': pmChangeSize(el.dataset.size); break;
    case 'pm-qty': pmChangeQty(Number(el.dataset.delta)); break;
    case 'pm-add-to-cart': pmAddToCart(); break;
    case 'pm-tab': pmSwitchTab(el.dataset.tab); break;
    case 'pm-tab-reviews': pmSwitchTab('reviews'); break;

    case 'quick-add': addToCart(Number(el.dataset.id)); break;
    case 'toggle-wishlist': toggleWishlist(Number(el.dataset.id)); break;
    case 'wishlist-add-to-cart': addToCart(Number(el.dataset.id)); break;

    case 'cart-qty': changeCartQty(el.dataset.key, Number(el.dataset.delta)); break;
    case 'cart-remove': removeFromCart(el.dataset.key); break;

    case 'goto-product': openQuickView(el.dataset.id); document.getElementById('search-suggest').classList.remove('open'); break;
    case 'search-all': runSearch(el.dataset.query); break;

    case 'jump-category': closeMobileNav(); jumpToCategory(el.dataset.cat); break;
    case 'reset-filters': resetAllFilters(); break;
    case 'clear-chip': {
      const wrap = document.getElementById('active-chips');
      const idx = Number(el.dataset.chipIdx);
      if (wrap._chips && wrap._chips[idx]) {
        wrap._chips[idx].clear();
        state.page = 1;
        initFilterPanel();
        renderProductGrid();
      }
      break;
    }
    case 'open-filters-mobile': openFiltersMobile(); break;
    case 'close-filters-mobile': closeFiltersMobile(); break;
    case 'filter-group-toggle': toggleFilterGroup(el); break;
    case 'filter-color':
      el.classList.toggle('active');
      el.setAttribute('aria-pressed', el.classList.contains('active'));
      if (state.filters.colors.has(el.dataset.color)) state.filters.colors.delete(el.dataset.color);
      else state.filters.colors.add(el.dataset.color);
      state.page = 1; renderProductGrid();
      break;
    case 'apply-price': applyPriceFilter(); break;
    case 'page': {
      const p = Number(el.dataset.page);
      if (p >= 1) { state.page = p; renderProductGrid(); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); }
      break;
    }
    case 'tab-collection':
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.collection === el.dataset.collection));
      state.filters.collection = el.dataset.collection;
      state.page = 1;
      renderProductGrid();
      if (el.hasAttribute('data-scroll-shop') || el.closest('#site-header') || el.closest('#mobile-nav')) {
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
      }
      break;

    case 'select-address': selectAddress(el.value || el.closest('[data-action]').value); break;
    case 'select-shipping': selectShipping(el.value); break;
    case 'select-pay-method': selectPayMethod(el.dataset.method); break;
    case 'select-bnpl-plan': selectBnplPlan(el.value); break;
    case 'apply-promo': applyPromoCode(); break;
    case 'add-address': addDemoAddress(); break;
    case 'show-address-form': showAddressForm(el.dataset.mode, el.dataset.id || null); break;
    case 'edit-address': showAddressForm('edit', el.dataset.id); break;
    case 'cancel-address-form': cancelAddressForm(); break;
    case 'save-address-form': saveAddressForm(); break;
    case 'autofill-location': autoFillLocation(); break;
    case 'autofill-location-form': autoFillLocation('form'); break;
    case 'set-default-address': setDefaultAddress(el.dataset.id); break;
    case 'remove-address': removeAddress(el.dataset.id); break;
    case 'share-wishlist': shareWishlist(el.dataset.channel); break;
    case 'shop-now': document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); break;
    default: break;
  }
}

function handleDelegatedChange(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  switch (action) {
    case 'filter-category':
      if (el.checked) state.filters.categories.add(el.value);
      else state.filters.categories.delete(el.value);
      state.page = 1; renderProductGrid();
      break;
    case 'filter-rating':
      state.filters.minRating = Number(el.value);
      state.page = 1; renderProductGrid();
      break;
    case 'select-address': selectAddress(el.value); break;
    case 'select-shipping': selectShipping(el.value); break;
    case 'select-bnpl-plan': selectBnplPlan(el.value); break;
    case 'sort-select':
      state.sort = el.value;
      renderProductGrid();
      break;
    default: break;
  }
}

function wireStaticListeners() {
  document.addEventListener('click', handleDelegatedClick);
  document.addEventListener('change', handleDelegatedChange);

  document.getElementById('drawer-scrim').addEventListener('click', closeAllDrawers);

  document.getElementById('price-min').addEventListener('change', applyPriceFilter);
  document.getElementById('price-max').addEventListener('change', applyPriceFilter);

  document.getElementById('sort-select').addEventListener('change', (e) => { state.sort = e.target.value; renderProductGrid(); });

  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    if (input.value.trim()) {
      showToast('You\u2019re subscribed! Check your inbox for 10% off.');
      input.value = '';
    }
  });

  document.querySelectorAll('.overlay').forEach(ov => {
    ov.addEventListener('click', (e) => {
      if (e.target === ov) {
        if (ov.id === 'product-modal-overlay') closeQuickView();
        if (ov.id === 'auth-modal-overlay') closeAuthModal();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('product-modal-overlay').classList.contains('open')) closeQuickView();
    else if (document.getElementById('auth-modal-overlay').classList.contains('open')) closeAuthModal();
    else if (document.getElementById('cart-drawer').classList.contains('open') || document.getElementById('wishlist-drawer').classList.contains('open')) closeAllDrawers();
    else if (document.getElementById('mobile-nav').classList.contains('open')) closeMobileNav();
    else if (document.getElementById('filters-panel').classList.contains('open')) closeFiltersMobile();
  });

  window.addEventListener('scroll', () => {
    updateReveal();
    document.getElementById('site-header').classList.toggle('scrolled', window.scrollY > 10);
  });
}

function init() {
  renderCategoryStrip();
  initFilterPanel();
  renderProductGrid();
  updateCartBadge();
  updateWishlistBadge();
  updateAccountUI();
  renderCartDrawer();
  wireSearchInput('search-input', 'search-suggest');
  wireSearchInput('mobile-search-input', 'mobile-search-suggest');
  wireStaticListeners();
  refreshIcons(); wireAllImages();
  updateReveal();
}

window.addEventListener('DOMContentLoaded', init);
