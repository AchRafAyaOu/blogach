# P0_SUBPLAN.md

## 1. قائمة الملفات في مجلد `src/` التي تحتاج إلى تعديل

تشمل الملفات التالية في مجلد `src/` والتي تتطلب تعديلات كجزء من مهام الأولوية P0:

1.  `/home/achraf/code/blogxml/src/core/drawer.js`
2.  `/home/achraf/code/blogxml/src/core/homepage-data.js`
3.  `/home/achraf/code/blogxml/src/core/theme.js`
4.  `/home/achraf/code/blogxml/src/cdn-loader.js`
5.  **جميع الوحدات المستخرجة (20 ملفًا):**
    *   `/home/achraf/code/blogxml/src/mini-cards.js`
    *   `/home/achraf/code/blogxml/src/core/lazy-images.js`
    *   `/home/achraf/code/blogxml/src/core/theme.js` (مدرج أعلاه)
    *   `/home/achraf/code/blogxml/src/core/search.js`
    *   `/home/achraf/code/blogxml/src/core/drawer.js` (مدرج أعلاه)
    *   `/home/achraf/code/blogxml/src/core/skeletons.js`
    *   `/home/achraf/code/blogxml/src/core/clickable-cards.js`
    *   `/home/achraf/code/blogxml/src/core/forms.js`
    *   `/home/achraf/code/blogxml/src/core/renderers.js`
    *   `/home/achraf/code/blogxml/src/core/homepage-data.js` (مدرج أعلاه)
    *   `/home/achraf/code/blogxml/src/newsletter.js`
    *   `/home/achraf/code/blogxml/src/page-progress.js`
    *   `/home/achraf/code/blogxml/src/web-share.js`
    *   `/home/achraf/code/blogxml/src/cdn-loader.js` (مدرج أعلاه)
    *   `/home/achraf/code/blogxml/src/lightbox.js`
    *   `/home/achraf/code/blogxml/src/homepage-ux.js`
    *   `/home/achraf/code/blogxml/src/breadcrumb-jsonld.js`
    *   `/home/achraf/code/blogxml/src/image-dedup.js`
    *   `/home/achraf/code/blogxml/src/post-toc.js`
    *   `/home/achraf/code/blogxml/src/navbar-ux.js`
    *   `/home/achraf/code/blogxml/src/quotes-fallback.js`

بالإضافة إلى ذلك، يجب تعديل ملف القالب الرئيسي `Blogarch_lite_audited-3.xml`.

## 2. التعديلات المحددة المطلوبة لكل ملف

### `Blogarch_lite_audited-3.xml`

*   **العودة إلى الوضع السابق:** أولاً، يجب استعادة هذا الملف إلى نسخته الاحتياطية `Blogarch_lite_audited-3.xml.backup` لضمان نقطة بداية نظيفة.
*   **إزالة JavaScript المضمن:**
    *   تحديد وإزالة جميع كتل `<script>` المضمنة التي تم استخراجها كملفات منفصلة في `src/`.
    *   **الإبقاء على السكريبتات الحرجة المضمنة التالية فقط:**
        1.  تكوين `window.BlogArch` (الأساسي، حوالي الأسطر 175-195).
        2.  سكريبت Anti-FOUC (منع وميض تغيير الثيم، حوالي الأسطر 291-310).
        3.  سكريبت Article JSON-LD (حوالي الأسطر 3017-3050).
        4.  الدالة العامة `finOpenLesson` (حوالي الأسطر 2297-2326).
        5.  سكريبتات ودجات Blogger الأساسية (مثل نظام التعليقات، والتي توجد عادة في أجزاء مختلفة من القالب).
*   **تحديث `window.BlogArch.ASSETS.js`:** تحديث مصفوفة `js` ضمن `window.BlogArch.ASSETS` لتعكس المسارات الصحيحة لجميع الوحدات الـ 20 الجديدة في `src/`.

### `src/core/drawer.js`

