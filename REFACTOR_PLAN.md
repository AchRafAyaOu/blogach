# Refactoring Plan

## Phase 1 — Safety (Complete)
- [x] Backup created: `Blogarch_lite_audited-3.xml.backup`
- [x] Inline JavaScript blocks identified (12 scripts)
- [x] Blogger-critical scripts identified
- [x] Dependencies mapped

## Phase 2 — JavaScript Refactoring

### Inline Scripts Inventory

| # | Lines | Description | Safe to Extract? | Target File |
|---|-------|-------------|------------------|-------------|
| 1 | 175-195 | `window.BlogArch` config | **NO** - Blogger variables, must stay inline | — |
| 2 | 197-263 | CDN loader, error handler, lazy/LP boost | **YES** - Reusable, no Blogger vars | `src/cdn-loader.js` |
| 3 | 291-310 | Anti-FOUC theme init | **NO** - Must run before paint | — |
| 4 | 1428-2185 | Core v16: sidebar, theme, navbar, search, forms, renderers | **PARTIAL** - Split into modules | `src/core/*.js` |
| 5 | 2297-326 | `finOpenLesson` global | **NO** - Called from HTML | — |
| 6 | 2355-2463 | Mini Cards | **YES** - Self-contained | `src/mini-cards.js` |
| 7 | 2467-2577 | Quotes Rotator (fallback) | **YES** - Superseded by CDN JS | `src/quotes-fallback.js` |
| 8 | 2583-2623 | Web Share API | **YES** - Self-contained | `src/web-share.js` |
| 9 | 2629-2749 | Navbar UX (scroll, glider, search, shortcuts) | **YES** - Self-contained | `src/navbar-ux.js` |
| 10 | 2751-2834 | Read-time + TOC | **YES** - Post-page only | `src/post-toc.js` |
| 11 | 2837-2897 | Scroll-reveal + card-label colors | **YES** - Homepage only | `src/homepage-ux.js` |
| 12 | 2901-2935 | Image deduplication | **YES** - Post-page only | `src/image-dedup.js` |
| 13 | 2938-2970 | Page progress bar | **YES** - Self-contained | `src/page-progress.js` |
| 14 | 2972-3013 | Lightbox | **YES** - Self-contained | `src/lightbox.js` |
| 15 | 3017-3050 | Article JSON-LD | **NO** - Uses Blogger meta tags | — |
| 16 | 3053-3079 | Breadcrumb JSON-LD | **YES** - Self-contained | `src/breadcrumb-jsonld.js` |
| 17 | 3081-3140 | Newsletter form | **YES** - Uses BlogArch.PROXY_URL | `src/newsletter.js` |

### Extraction Strategy
1. Create external JS files in a logical structure
2. Update `window.BlogArch.ASSETS.js` array to include new files
3. Load with `defer` (preserves order)
4. Keep critical inline scripts (config, anti-FOUC, Article JSON-LD, finOpenLesson)

### New File Structure
```
/src/
  cdn-loader.js          # From script #2
  navbar-ux.js           # From script #9
  mini-cards.js          # From script #6
  quotes-fallback.js     # From script #7
  web-share.js           # From script #8
  post-toc.js            # From script #10
  homepage-ux.js         # From script #11
  image-dedup.js         # From script #12
  page-progress.js       # From script #13
  lightbox.js            # From script #14
  breadcrumb-jsonld.js   # From script #16
  newsletter.js          # From script #17
  core/
    theme.js             # Theme/dark mode logic from #4
    drawer.js            # Mobile drawer from #4
    search.js            # Live search from #4
    forms.js             # Contact form from #4
    renderers.js         # Works/Learn/Podcast renderers from #4
    skeletons.js         # Skeleton loader from #4
    lazy-images.js       # Lazy image fallback from #4
    clickable-cards.js   # Clickable cards from #4
```

## Phase 3 — Inline Style Cleanup

### Repeated/Static Inline Styles to Convert

