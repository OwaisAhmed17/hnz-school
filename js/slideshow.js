const slides = Array.from(document.querySelectorAll('.slide'));
const dots   = Array.from(document.querySelectorAll('.dot'));
const counter = document.querySelector('.slide-counter');
let current = 0;
let timer;

function goTo(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
}

document.querySelector('.slide-prev').addEventListener('click', () => { reset(); goTo(current - 1); });
document.querySelector('.slide-next').addEventListener('click', () => { reset(); goTo(current + 1); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { reset(); goTo(i); }));

const slideshow = document.querySelector('.slideshow');
slideshow.addEventListener('mouseenter', () => clearInterval(timer));
slideshow.addEventListener('mouseleave', start);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { reset(); goTo(current - 1); }
  if (e.key === 'ArrowRight') { reset(); goTo(current + 1); }
});

function start() { timer = setInterval(() => goTo(current + 1), 4000); }
function reset() { clearInterval(timer); start(); }

start();
