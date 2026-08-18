// Core Skeletons: Skeleton Loader Manager
// Extracted from core v16 script (lines 2186-2234)

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  window.BlogArch._modules = window.BlogArch._modules || {};
  if (window.BlogArch._modules.skeletonsInitialized) return;
  window.BlogArch._modules.skeletonsInitialized = true;

  var sk = document.getElementById('posts-skeleton');
  var pg = document.getElementById('posts-grid');
  if(!sk || !pg) return;

  /* إخفاء الـ grid الحقيقي مبدئياً */
  pg.style.opacity = '0';

  function revealGrid(){
    /* لا نُعيد ضبط display هنا — الفلتر يتولّى إظهار البطاقات */
    sk.classList.add('sk-hide');
    setTimeout(function(){
      sk.style.display = 'none';
      pg.classList.add('sk-reveal');
      pg.style.opacity = '';
    }, 360);
  }

  /* كشف فوري عند تحميل أول صورة (أو فوراً إن لا صور) */
  var imgs = pg.querySelectorAll('img');
  var revealed = false;

  function onImageLoad(){
    if(revealed) return;
    revealed = true;
    revealGrid();
  }

  if(imgs.length){
    /* فحص الصور المحملة مسبقاً */
    for(var i = 0; i < imgs.length; i++){
      if(imgs[i].complete && imgs[i].naturalWidth > 0){ onImageLoad(); break; }
    }
    if(!revealed){
      /* أول صورة تنتهي = كشف */
      imgs[0].addEventListener('load', onImageLoad);
      imgs[0].addEventListener('error', onImageLoad);
      /* احتياطي: 500ms كحد أقصى */
      setTimeout(function(){ if(!revealed){ revealed = true; revealGrid(); } }, 500);
    }
  } else {
    /* لا صور = كشف بعد frame واحد */
    requestAnimationFrame(function(){ revealGrid(); });
  }
})();