// Category filter
const filterBtns = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');
const emptyState = document.querySelector('.events-empty');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selected = btn.dataset.filter;
    let visible = 0;

    eventCards.forEach(card => {
      const match = selected === 'all' || card.dataset.category === selected;
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });

    if (emptyState) emptyState.classList.toggle('visible', visible === 0);
  });
});

// Card image carousel
const CAROUSEL_MS = 3000;
const isTouchDevice = !window.matchMedia('(hover: hover)').matches;

eventCards.forEach(card => {
  const slides = Array.from(card.querySelectorAll('.carousel-slide'));
  if (slides.length < 2) return;

  let current = 0;
  let timer = null;

  function advance() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }

  function start() {
    if (timer) return;
    timer = setInterval(advance, CAROUSEL_MS);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    slides[current].classList.remove('active');
    current = 0;
    slides[0].classList.add('active');
  }

  if (isTouchDevice) {
    start();
  } else {
    card.addEventListener('mouseenter', start);
    card.addEventListener('mouseleave', stop);
  }
});
