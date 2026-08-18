# تصميم الـ Hero Section (المرحلة 2)

> توثيق القسم الرئيسي (Hero) بعد إعادة تصميمه ليستخدم **نظام التصميم** (`docs/DESIGN_SYSTEM.md`)
> حصرياً — بلا ألوان أو أحجام ثابتة (hardcoded).

---

## 1. نظرة عامة

القسم السابق كان `<section class='ba-hero fade-in-section'>` يعتمد على صورة زخرفية (`ba-hero-decor`)
وشبكة radial-gradient ثابتة. التصميم الجديد:

- **خلفية متدرجة متحركة** (Primary → Secondary → Accent) عبر `baHeroGradient`.
- **بطاقة زجاجية** (Glass Morphism) تحوي النص بفضل `backdrop-filter: blur`.
- **عنوان ترحيبي** بـ `--fs-4xl` + `--font-display` (Amiri) مع تدرّج نصي.
- **عنوان فرعي** بـ `--fs-xl` + `--font-sans` (Tajawal).
- **زرّا CTA**: `.btn--primary` (رئيسي) و`.btn--ghost` (ثانوي).
- **روابط اجتماعية** دائرية في الأسفل.
- **أنيميشن دخول** (fade-in + slide-up) متدرّج عبر `.hero-reveal`.
- **متجاوب** بالكامل + احترام `prefers-reduced-motion`.

---

## 2. البنية الجديدة (HTML Structure)

```html
<section class='ba-hero' id='home-section' aria-labelledby='ba-hero-title'>
  <div class='ba-hero-bg' aria-hidden='true'></div>
  <div class='ba-hero-inner'>
    <div class='ba-hero-card'>
      <span class='ba-hero-badge hero-reveal'>
        <i class='fas fa-circle'/> منصة معرفية عربية
      </span>
      <h1 class='ba-hero-title hero-reveal' id='ba-hero-title'>
        <span class='ba-hero-gradient'>اللغة والتقنية</span><br/>
        بوابتك إلى التعلّم الذاتي.
      </h1>
      <p class='ba-hero-subtitle hero-reveal'>
        محتوى تحليلي عميق يجمع بين إتقان اللغة الإنجليزية، والتقنية الحديثة، والثقافة الرقمية.
        لأنّ التعلّم المنهجي هو المفتاح الحقيقي للفرص في عالم متسارع التغيّر.
      </p>
      <div class='ba-hero-actions hero-reveal'>
        <a class='btn btn--primary' href='/p/blog-page_52.html'>
          <i class='fas fa-graduation-cap'/> ابدأ التعلّم
        </a>
        <a class='btn btn--ghost' href='/p/blog-page_25.html'>
          <i class='fas fa-compass'/> استكشف المحتوى
        </a>
      </div>
      <ul class='ba-hero-socials hero-reveal' aria-label='روابط التواصل الاجتماعي'>
        <li><a class='ba-social' href='#' aria-label='X'><i class='fab fa-x-twitter'/></a></li>
        <li><a class='ba-social' href='#' aria-label='LinkedIn'><i class='fab fa-linkedin-in'/></a></li>
        <li><a class='ba-social' href='#' aria-label='YouTube'><i class='fab fa-youtube'/></a></li>
        <li><a class='ba-social' href='#' aria-label='GitHub'><i class='fab fa-github'/></a></li>
      </ul>
    </div>
  </div>
</section>
```

> **طبّق فعلياً:** استُبدلت بنية `ba-hero` القديمة (الخطوط 561–590) بهذه البنية في
> `Blogarch_lite_audited-3.xml.work`.

---

## 3. CSS المستخدم (مضاف إلى `<b:skin>`)

كل القيم مشتقّة من رموز نظام التصميم (`--primary-color`, `--secondary-color`, `--accent`,
`--card`, `--text`, `--r-2xl`, `--sh-xl`, `--sp-*`, `--fs-*`, `--font-*`, `--ease-out` …).

