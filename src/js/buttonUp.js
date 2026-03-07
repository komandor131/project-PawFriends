const header = document.getElementById('header');  
const scrollBtn = document.querySelector('#scrollBtn');
const footer = document.getElementById('footer');  

// Следим за скроллом
window.addEventListener('scroll', () => {
  const headerBottom = header.getBoundingClientRect().bottom;
  if (headerBottom < 0) {
    scrollBtn.style.display = 'block';
  } else {
    scrollBtn.style.display = 'none';
  }
});

// При клике — скролл к футеру
scrollBtn.addEventListener('click', () => {
  header.scrollIntoView({ behavior: 'smooth' });
});