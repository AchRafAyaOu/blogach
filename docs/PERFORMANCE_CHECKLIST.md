# ✅ قائمة اختبار الأداء (Performance Checklist)

> **التاريخ:** 2026-08-18
> استخدمها للتحقق من أداء وسلامة الصفحة الرئيسية بعد التعديلات.

---

## 1. السلامة الأساسية (قبل الاختبار)
- [ ] `Blogarch_lite_audited-3.xml.work` **well-formed** (XML)
  - `python3 -c "import xml.dom.minidom; xml.dom.minidom.parse('Blogarch_lite_audited-3.xml.work'); print('OK')"`
- [ ] كل ملفات JS سليمة الصياغة: `node --check src/*.js src/core/*.js`
- [ ] جميع مسارات `ASSETS` تشير لملفات موجودة (على CDN `blogs_arch@main`)
- [ ] لا توجد `href='#'` أو روابط CDN خاطئة (بحث عن `cdn.jsdelivr.net`)

## 2. تحميل JavaScript حسب الصفحة
- [ ] **الصفحة الرئيسية:** لا تُحمَّل وحدات post-only (`post-toc, web-share, page-progress, lightbox, breadcrumb-jsonld, image-dedup`) ولا static-only (`forms, Blogarch.contact, Blogarch.lessons`)
- [ ] **صفحة مقال:** تُحمَّل وحدات المقالات ولا تُحمَّل وحدات homepage (`renderers, skeletons, clickable-cards, homepage-data, homepage-ux, newsletter`)
- [ ] **صفحة ثابتة "تواصل":** تُحمَّل `forms + Blogarch.contact`
- [ ] **صفحة ثابتة "تعلّم":** تُحمَّل `Blogarch.lessons`
- [ ] الوحدات الحرجة (theme, drawer, search, navbar…) تظهر في كل الصفحات
- [ ] تتبّع في Network: عدد ملفات JS المحمَّلة على الصفحة الرئيسية **انخفض** مقارنةً بالنسخة السابقة

## 3. LCP
- [ ] عنوان الـ Hero يظهر بسرعة (بدون أنيميشن يخفيه لأكثر من ~150ms)
- [ ] `animation-delay` ≤ `150ms` لعناصر فوق الطية
- [ ] لا يعتمد ظهور العنوان على JavaScript (نص CSS نقي)
- [ ] (إن كان LCP صورة) `loading='eager'` + `fetchpriority='high'` + width/height

## 4. FCP / الخطوط
- [ ] Google Fonts تستخدم `display=swap`
- [ ] `preconnect` موجود لـ `fonts.gstatic.com` و`cdn.jsdelivr.net`
- [ ] لا يوجد preconnect لمصادر غير مستخدمة (مثل cdnjs.cloudflare)
- [ ] لا يحدث FOUC شديد (استخدام swap)

## 5. content-visibility
- [ ] الأقسام تحت الطية تستخدم `content-visibility:auto` (تتبّع في DevTools → Rendering)
- [ ] الـ Hero وNavbar **غير** مطبَّق عليهما `content-visibility`
- [ ] لا قفزات Scrollbar كبيرة بفضل `contain-intrinsic-size`

## 6. Lighthouse (DevTools)
- [ ] Performance ≥ 90 (بعد إزالة Unused JS)
- [ ] LCP < 2.5s على اتصال متوسط (4G)
- [ ] First Contentful Paint < 1.8s
- [ ] لا تحذيرات "Reduce unused JavaScript" كبيرة
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90

## 7. ميزات (Functional Regression)
- [ ] تبديل الوضع الداكن يعمل (theme.js)
- [ ] قائمة الجوال/المظلة تعمل (drawer/navbar)
- [ ] البحث المباشر يعمل (search.js)
- [ ] شبكة المقالات تُملأ (homepage-data/renderers) في الصفحة الرئيسية
- [ ] TOC + مشاركة + تقدم القراءة يعملون في صفحات المقالات
- [ ] نموذجا التواصل والنشرة يعملان في صفحاتهما
- [ ] النشرة البريدية تعمل في الصفحة الرئيسية
- [ ] `prefers-reduced-motion` يوقف الأنيميشن

---

## 🐞 سجل المشاكل
| # | التاريخ | المشكلة | الحالة |
|---|---------|---------|--------|
| - | - | - | مفتوح |
