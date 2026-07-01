/* =========================================================
   LUMINA — Search Autocomplete
   ========================================================= */

let searchActiveIdx = -1;

function getSearchMatches(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ).slice(0, 6);
}

function renderSearchSuggestions(inputEl, suggestEl, query) {
  searchActiveIdx = -1;
  const matches = getSearchMatches(query);
  if (!query.trim()) { suggestEl.classList.remove('open'); suggestEl.innerHTML = ''; return; }

  if (!matches.length) {
    suggestEl.innerHTML = `<div class="suggest-empty">No products found for “${escapeHtml(query)}”</div>`;
  } else {
    suggestEl.innerHTML = matches.map(p => `
      <div class="suggest-item" data-action="goto-product" data-id="${p.id}" role="option">
        <img src="${p.img}" alt="">
        <div class="meta">
          <div class="name">${escapeHtml(p.name)}</div>
          <div class="cat">${escapeHtml(p.brand)}</div>
        </div>
        <div class="price">${money(p.price)}</div>
      </div>
    `).join('') + `<div class="suggest-footer" data-action="search-all" data-query="${escapeHtml(query)}">See all results for “${escapeHtml(query)}”</div>`;
  }
  suggestEl.classList.add('open');
}

function runSearch(query, fromInputId) {
  state.filters.query = query;
  state.page = 1;
  document.getElementById('search-input').value = query;
  const mobileInput = document.getElementById('mobile-search-input');
  if (mobileInput) mobileInput.value = query;
  renderProductGrid();
  closeMobileNav();
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('search-suggest').classList.remove('open');
}

function wireSearchInput(inputId, suggestId) {
  const input = document.getElementById(inputId);
  const suggest = document.getElementById(suggestId);
  if (!input) return;

  const onType = debounce(() => renderSearchSuggestions(input, suggest, input.value), 150);
  input.addEventListener('input', onType);
  input.addEventListener('focus', () => { if (input.value.trim()) renderSearchSuggestions(input, suggest, input.value); });
  input.addEventListener('keydown', (e) => {
    const items = suggest.querySelectorAll('.suggest-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      searchActiveIdx = Math.min(searchActiveIdx + 1, items.length - 1);
      items.forEach((it, i) => it.classList.toggle('is-active', i === searchActiveIdx));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      searchActiveIdx = Math.max(searchActiveIdx - 1, 0);
      items.forEach((it, i) => it.classList.toggle('is-active', i === searchActiveIdx));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchActiveIdx >= 0 && items[searchActiveIdx]) {
        openQuickView(items[searchActiveIdx].dataset.id);
        suggest.classList.remove('open');
      } else {
        runSearch(input.value, inputId);
      }
    } else if (e.key === 'Escape') {
      suggest.classList.remove('open');
      input.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggest.contains(e.target)) {
      suggest.classList.remove('open');
    }
  });
}