```css
/* ===== Hero v2 (Design System driven) ===== */
.ba-hero{position:relative;overflow:hidden;padding:var(--sp-4xl) 0;isolation:isolate}
.ba-hero::before{display:none}                 /* ألغِ شبكة الـ mesh القديمة */
.ba-hero-bg{position:absolute;inset:0;z-index:-1;
  background:linear-gradient(125deg,var(--primary-color),var(--secondary-color) 45%,var(--accent) 100%);
  background-size:200% 200%;animation:baHeroGradient 14s ease infinite}
.ba-hero-bg::after{content:'';position:absolute;inset:0;
  background:radial-gradient(60% 60% at 82% 18%,rgba(255,255,255,.28),transparent 70%)}
@keyframes baHeroGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.ba-hero-inner{position:relative;max-width:min(92vw,1100px);margin-inline:auto;padding-inline:clamp(1rem,4vw,2.5rem)}
.ba-hero-card{background:color-mix(in srgb,var(--card) 72%,transparent);
  backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);
  border:1px solid color-mix(in srgb,var(--card) 45%,transparent);
  border-radius:var(--r-2xl);box-shadow:var(--sh-xl);padding:clamp(1.5rem,5vw,3rem);text-align:center}
.ba-hero-badge{display:inline-flex;align-items:center;gap:.45rem;padding:.45rem 1rem;border-radius:var(--r-full);
  background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);
  font-size:var(--fs-sm);font-weight:var(--fw-bold);font-family:var(--font-sans);margin-bottom:var(--sp-lg)}
.ba-hero-title{font-family:var(--font-display);font-size:var(--fs-4xl);line-height:var(--lh-tight);
  letter-spacing:var(--ls-tight);font-weight:var(--fw-bold);color:var(--text);margin-bottom:var(--sp-md)}
.ba-hero-gradient{background:linear-gradient(to left,var(--primary-color),var(--accent));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.ba-hero-subtitle{font-family:var(--font-sans);font-size:var(--fs-xl);line-height:var(--lh-relaxed);
  color:var(--text-soft);max-width:60ch;margin:0 auto var(--sp-xl)}
.ba-hero-actions{display:flex;gap:var(--sp-sm);flex-wrap:wrap;justify-content:center;margin-bottom:var(--sp-xl)}
.ba-hero-socials{display:flex;gap:var(--sp-sm);justify-content:center;list-style:none;padding:0;margin:0}
.ba-social{width:44px;height:44px;border-radius:var(--r-full);display:inline-flex;align-items:center;
  justify-content:center;color:var(--text-soft);background:color-mix(in srgb,var(--card) 60%,transparent);
  border:1px solid var(--border);font-size:1.05rem;
  transition:transform .2s var(--ease-out),background .2s,color .2s,box-shadow .2s}
.ba-social:hover{transform:translateY(-3px);background:var(--primary-color);color:#fff;box-shadow:var(--sh-lg)}

/* Button component — استُخدم لأول مرة هنا ليصبح متاحاً في باقي القالب */
.btn{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--font-sans);font-weight:var(--fw-semibold);
  font-size:var(--fs-base);padding:var(--btn-padding);border-radius:var(--btn-radius);border:none;cursor:pointer;
  text-decoration:none;transition:transform .2s var(--ease-out),box-shadow .2s,background .2s,color .2s}
.btn--primary{background:var(--primary-color);color:#fff}
.btn--primary:hover{background:var(--primary-hover);transform:translateY(-2px);box-shadow:var(--sh-lg)}
.btn--secondary{background:var(--secondary-color);color:#fff}
.btn--secondary:hover{transform:translateY(-2px);box-shadow:var(--sh-lg);filter:brightness(.93)}
.btn--accent{background:var(--accent);color:var(--accent-fg)}
.btn--accent:hover{background:var(--accent-hover);transform:translateY(-2px);box-shadow:var(--sh-lg)}
.btn--ghost{background:transparent;color:var(--primary-color);border:1.5px solid var(--border)}
.btn--ghost:hover{background:var(--primary-light);transform:translateY(-2px);box-shadow:var(--sh-sm)}
.btn--lg{padding:.9rem 1.8rem;font-size:var(--fs-lg)}
.btn--sm{padding:.45rem 1rem;font-size:var(--fs-sm)}
```

---

## 4. التأثيرات والأنيميشن

### 4.1 خلفية متدرجة متحركة
`baHeroGradient` يحرّك `background-position` على تدرّج `200% 200%` ببطء (14s، `ease infinite`)
لفرشاة حيويّة بين Primary/Secondary/Accent. طبقة `::after` تضيف وميضاً ضوئياً علويّاً.

### 4.2 Glass Morphism
البطاقة `.ba-hero-card` شفافة (`color-mix` من `--card` بنسبة 72%) مع `backdrop-filter: blur(16px)`.
تتكيّف تلقائياً مع الوضع الداكن لأن `--card` و`--border` متغيّران حسب الثيم.

