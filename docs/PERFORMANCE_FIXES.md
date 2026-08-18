# 🔧 سجل الإصلاحات المنفَّذة (Performance Fixes — P0)

> **التاريخ:** 2026-08-18
> **الملف:** `Blogarch_lite_audited-3.xml.work`
> **النطاق:** إصلاحات P0 فقط (آمنة، مُتحقَّق منها)

---

## 1. تحميل JavaScript حسب نوع الصفحة (تقليل Unused JS ~189 KiB)

- **الملف المتأثر:** كتلة `window.BlogArch.ASSETS.js` (inline config)
- **السبب:** كان يحمّل كل الوحدات (24) في كل صفحة؛ معظمها غير مستخدم في الصفحة الحالية.
- **التغيير:** استُبدلت القائمة الثابتة بمنشئ مشروط (`<b:if>` من Blogger):
  - **Critical (كل الصفحات):** theme, drawer, search, lazy-images, navbar-ux, mini-cards, quotes-fallback, blogarch, data
  - **Homepage:** renderers, skeletons, clickable-cards, homepage-data, newsletter, homepage-ux
  - **Post:** post-toc, web-share, page-progress, lightbox, breadcrumb-jsonld, image-dedup
  - **Static:** forms + Blogarch.contact (تواصل) · Blogarch.lessons (تعلّم)
- **الأثر المتوقع:** انخفاض كبير في بايتات JS المحمَّلة لكل نوع صفحة (توفير ~189 KiB على الصفحة الرئيسية).
- **التراجع:** `git checkout <prev> -- Blogarch_lite_audited-3.xml.work`

## 2. إزالة preconnect غير مستخدم (cdnjs.cloudflare.com)

- **الملف المتأثر:** `<head>`
- **السبب:** preconnect لمصدر غير مستخدم فعلياً في القالب (كل الأيقونات عبر jsDelivr).
- **التغيير:** حذف `<link rel='preconnect' href='https://cdnjs.cloudflare.com'/>`
- **الأثر المتوقع:** تقليل اتصال DNS/شبكة غير ضروري.
- **التراجع:** إعادة إدراج السطر.

## 3. تحسين LCP — تسريع أنيميشن عنوان الـ Hero

- **الملف المتأثر:** كتلة `Hero v2` (`.hero-reveal`)
- **السبب:** كان العنوان يبدأ `opacity:0` مع `animation-delay` حتى `.45s` ومدّة `.7s` → تأخير رسم LCP.
- **التغيير:**
  - `animation-delay` للعناصر الخمسة: `0 / .05 / .1 / .15 / .15` (كلها `≤150ms`).
  - مدّة أقصر `.5s` وإزاحة أقل `18px`.
- **الأثر المتوقع:** رسم أسرع لعنوان الـ Hero (LCP) وFCP أفضل.
- **التراجع:** إعادة القيم القديمة (`.7s`, `.05–.45s`).

## 4. content-visibility: auto للأقسام تحت الطية

- **الملف المتأثر:** نهاية `<b:skin>` (كتلة Performance جديدة)
- **السبب:** تخطّي الرسم/الحساب للأقسام البعيدة عن أول الشاشة.
- **التغيير:**
  ```css
  #main > section:not(.ba-hero),.ba-features-strip,.ba-best-section,.ba-learn-strip,.ba-final-strip{
    content-visibility:auto;contain-intrinsic-size:auto 900px;
  }
  ```
- **الأثر المتوقع:** تحسين سرعة الرسم والتخطيط (تقليل Layout/Input lag).
- **التراجع:** حذف الكتلة.

---

## ✅ أمور تحقّقت (لم تحتج تعديلاً)
- **الخطوط:** `display=swap` + `preconnect` لـ `fonts.gstatic.com` + noscript fallback — موجودة.
- **Font Awesome:** محمّل بـ `preload`+`onload` (غير حاجب) — لم يُعدَّل (خطة مرحلية لاحقاً).
- **fallback الخطوط:** `--font-sans` يشمل `system-ui, Segoe UI, Tahoma, sans-serif` — كافٍ.

## 📌 لم يُنفَّذ (خطة فقط — لأسباب أمان)
- استبدال Font Awesome بـ Inline SVG (يؤثر على أيقونات محتوى المقالات).
- نقل CSS لملف `noncritical.css` خارجي (خطر على بنية Blogger).
- تصغير JS عبر esbuild إلى `.min.js` (توثيق الاستخدام في الخطة).