*   **إصلاح ReferenceError:** تعديل الوحدة لتصدير أو توفير وصول متحكم فيه إلى المتغيرين `_lastFocus` و `trapFocus` بحيث يمكن لوحدات أخرى مثل `homepage-data.js` استخدامهما. يمكن تحقيق ذلك عن طريق:
    *   إرفاق `_lastFocus` و `trapFocus` بكائن فرعي محدد ضمن `window.BlogArch`، على سبيل المثال `window.BlogArch.Drawer = { open: function() {...}, close: function() {...}, _lastFocus: null, trapFocus: function() {...} }`.
    *   تعديل الدوال التي تحتاج إلى هذه المتغيرات (مثل وظيفة إغلاق المودال) لاستخدام `window.BlogArch.Drawer._lastFocus` و `window.BlogArch.Drawer.trapFocus`.
*   **إضافة init guard:** إضافة شرط في بداية الوحدة لمنع التنفيذ المزدوج، مثل:
    ```javascript
    if (window.BlogArch && window.BlogArch.Drawer && window.BlogArch.Drawer._isInitialized) {
        return;
    }
    // ... code ...
    window.BlogArch = window.BlogArch || {};
    window.BlogArch.Drawer = window.BlogArch.Drawer || {};
    window.BlogArch.Drawer._isInitialized = true;
    ```
    (أو إنشاء كائن `window._baModule` منفصل لتتبع تهيئة الوحدات إذا لم تكن الدوال جزءًا من API عام).

### `src/core/homepage-data.js`

*   **إصلاح ReferenceError:** تعديل منطق إغلاق مودال "تعلم" (`learn-modal`) لاستدعاء `trapFocus` والوصول إلى `_lastFocus` من خلال واجهة `drawer.js` المكشوفة (على سبيل المثال، `window.BlogArch.Drawer._lastFocus` و `window.BlogArch.Drawer.trapFocus`).
*   **إزالة الشيفرة الميتة (P3):** إزالة المتغير `_origAddOpen` (خط 159). يمكن إنجاز هذا الآن لتجنب أي ديون تقنية مستقبلية.
*   **إضافة init guard:** إضافة شرط في بداية الوحدة لمنع التنفيذ المزدوج.

### `src/core/theme.js`

*   **استعادة مستمع `resize`:** إعادة إضافة مستمع لحدث تغيير حجم النافذة (resize event listener) الذي يعيد توليد حقول النجوم (`buildStars`) عند تغيير حجم النافذة في الوضع الداكن، كما كان في الشيفرة المضمنة الأصلية. يجب أن تكون الدالة `buildStars` قابلة للاستدعاء، على سبيل المثال، عبر `window.BlogArch.Theme.buildStars()`.
*   **مواءمة API:** التأكد من أن `buildStars` يمكن استدعاؤها من خلال `window.BlogArch.Theme.buildStars` إذا كانت مطلوبة خارج نطاق الوحدة.
*   **إضافة init guard:** إضافة شرط في بداية الوحدة لمنع التنفيذ المزدوج.

### `src/cdn-loader.js`

*   **ضمان ترتيب التحميل:** تعديل منطق تحميل السكريبتات لضمان الترتيب الحتمي للتنفيذ. بدلاً من الاعتماد على `script.defer = true` (الذي يُتجاهل للسكريبتات المُضافة ديناميكيًا)، يجب تحميل السكريبتات بالتسلسل. يمكن تحقيق ذلك عن طريق:
    *   استخدام سلسلة من `Promises` أو استدعاءات `onload` لضمان تحميل كل سكريبت وتنفيذه قبل بدء تحميل السكريبت التالي.
    *   مثال (مفهوم):
        ```javascript
        function loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                // script.async = false; // قد يكون له تأثير في بعض المتصفحات
                document.body.appendChild(script);
            });
        }

        async function loadAllScripts(urls) {
            for (const url of urls) {
                await loadScript(url);
            }
        }

        // استخدام: loadAllScripts(ASSETS.js).then(() => console.log('All JS loaded'));
        ```
