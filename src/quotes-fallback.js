// Quotes Rotator Fallback
// Extracted from inline script (lines 2467-2577)
// Runs immediately, superseded by blogarch.js §14 if CDN loads

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  window.BlogArch._modules = window.BlogArch._modules || {};
  if (window.BlogArch._modules.quotesFallbackInitialized) return;
  window.BlogArch._modules.quotesFallbackInitialized = true;

  var CDN = 'https://cdn.jsdelivr.net/gh/AchRafAyaOu/blogs_arch@main';
  var quotesEl  = document.getElementById('fin-quote-text');
  var sourceEl  = document.getElementById('fin-quote-source');
  var dotsEl    = document.getElementById('fin-quote-dots');
  var prevBtn   = document.getElementById('fin-quote-prev');
  var nextBtn   = document.getElementById('fin-quote-next');
  if(!quotesEl || !sourceEl) return;

  var quotes = [];
  var idx = 0;
  var autoTimer = null;

  function renderDots(){
    if(!dotsEl) return;
    dotsEl.innerHTML = '';
    quotes.forEach(function(_, i){
      var d = document.createElement('button');
      d.className = 'fin-quote-dot' + (i === idx ? ' active' : '');
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'مقولة ' + (i+1));
      d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      d.addEventListener('click', function(){ goTo(i); });
      dotsEl.appendChild(d);
    });
  }

  function show(i, animate){
    if(!quotes.length) return;
    idx = ((i % quotes.length) + quotes.length) % quotes.length;
    var q = quotes[idx];
    if(animate !== false){
      quotesEl.style.opacity = '0'; sourceEl.style.opacity = '0';
      setTimeout(function(){
        quotesEl.textContent = q.text || q.quote || '';
        sourceEl.textContent = '\u2014 ' + (q.author || q.source || '');
        quotesEl.style.opacity = '1'; sourceEl.style.opacity = '1';
      }, 320);
    } else {
      quotesEl.textContent = q.text || q.quote || '';
      sourceEl.textContent = '\u2014 ' + (q.author || q.source || '');
    }
    renderDots();
  }

  function goTo(i){ clearTimeout(autoTimer); show(i, true); startAuto(); }
  function startAuto(){
    clearTimeout(autoTimer);
    autoTimer = setTimeout(function(){ show(idx+1, true); startAuto(); }, 5500);
  }

  /* Swipe support */
  var swipeX = 0;
  var box = document.querySelector('.fin-quote-box');
  if(box){
    box.addEventListener('touchstart', function(e){ swipeX = e.touches[0].clientX; }, {passive:true});
    box.addEventListener('touchend', function(e){
      var dx = e.changedTouches[0].clientX - swipeX;
      if(Math.abs(dx) > 45){ goTo(idx + (dx > 0 ? 1 : -1)); }
    }, {passive:true});
  }
  if(prevBtn) prevBtn.addEventListener('click', function(){ goTo(idx-1); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ goTo(idx+1); });

  /* Keyboard */
  var qSection = document.getElementById('fin-quotes');
  if(qSection){
    qSection.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); goTo(idx-1); }
      if(e.key === 'ArrowLeft'  || e.key === 'ArrowDown'){ e.preventDefault(); goTo(idx+1); }
    });
    qSection.setAttribute('tabindex', '0');
  }

  /* Fetch quotes.json */
  function loadQuotes(){
    fetch(CDN + '/data/quotes.json?v=' + (window.BlogArch && window.BlogArch.VERSION || '20260601'))
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(data){
        if(!data || !data.length) throw new Error('empty');
        quotes = data;
        /* shuffle for variety */
        for(var i = quotes.length-1; i > 0; i--){
          var j = Math.floor(Math.random() * (i+1));
          var t = quotes[i]; quotes[i] = quotes[j]; quotes[j] = t;
        }
        show(0, false);
        startAuto();
        window._quotesLoaded = true;
      })
      .catch(function(){
        /* Hardcoded fallback quotes */
        quotes = [
          {text:'العلم في الصغر كالنقش على الحجر.', author:'الحكمة العربية'},
          {text:'من لا يقرأ لا يحكم على ما يجهل.', author:'مجهول'},
          {text:'الكلمة الطيبة صدقة.', author:'الحديث النبوي'},
          {text:'لا تيأس فإن اليأس بداية الهزيمة.', author:'ابن تيمية'}
        ];
        show(0, false);
        startAuto();
      });
  }

  /* Wait for DOM + FontAwesome, then load */
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', loadQuotes);
  } else {
    loadQuotes();
  }
})();