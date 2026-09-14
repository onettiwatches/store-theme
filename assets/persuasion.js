(function () {
  var overlay = document.getElementById('OnettiExit');
  if (!overlay) return;

  try {
    if (sessionStorage.getItem('onetti-exit')) return;
  } catch (err) {}

  var armed = false;
  window.setTimeout(function () {
    armed = true;
  }, 12000);

  document.addEventListener('mouseout', function (event) {
    if (!armed || event.relatedTarget || event.clientY > 8) return;
    overlay.hidden = false;
    try {
      sessionStorage.setItem('onetti-exit', '1');
    } catch (err) {}
    armed = false;
  });

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay || event.target.closest('[data-exit-close]')) {
      overlay.hidden = true;
    }
  });
})();
