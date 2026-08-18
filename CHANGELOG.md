# Changelog

## [Unreleased] - Refactoring in Progress

### Phase 1 - Safety
- Created backup: `Blogarch_lite_audited-3.xml.backup`
- Created BACKUP_INFO.md, REFACTOR_PLAN.md, CHANGELOG.md

### Phase 2 - JavaScript Refactoring (Planned)

#### Low Risk Extractions
- [ ] `src/cdn-loader.js` - CDN loader, error handler, lazy/LCP boost
- [ ] `src/mini-cards.js` - Mini cards (about/contact)
- [ ] `src/quotes-fallback.js` - Quotes rotator fallback
- [ ] `src/web-share.js` - Web Share API
- [ ] `src/page-progress.js` - Page progress bar
- [ ] `src/lightbox.js` - Image lightbox
- [ ] `src/breadcrumb-jsonld.js` - Breadcrumb JSON-LD
- [ ] `src/newsletter.js` - Newsletter form

#### Medium Risk Extractions
- [ ] `src/post-toc.js` - Read-time + TOC
- [ ] `src/image-dedup.js` - Image deduplication
- [ ] `src/homepage-ux.js` - Scroll-reveal + card-label colors

#### High Complexity - Core v16 Split
- [ ] `src/core/theme.js` - Theme/dark mode logic
- [ ] `src/core/drawer.js` - Mobile drawer
- [ ] `src/core/search.js` - Live search
- [ ] `src/core/forms.js` - Contact form
- [ ] `src/core/renderers.js` - Works/Learn/Podcast renderers
- [ ] `src/core/skeletons.js` - Skeleton loader manager
- [ ] `src/core/lazy-images.js` - Lazy image fallback
- [ ] `src/core/clickable-cards.js` - Clickable post cards
- [ ] `src/navbar-ux.js` - Navbar scroll, glider, search, shortcuts

### Phase 3 - Inline Style Cleanup (Planned)
- [ ] Convert drawer section titles to `.drawer-section-title`
- [ ] Convert drawer icon wraps to `.drawer-icon-wrap` + color classes
- [ ] Convert CTA buttons to `.btn-cta-learn`
- [ ] Convert no-results styles to CSS classes
- [ ] Convert section head center to `.section-head--center`

### Phase 4 - CSS Cleanup (Planned)
- [ ] Audit for duplicated rules
- [ ] Verify color variables usage
- [ ] Consolidate focus styles

### Phase 5 - Validation (Planned)
- [ ] Full functionality testing
- [ ] Accessibility audit
- [ ] Performance verification