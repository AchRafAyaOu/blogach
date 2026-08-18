# Verification Report — JavaScript Refactoring

**Date:** 2026-08-05
**Files compared:**
- Original: `Blogarch_lite_audited-3.xml.backup` (273,676 bytes / 3,141 lines)
- Refactored: `Blogarch_lite_audited-3.xml` (274,231 bytes / 3,161 lines)

**Scope:** Verification and regression testing only. No files were modified during this review.

---

## 1. Executive Summary

The refactoring is **incomplete and not deployable**. A byte-level diff shows the only change between the original and the refactored XML is the **`ASSETS` array inside the `window.BlogArch` config** (config block, lines ~182–211). Every inline `<script>` block is **byte-for-byte identical** between the two files.

The refactored XML now lists **24 JS assets** (20 new extracted modules + the original 4 CDN files), but:

1. The **20 new module files return HTTP 404** on the jsDelivr CDN — they were never uploaded.
2. The **inline scripts were never removed** from the XML — the extraction produced `src/*.js` files but did **not** replace or delete the inline copies.
3. If the module files *were* uploaded, the page would execute **every feature twice** (inline copy + external module), because the new modules contain **no deduplication guards** (unlike the original `blogarch.js` which uses `_blogarchJsLoaded`).
4. The extracted modules contain **real cross-module scope bugs** and at least one **omitted handler**, so they are not safe to activate even after the inline removal is completed.

---

## 2. Methodology

- Byte-level diff of both XML files.
- Extraction + comparison of all 22 `<script>` blocks.
- Syntax check (`node --check`) of every module.
- Semantic (whitespace/comment-insensitive) diff of every module against its inline source.
- CDN availability probe (`curl`) for all referenced assets.
- Dependency / initialization-order analysis of the CDN loader.

---

## 3. What Actually Changed

```
--- backup ---                          +++ refactored +++
  ASSETS: {                             ASSETS: {
    css: [ 'blogarch.css', 'nav.css' ]  css: [ 'blogarch.css', 'nav.css' ]   (quote entity style only)
    js: [ 4 files ]                     js: [ 24 files ]   ← THE ONLY REAL CHANGE
```

The full diff is 40 lines; all of it is inside the `ASSETS` block. Everything else — HTML, CSS (`<b:skin>`), all 22 inline scripts, widgets, comments — is unchanged.

---

## 4. Feature-by-Feature Verification

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| 1 | Blogger XML validity | ✅ PASS | `xml.etree` parses both files as well-formed XML |
| 2 | Homepage rendering | ✅ PASS | HTML/Blogger markup unchanged; inline renderers intact |
| 3 | Mobile layout | ✅ PASS | All CSS in `<b:skin>` unchanged |
| 4 | Desktop layout | ✅ PASS | Same as above |
| 5 | Navbar | ✅ PASS | Inline HTML + inline `navbar-ux` intact |
| 6 | Mobile drawer | ✅ PASS | Inline core-v16 drawer intact |
| 7 | Search | ✅ PASS | Inline live-search (Feed API) intact |
| 8 | Theme switcher | ✅ PASS | Inline theme + anti-FOUC intact |
| 9 | Contact form | ✅ PASS | Inline form handler intact |
| 10 | Newsletter | ✅ PASS | Inline newsletter handler intact |
| 11 | Learn modal | ✅ PASS | Inline modal close + `finOpenLesson` intact |
| 12 | Mini cards | ✅ PASS | Inline mini-cards intact |
| 13 | Quotes | ✅ PASS | Inline quotes rotator intact |
| 14 | Web Share | ✅ PASS | Inline web-share intact |
| 15 | Lightbox | ✅ PASS | Inline lightbox intact |
| 16 | Table of contents | ✅ PASS | Inline post-toc intact |
| 17 | Reading progress | ✅ PASS | Inline navbar-ux reading-progress intact |
| 18 | Page progress | ✅ PASS | Inline page-progress intact |
| 19 | Lazy images | ✅ PASS | Inline lazy loader + auto-lazy intact |
| 20 | Skeleton loaders | ✅ PASS | Inline skeleton manager intact |
| 21 | Scroll-to-top | ✅ PASS | Inline `#scroll-top-btn` handler intact |
| 22 | JSON-LD | ✅ PASS | WebSite, Article, Breadcrumb inline scripts intact |
| 23 | External CDN JS loading | ⚠️ **REG RESSION (latent)** | `ASSETS.js` now references 20 files that **404**; `defer` on dynamically-inserted scripts does not guarantee order |
| 24 | Initialization order | ⚠️ **RISK** | Inline order preserved today; would break if modules are activated |
| 25 | Global `window.BlogArch` API | ⚠️ **CHANGED** | Modules add `applyTheme/setThemeMode/...` + `renderWorks/renderLearn/renderPodcast` to `window`; inline never exposed these |
| 26 | `finOpenLesson` | ✅ PASS | Present in both (2 occurrences each) |
| 27 | Blogger widgets & comments | ✅ PASS | `BLOG_CMT_createIframe`, `commentSrc`, threaded comments unchanged |

