// site.js — shared nav, reveal, and page-load interactions.
// Guards on element presence so the same file works on every page:
// the scroll progress bar and cursor glow only exist on the home page.
(function () {
  var nav = document.getElementById('nav');
  var progressBar = document.getElementById('scrollProgress');

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('shrink', y > 80);
    if (progressBar) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Cursor-following glow in the hero (home page only).
  var heroHeader = document.getElementById('top');
  var heroStage = document.querySelector('.hero-stage');
  var glow = document.querySelector('.cursor-glow');
  if (heroHeader && heroStage && glow) {
    heroHeader.addEventListener('mouseenter', function () { heroStage.classList.add('glow-on'); });
    heroHeader.addEventListener('mouseleave', function () { heroStage.classList.remove('glow-on'); });
    heroHeader.addEventListener('mousemove', function (e) {
      var r = heroHeader.getBoundingClientRect();
      glow.style.transform = 'translate(' + (e.clientX - r.left) + 'px, ' + (e.clientY - r.top) + 'px)';
    });
  }

  // Subtle tilt on case-media, following the cursor.
  document.querySelectorAll('.case-media').forEach(function (media) {
    media.addEventListener('mousemove', function (e) {
      var r = media.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      media.style.transform = 'perspective(900px) rotateX(' + (-py * 6).toFixed(2) + 'deg) rotateY(' + (px * 8).toFixed(2) + 'deg) scale(1.015)';
    });
    media.addEventListener('mouseleave', function () { media.style.transform = ''; });
  });

  // Mobile menu toggle.
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (nav && navToggle && navLinks) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    navToggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    navLinks.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  // Page-load entrance — with a hard failsafe so content never stays hidden.
  var loadEls = document.querySelectorAll('.load-up, .load-fade, .hero-meta .chip');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('loaded'); });
  });
  setTimeout(function () {
    document.body.classList.add('loaded');
    loadEls.forEach(function (el) {
      if (getComputedStyle(el).opacity === '0') {
        el.style.transition = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      }
    });
  }, 1500);

  // Gentle fade/slide-in on scroll — with a hard failsafe so content
  // NEVER stays hidden if the observer is throttled or never fires.
  var reveals = document.querySelectorAll('.reveal');
  var reveal = function (el) { el.classList.add('in'); };
  var hardShow = function (el) {
    el.style.transition = 'none';
    el.classList.add('in');
    el.style.opacity = '1';
    el.style.transform = 'none';
  };
  var io;
  try {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } catch (err) {
    reveals.forEach(hardShow);
  }
  requestAnimationFrame(function () {
    reveals.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) hardShow(el);
    });
  });
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in)').forEach(hardShow);
  }, 1400);
})();
