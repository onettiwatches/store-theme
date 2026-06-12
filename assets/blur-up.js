(function () {
  function init() {
    var images = document.querySelectorAll('img.lazyload, img[loading="lazy"]');
    images.forEach(function (img) {
      if (img.dataset.onettiBlurBound === '1') return;
      img.dataset.onettiBlurBound = '1';
      img.classList.add('is-loading');
      var clear = function () { img.classList.remove('is-loading'); };
      if (img.complete && img.naturalWidth > 0) {
        clear();
      } else {
        img.addEventListener('load', clear, { once: true });
        img.addEventListener('error', clear, { once: true });
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Re-scan after predictive-search / quick-add injects new images
  var mo = new MutationObserver(function () { init(); });
  if (document.body) {
    mo.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      mo.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
