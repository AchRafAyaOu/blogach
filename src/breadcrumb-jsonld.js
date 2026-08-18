// Breadcrumb JSON-LD
// Extracted from inline script (lines 3053-3079)
// Builds automatically from displayed nav.breadcrumb elements

(function(){
  'use strict';

  var nav = document.querySelector('nav.breadcrumb');
  if(!nav) return;
  var items = [];
  var pos = 1;
  Array.prototype.forEach.call(nav.children, function(el){
    if(el.tagName === 'A' && el.getAttribute('href')){
      items.push({ '@type': 'ListItem', position: pos++, name: el.textContent.trim(), item: el.href });
    } else if(el.hasAttribute && el.hasAttribute('aria-current')){
      items.push({ '@type': 'ListItem', position: pos++, name: el.textContent.trim(), item: location.href });
    }
  });
  if(items.length < 2) return; /* لا فائدة من مخطط لعنصر واحد فقط */
  var schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  };
  var s = document.createElement('script');
  s.type = 'application/ld+json';
  s.text = JSON.stringify(schema);
  document.head.appendChild(s);
})();