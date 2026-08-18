// Lightbox: Image Zoom on Click
// Extracted from inline script (lines 2972-3013)

(function(){
  'use strict';

  var lb = document.getElementById('fin-lightbox');
  var lbImg = document.getElementById('fin-lightbox-img');
  var lbClose = document.getElementById('fin-lightbox-close');
  if(!lb || !lbImg) return;
  var lastFocus = null;

  function openLightbox(src, alt){
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if(lbClose) lbClose.focus();
  }

  function closeLightbox(){
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function(e){
    var img = e.target.closest('.post-body img,.post-content img');
    if(img){
      e.preventDefault();
      openLightbox(img.currentSrc || img.src, img.alt);
    }
  });

  if(lbClose) lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && lb.classList.contains('active')) closeLightbox();
  });
})();