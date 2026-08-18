// Web Share API
// Extracted from inline script (lines 2583-2623)

(function(){
  'use strict';

  // init guard
  window.BlogArch = window.BlogArch || {};
  window.BlogArch._modules = window.BlogArch._modules || {};
  if (window.BlogArch._modules.webShareInitialized) return;
  window.BlogArch._modules.webShareInitialized = true;

  var bar = document.getElementById('post-share-bar');
  if(!bar) return;
  var title = document.title;
  var url = location.href;
  var nativeBtn = document.getElementById('post-share-native');
  var copyBtn = document.getElementById('post-share-copy');
  var twitterLink = document.getElementById('post-share-twitter');
  if(twitterLink) twitterLink.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url);
  var whatsappLink = document.getElementById('post-share-whatsapp');
  if(whatsappLink) whatsappLink.href = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
  if(navigator.share && nativeBtn){
    nativeBtn.style.display = 'inline-flex';
    nativeBtn.addEventListener('click', function(){
      navigator.share({title: title, url: url}).catch(function(){});
    });
  }
  if(copyBtn){
    copyBtn.addEventListener('click', function(){
      var icon = copyBtn.querySelector('i');
      if(navigator.clipboard){
        navigator.clipboard.writeText(url).then(function(){
          copyBtn.style.color = 'var(--accent)'; copyBtn.style.borderColor = 'var(--accent)';
          if(icon){ icon.className = 'fas fa-check'; }
          setTimeout(function(){ copyBtn.style.color = ''; copyBtn.style.borderColor = ''; if(icon) icon.className = 'fas fa-link'; }, 2000);
        });
      } else {
        var ta = document.createElement('textarea'); ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try{ document.execCommand('copy'); }catch(_){}
        document.body.removeChild(ta);
        copyBtn.style.color = 'var(--accent)'; if(icon) icon.className = 'fas fa-check';
        setTimeout(function(){ copyBtn.style.color = ''; if(icon) icon.className = 'fas fa-link'; }, 2000);
      }
    });
  }
})();