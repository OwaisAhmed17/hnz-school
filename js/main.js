// Mobile nav toggle
const toggle = document.getElementById('nav-toggle');
const nav    = document.getElementById('main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Nav background on scroll
const mainNav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    mainNav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
  } else {
    mainNav.style.boxShadow = 'none';
  }
});

// Form submit — validates then posts to Netlify Forms
const enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) enquiryForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const phoneVal = document.getElementById('phone').value.trim();
  const emailVal = document.getElementById('email').value.trim();

  // Reset errors
  document.getElementById('phone-error').textContent = '';
  document.getElementById('email-error').textContent = '';
  document.getElementById('contact-error').style.display = 'none';

  // At least one of phone / email is required
  if (!phoneVal && !emailVal) {
    document.getElementById('contact-error').style.display = 'block';
    return;
  }

  let valid = true;

  if (phoneVal && !/^\d{10}$/.test(phoneVal)) {
    document.getElementById('phone-error').textContent = 'Enter a valid 10-digit number.';
    valid = false;
  }

  if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    document.getElementById('email-error').textContent = 'Enter a valid email address.';
    valid = false;
  }

  if (!valid) return;

  const data = new FormData(form);
  if (phoneVal) data.set('phone', '+91 ' + phoneVal);

  fetch('/', { method: 'POST', body: data })
    .then(() => {
      document.getElementById('form-success').style.display = 'block';
      form.querySelectorAll('input, select, textarea, button[type=submit]')
        .forEach(el => el.disabled = true);
    })
    .catch(() => {
      alert('Something went wrong. Please call us at +91 98452 38201.');
    });
}
