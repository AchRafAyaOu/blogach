// Core Search: Live Search in Panel (Blogger Feed API)
// Extracted from core v16 script (lines 1778-1839)

(function(){
  'use strict';

  /* ── Live search in panel (Blogger Feed API) — المصدر الرئيسي للبحث ──
       يأخذ الأولوية على DOM-search في blogarch.js §12 عبر الراية أدناه
     ── */
  window._blogarchFeedSearchEnabled = true;

  var inp = document.getElementById('search-input');
  var res = document.getElementById('search-results');
  if(!inp || !res) return;

  var timer = null;
  var activeController = null;

  function doSearch(q){
    /* إلغاء أي طلب سابق لم يكتمل بعد — يمنع تراكب النتائج القديمة فوق الجديدة عند تكرار البحث بسرعة */
    if(activeController) activeController.abort();
    if(q.length < 2){ res.innerHTML = ''; return; }
    res.innerHTML = '<p style="color:var(--muted);font-size:.85rem;padding:.3rem 0">جاري البحث...</p>';
    activeController = ('AbortController' in window) ? new AbortController() : null;
    fetch('/feeds/posts/default?q=' + encodeURIComponent(q) + '&alt=json&max-results=8', activeController ? {signal: activeController.signal} : {})
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(data){
        if(!data || !data.feed){ res.innerHTML = '<p style="color:var(--muted);font-size:.85rem">لا توجد نتائج</p>'; return; }
        var entries = data.feed.entry || [];
        if(!entries.length){ res.innerHTML = '<p style="color:var(--muted);font-size:.85rem">لا توجد نتائج مطابقة</p>'; return; }
        /* XSS-safe: build search items via DOM, never innerHTML with API data */
        var frag = document.createDocumentFragment();
        entries.forEach(function(e){
          var title = e.title ? e.title.$t : '';
          var rawHref = ((e.link || []).find(function(l){ return l.rel === 'alternate'; }) || {href: '#'}).href;
          var href = (/^https?:\/\//.test(rawHref) || rawHref === '#') ? rawHref : '#';
          var summary = e.summary ? e.summary.$t.replace(/<[^>]+>/g, '').slice(0, 100) : '';
          var a = document.createElement('a');
          a.href = href; a.className = 'search-item';
          a.style.cssText = 'display:flex;align-items:flex-start;gap:.5rem;padding:.55rem .4rem;border-bottom:1px solid var(--border);color:var(--text);text-decoration:none;border-radius:6px;transition:background .15s';
          a.addEventListener('mouseover', function(){ this.style.background = 'var(--muted-bg)'; });
          a.addEventListener('mouseout', function(){ this.style.background = ''; });
          var ico = document.createElement('i');
          ico.className = 'fas fa-file-alt'; ico.setAttribute('aria-hidden', 'true');
          ico.style.cssText = 'color:var(--primary-color);font-size:.7rem;flex-shrink:0;margin-top:.3rem';
          var txt = document.createElement('span');
          txt.style.cssText = 'font-size:.9rem;line-height:1.5';
          txt.textContent = title;
          if(summary){
            var sm = document.createElement('small');
            sm.style.cssText = 'display:block;color:var(--muted);font-size:.78rem';
            sm.textContent = summary + '...';
            txt.appendChild(sm);
          }
          a.appendChild(ico); a.appendChild(txt); frag.appendChild(a);
        });
        res.textContent = ''; res.appendChild(frag);
      }).catch(function(err){
        if(err && err.name === 'AbortError') return; /* طلب مُلغى عمداً — ليس خطأ حقيقي */
        res.innerHTML = '<p style="color:var(--muted);font-size:.85rem">تعذّر البحث — اضغط Enter للبحث الكامل</p>';
      });
  }

  inp.addEventListener('input', function(){
    clearTimeout(timer);
    timer = setTimeout(function(){ doSearch(inp.value.trim()); }, 280);
  });

  inp.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      var q = inp.value.trim();
      if(q) window.location.href = '/search?q=' + encodeURIComponent(q);
    }
  });

})();