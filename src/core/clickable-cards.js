// Core Clickable Cards: Clickable Post Cards
// Extracted from core v16 script (lines 2278-2292)

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  window.BlogArch._modules = window.BlogArch._modules || {};
  if (window.BlogArch._modules.clickableCardsInitialized) return;
  window.BlogArch._modules.clickableCardsInitialized = true;

  // Clickable post cards — يفتح رابط المشاركة بضغطة على البطاقة كاملة
  document.addEventListener('click', function(e){
    var card = e.target.closest('.fin-clickable-card');
    if(!card) return;
    /* Don't intercept if clicking an actual link, button, or form element */
    if(e.target.closest('a[href],button,[role="button"],input,textarea,select')) return;
    var url = card.getAttribute('data-url');
    if(!url) return;
    /* Middle-click or Ctrl-click → new tab */
    if(e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey){
      window.open(url, '_blank', 'noopener');
    } else {
      window.location.href = url;
    }
  });
})();