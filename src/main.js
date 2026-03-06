import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';
import StarRating from 'star-rating.js';
import 'star-rating.js/dist/star-rating.css';
import 'raty-js';
import Swal from 'sweetalert2';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

import.meta.glob('./js/*.js', { eager: true });

import {
  createReviewSwiperOptions,
  getReview,
  writeRevier,
} from './js/review';

const reviewSection = document.querySelector('.review-section');
const reviewWrapper = reviewSection?.querySelector('.review-swiper-wrapper');
const reviewSlider = reviewSection?.querySelector('.review-swiper');

if (reviewSection && reviewWrapper && reviewSlider) {
  firstLoad();
}

async function firstLoad() {
  try {
    const views = await getReview();
    reviewWrapper.innerHTML = writeRevier(views);

    new Swiper(reviewSlider, createReviewSwiperOptions(reviewSection));
  } catch (error) {
    console.log(error);
  }
}






