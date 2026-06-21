(function () {
  'use strict';

  function init() {
    // Only on devices with real hover (desktop)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var collectionsMenus = document.querySelectorAll('.header-menu__collections');

    collectionsMenus.forEach(function (details) {
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
        }, 150);
      }

      headerMenu.addEventListener('mouseenter', function () {
        if (openTimer) { clearTimeout(openTimer); openTimer = null; }
        openTimer = setTimeout(open, 80);
      });

      headerMenu.addEventListener('mouseleave', scheduleClose);

      // Keep open when hovering the dropdown content itself
      details.addEventListener('mouseenter', function () {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      });

      details.addEventListener('mouseleave', scheduleClose);

      // Close on Escape
      details.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          details.removeAttribute('open');
        }
      });
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
