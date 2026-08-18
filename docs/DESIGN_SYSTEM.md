# نظام التصميم (Design System)

> وثيقة مرجعية شاملة لنظام تصميم احترافي عالمي لمدونة **Blogarch / blogach**.
> جميع القيم معرّفة داخل `<b:skin>` في `Blogarch_lite_audited-3.xml.work` بصيغة **HSL**
> للتحكم الدقيق في الدرجات والشفافية، ومتزامنة مع المتغيرات الحالية للقالب.

---

## أ. لوحة الألوان الاحترافية (Modern Color Palette)

تعتمد اللوحة على نظام **HSL** (Hue / Saturation / Lightness) بحيث يسهُل اشتقاق
الدرجات (tints/shades) والشفافية عبر `hsl(H S L / alpha)` بدل تكرار قيم `rgba()` سداسية.

### A.1 القنوات الأساسية (Brand hue channels)

| المتغير | القيمة | الوصف |
|---|---|---|
| `--c-primary-h` | `243` | هوية اللون الرئيسي (Indigo) |
| `--c-primary-s` | `75%` | تشبع اللون الرئيسي |
| `--c-primary-l` | `59%` | إضاءة اللون الرئيسي |
| `--c-secondary-h` | `262` | ثانوي (Violet) |
| `--c-secondary-s` | `83%` | |
| `--c-secondary-l` | `58%` | |
| `--c-accent-h` | `160` | لون التمييز (Emerald) |
| `--c-accent-s` | `84%` | |
| `--c-accent-l` | `39%` | |

### A.2 Primary & Secondary (الألوان الأساسية)

| الرمز | القيمة (Hex) | HSL | الاستخدام |
|---|---|---|---|
| Primary | `#4f46e5` | `hsl(243 75% 59%)` | أزرار، روابط، تفعيل، علامة مميِّزة |
| Primary Dark | `#3730a3` | `hsl(243 75% 41%)` | hover/active عميق |
| Primary Hover | `#4338ca` | `hsl(243 75% 50%)` | حالة التمرير |
| Primary Light | `#eef2ff` | `hsl(243 100% 96%)` | خلفيات خفيفة/أشرطة |
| Secondary | `#7c3aed` | `hsl(262 83% 58%)` | تدرّجات، عناصر ثانوية |

### A.3 Accent (لون التمييز)

| الرمز | القيمة | HSL |
|---|---|---|
| Accent | `#059669` | `hsl(160 84% 39%)` |
| Accent Hover | `#047857` | `hsl(160 84% 31%)` |
| Accent FG | `#ffffff` | (نص على خلفية التمييز) |
| Accent Soft | `rgba(5,150,105,.10)` | خلفية شفافة |

### A.4 Neutral Scale (مقياس محايد — Slate، 9+ درجة)

من الأبيض إلى الأسود، أساسه `#0f172a → #f8fafc`:

| الدرجة | Hex | HSL |
|---|---|---|
| 50  | `#f8fafc` | `hsl(210 40% 98%)` |
| 100 | `#f1f5f9` | `hsl(210 40% 96%)` |
| 200 | `#e2e8f0` | `hsl(214 32% 91%)` |
| 300 | `#cbd5e1` | `hsl(213 27% 84%)` |
| 400 | `#94a3b8` | `hsl(215 20% 65%)` |
| 500 | `#64748b` | `hsl(215 16% 47%)` |
| 600 | `#475569` | `hsl(215 19% 35%)` |
| 700 | `#334155` | `hsl(215 25% 27%)` |
| 800 | `#1e293b` | `hsl(217 33% 17%)` |
| 900 | `#0f172a` | `hsl(222 47% 11%)` |

**تعيين المتغيرات الحالية على المحايد:**
`--bg:#f8fafc · --bg-subtle:#f1f5f9 · --bg-muted:#e2e8f0 · --border:#e2e8f0 ·`
`--border-strong:#cbd5e1 · --text:#0f172a · --text-soft:#334155 · --text-muted:#64748b · --card:#ffffff`

### A.5 Semantic Colors (ألوان دلالية)

| المعنى | المتغير | Hex | HSL |
|---|---|---|---|
| Success | `--c-success` | `#10b981` | `hsl(160 84% 39%)` |
| Warning | `--c-warning` | `#f59e0b` | `hsl(38 92% 50%)` |
| Error   | `--c-error`   | `#ef4444` | `hsl(0 84% 60%)` |
| Info    | `--c-info`    | `#3b82f6` | `hsl(217 91% 60%)` |

