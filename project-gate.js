// Password gate for protected case studies. Intercepts links to a gated page
// and, on the gated page itself, blocks the content until unlocked.
(function () {
  const GATED = { 'readsg-challenge.html': 'readsg' };
  const KEY = 'bg-gate-unlocked';
  const norm = (s) => (s || '').trim().toLowerCase();

  const unlocked = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  };
  const unlock = (page) => {
    const list = unlocked();
    if (!list.includes(page)) list.push(page);
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  };
  const isUnlocked = (page) => unlocked().includes(page);

  const CSS = `
.pg-veil{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:24px;background:oklch(0.22 0.02 265 / 0.55);backdrop-filter:blur(6px);opacity:0;transition:opacity .3s var(--ease,ease)}
.pg-veil.in{opacity:1}
.pg-box{width:100%;max-width:400px;background:var(--bg,#fff);color:var(--ink,#111);border:1px solid var(--line,#e5e5e5);border-radius:20px;padding:clamp(24px,3vw,32px);box-shadow:0 40px 80px -40px oklch(0.2 0.04 265 / 0.5);transform:translateY(8px) scale(0.985);transition:transform .3s var(--ease,ease)}
.pg-veil.in .pg-box{transform:none}
.pg-eyebrow{font-family:var(--font-mono,ui-monospace,monospace);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-press,#7A2E2E)}
.pg-title{font-family:var(--font-display,inherit);font-weight:500;font-size:22px;line-height:1.2;letter-spacing:-0.01em;margin:8px 0 6px}
.pg-sub{font-size:14.5px;line-height:1.5;color:var(--ink-soft,#555);margin:0 0 18px;text-wrap:pretty}
.pg-form{display:flex;flex-direction:column;gap:10px}
.pg-input{font:inherit;font-size:15px;padding:12px 14px;border:1px solid var(--line,#ddd);border-radius:12px;background:var(--bg-2,#fafafa);color:inherit}
.pg-input:focus{outline:2px solid var(--accent,#7A2E2E);outline-offset:1px}
.pg-row{display:flex;gap:10px;align-items:center;margin-top:2px}
.pg-btn{font-family:var(--font-head,inherit);font-weight:500;font-size:14.5px;padding:11px 18px;border-radius:999px;border:1px solid transparent;background:var(--ink,#111);color:var(--bg,#fff);cursor:pointer;transition:opacity .25s ease}
.pg-btn:hover{opacity:.86}
.pg-cancel{background:transparent;color:var(--ink-soft,#555);border-color:var(--line,#ddd)}
.pg-err{font-size:13px;color:#b3261e;min-height:17px;margin:0}
`;

  function ensureCss() {
    if (document.getElementById('pg-css')) return;
    const s = document.createElement('style');
    s.id = 'pg-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function prompt(page, opts) {
    ensureCss();
    const veil = document.createElement('div');
    veil.className = 'pg-veil';
    veil.innerHTML =
      '<div class="pg-box" role="dialog" aria-modal="true" aria-label="Password required">' +
      '<h2 class="pg-title" style="margin-top:0">This project is password-protected</h2>' +
      '<p class="pg-sub">This work isn\'t public yet. You\'ll find the password in my CV.</p>' +
      '<form class="pg-form"><input class="pg-input" type="password" placeholder="Password" autocomplete="off" aria-label="Password" />' +
      '<p class="pg-err" role="alert"></p>' +
      '<div class="pg-row"><button class="pg-btn" type="submit">Unlock</button>' +
      (opts.cancel ? '<button class="pg-btn pg-cancel" type="button">Cancel</button>' : '') +
      '</div></form></div>';
    document.body.appendChild(veil);
    requestAnimationFrame(() => veil.classList.add('in'));
    const input = veil.querySelector('.pg-input');
    const err = veil.querySelector('.pg-err');
    input.focus();
    const close = () => { veil.classList.remove('in'); setTimeout(() => veil.remove(), 300); };
    veil.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (norm(input.value) === norm(GATED[page])) { unlock(page); close(); opts.onPass(); }
      else { err.textContent = 'Incorrect password — try again.'; input.select(); }
    });
    const cancelBtn = veil.querySelector('.pg-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', close);
    if (opts.cancel) {
      veil.addEventListener('click', (e) => { if (e.target === veil) close(); });
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
      });
    }
  }

  const pageOf = (href) => {
    if (!href) return null;
    const file = decodeURIComponent(href.split('#')[0].split('?')[0].split('/').pop() || '');
    return GATED[file] ? file : null;
  };

  // Intercept links pointing at a gated page.
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const page = pageOf(a.getAttribute('href'));
    if (!page || isUnlocked(page)) return;
    e.preventDefault();
    prompt(page, { cancel: true, onPass: () => { window.location.href = a.getAttribute('href'); } });
  }, true);

  // On a gated page itself: hide content until unlocked.
  const here = decodeURIComponent(location.pathname.split('/').pop() || '');
  if (GATED[here] && !isUnlocked(here)) {
    const reveal = () => { document.documentElement.style.removeProperty('overflow'); document.body.style.visibility = ''; };
    const hide = () => { document.documentElement.style.overflow = 'hidden'; document.body.style.visibility = 'hidden'; };
    const start = () => {
      hide();
      const box = document.createElement('div');
      document.body.appendChild(box);
      document.body.style.visibility = 'hidden';
      prompt(here, { cancel: false, onPass: reveal });
      // keep the modal visible while the page body is hidden
      const veil = document.querySelector('.pg-veil');
      if (veil) veil.style.visibility = 'visible';
      box.remove();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }
})();
