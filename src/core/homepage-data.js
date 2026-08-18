// Core Homepage Data: JSON Loading + Rendering for Homepage
// Extracted from core v16 script (lines 2017-2182)
// Only runs on index page

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  if (window.BlogArch._modules && window.BlogArch._modules.homepageDataInitialized) {
      return;
  }
  window.BlogArch._modules = window.BlogArch._modules || {};
  window.BlogArch._modules.homepageDataInitialized = true;

  var isIndex = location.pathname === '/' || location.pathname === '/search' || location.pathname.indexOf('/search/label') === 0;
  if(!isIndex) return;

  var JSON_URL = 'https://cdn.jsdelivr.net/gh/AchRafAyaOu/blogs_arch@main/data/';

  /* ── جلب lessons.json و works.json و podcast.json — فقط إن وُجد عنصر هدف فعلي بالصفحة الحالية ── */
  if(document.getElementById('fin-learn-grid') || document.getElementById('fin-works-grid') ||
     document.getElementById('fin-podcast-grid') || document.getElementById('fin-podcast-ep-grid') ||
     document.getElementById('ba-sc-learn') || window._baSCPodcastCb){
    var _jv = (window.BlogArch && window.BlogArch.VERSION) || '20260619';
    Promise.all([
      fetch(JSON_URL + 'lessons.json?v=' + _jv).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }),
      fetch(JSON_URL + 'works.json?v=' + _jv).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }),
      fetch(JSON_URL + 'podcast.json?v=' + _jv).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; })
    ]).then(function(results){
      var lessonsData = results[0], worksData = results[1], podcastData = results[2];
      /* بيانات احتياطية للدروس إذا لم يوجد lessons.json على CDN بعد */
      if(!lessonsData || !lessonsData.length){
        lessonsData = [
          {id:1, title:'المفردات الأساسية', description:'أهم الكلمات الإنجليزية اليومية للمبتدئين', level:'beg', icon:'fas fa-book', githubPath:'lesson-01.html'},
          {id:2, title:'الجمل المفيدة', description:'جمل تستخدمها في محادثاتك اليومية', level:'beg', icon:'fas fa-comment-dots', githubPath:'lesson-02.html'},
          {id:3, title:'مهارات الاستماع', description:'تحسين الفهم عبر التدريب على الاستماع', level:'mid', icon:'fas fa-headphones', githubPath:'lesson-03.html'},
          {id:4, title:'القراءة السريعة', description:'تقنيات لزيادة سرعة القراءة وفهمها', level:'mid', icon:'fas fa-book-reader', githubPath:'lesson-04.html'},
          {id:5, title:'التعبير الكتابي', description:'مهارات الكتابة الأكاديمية والمهنية', level:'adv', icon:'fas fa-pen-nib', githubPath:'lesson-05.html'},
          {id:6, title:'المحادثة المتقدمة', description:'نقاشات وتعابير للمستوى المتقدم', level:'adv', icon:'fas fa-microphone-alt', githubPath:'lesson-06.html'}
        ];
      }
      window.lessonsData = lessonsData;
      window.podcastData = podcastData;
      if(lessonsData.length) window.renderLearn(lessonsData);
      if(worksData.length) window.renderWorks(worksData);
      if(podcastData.length) window.renderPodcast(podcastData);
      /* تمرير بيانات البودكاست لبطاقة "ابدأ من هنا" إذا كانت تنتظر */
      if(typeof window._baSCPodcastCb === 'function' && podcastData.length){
        window._baSCPodcastCb(podcastData);
      }
    });
  }

  /* ── Footer contact → /p/blog-page_05.html (رابط مباشر، لا يحتاج JS) ── */
  /* No JS needed */

  /* ── Active nav link ── */
  var path = location.pathname;
  document.querySelectorAll('.fin-sb-item, .nav-menu .nav-link, .mobile-drawer .nav-link').forEach(function(item){
    var href = item.getAttribute('href') || '';
    if(!href || href === 'javascript:void(0)') return;
    var isActive = false;
    if(href === '/' && (path === '/' || path === '/index.html')) isActive = true;
    else if(href !== '/search' && href !== '/' && path.indexOf(href) === 0) isActive = true;
    else if(href === '/search' && (path === '/search' || path.indexOf('/search/label') === 0)) isActive = true;
    if(isActive){ item.classList.add('active', 'fin-active'); item.setAttribute('aria-current', 'page'); }
  });

  /* ── Active nav by section (index only) ── */
  if(isIndex && 'IntersectionObserver' in window){
    var secs = [
      {id: 'home-section', href: '/'},
      {id: 'fin-quotes', href: '/p/blog-page_73.html'},
      {id: 'fin-podcast', href: '/p/blog-page_54.html'},
      {id: 'fin-learn', href: '/p/blog-page_52.html'},
      {id: 'fin-about', href: '/p/blog-page_7.html'}
    ];
    var navItems = document.querySelectorAll('.fin-sb-item');
    var secEls = secs.map(function(s){ return {el: document.getElementById(s.id), href: s.href}; }).filter(function(s){ return s.el; });
    function setActive(h){
      navItems.forEach(function(l){
        var lh = l.getAttribute('href');
        l.classList.toggle('fin-active', lh === h || (h === '/' && (lh === '/')));
      });
    }
    var secObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var f = secEls.find(function(s){ return s.el === e.target; });
          if(f) setActive(f.href);
        }
      });
    }, { threshold: .3, rootMargin: '-60px 0px -40% 0px' });
    secEls.forEach(function(s){ secObs.observe(s.el); });
  }

  /* ── Homepage posts filter — حدّ متجاوب: موبايل 2 / كمبيوتر 4 ── */
  (function(){
    var filterBar = document.getElementById('posts-filter-bar');
    var grid = document.getElementById('posts-grid');
    if(!filterBar || !grid) return;

    var cards = Array.from(grid.querySelectorAll('.post-card'));
    var labelSet = [];
    cards.forEach(function(card){
      var lbls = Array.from(card.querySelectorAll('.card-label')).map(function(l){ return l.textContent.trim(); });
      card.setAttribute('data-labels', lbls.join(','));
      lbls.forEach(function(t){ if(t && labelSet.indexOf(t) === -1) labelSet.push(t); });
    });

    /* أزرار التصفية */
    if(labelSet.length){
      labelSet.forEach(function(lbl){
        var btn = document.createElement('button');
        btn.className = 'posts-filter-btn'; btn.type = 'button';
        btn.setAttribute('data-filter', lbl); btn.textContent = lbl;
        filterBar.appendChild(btn);
      });
    }

    var currentFilter = 'all';

    /* الحد الأقصى للبطاقات الظاهرة في الرئيسية: 2 على الهاتف، 4 على الكمبيوتر */
    function getLimit(){ return window.innerWidth <= 768 ? 2 : 4; }

    /* تطبيق التصفية: إظهار أول N بطاقة مطابقة فقط حسب حجم الشاشة */
    function applyFilter(filter){
      var limit = getLimit();
      var shown = 0;
      cards.forEach(function(card){
        var lbls = card.getAttribute('data-labels') || '';
        var match = (filter === 'all') || (lbls.indexOf(filter) !== -1);
        var visible = match && shown < limit;
        if(visible) shown++;
        card.style.display = visible ? '' : 'none';
      });
    }

    /* حالة ابتدائية */
    applyFilter('all');

    filterBar.addEventListener('click', function(e){
      var btn = e.target.closest('.posts-filter-btn');
      if(!btn) return;
      currentFilter = btn.getAttribute('data-filter');
      filterBar.querySelectorAll('.posts-filter-btn').forEach(function(b){
        b.classList.toggle('active', b === btn);
      });
      applyFilter(currentFilter);
      grid.style.minHeight = '';
    });

    /* إعادة الحساب عند تغيير حجم النافذة */
    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){ applyFilter(currentFilter); }, 200);
    });
  })();

  /* ── Learn Modal — إغلاق ── */
  (function(){
    var modal = document.getElementById('fin-learn-modal');
    if(!modal) return;
    var modalOpener = null;
    function closeModal(){
      modal.classList.remove('open');
      document.body.style.overflow = '';
      var iframe = document.getElementById('fin-learn-iframe');
      if(iframe) iframe.src = '';
      try{ if(modalOpener && modalOpener.focus) modalOpener.focus(); }catch(_){}
      modalOpener = null;
    }
    var mo = new MutationObserver(function(){
      if(modal.classList.contains('open') && !modalOpener){
        modalOpener = (window.BlogArch.Drawer && window.BlogArch.Drawer._getLastFocus()) || document.activeElement;
      }
    });
    mo.observe(modal, {attributes: true, attributeFilter: ['class']});

    modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
    var closeBtn = document.getElementById('fin-learn-modal-close');
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e){
      if(modal.classList.contains('open')){
        if(e.key === 'Escape') closeModal();
        else if(window.BlogArch.Drawer && window.BlogArch.Drawer.trapFocus) window.BlogArch.Drawer.trapFocus(modal, e);
      }
    });
  })();

  /* ── بطاقة التعلم: تقدّم حيّ من localStorage (دمج ba-resume) ── */
  (function(){
    var card = document.getElementById('ba-sc-learn');
    if(!card) return;
    try {
      var saved = localStorage.getItem('ba_last_lesson');
      if(!saved) return;
      var d = JSON.parse(saved);
      var sub = document.getElementById('ba-sc-learn-sub');
      var barWrap = document.getElementById('ba-sc-learn-bar');
      var fillEl = document.getElementById('ba-sc-learn-fill');
      var pctEl = document.getElementById('ba-sc-learn-pct');
      var tags = document.getElementById('ba-sc-learn-tags');
      var linkEl = document.getElementById('ba-sc-learn-link');
      if(sub && d.title) sub.textContent = 'آخر درس: ' + d.title;
      var pct = Math.min(100, Math.max(0, d.progress || 0));
      if(barWrap) barWrap.style.display = '';
      if(fillEl) fillEl.style.width = pct + '%';
      if(pctEl) pctEl.textContent = pct + '%';
      if(tags) tags.style.display = 'none';
      if(linkEl && d.url){ linkEl.href = d.url; linkEl.innerHTML = 'متابعة <i class="fas fa-arrow-left"></i>'; }
    } catch(e){}
  })();

  /* ── بطاقة أحدث مقال: من Blogger Feed API ── */
  (function(){
    if(document.getElementById('ba-sc-article-sub')){
      fetch('/feeds/posts/default?alt=json&max-results=1')
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(data){
          var entry = data && data.feed && data.feed.entry && data.feed.entry[0];
          if(!entry) return;
          var sub = document.getElementById('ba-sc-article-sub');
          var meta = document.getElementById('ba-sc-article-meta');
          var linkEl = document.getElementById('ba-sc-article-link');
          var title = entry.title ? entry.title.$t : '';
          var href = ((entry.link || []).find(function(l){ return l.rel === 'alternate'; }) || {}).href || '/search';
          var label = (entry.category && entry.category[0] && entry.category[0].term) || '';
          var pub = entry.published ? new Date(entry.published.$t) : null;
          var ago = '';
          if(pub){
            var diff = Math.floor((Date.now() - pub) / 864e5);
            ago = diff === 0 ? 'اليوم' : diff === 1 ? 'أمس' : diff < 30 ? 'منذ ' + diff + ' يوم' :
                  diff < 365 ? 'منذ ' + Math.floor(diff/30) + ' شهر' : 'منذ ' + Math.floor(diff/365) + ' سنة';
          }
          if(sub) sub.textContent = title;
          if(meta){ meta.textContent = '';
            if(label){ var s = document.createElement('a'); s.textContent = label; s.href = '/search/label/' + encodeURIComponent(label); s.className = 'card-label'; meta.appendChild(s); }
            if(ago){ var s2 = document.createElement('span'); s2.textContent = ago; meta.appendChild(s2); }
          }
          if(linkEl && /^https?:\/\//.test(href)) linkEl.href = href;
        }).catch(function(){
          var sub = document.getElementById('ba-sc-article-sub');
          if(sub) sub.textContent = 'تصفح المقالات والمواضيع التقنية';
        });
    }
  })();

  /* ── بطاقة آخر حلقة بودكاست: من window.podcastData أو podcast.json ── */
  (function(){
    function fillPodcastCard(data){
      var ep = data && data[0];
      if(!ep) return;
      var sub = document.getElementById('ba-sc-podcast-sub');
      var meta = document.getElementById('ba-sc-podcast-meta');
      var linkEl = document.getElementById('ba-sc-podcast-link');
      if(sub) sub.textContent = ep.title || '';
      if(meta){ meta.textContent = '';
        if(ep.num){ var s = document.createElement('span'); s.textContent = 'الحلقة ' + ep.num; meta.appendChild(s); }
        if(ep.duration){ var s2 = document.createElement('span'); s2.textContent = ep.duration; meta.appendChild(s2); }
      }
      var url = ep.url || ep.link || '/p/blog-page_54.html';
      if(linkEl && /^https?:\/\//.test(url)){ linkEl.href = url; linkEl.target = '_blank'; linkEl.rel = 'noopener noreferrer'; }
    }
    if(window.podcastData && window.podcastData.length){ fillPodcastCard(window.podcastData); return; }
    window._baSCPodcastCb = fillPodcastCard;
  })();

  /* ── Label pills active state ── */
  (function(){
    var pills = document.querySelectorAll('#label-pills .pill, #label-pills .ba-pill');
    if(!pills.length) return;
    var labelMatch = location.pathname.match(/\/search\/label\/(.+)/);
    pills.forEach(function(p){ p.classList.remove('active'); });
    if(!labelMatch){
      var allPill = document.querySelector('#label-pills .pill[href], #label-pills .ba-pill[href]');
      if(allPill && (allPill.getAttribute('href') === '/' || allPill.getAttribute('href') === location.pathname)) allPill.classList.add('active');
      else { var first = document.querySelector('#label-pills .pill, #label-pills .ba-pill'); if(first) first.classList.add('active'); }
    } else {
      var label = decodeURIComponent(labelMatch[1]);
      pills.forEach(function(p){
        var h = p.getAttribute('href') || '';
        if(h.indexOf(encodeURIComponent(label)) !== -1 || h.indexOf(label) !== -1) p.classList.add('active');
      });
    }
  })();

})();