القنوات: `--c-success-h/s/l · --c-warning-h/s/l · --c-error-h/s/l · --c-info-h/s/l`

### A.6 Dark Mode Variants (محسّنة للوضع الداكن)

تعتمد على نفس القنوات لكن بإضاءة أعلى للألوان الحيّة وخلفيات من المقياس المحايد الداكن:

| المتغير | Light | Dark |
|---|---|---|
| `--bg` | `#f8fafc` | `#0f172a` |
| `--bg-elevated` | `#ffffff` | `#1e293b` |
| `--bg-subtle` | `#f1f5f9` | `#18233b` |
| `--bg-muted` | `#e2e8f0` | `#334155` |
| `--text` | `#0f172a` | `#f8fafc` |
| `--text-soft` | `#334155` | `#e2e8f0` |
| `--text-muted` | `#64748b` | `#94a3b8` |
| `--card` | `#ffffff` | `#1e293b` |
| `--border` | `#e2e8f0` | `#334155` |
| `--border-strong` | `#cbd5e1` | `#475569` |
| `--primary-color` | `#4f46e5` | `#818cf8` |
| `--accent` | `#059669` | `#34d399` |
| `--ring` | `#4f46e5` | `#818cf8` |

> مُطبَّق عبر `body[data-dark], body.dark-mode` وفي `@media (prefers-color-scheme:dark)`.

---

## ب. Typography Scale (مقياس الخطوط)

### B.1 Font Families (Google Fonts تدعم العربية)

| الدور | المتغير | الخط | الوزن المتاح |
|---|---|---|---|
| Sans / UI | `--font-sans` | **Tajawal** | 400, 500, 700 |
| Serif / Body | `--font-serif` | **Alexandria** | 400, 500, 600, 700 |
| Display / Headings | `--font-display` | **Amiri** | 700 |

الرابط الحالي: `css2?family=Alexandria:wght@400;500;600;700&family=Tajawal:wght@400;500;700&family=Amiri:wght@700&display=swap`

### B.2 Font Sizes (xs → 4xl)

| الرمز | القيمة | مثال الاستخدام |
|---|---|---|
| `--fs-xs` | `.75rem` (12px) | تلميحات، تذييل |
| `--fs-sm` | `.875rem` (14px) | نص ثانوي |
| `--fs-base` | `1rem` (16px) | نص الجسم |
| `--fs-lg` | `1.125rem` (18px) | عناوين فرعية |
| `--fs-xl` | `1.25rem` (20px) | عناوين قسم |
| `--fs-2xl` | `1.5rem` (24px) | عناوين مقالات |
| `--fs-3xl` | `1.875rem` (30px) | عناوين رئيسية |
| `--fs-4xl` | `2.25rem` (36px) | بطل (Hero) |

### B.3 Font Weights

`--fw-light:300 · --fw-regular:400 · --fw-medium:500 · --fw-semibold:600 · --fw-bold:700`

### B.4 Line Heights

`--lh-tight:1.25 · --lh-snug:1.375 · --lh-normal:1.6 · --lh-relaxed:1.8 · --lh-loose:2`

### B.5 Letter Spacing

`--ls-tight:-.02em · --ls-normal:0 · --ls-wide:.025em · --ls-wider:.05em`

---

## ج. Spacing System (نظام المسافات — أساس 4px)

| الرمز | القيمة | بكسل |
|---|---|---|
| `--sp-xs` | `.25rem` | 4 |
| `--sp-sm` | `.5rem` | 8 |
| `--sp-md` | `1rem` | 16 |
| `--sp-lg` | `1.5rem` | 24 |
| `--sp-xl` | `2rem` | 32 |
| `--sp-2xl` | `3rem` | 48 |
| `--sp-3xl` | `4rem` | 64 |
| `--sp-4xl` | `6rem` | 96 |

> ملاحظة: القالب يحتوي مسبقاً على `--space-*` (نفس الأساس 4px). النظام الجديد `--sp-*`
> موازٍ ومكمِّل، ويُنصح بالانتقال التدريجي إليه.

---

## د. Shadow & Border Radius

### D.1 الظلال (5 مستويات sm → 2xl)