| Pattern | Locations | CSS Class |
|---------|-----------|-----------|
| `style='display:block;margin:0;padding:.9rem .8rem .35rem;font-size:.6rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;background:none;border:none;border-bottom:none'` | Lines 387, 399 | `.drawer-section-title` |
| `style='width:22px;height:22px;background:#...;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0'` | Lines 389, 392, 395, 401, 404 | `.drawer-icon-wrap` + color variants |
| `style='text-decoration:none'` | Line 377 | `.brand-link` (already has class) |
| `style='--sc:var(--social-twitter)'` etc. | Lines 826-828, 1398-1403 | `.social-link` + color vars |
| `style='font-size:.45rem;color:var(--accent);vertical-align:middle'` | Line 507 | `.hero-badge-dot` |
| Skeleton inline styles | Lines 593-683 | Already have classes |
| `style='text-align:center;padding:3rem 1rem;grid-column:1/-1'` | Line 724 | `.no-results-state` |
| `style='justify-content:center;text-align:center;flex-direction:column'` | Line 748 | `.section-head--center` |
| `style='display:flex;align-items:center;justify-content:center;gap:.5rem;width:100%;padding:.72rem 1rem;border-radius:10px;background:linear-gradient(135deg,#4361ee,#7c3aed);color:#fff;text-decoration:none;font-weight:700;font-size:.9rem'` | Line 408 | `.btn-cta-learn` |
| `style='display:flex;align-items:center;justify-content:center;gap:.5rem;width:100%;padding:.75rem 1rem;border-radius:10px;background:linear-gradient(135deg,#4361ee,#7c3aed);color:#fff;text-decoration:none;font-weight:700;font-size:.9rem'` | Line 775 | `.btn-cta-learn` |
| `style='font-size:2.2rem;color:var(--muted);margin-bottom:1rem;display:block'` | Line 725 | `.no-results-icon` |
| `style='font-size:1.05rem;font-weight:800;color:var(--text);margin-bottom:.4rem'` | Lines 727, 730 | `.no-results-title` |
| `style='color:var(--muted);font-size:.9rem'` | Line 728 | `.no-results-desc` |

### Dynamic Inline Styles to KEEP
- `style='--sc:var(--social-...)'` — CSS variable per social link (dynamic)
- `style='left:...;top:...;width:...;height:...;opacity:...;animation:...'` — Stars (JS-generated)
- `style='width:...%'` — Reading/page progress bars (JS-updated)
- `style='display:none'` / `style='display:grid'` — Conditional rendering (Blogger logic)
- `style='opacity:0'` / `style='opacity:1'` — TOC scroll transitions
- `onmouseenter/onmouseleave` opacity — Comment delete icons (Blogger widget)

## Phase 4 — CSS Cleanup

### Duplicated Rules to Consolidate
- `.skeleton-*` classes — Already in external CSS, verify no duplication
- `.card-label[data-color="..."]` — Generated by JS, ensure CSS covers all 5 colors
- `.fin-quote-dot.active` — Duplicate with `.fin-quote-dot[aria-selected="true"]`
- Focus styles — Multiple `:focus-visible` declarations
- Color variables — Check for unused variables in `:root`

### External CSS Files (Keep as-is, loaded via CDN)
- `blogarch.css` — Main stylesheet
- `nav.css` — Navbar styles
- Font Awesome split CSS
- Google Fonts

## Phase 5 — Validation Checklist

After each extraction:
- [ ] Blogger XML syntax valid
- [ ] No broken Blogger tags (`b:if`, `b:loop`, `data:`, `expr:`)
- [ ] JavaScript initialization order preserved
- [ ] Mobile layout works
- [ ] Desktop layout works
- [ ] Navigation (drawer, navbar, glider)
- [ ] Search panel (open/close, live search, hints)
- [ ] Contact form (main + mini-card)
- [ ] Newsletter form
- [ ] Learn modal
- [ ] Lightbox
- [ ] TOC (build, highlight, toggle)
- [ ] Theme toggle (light/dark/system)
- [ ] Lazy loading images
- [ ] Skeleton loaders
- [ ] Page progress bar
- [ ] Reading progress bar
- [ ] Scroll to top
- [ ] JSON-LD (Article, Breadcrumb, WebSite)
- [ ] External JS/CSS loading (CDN)
- [ ] Accessibility (ARIA, focus trap, keyboard nav)
- [ ] No feature regression

## Risk Assessment

### High Risk (Do Not Touch)
- `window.BlogArch` config (lines 175-195) — Blogger template variables
- Anti-FOUC script (lines 291-310) — Must run before first paint
- Article JSON-LD (lines 3017-3050) — Uses Blogger meta tags with `data:` attributes
- `finOpenLesson` global (lines 2297-2326) — Called from HTML onclick
- Blogger widget scripts (comment system, threaded comments) — Lines 1008, 1055, 1158, 1164, 1347

### Medium Risk (Extract Carefully)
- Core v16 script (lines 1428-2185) — Large, many dependencies, split into modules
- Navbar UX (lines 2629-2749) — Event listeners on navbar elements

### Low Risk (Safe to Extract)
- Mini Cards, Quotes Fallback, Web Share, Post TOC, Homepage UX, Image Dedup, Page Progress, Lightbox, Breadcrumb JSON-LD, Newsletter

## Recommended Order of Work

1. **Low risk first**: Extract mini-cards, web-share, quotes-fallback, page-progress, lightbox, breadcrumb-jsonld, newsletter
2. **Medium risk**: Extract post-toc, image-dedup, homepage-ux
3. **High complexity**: Split core v16 into modules (theme, drawer, search, forms, renderers, skeletons, lazy-images, clickable-cards)
4. **Integration**: Update CDN loader to load new files in correct order
5. **Inline styles**: Convert repeated static styles to CSS classes
6. **Full validation**: Test all functionality