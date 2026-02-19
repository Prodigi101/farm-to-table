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

// ===================================================
//  SUBSCRIPTION MODAL
// ===================================================

const TIERS = {
  Essentials: {
    price: 'J$14,000',
    swaps: '2 swaps / month',
    weight: '16–18 lbs',
    delivery: 'Every 2 weeks',
    for: 'Young professionals & households of 1–2',
  },
  Select: {
    price: 'J$24,000',
    swaps: '3 swaps / month',
    weight: '20–22 lbs',
    delivery: 'Every 2 weeks',
    for: 'Families of 3–4, health-conscious professionals',
  },
  Reserve: {
    price: 'J$38,000',
    swaps: 'Unlimited swaps',
    weight: '25–30 lbs',
    delivery: 'Every 2 weeks',
    for: 'Larger households, entertainers & expats',
  },
};

let currentStep = 1;
let selectedTier = null;

const backdrop  = document.getElementById('modalBackdrop');
const modalEl   = document.getElementById('modal');
const modalBack = document.getElementById('modalBack');
const modalNext = document.getElementById('modalNext');
const modalClose= document.getElementById('modalClose');
const footerNote= document.getElementById('footerNote');
const modalFooter = document.getElementById('modalFooter');

// --- Open modal ---
document.querySelectorAll('.tier-card .btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const card  = btn.closest('.tier-card');
    const label = card.querySelector('.tier-card__label').textContent.trim();
    openModal(label);
  });
});

// Also wire the CTA banner button to open with Select tier
document.querySelectorAll('.cta-banner .btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openModal('Select');
  });
});