| الرمز | القيمة |
|---|---|
| `--sh-sm` | `0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.1)` |
| `--sh-md` | `0 4px 6px -1px rgba(15,23,42,.1), 0 2px 4px -2px rgba(15,23,42,.1)` |
| `--sh-lg` | `0 10px 15px -3px rgba(15,23,42,.1), 0 4px 6px -4px rgba(15,23,42,.1)` |
| `--sh-xl` | `0 20px 25px -5px rgba(15,23,42,.1), 0 8px 10px -6px rgba(15,23,42,.1)` |
| `--sh-2xl` | `0 25px 50px -12px rgba(15,23,42,.18)` |

### D.2 Border Radius (موحّد)

| الرمز | القيمة | الوصف |
|---|---|---|
| `--r-xs` | `4px` | عناصر دقيقة |
| `--r-sm` | `8px` | حقول/وسوم |
| `--r-md` | `12px` | أزرار |
| `--r-lg` | `16px` | بطاقات |
| `--r-xl` | `24px` | بطاقات كبيرة/صور |
| `--r-2xl` | `32px` | أقسام بطلة |
| `--r-full` | `9999px` | دوائر/حبوب |

---

## هـ. Component Tokens (رموز المكونات)

### E.1 Button

```css
.btn{
  font-family:var(--btn-font, var(--font-ui));
  font-weight:var(--fw-semibold);
  padding:var(--btn-padding, .7rem 1.4rem);
  border-radius:var(--btn-radius, var(--r-md));
  cursor:pointer; transition:transform .18s, box-shadow .18s, background .18s;
}
.btn--primary{ background:var(--primary-color); color:#fff; }
.btn--primary:hover{ background:var(--primary-hover); transform:translateY(-2px); }
.btn--secondary{ background:var(--secondary-color); color:#fff; }
.btn--accent{ background:var(--accent); color:var(--accent-fg); }
.btn--ghost{ background:transparent; color:var(--primary-color); border:1.5px solid var(--border); }
.btn--ghost:hover{ background:var(--primary-light); }
```

### E.2 Card

```css
.card{
  background:var(--card);
  border:var(--card-border, 1px solid var(--border));
  border-radius:var(--card-radius, var(--r-lg));
  padding:var(--card-padding, 1.5rem);
  box-shadow:var(--card-shadow, var(--sh-md));
}
```

### E.3 Input

```css
.input{
  font-family:inherit; font-size:var(--fs-base);
  padding:var(--input-padding, .65rem .85rem);
  border:var(--input-border, 1px solid var(--border));
  border-radius:var(--input-radius, var(--r-md));
  background:var(--bg-elevated); color:var(--text);
  transition:border-color .2s, box-shadow .2s;
}
.input:focus{
  outline:none; border-color:var(--primary-color);
  box-shadow:var(--input-focus, 0 0 0 4px rgba(79,70,229,.12));
}
```

### E.4 Navigation

```css
.navbar{
  position:sticky; top:0; z-index:var(--z-sticky, 200);
  height:var(--nav-h, 62px);
  background:var(--nav-bg, rgba(248,250,252,.85));
  backdrop-filter:var(--nav-blur, blur(16px) saturate(180%));
  border-bottom:1px solid var(--border);
}
```

---

## و. خريطة التطبيق على القالب (Applied Changes)

تم بالفعل داخل `<b:skin>` في `Blogarch_lite_audited-3.xml.work`:

1. **تحديث القيم المركزية** (`:root` + كتلة `prefers-color-scheme:dark`) إلى اللوحة الجديدة:
   - Primary `#4361ee → #4f46e5`، Secondary `#7c3aed` (محفوظ)، Accent `#059669` (محفوظ).
   - المحايد: `#F8F9FA → #f8fafc`، `#0d1b2a → #0f172a`، إلخ.
   - إضافة `--info` و`--*-rgb` الدلالية.
2. **كتلة Design System جديدة** (قنوات HSL + رموز `--c-*` / `--n-*` / `--fs-*` / `--sp-*` / `--r-*` / `--sh-*` / `--btn-*` / `--card-*` / `--input-*` / `--nav-*`) مُدرجة قبل `]]></b:skin>`.
3. تحديث القيم السداسية الاحتياطية (fallbacks) و`rgba(67,97,238,…)` المشتتة إلى `#4f46e5` / `79,70,229`.

> معاينة بصرية كاملة في: **`docs/DESIGN_SYSTEM_PREVIEW.html`** (ملف HTML ثابت مفتوح مباشرة في المتصفح).
