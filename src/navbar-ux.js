// Navbar UX: Scroll State + Glider + Search Panel + Keyboard Shortcuts
// Extracted from inline script (lines 2629-2749)

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  window.BlogArch._modules = window.BlogArch._modules || {};
  if (window.BlogArch._modules.navbarUxInitialized) return;
  window.BlogArch._modules.navbarUxInitialized = true;

  /* ── 1) Navbar scroll state + reading progress + scroll-to-top ── */
  var nb = document.getElementById('navbar');
  var rp = document.getElementById('reading-progress');
  var st = document.getElementById('scroll-top-btn');

  if(nb){
    function setNavbarH(){
      document.documentElement.style.setProperty('--navbar-h', (nb.offsetHeight + 2) + 'px');
    }
    setNavbarH();
    window.addEventListener('resize', setNavbarH, {passive:true});
    if('fonts' in document) document.fonts.ready.then(setNavbarH).catch(function(){});
  }

  if(nb || rp || st){
    var docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    window.addEventListener('resize', function(){
      docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }, {passive:true});

    var scrollTicking = false;
    function onScrollFrame(){
      var sy = window.scrollY;
      if(nb) nb.classList.toggle('scrolled', sy > 50);
      if(rp) rp.style.width = (sy / docH * 100) + '%';
      if(st) st.classList.toggle('visible', sy > 300);
      scrollTicking = false;
    }

    window.addEventListener('scroll', function(){
      if(!scrollTicking){
        requestAnimationFrame(onScrollFrame);
        scrollTicking = true;
      }
    }, {passive:true});
  }

  if(st) st.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });

  /* ── 2) Nav glider ── */
  var glider = document.getElementById('nav-glider');
  var navMenu = document.getElementById('nav-menu');

  function moveGlider(el){
    if(!glider || !el || !navMenu) return;
    requestAnimationFrame(function(){
      var mr = navMenu.getBoundingClientRect();
      var er = el.getBoundingClientRect();
      var pad = 13;
      glider.style.left = (er.left - mr.left + pad) + 'px';
      glider.style.width = (er.width - pad*2) + 'px';
      glider.style.opacity = '1';
    });
  }

  if(glider && navMenu){
    var initActive = navMenu.querySelector('.nav-link.active, .nav-link.fin-active');
    if(initActive) setTimeout(function(){ moveGlider(initActive); }, 150);
    navMenu.querySelectorAll('.nav-link:not(.nav-cta)').forEach(function(link){
      link.addEventListener('mouseenter', function(){ moveGlider(link); });
    });
    navMenu.addEventListener('mouseleave', function(){
      var a = navMenu.querySelector('.nav-link.active, .nav-link.fin-active');
      if(a) moveGlider(a);
      else if(glider) glider.style.opacity = '0';
    });
  }

  /* ── 3) Search panel + hint chips ── */
  var sbtn = document.getElementById('search-btn');
  var sp = document.getElementById('search-panel');
  var sinp = document.getElementById('search-input');
  var sclose = document.getElementById('search-close-btn');

  function openSearchPanel(){
    if(!sp) return;
    sp.classList.add('active');
    if(sbtn) sbtn.classList.add('is-open');
    var bd = document.getElementById('search-backdrop');
    if(bd) bd.classList.add('active');
    setTimeout(function(){ if(sinp) sinp.focus(); }, 200);
  }

  function closeSearchPanel(){
    if(!sp) return;
    sp.classList.remove('active');
    if(sbtn){ sbtn.classList.remove('is-open'); sbtn.focus(); }
    var bd = document.getElementById('search-backdrop');
    if(bd) bd.classList.remove('active');
  }

  var sbackdrop = document.getElementById('search-backdrop');
  if(sbackdrop && !sbackdrop._wired){
    sbackdrop._wired = true;
    sbackdrop.addEventListener('click', closeSearchPanel);
  }

  if(sbtn && !sbtn._wired){
    sbtn._wired = true;
    sbtn.addEventListener('click', function(){
      sp && sp.classList.contains('active') ? closeSearchPanel() : openSearchPanel();
    });
  }

  if(sclose && !sclose._wired){
    sclose._wired = true;
    sclose.addEventListener('click', closeSearchPanel);
  }

  document.addEventListener('click', function(e){
    if(sp && sp.classList.contains('active') && !sp.contains(e.target) && e.target !== sbtn) closeSearchPanel();
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      if(window.BlogArch && window.BlogArch.Drawer && typeof window.BlogArch.Drawer.close === 'function') window.BlogArch.Drawer.close();
      closeSearchPanel();
      return;
    }
    if((e.ctrlKey || e.metaKey) && e.key === 'k'){
      e.preventDefault();
      sp && sp.classList.contains('active') ? closeSearchPanel() : openSearchPanel();
      return;
    }
    if(e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){
      e.preventDefault();
      openSearchPanel();
    }
  });

  document.querySelectorAll('.search-hint-chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      if(sinp){ sinp.value = chip.textContent.trim(); sinp.focus(); sinp.dispatchEvent(new Event('input')); }
    });
  });

})();