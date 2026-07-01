/* =========================================================
   LUMINA — Rendering: Cards & Grid
   ========================================================= */

function productCardHtml(p) {
  const isWishlisted = state.wishlist.includes(p.id);
  const lowStock = p.stock > 0 && p.stock <= 6;
  const outOfStock = p.stock === 0;
  return `
    <article class="product-card reveal active" data-id="${p.id}">
      <div class="card-media" data-action="open-quickview" data-id="${p.id}">
        <img src="${p.img}" alt="${escapeHtml(p.name)}" loading="lazy">
        <div class="card-badges">
          ${p.badge ? `<span class="pill ${p.badge === 'Sale' ? 'pill-sale' : 'pill-new'}">${p.badge}</span>` : ''}
        </div>
        <button class="card-wishlist ${isWishlisted ? 'active' : ''}" data-action="toggle-wishlist" data-id="${p.id}" aria-pressed="${isWishlisted}" aria-label="${isWishlisted ? 'Remove from' : 'Save to'} wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        ${outOfStock
          ? `<div class="card-stock-low">Out of stock</div>`
          : lowStock
            ? `<div class="card-stock-low">Only ${p.stock} left</div>`
            : `<button class="card-quickadd" data-action="quick-add" data-id="${p.id}" aria-label="Add ${escapeHtml(p.name)} to cart">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
               </button>`
        }
      </div>
      <div class="card-body">
        <div class="card-brand">${escapeHtml(p.brand)}</div>
        <h3 class="card-name" data-action="open-quickview" data-id="${p.id}">${escapeHtml(p.name)}</h3>
        <div class="card-rating">
          <span class="stars">${starsHtml(p.rating)}</span>
          <span class="count">${p.rating.toFixed(1)} (${p.reviewCount})</span>
        </div>
        <div class="card-price-row">
          <span class="card-price">${money(p.price)}</span>
          ${p.compareAt ? `<span class="card-compare">${money(p.compareAt)}</span>` : ''}
        </div>
        <div class="spec-strip">
          ${p.specs.slice(0, 2).map(([k, v]) => `<span class="spec-item">${k}: <b>${escapeHtml(v)}</b></span>`).join('')}
        </div>
        ${p.colors.length > 1 ? `<div class="card-colors">${p.colors.map(c => `<span style="background:${c.hex}" title="${escapeHtml(c.name)}"></span>`).join('')}</div>` : ''}
      </div>
    </article>
  `;
}

function skeletonCardHtml() {
  return `
    <div class="skeleton-card">
      <div class="skeleton-box media"></div>
      <div class="skeleton-box line" style="width:40%"></div>
      <div class="skeleton-box line" style="width:80%"></div>
      <div class="skeleton-box line" style="width:30%"></div>
    </div>
  `;
}

function getFilteredSortedProducts() {
  let list = PRODUCTS.slice();
  const f = state.filters;

  if (f.query.trim()) {
    const q = f.query.trim().toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  if (f.collection !== 'all') {
    list = list.filter(p => p.collections.includes(f.collection));
  }
  if (f.categories.size) {
    list = list.filter(p => f.categories.has(p.category));
  }
  if (f.colors.size) {
    list = list.filter(p => p.colors.some(c => f.colors.has(c.name)));
  }
  if (f.minPrice != null) list = list.filter(p => p.price >= f.minPrice);
  if (f.maxPrice != null) list = list.filter(p => p.price <= f.maxPrice);
  if (f.minRating > 0) list = list.filter(p => p.rating >= f.minRating);

  switch (state.sort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    case 'newest': list.sort((a, b) => b.id - a.id); break;
    default: /* featured: bestsellers first, then id */
      list.sort((a, b) => {
        const aB = a.collections.includes('bestseller') ? 1 : 0;
        const bB = b.collections.includes('bestseller') ? 1 : 0;
        return bB - aB || a.id - b.id;
      });
  }
  return list;
}

function renderActiveChips() {
  const wrap = document.getElementById('active-chips');
  const f = state.filters;
  const chips = [];

  f.categories.forEach(c => {
    const cat = CATEGORIES.find(x => x.id === c);
    chips.push({ label: cat ? cat.label : c, clear: () => f.categories.delete(c) });
  });
  f.colors.forEach(c => chips.push({ label: c, clear: () => f.colors.delete(c) }));
  if (f.minPrice != null || f.maxPrice != null) {
    chips.push({
      label: `$${f.minPrice ?? 0} – $${f.maxPrice ?? '∞'}`,
      clear: () => { f.minPrice = null; f.maxPrice = null; }
    });
  }
  if (f.minRating > 0) chips.push({ label: `${f.minRating}★ & up`, clear: () => f.minRating = 0 });
  if (f.query) chips.push({ label: `“${f.query}”`, clear: () => { f.query = ''; document.getElementById('search-input').value = ''; const m = document.getElementById('mobile-search-input'); if (m) m.value = ''; } });

  if (!chips.length) { wrap.innerHTML = ''; wrap.style.display = 'none'; return; }
  wrap.style.display = 'flex';
  wrap.innerHTML = chips.map((c, i) => `
    <span class="chip" data-chip-idx="${i}">
      ${escapeHtml(c.label)}
      <button data-action="clear-chip" data-chip-idx="${i}" aria-label="Remove filter">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </span>
  `).join('');
  wrap._chips = chips;
}

function renderProductGrid() {
  const grid = document.getElementById('product-grid');
  const all = getFilteredSortedProducts();
  const totalPages = Math.max(1, Math.ceil(all.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const start = (state.page - 1) * state.pageSize;
  const pageItems = all.slice(start, start + state.pageSize);

  document.getElementById('result-count').innerHTML = `<b>${all.length}</b> product${all.length === 1 ? '' : 's'}`;

  if (!pageItems.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <h3>No products match these filters</h3>
        <p>Try widening your price range or clearing a filter.</p>
        <button class="btn btn-ghost" style="margin-top:18px" data-action="reset-filters">Clear all filters</button>
      </div>`;
  } else {
    grid.innerHTML = pageItems.map(productCardHtml).join('');
  }

  renderActiveChips();
  renderPagination(totalPages);
  refreshIcons(); wireAllImages();
  updateReveal();
}

function renderPagination(totalPages) {
  const el = document.getElementById('pagination');
  if (totalPages <= 1) { el.innerHTML = ''; return; }
  let html = `<button class="page-btn" data-action="page" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === state.page ? 'active' : ''}" data-action="page" data-page="${i}">${i}</button>`;
  }
  html += `<button class="page-btn" data-action="page" data-page="${state.page + 1}" ${state.page === totalPages ? 'disabled' : ''} aria-label="Next page">›</button>`;
  el.innerHTML = html;
}
