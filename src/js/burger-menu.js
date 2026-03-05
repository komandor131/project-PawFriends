const openBurger = document.querySelector('.burger-btn');
const closeBurger = document.querySelector('.close-burger-menu');
const burgerMenu = document.querySelector('.burger-menu');
const menuLink = document.querySelectorAll('.burger-menu .header-nav-link');
const findFriend = document.querySelector('.burger-button')

if (openBurger && closeBurger && burgerMenu) {
  openBurger.addEventListener('click', openBurgerModal);
  closeBurger.addEventListener('click', closeBurgerMenu);
  burgerMenu.addEventListener('click', function (e) {
    if (e.target === burgerMenu) {
      closeBurgerMenu();
    }
  });

  findFriend.addEventListener('click', ()=> {
    const section = document.querySelector("#find-friend")
    if(section){
        section.scrollIntoView({behavior: "smooth"})
    }
    closeBurgerMenu()
  })

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
