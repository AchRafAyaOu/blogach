# الألوان · التنسيق · التجاوب (Colors, Layout & Responsive)

> توثيق تعديلات تحسين الألوان (تفادي الزهري)، ونظام التنسيق الموحّد للأقسام،
> ونهج Mobile-First للـ Breakpoints في `Blogarch_lite_audited-3.xml.work`.
> كل القيم من نظام التصميم (`docs/DESIGN_SYSTEM.md`) — بلا ألوان hardcoded.

---

## 1. الألوان الجديدة (قبل / بعد)

### 1.1 الثانوي (Secondary) — أزرق عميق بدل البنفسجي الزهري

| | القناة | القيمة |
|---|---|---|
| **قبل** | `--c-secondary-h / s / l` | `262 · 83% · 58%` → `#7c3aed` (Violet — قد يُنتج زهرياً عند دمجه مع Primary) |
| **بعد** | `--c-secondary-h / s / l` | `230 · 70% · 50%` → `#3b5bdb` (Deep Blue — بارد واحترافي) |

**المتغيرات المشتّقة (محدّثة):**
```css
--secondary-color:hsl(var(--c-secondary-h) var(--c-secondary-s) var(--c-secondary-l)); /* #3b5bdb */
--secondary-hover:hsl(var(--c-secondary-h) var(--c-secondary-s) 42%);                  /* أغمق عند التمرير */
--secondary-light:hsl(var(--c-secondary-h) var(--c-secondary-s) 94%);                  /* خلفية خفيفة */
```

**تمت معالجة كل مواضع `#7c3aed` في الملف** (المرجعية، المتغيرات، الـ fallbacks في
`var(--secondary-color,#7c3aed)`، التدرّجات، والنص الملوّن مباشرة) إلى `#3b5bdb`.

### 1.2 الألوان الحيّة النهائية (كلها باردة/محايدة)

```css
/* Primary  — Indigo (بارد) */
--c-primary-h:243; --c-primary-s:75%; --c-primary-l:59%;   /* #4f46e5 */
/* Secondary — Deep Blue (بارد جداً) */
--c-secondary-h:230; --c-secondary-s:70%; --c-secondary-l:50%; /* #3b5bdb */
/* Accent   — Emerald (بارد) */
--c-accent-h:160; --c-accent-s:84%; --c-accent-l:39%;      /* #059669 */
/* Neutral  — Slate (محايد بارد) — بدون تغيير */
```

### 1.3 إزالة اللون الوردي من فئة "بودكاست"

كانت فئة البودكاست (`--c-podcast`) ملوّنة بالوردي `#e11d48`. استُبدلت بلون **Sky أزرق بارد**
مع خلفيتها الشفافة:
```css
/* قبل */ --c-podcast:#e11d48; /* after */ --c-podcast:#0284c7;
/* والأيقونة الملوّنة يدوياً `color:#e11d48` أصبحت `color:var(--c-podcast)` */
```

### 1.4 مراجعة الـ Gradients

- **Hero Background:** `Primary → Secondary(Deep Blue) → Accent` — كلها باردة الآن.
- **أزرار CTA / تدرّجات البطاقات:** `#4f46e5 → #3b5bdb` بدل `#7c3aed`.
- فحص شامل للقيم الوردية (`#f9a8d4 … #e11d48 …`) لم يبقَ أي وردي/زهري.

---

## 2. نظام التنسيق الموحّد للأقسام (Section Layout)

أُضيفت كتلة `Unified Section Layout` في `<b:skin>`:

### 2.1 المسافات (Spacing)
```css
#main > section{padding-block:var(--sp-3xl)}   /* 64px بين الأقسام */
#main > section.ba-hero{padding-block:var(--sp-4xl)} /* 96px للـ Hero */
.section-header{display:flex;flex-direction:column;align-items:center;gap:var(--sp-sm);text-align:center;margin-bottom:var(--sp-2xl)}
```

### 2.2 الحاوية (Container)
```css
.section-container{width:100%;max-width:1200px;margin-inline:auto;padding-inline:var(--sp-md)}
@media (min-width:640px){.section-container{padding-inline:var(--sp-lg)}}
```