**Bottom line for #1–#22:** Because the inline scripts are byte-identical, **all behavior today is preserved**. The regressions are in the *new module files* and in the *deployment configuration*, not in the live inline code.

---

## 5. Findings (ordered by severity)

### CRITICAL-1 — Module files referenced but never uploaded (404)

**File:** `Blogarch_lite_audited-3.xml`, config block, `ASSETS.js` array (lines 188–211).
**Module:** CDN loader (`src/cdn-loader.js`, loader IIFE).

`ASSETS.js` now lists 20 files that **do not exist** on `https://cdn.jsdelivr.net/gh/AchRafAyaOu/blogs_arch@main`:

```
src/core/theme.js         → 404     src/core/drawer.js        → 404
src/core/search.js        → 404     src/core/forms.js         → 404
src/core/renderers.js     → 404     src/core/skeletons.js     → 404
src/core/lazy-images.js   → 404     src/core/clickable-cards.js → 404
src/core/homepage-data.js → 404     src/navbar-ux.js          → 404
src/mini-cards.js         → 404     src/quotes-fallback.js    → 404
src/web-share.js          → 404     src/page-progress.js      → 404
src/lightbox.js           → 404     src/breadcrumb-jsonld.js  → 404
src/newsletter.js         → 404     src/post-toc.js           → 404
src/image-dedup.js        → 404     src/homepage-ux.js        → 404
```

The original 4 files still return 200 (`blogarch.js`, `Blogarch.lessons.js`, `Blogarch.contact.js`, `Blogarch.data.js`).

**Impact:** Deploying the refactored XML today triggers 20 failed `<script>` loads (console noise + wasted requests). Features still work because the inline scripts remain. **If the files are later uploaded, the page breaks** (see CRITICAL-2).

---

### CRITICAL-2 — Double execution if modules are ever uploaded

**File:** `Blogarch_lite_audited-3.xml` — inline scripts were never removed.
**Module:** all 20 extracted modules (no init guards).

The refactoring's stated goal (REFACTOR_PLAN.md: *"keep critical inline scripts (config, anti-FOUC, Article JSON-LD, finOpenLesson)"*, extract the rest) was **not achieved**: the inline copies of every extracted feature are still in the XML (verified byte-identical). The new modules contain **no** `_blogarchJsLoaded`-style guard, unlike the original external `blogarch.js` (§01 init guard, line 21).

**Consequence:** if the 20 files are uploaded to the CDN, every feature initializes twice:
- theme toggle bound twice → single click = toggles twice = appears broken;
- renderers render grids twice → duplicated cards;
- breadcrumb JSON-LD injected twice;
- skeleton reveal / lightbox / quotes / etc. all run twice.

**Original implementation:** the original design deliberately used guard flags (`window._blogarchFeedSearchEnabled`, `window._quotesLoaded`, `window._blogarchJsLoaded`) so inline and CDN copies coordinate. The extracted modules do not replicate this coordination.

---

### HIGH-1 — Cross-module scope bug: `homepage-data.js` uses `_lastFocus` / `trapFocus` it cannot see

**File:** `src/core/homepage-data.js` lines 170 & 181.
**Function:** learn-modal close logic (inline lines 331–344).
**Regression:** In the inline core-v16 IIFE, `_lastFocus` and `trapFocus` were declared in the same scope (inline lines 168, 176) and were accessible. In the module split, they are **private** to `src/core/drawer.js` (lines 12–24) and **not exported** to `window`. If `homepage-data.js` runs as a standalone module, the learn modal's `MutationObserver` callback (`modalOpener = _lastFocus || ...`) and keydown handler (`trapFocus(modal, e)`) throw `ReferenceError: _lastFocus is not defined` / `trapFocus is not defined`.
**Severity:** High (would break learn-modal focus restore + focus trap the moment the modules are activated).

---

### MEDIUM-1 — Missing resize handler in `theme.js`

**File:** `src/core/theme.js` (142 lines).
**Function:** `buildStars` + resize listener.
**Regression:** The inline core-v16 registers `window.addEventListener('resize', … if(isDark) buildStars())` (inline lines 45–48) so the star field regenerates on resize in dark mode. `theme.js` contains `buildStars()` but **no resize listener** (`grep resize` → 0 matches). Stars freeze at initial count after a window resize.
**Original implementation:** inline lines 45–48.
**Severity:** Medium (minor visual regression in dark mode).

---

### MEDIUM-2 — `window` API surface changed by modules

**File:** `src/core/theme.js` (lines 106–111, 123), `src/core/drawer.js` (lines 50–51, 83–84), `src/core/renderers.js` (lines 21, 48, 101).
**Regression:** The modules expose `window.BlogArch.applyTheme/setThemeMode/resolveDark/getThemeMode/getSavedDark`, `window.buildStars`, `window.openDrawer/closeDrawer/openSidebar/closeSidebar`, `window.renderWorks/renderLearn/renderPodcast`. The inline core-v16 kept all of these **module-private** (function declarations inside the IIFE) and **never** attached them to `window`. Activating the modules would change the global namespace (pollution + potential collisions with `blogarch.js` / `Blogarch.lessons.js` which already define `window.BlogArch.openLesson`, etc.).
**Severity:** Medium.

