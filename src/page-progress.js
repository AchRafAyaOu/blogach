// Page Progress Bar
// Extracted from inline script (lines 2938-2970)

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  window.BlogArch._modules = window.BlogArch._modules || {};
  if (window.BlogArch._modules.pageProgressInitialized) return;
  window.BlogArch._modules.pageProgressInitialized = true;

  var bar = document.getElementById('page-progress');
  if(!bar) return;

  /* عند اكتمال تحميل الصفحة الحالية: أنهِ الشريط إن كان ظاهراً (وصلنا للصفحة الجديدة فعلاً) */
  window.addEventListener('pageshow', function(){
    bar.classList.remove('active');
    bar.classList.add('done');
    setTimeout(function(){ bar.classList.remove('done'); bar.style.width = ''; }, 300);
  });

  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href]');
    if(!a) return;
    if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if(a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if(!href || href.charAt(0) === '#') return;
    /* روابط داخلية فقط (نفس الأصل) */
    try{
      var url = new URL(a.href, location.href);
      if(url.origin !== location.origin) return;
      if(url.pathname === location.pathname && url.search === location.search) return; /* نفس الصفحة */
    }catch(_){ return; }
    bar.classList.remove('done');
    /* يبدأ فوراً بعرض بسيط ثم يتمدّد بسلاسة نحو 78% ريثما يتم التنقل الفعلي */
    requestAnimationFrame(function(){ bar.classList.add('active'); });
  });
})();