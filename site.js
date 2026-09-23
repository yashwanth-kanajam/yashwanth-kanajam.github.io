(() => {
  'use strict';
  const links=[...document.querySelectorAll('.case-nav a')];
  function active(){links.forEach(link=>{if(link.hash===location.hash)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
  window.addEventListener('hashchange',active);active();
})();