### 2.3 عناوين الأقسام (Section Headers)
```css
.section-title{font-family:var(--font-display);font-size:var(--fs-2xl);font-weight:var(--fw-bold);color:var(--text)}
.section-subtitle{font-family:var(--font-sans);font-size:var(--fs-base);color:var(--text-muted);max-width:600px;margin-inline:auto}
.section-title::after{content:'';display:block;width:60px;height:3px;
  background:linear-gradient(90deg,var(--primary-color),var(--accent));
  margin:var(--sp-sm) auto 0;border-radius:var(--r-full)}
```

### 2.4 خلفيات متناوبة (اختياري — آمن)
بدل قاعدة عامّة `nth-child` غير متوقّعة على هذا القالب، أُضيفت فئة مساعدة:
```css
.section--alt{background:var(--bg-subtle)}
```
تُضاف يدوياً للأقسام المُراد تمييزها (الـ Hero يبقى بشفافية والتدرّج من `.ba-hero-bg`).

---

## 3. الـ Breakpoints (Mobile-First)

| التسمية | العرض | ملاحظة |
|---|---|---|
| Base | `0–639px` | Mobile |
| `sm` | `640px+` | Tablet |
| `md` | `768px+` | Tablet Landscape |
| `lg` | `1024px+` | Laptop |
| `xl` | `1280px+` | Desktop |
| `2xl` | `1536px+` | Large Desktop |

### 3.1 الـ Hero (مطبّق)
```css
.ba-hero-title{font-size:var(--fs-2xl)}        /* Mobile */
@media (min-width:640px){.ba-hero-title{font-size:var(--fs-3xl)}}
@media (min-width:1024px){.ba-hero-title{font-size:var(--fs-4xl)}}
```

### 3.2 وسائط متجاوبة
```css
img,video,iframe{max-width:100%;height:auto}
```
(موجودة أصلاً في القالب، وأُكّدت ضمن الكتلة الجديدة.)

### 3.3 ملاحظات على باقي المكونات
- **Grids (`posts-grid` / الشبكات):** القالب لديه بالفعل تخطيط متجاوب (1→2→3 أعمدة).
- **Navbar:** لديه زر قائمة متجاوب وحاضر (`hamburger` + `mobile-drawer`).
- **Footer (`site-footer`):** يستخدم `repeat(auto-fit,minmax(200px,1fr))` فيتحوّل تلقائياً
  من عمود واحد إلى أربعة أعمدة دون Breakpoints إضافية.
- **Forms:** يمكن استخدام `.section-container` مع `grid-template-columns:1fr` ثم
  `repeat(2,1fr)` عند `min-width:768px` عند الحاجة.

---

## 4. ملاحظات وتوصيات

1. **نص لا يتجاوز عرض الحاوية:** قاعدة عامّة `p,li,blockquote{max-width:70ch}` لم تُطبَّق
   لأنها ستكسر القوائم/الفوتر/شريط الميزات (تتجاوز حد `70ch` عمداً). يُنصح بتطبيقها فقط
   على نصوص المقالات (`post-body p`, `post-content p`) عند الرغبة.
2. **الخلفيات المتناوبة:** استُخدمت فئة `.section--alt` بدل `nth-child` لتفادي سلوك غير
   متوقّع لأن `<main>` يضم عناصر متنوّعة (sections وdivs).
3. **Dark Mode:** الألوان والرموز الجديدة تعتمد متغيرات الثيم، فيتحوّل كل شيء تلقائياً
   بين الفاتح والداكن (بما فيها `--secondary-hover`/`--secondary-light`).
4. **Reduced Motion:** تمت إضافة حماية للخط الزخرفي، وأزرار الثيم السابقة تحترمها أصلاً.
5. **القيم القديمة غير المستخدمة:** قواعد `fin-footer*` و`footer-brand-wrap` و`.ba-hero-grid`
   و`.ba-hero-decor` و`.ba-hero-text` و`.ba-hero-h1` و`.ba-hero-desc` بقيت في `<b:skin>`
   دون عناصر مرجعية — يُنصح بحذفها في جولة تنظيف لتقليل حجم CSS.

---

## 5. التحقق

| الفحص | النتيجة |
|---|---|
| عدم وجود `#7c3aed` (بنفسجي) | ✅ 0 |
| عدم وجود `#e11d48` (وردي) | ✅ 0 |
| قنوات Secondary الجديدة `230/70%/50%` | ✅ |
| رموز `--secondary-hover` / `--secondary-light` | ✅ |
| كتلة `Unified Section Layout` في `<b:skin>` | ✅ |
| صحة بنية XML (`xml.dom.minidom`) | ✅ well-formed |
