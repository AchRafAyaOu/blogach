// Mini Cards (About/Contact)
// Extracted from inline script (lines 2355-2463)

(function(){
  'use strict';

  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var overlay   = document.getElementById('fin-mc-overlay');
  var mcAbout   = document.getElementById('fin-mc-about');
  var mcContact = document.getElementById('fin-mc-contact');
  var openCard  = null;
  var lastFocus = null;

  function openMC(card, trigger){
    closeAll(true);
    lastFocus = trigger || document.activeElement;
    openCard = card;
    if(overlay) overlay.classList.add('open');
    if(card)    card.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){
      if(card){
        var first = card.querySelector('input,textarea') || card.querySelector(FOCUSABLE);
        if(first) first.focus();
      }
    }, 80);
  }

  function closeAll(skipFocus){
    if(overlay)   overlay.classList.remove('open');
    if(mcAbout)   mcAbout.classList.remove('open');
    if(mcContact) mcContact.classList.remove('open');
    document.body.style.overflow = '';
    if(!skipFocus){
      try{ if(lastFocus && lastFocus.focus) lastFocus.focus(); }catch(_){}
    }
    lastFocus = null; openCard = null;
  }

  /* Wire all about/contact triggers (nav, drawer, hero) */
  ['nav-about-open','drawer-about-open'].forEach(function(id){
    var btn = document.getElementById(id);
    if(btn) btn.addEventListener('click', function(e){ e.preventDefault(); openMC(mcAbout, btn); });
  });

  ['nav-contact-open','drawer-contact-open'].forEach(function(id){
    var btn = document.getElementById(id);
    if(btn) btn.addEventListener('click', function(e){ e.preventDefault(); openMC(mcContact, btn); });
  });

  var heroCta = document.getElementById('hero-contact-cta');
  if(heroCta) heroCta.addEventListener('click', function(e){ e.preventDefault(); openMC(mcContact, heroCta); });

  ['fin-mc-about-close','fin-mc-contact-close'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.addEventListener('click', function(){ closeAll(); });
  });

  if(overlay) overlay.addEventListener('click', function(){ closeAll(); });

  document.addEventListener('keydown', function(e){
    if(!openCard) return;
    if(e.key === 'Escape'){ closeAll(); return; }
    if(e.key === 'Tab'){
      var nodes = openCard.querySelectorAll(FOCUSABLE);
      if(!nodes.length) return;
      var first = nodes[0], last = nodes[nodes.length-1];
      if(e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
      else if(!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
    }
  });

  /* ── Mini-Card Contact → Google Apps Script Proxy ── */
  var _PROXY = window.BlogArch && window.BlogArch.PROXY_URL;

  function sendToProxy(name, email, message, source, onSuccess, onError){
    if(!_PROXY || _PROXY === 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL'){
      onError('النموذج غير مُفعَّل بعد — يرجى إعداد Google Apps Script.');
      return;
    }
    fetch(_PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'contact', name: name, email: email, message: message, source: source || 'mini-card' })
    }).then(function(r){ return r.json(); })
      .then(function(d){ if(d.success) onSuccess(d.message); else onError(d.message || 'حاول مرة أخرى.'); })
      .catch(function(){ onError('تعذّر الاتصال بالخادم.'); });
  }

  var mcForm = document.getElementById('fin-mc-form');
  if(mcForm){
    mcForm.addEventListener('submit', function(e){
      e.preventDefault();
      var btn = mcForm.querySelector('.fin-mc-submit');
      var status = document.getElementById('fin-mc-status');
      var name = mcForm.querySelector('#fin-mc-name') ? mcForm.querySelector('#fin-mc-name').value.trim() : '';
      var email = mcForm.querySelector('#fin-mc-email') ? mcForm.querySelector('#fin-mc-email').value.trim() : '';
      var msg = mcForm.querySelector('#fin-mc-message') ? mcForm.querySelector('#fin-mc-message').value.trim() : '';
      if(!name || !email || !msg){
        if(status){ status.style.display = 'block'; status.textContent = 'يرجى ملء جميع الحقول المطلوبة.'; status.style.color = '#ef4444'; }
        return;
      }
      if(btn){ btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> جاري الإرسال...'; }
      sendToProxy(name, email, msg, 'mini-card',
        function(msg){
          if(status){ status.style.display = 'block'; status.textContent = msg || '\u2713 تم الإرسال بنجاح!'; status.style.color = 'var(--accent)'; }
          mcForm.reset();
          if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-inline-end:.35rem" aria-hidden="true"></i>إرسال'; }
        },
        function(err){
          if(status){ status.style.display = 'block'; status.textContent = err || 'حدث خطأ، حاول مرة أخرى.'; status.style.color = '#ef4444'; }
          if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-inline-end:.35rem" aria-hidden="true"></i>إرسال'; }
        }
      );
    });
  }
})();