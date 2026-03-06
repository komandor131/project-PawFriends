import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const aboutSection = document.querySelector('#about');

if (aboutSection) {
  const swiperEl = aboutSection.querySelector('.swiper');
  const prevEl = aboutSection.querySelector('.swiper-button-prev');
  const nextEl = aboutSection.querySelector('.swiper-button-next');
  const paginationEl = aboutSection.querySelector('.swiper-pagination');

  if (swiperEl && prevEl && nextEl && paginationEl) {
    new Swiper(swiperEl, {
      modules: [Navigation, Pagination],
      loop: false,
      slidesPerView: 1,
      navigation: {
        nextEl,
        prevEl,
      },
      pagination: {
        el: paginationEl,
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 2,
      },
    });
  }
}

