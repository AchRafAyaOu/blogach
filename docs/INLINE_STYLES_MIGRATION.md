# تقرير هجرة الأنماط المضمنة (Inline Styles Migration)

**الملف:** `Blogarch_lite_audited-3.xml.work`
**التاريخ:** 2026-08-18
**الأداة المستخدمة:** `grep -o 'style="[^"]*"' | sort | uniq -c`

---

## 1. نتائج الفحص

عدد سمات `style="..."` المضمنة في الملف: **6** (كلها داخل سلاسل `innerHTML` في كتل `<script>`، وليس في ترميز القالب الظاهر).

توزيعها:

| السمة المضمنة | عدد التكرار | السطروط |
|---|---|---|
| `style="color:var(--muted);font-size:.85rem"` | 3 | 1817، 1819، 1849 |
| `style="color:var(--muted);font-size:.85rem;padding:.3rem 0"` | 1 | 1812 |
| `style="margin-inline-end:.35rem"` | 2 | 2472، 2476 |

---

## 2. التصنيف

### الفئة 1 — أنماط متكررة (قابلة للهجرة) ✅
جميع السمات الست تنتمي إلى هذه الفئة لأنها أنماط ثابتة (static) تتكرر حرفياً:

- **عائلة الرسائل المكتومة** (`color:var(--muted);font-size:.85rem`) — تُستخدم لرسائل حالة البحث
  (جاري البحث / لا توجد نتائج / لا توجد نتائج مطابقة / تعذّر البحث). أحدها يضيف `padding:.3rem 0`.
- **عائلة إزاحة الأيقونة** (`margin-inline-end:.35rem`) — تُستخدم لإزاحة أيقونة الإرسال
  (`fas fa-paper-plane`) عن نص الزر.

### الفئة 2 — أنماط ديناميكية (تحتوي `<data:`) ❌
**لم تُعثر على أي سمة**. لا توجد سمة مضمنة تشير إلى `data:blog.*` أو متغيرات Blogger.

### الفئة 3 — أنماط حرجة يجب إبقاؤها inline ❌
**لم تُعثر على أي سمة حرجة**. جميع السمات الست كانت ثابتة وآمنة للهجرة.

> **ملاحظة إضافية (خارج نطاق `style="..."`):** يوجد داخل كتل `<script>` تعيينات
> نمط عبر JavaScript (`el.style.cssText = '...'` و `el.style.color = '...'`)
> على الأسطر 1829، 1834، 1836، 1840، 2470، 2475. هذه أنماط **برمجية/ديناميكية**
> تُبنى في وقت التشغيل (DOM) ولا تظهر كسمة `style="..."` في القالب، لذا تُركت كما هي
> ولم تُهاجر (تتطلب إعادة بناء منطق JS ليس مبرراً هنا).

---

## 3. فئات CSS الجديدة المُضافة في `<b:skin>`

أُضيفت قبل `]]></b:skin>` (نهاية السطر 305):

```css
.ba-msg{color:var(--muted);font-size:.85rem}
.ba-msg--pad{padding:.3rem 0}
.ba-icon-gap{margin-inline-end:.35rem}
```

---

## 4. خريطة الاستبدال (قبل ← بعد)

### 4.1 رسائل حالة البحث

**السطر 1812** (تحميل):
```js
// قبل
res.innerHTML='<p style="color:var(--muted);font-size:.85rem;padding:.3rem 0">جاري البحث...</p>';
// بعد
res.innerHTML='<p class="ba-msg ba-msg--pad">جاري البحث...</p>';
```

**السطر 1817** (لا توجد نتائج):
```js
// قبل
if(!data||!data.feed){res.innerHTML='<p style="color:var(--muted);font-size:.85rem">لا توجد نتائج</p>';return;}
// بعد
if(!data||!data.feed){res.innerHTML='<p class="ba-msg">لا توجد نتائج</p>';return;}
```

**السطر 1819** (لا توجد نتائج مطابقة):
```js
// قبل
if(!entries.length){res.innerHTML='<p style="color:var(--muted);font-size:.85rem">لا توجد نتائج مطابقة</p>';return;}
// بعد
if(!entries.length){res.innerHTML='<p class="ba-msg">لا توجد نتائج مطابقة</p>';return;}
```

**السطر 1849** (تعذّر البحث):
```js
// قبل
res.innerHTML='<p style="color:var(--muted);font-size:.85rem">تعذّر البحث — اضغط Enter للبحث الكامل</p>';
// بعد
res.innerHTML='<p class="ba-msg">تعذّر البحث — اضغط Enter للبححث الكامل</p>';
```

### 4.2 إزاحة أيقونة زر الإرسال

**السطران 2472 و 2476** (مطابقان تماماً — استُبدلا معاً عبر `replaceAll`):
```js
// قبل
'<i class="fas fa-paper-plane" style="margin-inline-end:.35rem" aria-hidden="true"></i>إرسال'
// بعد
'<i class="fas fa-paper-plane ba-icon-gap" aria-hidden="true"></i>إرسال'
```

---

## 5. التحقق (Verification)

| الفحص | النتيجة |
|---|---|
| عدد سمات `style="..."` المتبقية | **0** |
| وجود الفئات الجديدة في `<b:skin>` | ✅ (`ba-msg`, `ba-msg--pad`, `ba-icon-gap`) |
| صحة بنية XML (`xml.dom.minidom`) | ✅ well-formed |
| سلامة منطق JS | ✅ لم تتغير السلوكيات، فقط استبدال السمة بفئة |

---

## 6. الخلاصة

- تم ترحيل **100%** من السمات المضمنة المكتشفة (6/6) إلى فئات CSS.
- لم توجد أنماط ديناميكية (`<data:`) ولا أنماط حرجة تستوجب الإبقاء inline.
- لم تُعدَّل أي أنماط برمجية مضبوطة عبر `el.style`/`cssText` (خارج نطاق المهمة).