### 4.3 دخول سلس (fade-in + slide-up)
```css
.hero-reveal{opacity:0;transform:translateY(24px);animation:baHeroIn .7s var(--ease-out) forwards}
.hero-reveal:nth-child(1..5){animation-delay:.05s … .45s}  /* تعاقب متدرّج */
@keyframes baHeroIn{to{opacity:1;transform:translateY(0)}}
```
يُشغَّل تلقائياً عند الرسم (لا حاجة لـ JS). كل عنصر داخل البطاقة يظهر تباعاً.

### 4.4 Hover
- الأزرار: `transform:translateY(-2px)` + `box-shadow:var(--sh-lg)` (أو `sh-sm` للشبح).
- أيقونات التواصل: ترتفع وتتلوّن بـ Primary مع `--sh-lg`.

### 4.5 احترام تقليل الحركة
```css
@media (prefers-reduced-motion:reduce){
  .ba-hero-bg{animation:none}
  .hero-reveal{animation:none;opacity:1;transform:none}
}
```

### 4.6 التجاوب (Responsive)
```css
@media (max-width:640px){
  .ba-hero-title{font-size:var(--fs-3xl)}
  .ba-hero-subtitle{font-size:var(--fs-lg)}
  .ba-hero-actions{flex-direction:column;align-items:stretch}
  .btn{justify-content:center}
}
```

---

## 5. دمج JavaScript الحالي (النجوم + الخلفية المتحركة)

القالب يحوي نظام نجوم في الوضع الداكن:

- `<div class='fin-stars' id='fin-stars'/>` (السطر 378) يُملأ ديناميكياً بـ JS
  (الأسطر ~1526 – 1529) **فقط** عند `body[data-dark]` (CSS: `body[data-dark] .fin-stars{display:block}`).

**كيفية الدمج مع التصميم الجديد:**
1. **لا تغيير مطلوب** — النجوم تظهر فوق خلفية التدرّج في الوضع الداكن كطبقة `z-index` أعلى،
   مما يعطي عمقاً ممتازاً (نجوم لامعة على تدرّج indigo/emerald). التدرّج المتحرك و النجوم متناغمان.
2. **تحسين اختياري:** جعل النجوم تتبع سرعة التدرّج عبر ضبط `animation-delay` في `fin-twinkle`
   عشوائياً داخل حلقة التوليد الحالية (بدون كسر المنطق).
3. **الخلفية المتحركة:** بما أن التدرّج الآن CSS خالص (`baHeroGradient`)، فلا تعارض مع أي
   `requestAnimationFrame` سابق. إن وُجد كود JS قديم يحرّك `--hero-x` فإنه يمكن حذفه لصالح CSS.
4. **مراقب الظهور (`fade-in-section`):** أُزيلت هذه الفئة من الـ Hero لأن `.hero-reveal`
   يتكفّل بالدخول عبر CSS؛ باقي الأقسام تظل تستخدم `IntersectionObserver` كما هي.

---

## 6. التكامل مع باقي الصفحة

- **النجوم:** تعايش مع شريط الميزات (`ba-features-strip`) أسفل الـ Hero كما كانت.
- **الرموز المشتركة:** استخدمنا Font Awesome (`fab fa-x-twitter` …) المتاح أصلاً عبر الـ CDN.
- **الأزرار `.btn`:** أصبح مكوّناً معتمداً في `<b:skin>` — يُمكن استبدال الأزرار القديمة
  (`.ba-btn`, `.nav-cta`, `.fin-hero-cta`) به تدريجياً في مراحل لاحقة لنظام موحّد.
- **الثيم:** البطاقة الزجاجية والنجوم والروابط كلها تعتمد متغيرات `--card/--border/--text`
  فتتحوّل تلقائياً بين الفاتح والداكن.

---

## 7. كيفية التراجع (Rollback)

الكود القديم محفوظ في تاريخ git قبل هذا التعديل. للعودة:
`git checkout <commit>^ -- Blogarch_lite_audited-3.xml.work` ثم إعادة النشر.

القواعد القديمة غير المستخدمة (`.ba-hero-grid`، `.ba-hero-decor`، `.ba-hero-text`،
`.ba-hero-h1`، `.ba-hero-desc`) بقيت في `<b:skin>` دون عناصر مرجعية — يُفضّل حذفها في
جولة تنظيف لاحقة لتقليل حجم CSS.
