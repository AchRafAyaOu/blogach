// Core Renderers: Works/Learn/Podcast Rendering
// Extracted from core v16 script (lines 2036-2148)

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  window.BlogArch._modules = window.BlogArch._modules || {};
  if (window.BlogArch._modules.renderersInitialized) return;
  window.BlogArch._modules.renderersInitialized = true;

  var CDN = 'https://cdn.jsdelivr.net/gh/AchRafAyaOu/blogs_arch@main';

  /* ── Helpers: safe DOM creation (XSS-protected) ── */
  function _el(tag, cls, txt){ var e = document.createElement(tag); if(cls) e.className = cls; if(txt != null) e.textContent = txt; return e; }
  function _icon(faClass){ var i = document.createElement('i'); i.className = faClass || ''; i.setAttribute('aria-hidden', 'true'); return i; }
  function _safeUrl(u){
    if(!u) return '#';
    var s = String(u).trim();
    if(/^(javascript|data|vbscript):/i.test(s)) return '#';
    return s;
  }
  function _isExternal(u){ return /^https?:\/\//i.test(u || ''); }

  /* ── Works Renderer ── */
  window.renderWorks = function renderWorks(data){
    var grid = document.getElementById('fin-works-grid'); if(!grid) return;
    grid.textContent = '';
    data.slice(0, 3).forEach(function(w){
      var card = _el('div', 'fin-work-card');
      var iconWrap = _el('div', 'fin-work-icon-wrap');
      var iconBox = _el('div', 'fin-work-icon');
      iconBox.appendChild(_icon('fas ' + (w.icon || 'fa-rocket')));
      iconWrap.appendChild(iconBox);
      iconWrap.appendChild(_el('span', 'fin-work-tag arabic-text', w.tag || ''));
      card.appendChild(iconWrap);
      var body = _el('div', 'fin-work-body');
      body.appendChild(_el('h3', 'fin-work-title arabic-text', w.title || ''));
      body.appendChild(_el('p', 'fin-work-desc arabic-text', w.desc || ''));
      var url = _safeUrl(w.url);
      var link = _el('a', 'fin-work-link arabic-text', 'استكشف ');
      link.href = url;
      if(_isExternal(url)){ link.rel = 'noopener noreferrer'; link.target = '_blank'; }
      link.appendChild(_icon('fas fa-arrow-left'));
      body.appendChild(link);
      card.appendChild(body);
      grid.appendChild(card);
    });
    if(!grid.classList.contains('is-visible')) grid.classList.add('is-visible');
  };

  /* ── Learn Renderer (أساسي — يُستبدل بالنسخة المحسَّنة من blogarch.lessons.v2.1.js) ── */
  window.renderLearn = function renderLearn(data){
    var grid = document.getElementById('fin-learn-grid'); if(!grid) return;
    var LESSONS_GH = 'https://achrafayaou.github.io/english-lessons/lessons/';
    grid.textContent = '';
    data.slice(0, 6).forEach(function(l){
      var lessonUrl = _safeUrl(l.url || (l.githubPath ? LESSONS_GH + l.githubPath : '#'));
      var lvl = l.level || 'beg';
      var lvlLabel = lvl === 'beg' ? 'مبتدئ' : lvl === 'mid' ? 'متوسط' : 'متقدم';
      var title = l.title || '';

      /* card container */
      var card = _el('div', 'fin-learn-card arabic-text');
      card.setAttribute('data-level', lvl);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', title);
      var open = function(){ if(typeof finOpenLesson === 'function') finOpenLesson(lessonUrl, title); };
      card.addEventListener('click', open);
      card.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); } });

      /* header: gradient icon + level badge */
      var hdr = _el('div', 'fin-learn-card-header');
      var iconBox = _el('div', 'fin-learn-icon');
      iconBox.appendChild(_icon('fas ' + (l.icon || 'fa-book')));
      hdr.appendChild(iconBox);
      hdr.appendChild(_el('span', 'fin-learn-level ' + lvl, lvlLabel));
      card.appendChild(hdr);

      /* content: title + subtitle */
      var cnt = _el('div', 'fin-learn-content');
      cnt.appendChild(_el('p', 'fin-learn-title', title));
      cnt.appendChild(_el('p', 'fin-learn-sub', l.desc || l.subtitle || ''));
      card.appendChild(cnt);

      /* footer meta: action label */
      var meta = _el('div', 'fin-learn-meta');
      var action = _el('span', 'fin-learn-action');
      action.appendChild(document.createTextNode('ابدأ الدرس '));
      action.appendChild(_icon('fas fa-arrow-left'));
      meta.appendChild(action);
      card.appendChild(meta);

      /* bottom progress bar */
      var prog = _el('div', 'fin-card-progress');
      prog.appendChild(_el('div', 'fin-card-progress-fill'));
      card.appendChild(prog);

      grid.appendChild(card);
    });
    if(!grid.classList.contains('is-visible')) grid.classList.add('is-visible');
  };

  /* ── Podcast Renderer ── */
  window.renderPodcast = function renderPodcast(data){
    var grid = document.getElementById('fin-podcast-grid'); if(!grid) return;
    grid.textContent = '';
    data.slice(0, 4).forEach(function(ep){
      var item = _el('div', 'fin-podcast-ep');
      var art = _el('div', 'fin-podcast-ep-art');
      art.appendChild(_icon(ep.icon || 'fas fa-podcast'));
      art.appendChild(_el('span', 'fin-podcast-ep-num', ep.num || ''));
      item.appendChild(art);
      var body = _el('div', 'fin-podcast-ep-body');
      var cat = _el('div', 'fin-podcast-ep-cat');
      var dot = _icon('fas fa-circle'); dot.style.fontSize = '.4rem'; cat.appendChild(dot);
      cat.appendChild(document.createTextNode(' ' + (ep.category || 'عام')));
      body.appendChild(cat);
      body.appendChild(_el('p', 'fin-podcast-ep-title', ep.title || ''));
      body.appendChild(_el('p', 'fin-podcast-ep-desc', ep.desc || ''));
      var foot = _el('div', 'fin-podcast-ep-footer');
      var dur = _el('span', 'fin-podcast-ep-dur');
      dur.appendChild(_icon('fas fa-clock'));
      dur.appendChild(document.createTextNode(' ' + (ep.duration || '')));
      foot.appendChild(dur);
      var play = _el('a', 'fin-podcast-ep-play');
      play.href = _safeUrl(ep.url || ep.link); play.target = '_blank'; play.rel = 'noopener noreferrer';
      play.appendChild(_icon('fas fa-play'));
      play.appendChild(document.createTextNode(' استمع'));
      foot.appendChild(play);
      body.appendChild(foot);
      item.appendChild(body);
      grid.appendChild(item);
    });
    grid.classList.add('is-visible');
  };

  /* ── Expose via window.BlogArch.Renderers (sub-namespace) ──
     تُبقى window.render* كـ aliases للتوافق مع homepage-data.js */
  window.BlogArch.Renderers = window.BlogArch.Renderers || {};
  window.BlogArch.Renderers.renderWorks  = window.renderWorks;
  window.BlogArch.Renderers.renderLearn  = window.renderLearn;
  window.BlogArch.Renderers.renderPodcast = window.renderPodcast;

})();