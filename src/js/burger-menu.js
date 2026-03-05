const openBurger = document.querySelector('.burger-btn');
const closeBurger = document.querySelector('.close-burger-menu');
const burgerMenu = document.querySelector('.burger-menu');
const menuLink = document.querySelectorAll('.burger-menu .header-nav-link');


if (openBurger && closeBurger && burgerMenu) {
  openBurger.addEventListener('click', openBurgerModal);
  closeBurger.addEventListener('click', closeBurgerMenu);
  burgerMenu.addEventListener('click', function (e) {
    if (e.target === burgerMenu) {
      closeBurgerMenu();
    }
  });

  menuLink.forEach(link => {
    link.addEventListener('click', closeBurgerMenu);
  });
}

function openBurgerModal() {
  burgerMenu.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', closeKeydown);
}

function closeBurgerMenu() {
  burgerMenu.classList.remove('is-open');
  document.body.style.overflow = '';
  window.removeEventListener('keydown', closeKeydown);
}

function closeKeydown(e) {
  if (e.key === 'Escape') closeBurgerMenu();
}