*   **إضافة init guard:** إضافة شرط في بداية الوحدة لمنع التنفيذ المزدوج.

### جميع الوحدات المستخرجة الـ 20 (`src/**/*.js`)

*   **إضافة init guards:** لكل ملف وحدة، أضف شرطًا في بدايته لمنع التنفيذ المزدوج، مع استخدام متغير عام فريد لكل وحدة. على سبيل المثال:
    ```javascript
    // في src/core/search.js
    if (window.BlogArch && window.BlogArch._modules && window.BlogArch._modules.searchInitialized) {
        return;
    }
    // ... code ...
    window.BlogArch = window.BlogArch || {};
    window.BlogArch._modules = window.BlogArch._modules || {};
    window.BlogArch._modules.searchInitialized = true;
    ```
*   **مراجعة تلوث `window.BlogArch`:** قم بمراجعة كل وحدة بعناية.
    *   تأكد من أن الدوال والمتغيرات التي لم تكن عامة في الشيفرة المضمنة الأصلية تبقى خاصة بنطاق الوحدة أو يتم إرفاقها بكائن فرعي محدد ضمن `window.BlogArch` إذا كانت ضرورية للاتصال بين الوحدات.
    *   تجنب إرفاق `window.render*` أو `window.openDrawer` مباشرة بـ `window`. بدلاً من ذلك، استخدم أسلوب الكائن الفرعي: `window.BlogArch.Renderers.renderWorks()` أو `window.BlogArch.Drawer.open()`.

## 3. الترتيب المنطقي لتعديل هذه الملفات وتحميلها

### الخطوة 1: التحضير الأولي (محليًا)

1.  **العودة إلى النسخة الاحتياطية:** ارجع ملف `Blogarch_lite_audited-3.xml` إلى نسخته الاحتياطية `Blogarch_lite_audited-3.xml.backup`. هذا يضمن أننا نبدأ من حالة وظيفية معروفة.
2.  **إنشاء `P0_SUBPLAN.md`:** (هذه الخطوة قيد التنفيذ حاليًا).

### الخطوة 2: صقل الوحدات (محليًا وتكراريًا)

قم بتعديل ملفات JavaScript في `src/` بالترتيب التالي، مع إجراء التحقق بعد كل تعديل رئيسي:

1.  **`src/core/drawer.js`:**
    *   نفذ تعديلات `_lastFocus` و `trapFocus` وإضافة init guard.
    *   **التحقق:** (لا يمكن التحقق بالكامل إلا بعد الخطوات اللاحقة).
2.  **`src/core/homepage-data.js`:**
    *   نفذ تعديلات استخدام `_lastFocus` و `trapFocus` (من `drawer.js`) وإضافة init guard وإزالة الشيفرة الميتة.
    *   **التحقق:** (لا يمكن التحقق بالكامل إلا بعد الخطوات اللاحقة).
3.  **`src/core/theme.js`:**
    *   أضف مستمع `resize` وأضف init guard.
    *   **التحقق:** (لا يمكن التحقق بالكامل إلا بعد الخطوات اللاحقة).
4.  **جميع الوحدات الـ 20 المتبقية في `src/`:**
    *   لكل وحدة، أضف init guard.
    *   راجع الوحدة للتأكد من أنها لا تلوث `window` أو `window.BlogArch` بشكل غير مقصود (باستثناء الواجهة البرمجية المحددة المطلوبة).
5.  **`src/cdn-loader.js`:**
    *   عدل منطق تحميل السكريبت لفرض الترتيب التسلسلي.
    *   أضف init guard.

### الخطوة 3: تحديث قالب XML (محليًا)

