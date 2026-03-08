const openBurger = document.querySelector('.header .burger-btn');
const closeBurger = document.querySelector('.close-burger-menu');
const burgerMenu = document.querySelector('.burger-menu');
const menuLink = document.querySelectorAll('.burger-menu .header-nav-link');
const findFriend = document.querySelector('.burger-button');

if (openBurger && closeBurger && burgerMenu) {
  burgerMenu.setAttribute('aria-hidden', 'true');
  openBurger.setAttribute('aria-expanded', 'false');

  openBurger.addEventListener('click', openBurgerModal);
  closeBurger.addEventListener('click', () => {
    closeBurgerMenu();
    openBurger.focus();
  });
  burgerMenu.addEventListener('click', function (e) {
    if (e.target === burgerMenu) {
      closeBurgerMenu();
    }
  });

  if (findFriend) {
    findFriend.addEventListener('click', () => {
      const section = document.querySelector('#find-friend');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
      closeBurgerMenu();
    });
  }

  menuLink.forEach(link => {
    link.addEventListener('click', () => {
      closeBurgerMenu();
      openBurger.focus();
    });
  });
}

function openBurgerModal() {
  if (!burgerMenu || !openBurger || !closeBurger) {
    return;
  }

  burgerMenu.classList.add('is-open');
  burgerMenu.setAttribute('aria-hidden', 'false');
  openBurger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  closeBurger.focus();
  window.addEventListener('keydown', closeKeydown);
}

function closeBurgerMenu() {
  if (!burgerMenu || !openBurger) {
    return;
  }

  burgerMenu.classList.remove('is-open');
  burgerMenu.setAttribute('aria-hidden', 'true');
  openBurger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  window.removeEventListener('keydown', closeKeydown);
}

function closeKeydown(e) {
  if (e.key === 'Escape') {
    closeBurgerMenu();
    if (openBurger) {
      openBurger.focus();
    }
  }
}

