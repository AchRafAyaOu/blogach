// Homepage UX: Scroll-Reveal + Card-Label Colors
// Extracted from inline script (lines 2837-2897)

(function(){
  'use strict';

  /* ─── 1) Scroll-reveal via IntersectionObserver ─────────────────────────
     يُضيف data-reveal تلقائياً لعناصر الصفحة الرئيسية ثم يُراقبها      */
  var REVEAL_SELS = [
    '.ba-hero-badge', '.ba-hero-desc', '.ba-hero-actions',
    '.ba-features-strip', '.ba-feature-item',
    '.ba-best-section .ba-section-head',
    '.ba-newsletter-section',
    '.footer-grid > *'
  ];

  if('IntersectionObserver' in window){
    REVEAL_SELS.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el, i){
        if(!el.hasAttribute('data-reveal')){
          el.setAttribute('data-reveal', '');
          if(i > 0 && i < 4) el.setAttribute('data-delay', String(i));
        }
      });
    });

    var revealIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add('r-in');
          revealIO.unobserve(en.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function(el){
      revealIO.observe(el);
    });
  }

  /* ─── 2) Card-label colour assignment ───────────────────────────────────
     يُعيّن لوناً لكل label بناءً على hash نص التصنيف (ثابت/متكرر)       */
  var COLOR_MAP = ['green', 'amber', 'coral', 'teal', 'violet'];

  /* خريطة يدوية للتصنيفات الشائعة — يُكملها الـ hash للباقي */
  var NAMED = {
    'تقنية': 'teal', 'تصميم': 'violet', 'تعلم': 'green',
    'برمجة': 'teal', 'ذكاء اصطناعي': 'violet', 'أعمال': 'amber',
    'تحليل': 'amber', 'بودكاست': 'coral', 'أخبار': 'coral',
    'tech': 'teal', 'design': 'violet', 'learn': 'green',
    'news': 'coral', 'podcast': 'coral', 'analysis': 'amber'
  };

  function strHash(s){
    var h = 0;
    for(var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
    return h;
  }

  document.querySelectorAll('.card-label').forEach(function(el){
    var txt = (el.textContent || '').trim().toLowerCase();
    var col = NAMED[txt] || COLOR_MAP[strHash(txt) % COLOR_MAP.length];
    el.setAttribute('data-color', col);
  });

})();