1.  **`Blogarch_lite_audited-3.xml`:**
    *   إزالة جميع كتل `<script>` المضمنة للوحدات التي تم استخراجها وتعديلها (مع الإبقاء على الخمسة الحرجة المذكورة أعلاه).
    *   تحديث مصفوفة `window.BlogArch.ASSETS.js` في القالب.

### الخطوة 4: النشر والتحقق الشامل

1.  **رفع الوحدات إلى CDN:** قم برفع جميع ملفات JavaScript المعدلة في `src/` إلى مستودع GitHub الخاص بك (مثل `AchRafAyaOu/blogs_arch`) بحيث تصبح متاحة عبر jsDelivr CDN.
2.  **نشر القالب:** قم بنشر ملف `Blogarch_lite_audited-3.xml` المحدّث إلى Blogger.
3.  **التحقق الشامل (في بيئة حية):**
    *   افحص وحدة تحكم المتصفح (browser console) بحثًا عن أخطاء HTTP 404 لملفات JS.
    *   تحقق من أن جميع الميزات (النافبار، الدرج الجانبي، البحث، مبدل الثيمات، النماذج، المودالات، الصور البطيئة التحميل، التحميلات الهيكلية، إلخ) تعمل بشكل صحيح على كل من الأجهزة المحمولة والمكتبية.
    *   تأكد من عدم وجود تنفيذ مزدوج لأي وظيفة (على سبيل المثال، تبديل الثيمات مرة واحدة بدلاً من مرتين).
    *   تحقق من عمل Learn Modal بشكل صحيح، بما في ذلك استعادة التركيز.
    *   تأكد من أن النجوم في الوضع الداكن تتجدد عند تغيير حجم النافذة.
    *   افحص `window.BlogArch` في وحدة تحكم المتصفح للتأكد من عدم وجود خصائص غير مقصودة أو تلوث.

## 4. كيفية ضمان عدم تلويث `window.BlogArch`

لضمان عدم تلويث الكائن العام `window.BlogArch` إلا بالواجهات البرمجية (APIs) الضرورية والمتحكم بها، سنتبع المبادئ التالية:

*   **الكشف الصريح عن API:** فقط الدوال والمتغيرات التي يجب أن تكون متاحة عالميًا للاتصال بين الوحدات أو من الشيفرة الخارجية يجب أن تُرفق بـ `window.BlogArch`.
*   **استخدام كائنات فرعية (Sub-Objects):** بدلاً من إرفاق دوال مباشرة بـ `window.BlogArch` (مثل `window.BlogArch.openDrawer`)، سنستخدم كائنات فرعية منطقية لتجميع الوظائف ذات الصلة. على سبيل المثال:
    *   `window.BlogArch.Drawer = { open: function() {...}, close: function() {...}, _lastFocus: null, trapFocus: function() {...} }`
    *   `window.BlogArch.Theme = { apply: function() {...}, setThemeMode: function() {...}, buildStars: function() {...} }`
    *   `window.BlogArch.Renderers = { works: function() {...}, learn: function() {...}, podcast: function() {...} }`
*   **التأهيل باستخدام `window.BlogArch._modules`:** بالنسبة لـ "init guards"، سنستخدم كائنًا داخليًا محددًا مثل `window.BlogArch._modules` لتتبع حالة تهيئة كل وحدة. هذا يحافظ على فصل آليات التحكم الداخلي عن واجهة API العامة.
*   **المراجعة الصارمة:** أثناء مراجعة كل وحدة، سنتأكد من عدم وجود أي تعيينات مباشرة لـ `window` أو `window.BlogArch` لم يتم تحديدها بوضوح كجزء من واجهة API المطلوبة. ستظل المتغيرات والدوال المحلية محصورة داخل نطاق IIFE (Immediately Invoked Function Expression) للوحدة.

من خلال تطبيق هذه الإرشادات، سنضمن بقاء `window.BlogArch` منظمًا، خاليًا من التلوث غير الضروري، ويقدم واجهة برمجية متسقة يمكن الاعتماد عليها. 