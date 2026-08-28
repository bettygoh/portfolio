(function () {
  const PROJECTS = [
    { href: 'readsg-challenge.html', title: 'Growing a daily reading habit with the ReadSG Challenge', img: 'assets/readsg-cover.png', pos: 'center top' },
    { href: 'app-store-previews.html', title: 'Redesigning app store previews to increase downloads', img: 'assets/addx-appstore.png', pos: 'center top' },
    { href: 'product-discovery.html', title: 'Enhancing product discovery for investors', img: 'assets/addx-offerings.png', pos: 'center' },
    { href: 'design-system.html', title: 'Design System 2.0 — interface foundations', img: 'assets/addx-buttons.png', pos: 'left top' }
  ];

  const CSS = `
.pc { --pc-gap: clamp(16px, 2vw, 24px); }
.pc-head { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; margin-bottom: clamp(20px, 2.4vw, 32px); }
.pc-title { font-family: var(--font-head); font-weight: 500; font-size: clamp(24px, 3vw, 34px); letter-spacing: -0.01em; color: var(--ink); margin: 0; }
.pc-nav { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.pc-foot { display: flex; justify-content: center; margin-top: clamp(28px, 3.4vw, 44px); }
.pc-all { font-family: var(--font-head); font-weight: 500; font-size: 15px; letter-spacing: 0.02em; color: var(--ink); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 5px; transition: color 0.25s var(--ease); }
.pc-all .pc-arrow { display: inline-block; transition: transform 0.3s var(--ease); }
.pc-all:hover { color: var(--ink-soft); }
.pc-all:hover .pc-arrow { transform: translateX(3px); }
.pc-all:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.pc-btn { width: 40px; height: 40px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--ink); cursor: pointer; display: grid; place-items: center; transition: background 0.25s var(--ease), border-color 0.25s var(--ease), opacity 0.25s var(--ease); }
.pc-btn svg { width: 17px; height: 17px; display: block; }
.pc-btn:hover { background: var(--bg-2); border-color: color-mix(in oklab, var(--accent) 40%, var(--line)); }
.pc-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.pc-btn[disabled] { opacity: 0.3; cursor: default; }
.pc-track { display: flex; gap: var(--pc-gap); overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; padding: 14px 16px 18px; margin-inline: -16px; }
.pc-track::-webkit-scrollbar { display: none; }
.pc-card { flex: 0 0 calc((100% - var(--pc-gap) * 2) / 2.35); scroll-snap-align: start; display: flex; flex-direction: column; gap: 14px; text-decoration: none; color: var(--ink); transition: transform 0.45s var(--ease); will-change: transform; }
.pc-card:hover { transform: scale(1.02); }
.pc-card:active { transform: scale(1.005); }
.pc-media { border: 1px solid var(--line); border-radius: clamp(14px, 1.6vw, 20px); background: var(--bg-2); overflow: hidden; aspect-ratio: 16 / 10; transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease), border-color 0.45s var(--ease); will-change: transform; }
.pc-media img, .pc-media image-slot { display: block; width: 100%; height: 100%; object-fit: cover; }
.pc-card img { transition: transform 0.6s var(--ease); }
.pc-card:hover .pc-media { box-shadow: 0 14px 30px -20px oklch(0.4 0.03 255 / 0.22); border-color: color-mix(in oklab, var(--ink) 8%, var(--line)); }
.pc-card:hover img { transform: scale(1.03); }
.pc-name { font-family: var(--font-head); font-weight: 500; font-size: clamp(16px, 1.3vw, 19px); line-height: 1.3; letter-spacing: -0.005em; transition: color 0.3s var(--ease); }
.pc-card:hover .pc-name { color: var(--ink-soft); }
@media (max-width: 820px) { .pc-card { flex: 0 0 78%; } }
@media (max-width: 760px) { .pc-nav { gap: 12px; } .pc-btn { width: 44px; height: 44px; } .pc-btn svg { width: 19px; height: 19px; } .pc-all { display: inline-flex; align-items: center; min-height: 44px; padding-inline: 4px; } }
`;

  function build(host) {
    const here = decodeURIComponent(location.pathname.split('/').pop() || '');
    const list = PROJECTS.filter(p => p.href !== here);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.className = 'pc';
    wrap.innerHTML = `<div class="pc-head"><h2 class="pc-title">More projects</h2><div class="pc-nav"><button class="pc-btn" type="button" data-dir="-1" aria-label="Previous projects"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg></button><button class="pc-btn" type="button" data-dir="1" aria-label="Next projects"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></button></div></div><div class="pc-track">` +
      list.map(p => `<a class="pc-card" href="${p.href}"><div class="pc-media">` +
        (p.img
          ? `<img src="${p.img}" alt="" style="object-position:${p.pos || 'center'}">`
          : `<image-slot id="${p.slot}" fit="cover" placeholder="${p.ph}"></image-slot>`) +
        `</div><div class="pc-name">${p.title}</div></a>`).join('') +
      `</div><div class="pc-foot"><a class="pc-all" href="work.html">View all&nbsp;<span class="pc-arrow" aria-hidden="true">→</span></a></div>`;
    host.replaceChildren(wrap);

    const track = wrap.querySelector('.pc-track');
    const step = () => {
      const card = track.querySelector('.pc-card');
      return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0) : 320;
    };
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      wrap.querySelector('[data-dir="-1"]').disabled = track.scrollLeft <= 2;
      wrap.querySelector('[data-dir="1"]').disabled = track.scrollLeft >= max;
    };
    wrap.querySelectorAll('.pc-btn').forEach(b => b.addEventListener('click', () => {
      track.scrollBy({ left: step() * Number(b.dataset.dir), behavior: 'smooth' });
    }));
    track.addEventListener('scroll', sync, { passive: true });
    sync();
  }

  const init = () => document.querySelectorAll('[data-project-carousel]').forEach(build);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
