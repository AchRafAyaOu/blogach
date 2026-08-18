// Core Theme: Theme/Dark Mode Logic
// Extracted from core v16 script (lines 1428-2185)

(function(){
  'use strict';

  /* ── Load saved prefs ── */
  var savedTheme = localStorage.getItem('ba-theme') || 'default';

  /* ── Detect system dark mode ── */
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  /* themeMode: 'light' | 'dark' — أوتوماتيكي خفي في أول زيارة فقط */
  var themeMode = localStorage.getItem('ba-theme-mode') || (prefersDark ? 'dark' : 'light');

  /* أول زيارة: احفظ الوضع المستنتج من المتصفح */
  if(!localStorage.getItem('ba-theme-mode')){
    localStorage.setItem('ba-theme-mode', themeMode);
  }

  /* ── Resolve dark from mode ── */
  function resolveDark(mode){ return mode === 'dark'; }
  var savedDark = resolveDark(themeMode);

  /* ── Apply theme + dark ── */
  function applyTheme(theme, dark){
    if(theme === 'default') document.body.removeAttribute('data-theme');
    else document.body.setAttribute('data-theme', theme);

    if(dark){
      document.body.setAttribute('data-dark', '');
      document.body.classList.add('dark-mode');
      document.body.removeAttribute('data-light');
    } else {
      document.body.removeAttribute('data-dark');
      document.body.classList.remove('dark-mode');
      /* data-light يمنع @media(prefers-color-scheme:dark) من التطبيق */
      if(themeMode === 'light'){
        document.body.setAttribute('data-light', '');
      } else {
        document.body.removeAttribute('data-light');
      }
    }

    /* sync navbar theme-icon + aria-label (2-mode: moon=dark / sun=light) */
    var isDark = dark;
    var themeBtn = document.getElementById('theme-toggle');
    var themeIcon = document.getElementById('theme-icon');
    var modeLabel = isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن';
    var modeIcon = isDark ? 'fas fa-moon' : 'fas fa-sun';
    if(themeIcon) themeIcon.className = modeIcon;
    if(themeBtn){
      themeBtn.setAttribute('aria-label', modeLabel);
      themeBtn.classList.toggle('theme-btn--dark', !!isDark);
    }

    /* stars */
    if(isDark) buildStars();
    else { var sc = document.getElementById('fin-stars'); if(sc) sc.innerHTML = ''; }

    var mc = document.getElementById('meta-theme-color');
    if(mc) mc.setAttribute('content', dark ? '#0d1b2a' : '#4361ee');
  }

  /* Initial */
  applyTheme(savedTheme, savedDark);

  /* System dark mode changes — تحديث meta-theme-color فوراً عند تغيُّر إعداد النظام */
  if(window.matchMedia){
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e){
      prefersDark = e.matches;
      /* إذا لم يختر المستخدم وضعاً يدوياً، بدِّل المظهر تلقائياً مع تحديث لون الـ toolbar */
      if(!localStorage.getItem('ba-theme-mode')){
        themeMode = prefersDark ? 'dark' : 'light';
        savedDark = resolveDark(themeMode);
        applyTheme(savedTheme, savedDark);
      } else {
        /* حتى لو كان الاختيار يدوياً، حدِّث meta-theme-color ليعكس الوضع الفعلي الحالي */
        var mc = document.getElementById('meta-theme-color');
        var curDark = document.body.classList.contains('dark-mode') || document.body.hasAttribute('data-dark');
        if(mc) mc.setAttribute('content', curDark ? '#0d1b2a' : '#4361ee');
      }
    });
  }

  /* ── Helper: save & apply mode ── */
  function setThemeMode(mode){
    themeMode = mode;
    savedDark = resolveDark(mode);
    localStorage.setItem('ba-theme-mode', mode);
    localStorage.setItem('ba-dark', savedDark ? '1' : '0');
    applyTheme(savedTheme, savedDark);
  }

  /* ── Navbar theme-toggle: light ↔ dark
       أول زيارة: يتبع إعداد المتصفح (auto)
       بعد النقر: يُحفظ الاختيار محلياً ── */
  var themeToggleBtn = document.getElementById('theme-toggle');
  if(themeToggleBtn){
    themeToggleBtn.addEventListener('click', function(){
      setThemeMode(savedDark ? 'light' : 'dark');
    });
  }

  /* Expose for other modules */
  window.BlogArch = window.BlogArch || {};
  window.BlogArch.applyTheme = applyTheme;
  window.BlogArch.setThemeMode = setThemeMode;
  window.BlogArch.resolveDark = resolveDark;
  window.BlogArch.getThemeMode = function(){ return themeMode; };
  window.BlogArch.getSavedDark = function(){ return savedDark; };

  /* ── Stars builder ── */
  function buildStars(){
    var c = document.getElementById('fin-stars'); if(!c) return; c.innerHTML = '';
    var n = Math.min(Math.floor(window.innerWidth / 18), 80);
    for(var i = 0; i < n; i++){
      var s = document.createElement('div'); s.className = 'fin-star';
      s.style.cssText = 'left:' + Math.random()*100 + '%;top:' + Math.random()*100 + '%;width:' + (Math.random()*2+1) + 'px;height:' + (Math.random()*2+1) + 'px;opacity:' + (Math.random()*.7+.3) + ';animation:fin-twinkle ' + (Math.random()*4+2) + 's ' + (Math.random()*3) + 's infinite';
      c.appendChild(s);
    }
  }
  window.buildStars = buildStars;

  /* ── Changing Role ── */
  var roleEl = document.getElementById('fin-changing-role');
  if(roleEl){
    var roles = ['كاتب محتوى', 'مراجع تقني', 'ناقد أدبي', 'مقدّم بودكاست', 'صانع محتوى'], idx = 0;
    roleEl.style.transition = 'opacity .4s ease';
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      setInterval(function(){
        roleEl.style.opacity = '0';
        setTimeout(function(){ idx = (idx+1)%roles.length; roleEl.textContent = roles[idx]; roleEl.style.opacity = '1'; }, 400);
      }, 3000);
    }
  }

  /* ── Year update ── */
  var yearEl = document.getElementById('fin-year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

})();