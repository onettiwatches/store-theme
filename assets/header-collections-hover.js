(function () {
  'use strict';

  function init() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('.header-menu__collections').forEach(function (details) {
      var headerMenu = details.closest('header-menu');
      if (!headerMenu) return;

      var openTimer = null;
      var closeTimer = null;

      function open() {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        if (!details.hasAttribute('open')) {
          details.setAttribute('open', '');
        }
      }

      function scheduleClose() {
        if (openTimer) { clearTimeout(openTimer); openTimer = null; }
        closeTimer = setTimeout(function () {
          details.removeAttribute('open');
        }, 200);
      }

      headerMenu.addEventListener('mouseenter', function () {
        if (openTimer) { clearTimeout(openTimer); openTimer = null; }
        openTimer = setTimeout(open, 80);
      });

      headerMenu.addEventListener('mouseleave', scheduleClose);
    });
  }

  function initMobileSubmenus() {
    var drawerNav = document.querySelector('.menu-drawer__navigation');
    if (!drawerNav) return;

    drawerNav.querySelectorAll('.header-drawer__collections').forEach(function (details) {
      var li = details.closest('li');
      if (li) li.classList.add('has-collections');

      var summary = details.querySelector('summary');
      if (!summary) return;

      var parentUl = details.closest('ul');

      details.addEventListener('toggle', function () {
        var isOpen = details.hasAttribute('open');
        summary.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (parentUl) {
          parentUl.classList.toggle('has-collections-open', isOpen);
        }
      });
    });
  }

  function runAll() {
    init();
    initMobileSubmenus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }
})();