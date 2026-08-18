// Newsletter Form
// Extracted from inline script (lines 3081-3140)
// Uses unified PROXY_URL from window.BlogArch

(function(){
  'use strict';

  /* يُستخدم PROXY_URL الموحَّد من window.BlogArch لكلٍّ من:
     - نماذج التواصل (action:'contact')
     - النشرة البريدية  (action:'newsletter')  */
  var PROXY_URL = window.BlogArch && window.BlogArch.PROXY_URL;

  var form = document.getElementById('ba-nl-form');
  var input = document.getElementById('ba-nl-email');
  var btn = document.getElementById('ba-nl-btn');
  var status = document.getElementById('ba-nl-status');
  if(!form || !input || !btn || !status) return;

  function setStatus(msg, type){
    status.textContent = msg;
    status.className = 'ba-nl-status' + (type ? ' ' + type : '');
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var email = input.value.trim().toLowerCase();
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){ setStatus('من فضلك أدخل البريد الإلكتروني.', 'error'); input.focus(); return; }
    if(!re.test(email)){ setStatus('صيغة البريد الإلكتروني غير صحيحة.', 'error'); input.focus(); return; }
    if(!PROXY_URL || PROXY_URL === 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL'){
      setStatus('الاشتراك غير متاح حالياً.', 'error'); return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ الاشتراك...';
    setStatus('');

    fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'newsletter', email: email, source: 'homepage' })
    })
    .then(function(r){ return r.json(); })
    .then(function(result){
      if(result.success){
        setStatus(result.message || 'تم الاشتراك بنجاح! \uD83C\uDF89', 'success');
        form.reset();
      } else {
        setStatus(result.message || 'تعذر تنفيذ الاشتراك.', 'error');
      }
    })
    .catch(function(){
      setStatus('حدث خطأ أثناء الإرسال. حاول مجدداً لاحقاً.', 'error');
    })
    .finally(function(){
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> اشترك الآن';
    });
  });
})();