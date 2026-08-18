# 🚀 خطة تحسين أداء الصفحة الرئيسية (Performance Fix Plan)

> **التاريخ:** 2026-08-18
> **الملف:** `Blogarch_lite_audited-3.xml.work` · **المجلد:** `src/`
> **الهدف:** تحسين FCP / LCP · تقليل Unused JS (~189 KiB) · تصغير CSS

---

## 1. تشخيص المشاكل

### 1.1 البنية الحالية
- القالب `~280KB` ويحمّل **كل وحدات JS (24)** على **كل صفحة** عبر أداة تحميل CDN
  (`window.BlogArch.ASSETS.js`) — يسبّب **Unused JavaScript** كبيرة على الصفحة الحالية.
- الوحدات محصّنة بـ `init guards` وفحص وجود العناصر، لذا **تأجيل/استبعاد تحميلها آمن** (no-op عند غياب عنصرها).
- `<head>` **مُحسَّن مسبقاً**: preconnect للخطوط وjsDelivr، خطوط بـ `display=swap` + `preload` + noscript،
  وFont Awesome محمّل بـ `preload`+`onload` (غير حاجب للرسم).

### 1.2 التصنيف (Critical / Lazy / Page-specific)

| الفئة | الملفات |
|-------|---------|
| **Critical (كل الصفحات)** | `theme.js`, `drawer.js`, `search.js`, `lazy-images.js`, `navbar-ux.js`, `mini-cards.js`, `quotes-fallback.js`, `blogarch.js`, `data/Blogarch.data.js` |
| **Homepage فقط** | `renderers.js`, `skeletons.js`, `clickable-cards.js`, `homepage-data.js`, `newsletter.js`, `homepage-ux.js` |
| **Post فقط** | `post-toc.js`, `web-share.js`, `page-progress.js`, `lightbox.js`, `breadcrumb-jsonld.js`, `image-dedup.js` |
| **Static فقط** | `forms.js` + `Blogarch.contact.js` (صفحة تواصل)، `Blogarch.lessons.js` (صفحة تعلّم) |

### 1.3 عناصر تؤثّر على LCP
- LCP غالباً **نص عنوان الـ Hero** (`.ba-hero-title`). كان يبدأ بـ `opacity:0` مع `animation-delay` حتى `.45s`
  → يؤخّر رسم النص.
- الـ Hero نص وليس صورة (خلفية CSS متدرّجة `.ba-hero-bg`). لا يعتمد على JS.

### 1.4 مكتبات/CDN
- **Font Awesome** (solid+brands): 3 CSS + 2 woff2 — محمّل لا-حاجب، لكنه يضيف طلبات/بايت.
  استبداله كلياً **خطر** لأن محتوى المقالات يستخدم `fa-*`. يُنفَّذ مرحلياً.
- **cdnjs.cloudflare.com** preconnect غير مستخدم → حُذف.

### 1.5 Render-blocking
- `b:skin` (CSS مضمّن) كبير أحادي السطر — حاجب جزئياً، لكنه ضروري للرسم.
- خطوط Google + Font Awesome محمّلة غير-حاجبة (preload+onload).

---

## 2. قائمة الملفات الحرجة (Critical)
`theme` · `drawer` · `search` · `lazy-images` · `navbar-ux` · `mini-cards` · `quotes-fallback` · `blogarch` · `data`

## 3. قائمة الملفات المؤجلة (Lazy)
تُحمَّل بعد idle/load: `renderers` · `skeletons` · `clickable-cards` · `homepage-data` · `newsletter` · `homepage-ux` (homepage)
— في النموذج المطبَّق تُحمَّل فوراً على صفحتها لكنها **لا تُحمَّل إطلاقاً** في الصفحات الأخرى
(توفير أكبر من التأجيل).

## 4. قائمة الملفات الخاصة بكل نوع صفحة
- **Homepage:** `renderers, skeletons, clickable-cards, homepage-data, newsletter, homepage-ux`
- **Post:** `post-toc, web-share, page-progress, lightbox, breadcrumb-jsonld, image-dedup`
- **Static:** `forms + Blogarch.contact` (تواصل)، `Blogarch.lessons` (تعلّم)

## 5. خطة تصغير CSS
- `b:skin` **مصغّر أصلًا** (سطر واحد)؛ النقل لملف `noncritical.css` خارجي **خطر** على Blogger (لا ننقله).
- بدلاً منه: تنظيف CSS الميت (تمّ في مهمة سابقة: `fin-footer*`, `ba-hero-*`...).
- للملفات الخارجية (FA): استخدام `.min.css` (مستخدم أصلًا).

## 6. خطة تحسين FCP
- إبقاء الخطوط بـ `display=swap` (موجود) + preconnect (موجود).
- إبقاء `b:skin` مضمّناً (Critical CSS فوري).

## 7. خطة تحسين LCP
- تقليل `animation-delay` للعناصر فوق الطية إلى `≤150ms` (نُفّذ).
- عدم إخفاء عنوان الـ Hero بأنيميشن طويل (نُفّذ: `.hero-reveal` أقصر وأسرع).
- لا يعتمد على JS لإظهار العنوان (نص CSS نقي).

## 8. المخاطر المتوقعة
- **استبعاد وحدة من صفحة تحتاجها** → كسر ميزة. تُخفَّف بالتحقق من وجود الملفات واختبار كل نوع صفحة.
- تغيّر ترتيب تحميل الوحدات → تُخفَّف بأن الوحدات مستقلة بفضل الـ guards.
- `content-visibility` قد يغيّر سلوك Scroll → تُخفَّف بـ `contain-intrinsic-size`.

## 9. طريقة التراجع
- القالب: `git checkout <prev> -- Blogarch_lite_audited-3.xml.work`.
- لا تغيير على الـ CDN؛ إعادة الرفع للنسخة السابقة يستعيد السلوك الأصلي.

---

## 📋 ملاحظات قرارات (نُفِّذ / لم يُنفَّذ)
| البند | القرار |
|-------|--------|
| Resource hints | ✅ موجود + حذف preconnect غير مستخدم |
| الخطوط | ✅ موجود (swap + preconnect + fallback) |
| تحميل JS حسب نوع الصفحة | ✅ نُفّذ |
| LCP (تأخير الأنيميشن) | ✅ نُفّذ |
| content-visibility | ✅ نُفّذ |
| استبدال Font Awesome بـ SVG | ⚠️ خطة مرحلية (خطر على أيقونات المقالات) |
| نقل CSS لملف خارجي | ⚠️ خطة (خطر على Blogger) |
| تصغير JS عبر esbuild | ⚠️ خطة (وثّق الاستخدام) |
