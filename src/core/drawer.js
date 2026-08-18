// Core Drawer: Mobile Drawer Open/Close/Swipe/Focus Trap
// Extracted from core v16 script (lines 1428-2185)

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  window.BlogArch.Drawer = window.BlogArch.Drawer || {};
  if (window.BlogArch.Drawer._isInitialized) {
      return;
  }
  window.BlogArch.Drawer._isInitialized = true;

  var hamburger = document.getElementById('hamburger');
  var menuOverlay = document.getElementById('menu-overlay');
  var mobileDrawer = document.getElementById('mobile-drawer');

  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var _lastFocus = null; // Private scope for now, exposed via getter/setter if needed

  function trapFocus(container, e){
    if(e.key !== 'Tab' || !container) return;
    var nodes = container.querySelectorAll(FOCUSABLE);
    if(!nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length-1];
    if(e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
    else if(!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
  }

  function rememberFocus(){ _lastFocus = document.activeElement; }
  function restoreFocus(){ try{ if(_lastFocus && _lastFocus.focus) _lastFocus.focus(); }catch(_){} _lastFocus = null; }

  function openDrawer(){
    rememberFocus();
    if(mobileDrawer){ mobileDrawer.classList.add('active'); mobileDrawer.removeAttribute('aria-hidden'); }
    if(menuOverlay) menuOverlay.classList.add('active');
    if(hamburger){ hamburger.classList.add('active'); hamburger.setAttribute('aria-expanded', 'true'); hamburger.setAttribute('aria-label', 'إغلاق القائمة'); }
    document.body.style.overflow = 'hidden';
    try{ navigator.vibrate && navigator.vibrate(30); }catch(_){}
    setTimeout(function(){
      if(mobileDrawer){
        var f = mobileDrawer.querySelector(FOCUSABLE);
        if(f) f.focus();
      }
    }, 120);
  }

  function closeDrawer(){
    if(mobileDrawer){ mobileDrawer.classList.remove('active'); mobileDrawer.setAttribute('aria-hidden', 'true'); }
    if(menuOverlay) menuOverlay.classList.remove('active');
    if(hamburger){ hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false'); hamburger.setAttribute('aria-label', 'فتح القائمة'); }
    document.body.style.overflow = '';
    restoreFocus();
  }

  /* Expose for other modules */
  window.BlogArch.Drawer.open = openDrawer;
  window.BlogArch.Drawer.close = closeDrawer;
  window.BlogArch.Drawer.trapFocus = trapFocus; // Expose trapFocus for homepage-data.js
  window.BlogArch.Drawer._getLastFocus = function() { return _lastFocus; }; // Expose a getter for _lastFocus
  window.BlogArch.Drawer._setLastFocus = function(el) { _lastFocus = el; }; // Expose a setter for _lastFocus

  /* aliases for backward compat - ensure they use the new exposed methods */
  window.openSidebar = window.BlogArch.Drawer.open;
  window.closeSidebar = window.BlogArch.Drawer.close;

  if(hamburger) hamburger.addEventListener('click', function(){
    mobileDrawer && mobileDrawer.classList.contains('active') ? closeDrawer() : openDrawer();
  });
  if(menuOverlay) menuOverlay.addEventListener('click', closeDrawer);

  /* Swipe right to close (RTL) */
  if(mobileDrawer){
    var txStart = 0, tyStart = 0;
    mobileDrawer.addEventListener('touchstart', function(e){ txStart = e.touches[0].clientX; tyStart = e.touches[0].clientY; }, {passive:true});
    mobileDrawer.addEventListener('touchend', function(e){
      if(!mobileDrawer.classList.contains('active')) return;
      var dx = e.changedTouches[0].clientX - txStart;
      var dy = Math.abs(e.changedTouches[0].clientY - tyStart);
      if(dx > 60 && dy < 80) closeDrawer();
    }, {passive:true});
  }

  /* Focus trap + ESC inside drawer */
  document.addEventListener('keydown', function(e){
    if(mobileDrawer && mobileDrawer.classList.contains('active')) window.BlogArch.Drawer.trapFocus(mobileDrawer, e);
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      window.BlogArch.Drawer.close();
    }
  });

  /* Close drawer on nav-link click (except about/contact) */
  document.querySelectorAll('.mobile-drawer .nav-link').forEach(function(l){
    l.addEventListener('click', function(){
      if(l.id !== 'drawer-about-open' && l.id !== 'drawer-contact-open') window.BlogArch.Drawer.close();
    });
  });

})();