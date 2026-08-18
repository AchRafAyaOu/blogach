// Core Forms: Contact Form → Google Apps Script Proxy
// Extracted from core v16 script (lines 1984-2015)

(function(){
  'use strict';

  var cForm = document.getElementById('contact-form');
  if(!cForm) return;

  cForm.addEventListener('submit', function(e){
    e.preventDefault();
    var btn = document.getElementById('contact-btn');
    var st = document.getElementById('contact-status');
    var PROXY = window.BlogArch && window.BlogArch.PROXY_URL;
    if(!PROXY || PROXY === 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL'){
      if(st){ st.textContent = 'نموذج التواصل غير مُفعَّل بعد.'; st.className = 'contact-feedback error'; }
      return;
    }
    var fd = new FormData(cForm);
    var name = fd.get('name') || '';
    var email = fd.get('email') || '';
    var msg = fd.get('message') || '';
    if(!name.trim() || !email.trim() || !msg.trim()){
      if(st){ st.textContent = 'يرجى ملء جميع الحقول المطلوبة.'; st.className = 'contact-feedback error'; }
      return;
    }
    if(btn){ btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...'; }
    fetch(PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'contact', name: name, email: email, message: msg, source: 'contact-page' })
    }).then(function(r){ return r.json(); }).then(function(d){
      if(d.success){
        if(st){ st.textContent = d.message || '\u2713 تم الإرسال بنجاح!'; st.className = 'contact-feedback success'; }
        cForm.reset();
      } else {
        if(st){ st.textContent = d.message || 'حاول مرة أخرى.'; st.className = 'contact-feedback error'; }
      }
      if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال'; }
    }).catch(function(){
      if(st){ st.textContent = 'تعذّر الاتصال، حاول مرة أخرى.'; st.className = 'contact-feedback error'; }
      if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال'; }
    });
  });

})();