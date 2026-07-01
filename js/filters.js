/* =========================================================
   LUMINA — Filters Sidebar
   ========================================================= */

function renderFilterCategoryOptions() {
  const wrap = document.getElementById('filter-categories');
  wrap.innerHTML = CATEGORIES.map(c => {
    const count = PRODUCTS.filter(p => p.category === c.id).length;
    const checked = state.filters.categories.has(c.id);
    return `
      <label class="filter-checkbox">
        <input type="checkbox" data-action="filter-category" value="${c.id}" ${checked ? 'checked' : ''}>
        ${c.label}
        <span class="count">${count}</span>
      </label>`;
  }).join('');
}

function renderFilterColorOptions() {
  const wrap = document.getElementById('filter-colors');
  const colorMap = new Map();
  PRODUCTS.forEach(p => p.colors.forEach(c => { if (!colorMap.has(c.name)) colorMap.set(c.name, c.hex); }));
  wrap.innerHTML = Array.from(colorMap.entries()).map(([name, hex]) => `
    <button class="color-swatch ${state.filters.colors.has(name) ? 'active' : ''}" style="background:${hex}" data-action="filter-color" data-color="${escapeHtml(name)}" title="${escapeHtml(name)}" aria-label="${escapeHtml(name)}" aria-pressed="${state.filters.colors.has(name)}"></button>
  `).join('');
}

function renderRatingFilter() {
  const wrap = document.getElementById('filter-ratings');
  wrap.innerHTML = [4, 3, 2].map(r => `
    <label class="rating-row">
      <input type="radio" name="rating-filter" data-action="filter-rating" value="${r}" ${state.filters.minRating === r ? 'checked' : ''}>
      <span class="stars">${starsHtml(r, 13)}</span>
      <span class="label">&amp; up</span>
    </label>
  `).join('') + `
    <label class="rating-row">
      <input type="radio" name="rating-filter" data-action="filter-rating" value="0" ${state.filters.minRating === 0 ? 'checked' : ''}>
      <span class="label">Any rating</span>
    </label>`;
}

function initFilterPanel() {
  renderFilterCategoryOptions();
  renderFilterColorOptions();
  renderRatingFilter();

  document.getElementById('price-min').value = state.filters.minPrice ?? '';
  document.getElementById('price-max').value = state.filters.maxPrice ?? '';
}

function applyPriceFilter() {
  const min = document.getElementById('price-min').value;
  const max = document.getElementById('price-max').value;
  state.filters.minPrice = min !== '' ? Number(min) : null;
  state.filters.maxPrice = max !== '' ? Number(max) : null;
  state.page = 1;
  renderProductGrid();
}

function resetAllFilters() {
  state.filters.categories.clear();
  state.filters.colors.clear();
  state.filters.minPrice = null;
  state.filters.maxPrice = null;
  state.filters.minRating = 0;
  state.filters.collection = 'all';
  state.filters.query = '';
  document.getElementById('search-input').value = '';
  const m = document.getElementById('mobile-search-input');
  if (m) m.value = '';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.collection === 'all'));
  state.page = 1;
  initFilterPanel();
  renderProductGrid();
}

function toggleFilterGroup(btn) {
  btn.closest('.filter-group').classList.toggle('collapsed');
}

/* --- Category quick-strip on homepage (separate from sidebar checkboxes) --- */
function renderCategoryStrip() {
  const wrap = document.getElementById('category-scroller');
  wrap.innerHTML = CATEGORIES.map(c => `
    <button class="category-card reveal active" data-action="jump-category" data-cat="${c.id}">
      <div class="category-icon"><i data-lucide="${c.icon}"></i></div>
      <span>${c.label}</span>
    </button>
  `).join('');
  refreshIcons(); wireAllImages();
}

function jumpToCategory(catId) {
  state.filters.categories = new Set([catId]);
  state.page = 1;
  initFilterPanel();
  renderProductGrid();
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}
