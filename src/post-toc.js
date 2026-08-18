// Read-Time + TOC Auto-Build + Active Highlight
// Extracted from inline script (lines 2751-2834)
// Post-page only functionality

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  window.BlogArch._modules = window.BlogArch._modules || {};
  if (window.BlogArch._modules.postTocInitialized) return;
  window.BlogArch._modules.postTocInitialized = true;

  var body = document.getElementById('post-body');
  if(!body) return;

  /* ── 1) Read-Time (Arabic ~200 wpm) ── */
  try{
    var words = ((body.innerText || body.textContent || '').trim().match(/\S+/g) || []).length;
    var mins = Math.max(1, Math.round(words / 200));
    document.querySelectorAll('.read-time-val').forEach(function(s){ s.textContent = mins; });
  }catch(e){}

  /* ── 2) TOC: build from h2/h3 ── */
  var container = document.getElementById('toc-container');
  var nav = document.getElementById('toc-nav');
  if(!container || !nav) return;
  var heads = body.querySelectorAll('h2,h3');
  if(!heads.length){ container.style.display = 'none'; return; }

  function slug(s){
    return (s || '').toString().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF\-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 's';
  }

  var used = {}, anchors = [];
  Array.prototype.forEach.call(heads, function(h, i){
    if(!h.id){
      var b = slug(h.textContent) || ('s' + i), u = b, k = 2;
      while(used[u]){ u = b + '-' + (k++); }
      h.id = u;
    }
    used[h.id] = true;
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.setAttribute('data-t', h.id);
    if(h.tagName === 'H3') a.classList.add('toc-h3');
    nav.appendChild(a);
    anchors.push(a);
  });
  container.style.display = '';

  /* scroll مع مراعاة ارتفاع الهيدر — يعتمد الآن على scroll-margin-top في CSS بدل حساب JS يدوي */
  nav.addEventListener('click', function(e){
    var t = e.target.closest('[data-t]');
    if(!t) return;
    e.preventDefault();
    var el = document.getElementById(t.getAttribute('data-t'));
    if(!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + t.getAttribute('data-t'));
  });

  /* toggle */
  var toggle = document.getElementById('toc-toggle');
  if(toggle) toggle.addEventListener('click', function(){
    var c = container.classList.toggle('collapsed');
    toggle.setAttribute('aria-expanded', c ? 'false' : 'true');
  });

  /* active highlight */
  if('IntersectionObserver' in window){
    var byId = {}; anchors.forEach(function(a){ byId[a.getAttribute('data-t')] = a; });
    var cur = null;
    var observeHead = function(h){
      new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){
            var a = byId[en.target.id];
            if(a && a !== cur){ if(cur) cur.classList.remove('toc-active'); a.classList.add('toc-active'); cur = a; }
          }
        });
      }, { rootMargin: '-28% 0px -55% 0px', threshold: 0 }).observe(h);
    };
    Array.prototype.forEach.call(heads, observeHead);
  }
})();