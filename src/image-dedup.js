// Image Deduplication: Remove Duplicate Featured Image from Post Body
// Extracted from inline script (lines 2901-2935)

(function(){
  'use strict';

  var featured = document.querySelector('.post-featured-image img');
  var body = document.getElementById('post-body');
  if(!featured || !body) return;

  /* تطبيع روابط صور Blogger: استخراج المعرّف الفريد للصورة (AVvXxxx...) بدل محاولة إزالة كل صيغ الحجم الممكنة */
  function normalize(url){
    if(!url) return '';
    var m = url.match(/AVvX[a-zA-Z0-9_-]+/);
    if(m) return m[0];
    /* رابط بلا معرّف Blogger (مثلاً صورة خارجية) — استخدم اسم الملف فقط كحل احتياطي */
    return url.split('?')[0].split('/').pop();
  }

  var featuredNorm = normalize(featured.src);
  if(!featuredNorm) return;

  var bodyImgs = body.querySelectorAll('img');
  for(var i = 0; i < bodyImgs.length; i++){
    var img = bodyImgs[i];
    if(normalize(img.src) === featuredNorm){
      /* أزل الصورة المكرّرة، وأزل حاوية .separator الفارغة إن وُجدت */
      var wrapper = img.closest('.separator') || img.closest('a');
      var toRemove = (wrapper && wrapper.parentElement === body) ? wrapper : img;
      /* إن كانت الصورة داخل رابط <a> داخل .separator، اصعد لأعلى غلاف فعلي */
      var outer = img.closest('.separator');
      if(outer){ toRemove = outer; }
      toRemove.parentNode.removeChild(toRemove);
      break; /* أول تطابق فقط — كافٍ لحل مشكلة التكرار الشائعة */
    }
  }
})();