/* =========================================================
   LUMINA — Image Reliability Layer
   Wraps every product/hero <img> with a branded, on-brand placeholder that
   appears instantly if the source fails to load, a load timeout is hit, or
   the image returns a 0x0/broken response. This makes "broken images" a
   non-issue regardless of whether a given hotlinked CDN URL is still alive.
   ========================================================= */

/* A clean, on-brand placeholder (not a generic broken-image glyph) drawn as
   inline SVG so it never depends on network access itself. */
function placeholderSvg(label = '') {
  const safeLabel = (label || '').slice(0, 28).replace(/[<>&]/g, '');
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f1efe9"/>
          <stop offset="100%" stop-color="#e6e2d8"/>
        </linearGradient>
      </defs>
      <rect width="700" height="700" fill="url(#g)"/>
      <g transform="translate(350,308)" fill="none" stroke="#b8b2a0" stroke-width="5">
        <rect x="-90" y="-65" width="180" height="130" rx="14"/>
        <circle cx="-40" cy="-25" r="14"/>
        <path d="M-90 35l55-50 40 35 45-30 50 45"/>
      </g>
      ${safeLabel ? `<text x="350" y="430" font-family="monospace" font-size="20" fill="#9b9484" text-anchor="middle">${safeLabel}</text>` : ''}
    </svg>
  `);
}

/* Swap a broken <img> to the placeholder, once, without re-triggering onerror. */
function useFallbackImage(imgEl, label) {
  if (imgEl.dataset.fallbackApplied) return;
  imgEl.dataset.fallbackApplied = '1';
  imgEl.src = placeholderSvg(label);
  imgEl.classList.add('img-fallback');
}

/* Attach robust error + timeout handling to a single image element.
   - onerror: standard broken-image detection (404, CORS block, etc.)
   - load timeout: some dead CDN links hang rather than erroring outright,
     so if nothing has loaded within 6s, treat it as failed too. */
function wireImageReliability(imgEl, label) {
  if (!imgEl || imgEl.dataset.reliabilityWired) return;
  imgEl.dataset.reliabilityWired = '1';

  let settled = false;
  const fail = () => { if (!settled) { settled = true; useFallbackImage(imgEl, label); } };
  const succeed = () => { settled = true; };

  imgEl.addEventListener('error', fail, { once: true });
  imgEl.addEventListener('load', () => {
    // A "successful" load with zero natural dimensions is effectively broken
    // (some CDNs return a 200 with an empty/invalid body on dead links).
    if (imgEl.naturalWidth === 0 || imgEl.naturalHeight === 0) fail();
    else succeed();
  }, { once: true });

  setTimeout(() => { if (!settled && !imgEl.complete) fail(); }, 6000);
}

/* Scan a container (or the whole document) and wire every product-relevant
   <img> that hasn't been wired yet. Call after any innerHTML render. */
function wireAllImages(root = document) {
  root.querySelectorAll('img:not([data-reliability-wired])').forEach(imgEl => {
    const label = imgEl.alt || imgEl.closest('[data-id]')?.dataset?.id || '';
    wireImageReliability(imgEl, label);
    // If the image already failed before listeners attached (e.g. cached
    // 404), catch that synchronously too.
    if (imgEl.complete && imgEl.naturalWidth === 0 && imgEl.src && !imgEl.src.startsWith('data:')) {
      useFallbackImage(imgEl, label);
    }
  });
}
