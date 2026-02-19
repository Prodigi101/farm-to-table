/* ===================================================
   FARM TO TABLE — JavaScript
   =================================================== */

// ---------- NAV SCROLL ----------
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---------- MOBILE MENU ----------
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// ---------- SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});

// Also observe the how__step elements (they use data-reveal class differently)
document.querySelectorAll('.how__step').forEach(el => {
  revealObserver.observe(el);
});

// ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---------- PARALLAX HERO SHAPES ----------
const shapes = document.querySelectorAll('.shape');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  shapes.forEach((shape, i) => {
    const speed = (i + 1) * 0.08;
    shape.style.transform = `translateY(${y * speed}px)`;
  });
}, { passive: true });

// ---------- MARQUEE PAUSE ON HOVER ----------
const track = document.querySelector('.marquee-track');
if (track) {
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}