function openModal(tierName) {
  selectedTier = TIERS[tierName] || TIERS['Essentials'];
  selectedTier.name = tierName;
  currentStep = 1;
  renderPlanSummary();
  goToStep(1);
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// --- Close triggers ---
modalClose.addEventListener('click', closeModal);
document.getElementById('successClose').addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// --- Step navigation ---
modalNext.addEventListener('click', () => {
  if (currentStep === 4) {
    handleSubmit();
    return;
  }
  if (!validateStep(currentStep)) return;
  if (currentStep === 3) renderReview();
  goToStep(currentStep + 1);
});

modalBack.addEventListener('click', () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

function goToStep(step) {
  // Hide all bodies
  document.querySelectorAll('.modal__body').forEach(b => b.classList.add('hidden'));

  if (step === 'success') {
    document.getElementById('stepSuccess').classList.remove('hidden');
    modalFooter.style.display = 'none';
    updateProgress(5); // beyond step 4 = all done
    return;
  }

  document.getElementById(`step${step}`).classList.remove('hidden');
  currentStep = step;
  updateProgress(step);

  // Back button visibility
  modalBack.style.visibility = step === 1 ? 'hidden' : 'visible';

  // Next button label
  if (step === 4) {
    modalNext.textContent = 'Confirm subscription';
  } else {
    modalNext.textContent = 'Continue';
  }

  // Footer note
  const notes = {
    1: selectedTier ? `${selectedTier.swaps} included` : '',
    2: 'Free delivery on all plans',
    3: 'We never share your data',
    4: 'Cancel anytime, no penalty',
  };
  footerNote.textContent = notes[step] || '';

  // Scroll body to top
  const body = document.getElementById(`step${step}`);
  if (body) body.scrollTop = 0;
}

function updateProgress(activeStep) {
  document.querySelectorAll('.modal__step').forEach(stepEl => {
    const n = parseInt(stepEl.dataset.step);
    stepEl.classList.remove('active', 'done');
    if (n === activeStep) stepEl.classList.add('active');
    else if (n < activeStep) stepEl.classList.add('done');
  });
}

// --- Render plan summary (step 1) ---
function renderPlanSummary() {
  const t = selectedTier;
  document.getElementById('planSummary').innerHTML = `
    <div>
      <p class="modal__plan-name">${t.name}</p>
      <p class="modal__plan-price"><strong>${t.price}</strong> / month</p>
      <div class="modal__plan-meta">
        <span class="modal__plan-tag">${t.delivery}</span>
        <span class="modal__plan-tag">${t.for}</span>
      </div>
    </div>
    <div class="modal__plan-right">
      <p class="modal__plan-swaps">${t.swaps}</p>
      <p class="modal__plan-weight">${t.weight}</p>
    </div>
  `;
}

// --- Validation ---
function validateStep(step) {
  if (step === 1) return true; // swaps are optional

  if (step === 2) {
    const required = ['firstName', 'lastName', 'phone', 'email', 'address', 'community', 'parish', 'deliveryDay', 'deliveryTime'];
    let valid = true;
    required.forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.classList.add('error');
        valid = false;
        el.addEventListener('input', () => el.classList.remove('error'), { once: true });
      }
    });
    if (!valid) {
      // scroll to first error
      const firstErr = document.querySelector('#step2 .error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return valid;
  }

  if (step === 4) {
    return document.getElementById('consentCheck').checked;
  }

  return true;
}

// --- Render review (step 4) ---
function renderReview() {
  const get  = id => document.getElementById(id)?.value?.trim() || '—';
  const dietary = [...document.querySelectorAll('input[name="dietary"]:checked')].map(cb => cb.value).join(', ') || '—';

  document.getElementById('reviewContent').innerHTML = `
    <div class="modal__review-section">
      <div class="modal__review-section-title">Your plan</div>
      <dl class="modal__review-rows">
        <div class="modal__review-row"><dt>Tier</dt><dd>${selectedTier.name}</dd></div>
        <div class="modal__review-row"><dt>Price</dt><dd>${selectedTier.price} / month</dd></div>
        <div class="modal__review-row"><dt>Delivery</dt><dd>${selectedTier.delivery}</dd></div>
        <div class="modal__review-row"><dt>Box weight</dt><dd>${selectedTier.weight} per delivery</dd></div>
        <div class="modal__review-row"><dt>Swaps</dt><dd>${selectedTier.swaps}</dd></div>
      </dl>
    </div>
    <div class="modal__review-section">
      <div class="modal__review-section-title">Delivery details</div>
      <dl class="modal__review-rows">
        <div class="modal__review-row"><dt>Name</dt><dd>${get('firstName')} ${get('lastName')}</dd></div>
        <div class="modal__review-row"><dt>Phone</dt><dd>${get('phone')}</dd></div>
        <div class="modal__review-row"><dt>Email</dt><dd>${get('email')}</dd></div>
        <div class="modal__review-row"><dt>Address</dt><dd>${get('address')}, ${get('community')}, ${get('parish')}</dd></div>
        <div class="modal__review-row"><dt>Delivery day</dt><dd>${get('deliveryDay')}s (bi-weekly)</dd></div>
        <div class="modal__review-row"><dt>Time window</dt><dd>${get('deliveryTime')}</dd></div>
      </dl>
    </div>
    <div class="modal__review-section">
      <div class="modal__review-section-title">Preferences</div>
      <dl class="modal__review-rows">
        <div class="modal__review-row"><dt>Household</dt><dd>${get('householdSize')} people</dd></div>
        <div class="modal__review-row"><dt>Dietary</dt><dd>${dietary}</dd></div>
        <div class="modal__review-row"><dt>Swap out</dt><dd>${get('swapOut')}</dd></div>
        <div class="modal__review-row"><dt>Swap in</dt><dd>${get('swapIn')}</dd></div>
        <div class="modal__review-row"><dt>Notes</dt><dd>${get('specialNotes')}</dd></div>
        <div class="modal__review-row"><dt>Heard via</dt><dd>${get('referralSource')}</dd></div>
        ${get('referralCode') !== '—' ? `<div class="modal__review-row"><dt>Referral code</dt><dd>${get('referralCode')}</dd></div>` : ''}
      </dl>
    </div>
  `;
}

// --- Submit ---
function handleSubmit() {
  if (!document.getElementById('consentCheck').checked) {
    const consent = document.querySelector('.modal__consent');
    consent.style.outline = '2px solid #c0392b';
    consent.style.borderRadius = '4px';
    setTimeout(() => consent.style.outline = '', 2000);
    return;
  }
  // In production: POST form data to your backend here
  // For now, show success state
  goToStep('success');
}
