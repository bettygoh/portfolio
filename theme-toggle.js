// theme-toggle.js — light/dark/system theme switcher (Foldaway-style)
(function () {
  var STORE_KEY = 'betty-theme';
  var root = document.documentElement;
  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function systemIsDark() { return mql.matches; }

  function apply(choice) {
    if (choice === 'system') {
      root.setAttribute('data-theme', systemIsDark() ? 'dark' : 'light');
      root.setAttribute('data-theme-mode', 'system');
    } else {
      root.setAttribute('data-theme', choice);
      root.setAttribute('data-theme-mode', choice);
    }
    document.querySelectorAll('.theme-toggle [data-theme-choice]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme-choice') === choice);
      btn.setAttribute('aria-pressed', btn.getAttribute('data-theme-choice') === choice ? 'true' : 'false');
    });
  }

  function setChoice(choice) {
    try { localStorage.setItem(STORE_KEY, choice); } catch (e) {}
    apply(choice);
  }

  var stored = 'system';
  try { stored = localStorage.getItem(STORE_KEY) || 'system'; } catch (e) {}
  apply(stored);

  mql.addEventListener('change', function () {
    var current = root.getAttribute('data-theme-mode');
    if (current === 'system') apply('system');
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme-toggle [data-theme-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () { setChoice(btn.getAttribute('data-theme-choice')); });
    });
    apply(stored);
  });
})();
