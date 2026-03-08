import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import { Navigation, Pagination } from 'swiper/modules';
import { withLoader } from './loader.js';

const FEEDBACKS_API_URL = 'https://paw-hut.b.goit.study/api/feedbacks';

export const getReview = async () => {
  const { data } = await withLoader(() => axios.get(FEEDBACKS_API_URL));
  return Array.isArray(data.feedbacks) ? data.feedbacks : [];
};

export const writeRevier = reviews => {
  return reviews
    .map(
      ({ rate, _id, description, author }) => `
        <div class="swiper-slide review-slide" id="review-${_id}">
          <div class="review-rating">
            <span class="visually-hidden">Оцінка ${Number(rate) || 0} з 5</span>
            ${renderRating(Number(rate) || 0)}
          </div>
          <p class="review-card-text">${description}</p>
          <p class="review-card-author">${author}</p>
        </div>
      `
    )
    .join('');
};

export function renderRating(value) {
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  let starsHTML = '';

  for (let i = 0; i < fullStars; i += 1) {
    starsHTML += '<i class="fas fa-star" aria-hidden="true"></i>';
  }

  if (hasHalf) {
    starsHTML += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
  }

  for (let i = 0; i < emptyStars; i += 1) {
    starsHTML += '<i class="far fa-star" aria-hidden="true"></i>';
  }

  return starsHTML;
}

export const createReviewSwiperOptions = reviewSection => ({
  modules: [Navigation, Pagination],
  loop: false,
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 32,
  navigation: {
    nextEl: reviewSection.querySelector('.review-next'),
    prevEl: reviewSection.querySelector('.review-prev'),
  },
  pagination: {
    el: reviewSection.querySelector('.review-pagination'),
    clickable: true,
    dynamicBullets: true,
    dynamicMainBullets: 2,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },
  },
  on: {
    init(swiper) {
      const prevBtn = swiper.navigation?.prevEl;
      const nextBtn = swiper.navigation?.nextEl;

      if (swiper.isBeginning && prevBtn) {
        prevBtn.style.opacity = 0.4;
        prevBtn.style.pointerEvents = 'none';
      }

      if (swiper.isEnd && nextBtn) {
        nextBtn.style.opacity = 0.4;
        nextBtn.style.pointerEvents = 'none';
      }
    },
    slideChange(swiper) {
      const prevBtn = swiper.navigation?.prevEl;
      const nextBtn = swiper.navigation?.nextEl;

      if (swiper.isBeginning && prevBtn) {
        prevBtn.style.opacity = 0.4;
        prevBtn.style.pointerEvents = 'none';
      } else if (prevBtn) {
        prevBtn.style.opacity = 1;
        prevBtn.style.pointerEvents = 'auto';
      }

      if (swiper.isEnd && nextBtn) {
        nextBtn.style.opacity = 0.4;
        nextBtn.style.pointerEvents = 'none';
      } else if (nextBtn) {
        nextBtn.style.opacity = 1;
        nextBtn.style.pointerEvents = 'auto';
      }
    },
  },
});
