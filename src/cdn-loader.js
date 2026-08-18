// CDN Loader, Error Handler, Lazy/LP Boost
// Extracted from inline script (lines 197-263)
// Loads via window.BlogArch.ASSETS with defer

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  if (window.BlogArch._modules && window.BlogArch._modules.cdnLoaderInitialized) {
      return;
  }
  window.BlogArch._modules = window.BlogArch._modules || {};
  window.BlogArch._modules.cdnLoaderInitialized = true;

  /* ── Defensive: تصفية أخطاء null-property من سكريبتات CDN / ويدجت Blogger ── */
  window.addEventListener('error', function(e){
    if(!e || !e.message || !e.filename) return;
    var isNullErr = /Cannot read prop|null is not|of null|of undefined/.test(e.message);
    var isExternal = !/blogger\.com|blogspot\.com|googleapis\.com/.test(e.filename);
    if(isNullErr && isExternal){ e.preventDefault(); return true; }
  }, true);

  /* ── CDN loader (sequential, deterministic order) ── */
  (function(){
    var CDN_BASE = window.BlogArch.CDN_BASE;
    var VERSION  = window.BlogArch.VERSION;
    var ASSETS   = window.BlogArch.ASSETS;

    /* CSS: keep preload→stylesheet pattern (order-independent) */
    ASSETS.css.forEach(function(file){
      var link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.crossOrigin = 'anonymous';
      link.href = CDN_BASE + file + '?' + VERSION;
      link.onload = function(){ this.rel = 'stylesheet'; this.onload = null; };
      document.head.appendChild(link);
    });

    /* JS: load sequentially with Promises to guarantee execution order */
    function loadScript(url){
      return new Promise(function(resolve, reject){
        var script = document.createElement('script');
        script.src = url + '?' + VERSION;
        script.async = false; // preserve order
        script.onload = resolve;
        script.onerror = function(){ reject(new Error('Failed to load: ' + url)); };
        document.body.appendChild(script);
      });
    }

    function loadAllScripts(urls){
      var chain = Promise.resolve();
      urls.forEach(function(url){
        chain = chain.then(function(){ return loadScript(url); });
      });
      return chain;
    }

    if(ASSETS.js && ASSETS.js.length){
      loadAllScripts(ASSETS.js.map(function(f){ return CDN_BASE + f; }))
        .catch(function(err){ /* defensive: ignore external load errors */ if(window.console) console.warn(err.message); });
    }
  })();

  /* ── Auto lazy: يُضيف loading="lazy" لأي صورة تفتقد الخاصية ── */
  (function(){
    function stampLazy(){
      document.querySelectorAll('img:not([loading])').forEach(function(img){
        img.setAttribute('loading','lazy');
      });
    }
    stampLazy();
    if(document.readyState !== 'loading'){
      stampLazy();
    } else {
      document.addEventListener('DOMContentLoaded', stampLazy);
    }

    /* ── LCP boost: أول صورة في شبكة المقالات هي عنصر LCP — ترقية إلى eager+high ── */
    document.addEventListener('DOMContentLoaded', function(){
      var lcpImg = document.querySelector(
        '.ba-best-grid .card-image, .ba-best-grid .card-image-wrapper img'
      );
      if(lcpImg){
        lcpImg.setAttribute('loading','eager');
        lcpImg.setAttribute('fetchpriority','high');
        lcpImg.setAttribute('decoding','auto');
        if(lcpImg.dataset.src && !lcpImg.src){ lcpImg.src = lcpImg.dataset.src; }
      }
    });
  })();
})();