---

### MEDIUM-3 — Load order not guaranteed for dynamic scripts

**File:** `src/cdn-loader.js` loader IIFE (line 35: `script.defer = true`).
**Regression:** `defer` is **ignored** for scripts created via `document.createElement` + `appendChild` — they execute asynchronously in load-completion order. The refactored `ASSETS.js` has intra-module dependencies (e.g., `renderers.js` must run before `homepage-data.js`, which calls `window.renderLearn`; `drawer.js` before `navbar-ux.js`). The original also used this loader, but its 4 files were independent/self-guarded; the new 20-file dependency graph makes order critical and non-deterministic.
**Severity:** Medium (latent — only matters once modules are live).

---

### LOW-1 — `_origAddOpen` dead code

**File:** `src/core/homepage-data.js` line 159 (`var _origAddOpen = …`).
**Note:** Unused leftover; no functional impact.

---

## 6. Module Fidelity Summary (vs inline sources)

Verified with whitespace/comment-insensitive diffs and `node --check`:

| Module | Inline source | Semantically faithful? |
|--------|---------------|------------------------|
| `cdn-loader.js` | script #2 | ✅ (identical logic) |
| `mini-cards.js` | script #6 | ✅ |
| `quotes-fallback.js` | script #7 | ✅ |
| `web-share.js` | script #8 | ✅ |
| `navbar-ux.js` | script #9 | ✅ (only a removed comment) |
| `post-toc.js` | script #10 | ✅ (rewritten but equivalent) |
| `homepage-ux.js` | script #11 | ✅ (exact match) |
| `image-dedup.js` | script #12 | ✅ |
| `page-progress.js` | script #13 | ✅ |
| `lightbox.js` | script #14 | ✅ |
| `breadcrumb-jsonld.js` | script #16 | ✅ |
| `newsletter.js` | script #17 | ✅ (emoji as `\uD83C\uDF89` = same) |
| `core/theme.js` | core-v16 | ⚠️ missing resize→stars handler |
| `core/drawer.js` | core-v16 | ⚠️ adds globals; `_lastFocus`/`trapFocus` not exported |
| `core/search.js` | core-v16 | ✅ |
| `core/forms.js` | core-v16 | ✅ |
| `core/renderers.js` | core-v16 | ⚠️ exposes `window.render*` (inline did not) |
| `core/skeletons.js` | core-v16 | ✅ |
| `core/lazy-images.js` | core-v16 | ✅ |
| `core/clickable-cards.js` | core-v16 | ✅ |
| `core/homepage-data.js` | core-v16 | ❌ **broken cross-module refs** (`_lastFocus`, `trapFocus`) |

---

## 7. Verdict

# ❌ FAIL

### Justification

The refactoring, as committed, does **not** deliver its stated goal and **must not be deployed**:

1. **Inline scripts were never removed** — the XML is functionally the original template with a bigger `ASSETS` list.
2. **20 of 24 referenced JS assets 404** on the CDN — deploying today produces 20 broken resource loads.
3. **If the modules are uploaded**, the site suffers **double initialization** of every feature (no guard flags in the modules), plus **crash-level bugs** in `homepage-data.js` (`_lastFocus`/`trapFocus` out of scope) and **missing** stars-resize behavior in `theme.js`.
4. **Global API surface changes** (`window.render*`, `window.openDrawer`, `window.BlogArch.applyTheme`, …) that the original never exposed — collision risk with the CDN `blogarch.js`/`Blogarch.lessons.js`.

The **current inline-only behavior is preserved** (features #1–#22 pass), but that is an artifact of the refactoring being incomplete, not a sign it works.

---

## 8. Deployment Recommendation

**Do NOT deploy `Blogarch_lite_audited-3.xml` to Blogger at this time.**

Before deployment, the following must be done (in order):
1. **Remove the inline scripts** that were extracted (keep only: config, anti-FOUC, Article JSON-LD, `finOpenLesson`, comment widgets — per the original plan), **or** revert `ASSETS.js` to the original 4 files.
2. **Upload all 20 module files** to the `AchRafAyaOu/blogs_arch` repo so the CDN returns 200.
3. **Fix `homepage-data.js`**: export `_lastFocus`/`trapFocus` from `drawer.js` (or expose them on `window`/`window.BlogArch`) so the learn-modal code resolves them.
4. **Add init guards** to each module (e.g., `if (window._baModuleTheme) return; window._baModuleTheme = true;`) to prevent double execution with any remaining inline code.
5. **Restore the resize→`buildStars` listener** in `theme.js`.
6. **Enforce deterministic load order** (load modules via sequential `async=false` injection, or concatenate/bundle in dependency order).
7. Decide on the `window.render*` / `window.openDrawer` / `window.BlogArch.*` global API — align it with what `blogarch.js` and `Blogarch.lessons.js` already expose.

Until steps 1–7 are complete, **keep the original template deployed** (`Blogarch_lite_audited-3.xml.backup`).
