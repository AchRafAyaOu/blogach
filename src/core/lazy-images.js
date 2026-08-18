// Core Lazy Images: Lazy Image Fallback (before CDN JS loads)
// Extracted from core v16 script (lines 2236-2276)

(function(){
  'use strict';

  if(!('IntersectionObserver' in window)){
    /* Fallback: load all lazy images immediately */
    document.querySelectorAll('img.lazy[data-src]').forEach(function(img){
      img.src = img.getAttribute('data-src') || img.src;
      img.removeAttribute('data-src');
      img.classList.remove('lazy');
    });
    return;
  }

  var io = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      var img = en.target;
      var src = img.getAttribute('data-src');
      if(src){
        img.src = src;
        img.removeAttribute('data-src');
        img.onload = function(){
          img.classList.add('loaded');
          img.classList.remove('lazy');
        };
        img.onerror = function(){
          var wrapper = img.closest('.card-image-wrapper');
          if(wrapper) wrapper.classList.add('has-error');
        };
      }
      obs.unobserve(img);
    });
  }, { rootMargin: '200px 0px' });

  document.querySelectorAll('img.lazy[data-src]').forEach(function(img){ io.observe(img); });

  /* Re-observe dynamically added cards */
  if('MutationObserver' in window){
    new MutationObserver(function(){
      document.querySelectorAll('img.lazy[data-src]').forEach(function(img){
        if(!img._observed){ img._observed = true; io.observe(img); }
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();