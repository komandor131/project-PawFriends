import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import { Navigation, Pagination } from 'swiper/modules';
export const getReview = async () =>{
    const {data} = await axios.get("https://paw-hut.b.goit.study/api/feedbacks")
    return data.feedbacks
}



export const writeRevier = (arr) =>{
    return arr.map(({rate, _id, description, author}) =>`
           <div class="swiper-slide" id="review-${_id}">
            <div id="rating" class="revier-rating">
            ${renderRating(rate)}
            </div>
            <p class="element-text">${description}</p>
            <p class="element-author">${author}</p>
            </div>
    `).join("")
}

export function renderRating(value) {
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  if (hasHalf) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

function swiperNextStop(){
  const nextBtm = document.querySelector('.review-next')
  if (nextBtm){
    nextBtm.style.opacity = 0.4;
    nextBtm.style.background = "#eee9e3";
    nextBtm.pointerEvents = 'none';
  }
}
function swiperNextAwait(){
   const nextBtm = document.querySelector('.review-next')
  if (nextBtm){
    nextBtm.style.opacity = 1;
    nextBtm.pointerEvents = 'auto';
  } 
}
function btnBackStao(){
  const prevBtn = document.querySelector(".review-prev")
  if(prevBtn){
    prevBtn.style.opacity = 1;
    prevBtn.pointerEvents = 'auto';
  }
}


export  const paramsSwiperReview = {
  modules: [Navigation, Pagination],
  loop: false,
  slidesPerView: 1,
  navigation: {
    nextEl: '.review-next',
    prevEl: '.review-prev',
  },
  pagination: {
    el: '.review-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      slidesPerGroup: 1,
    },
    768: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },
  },
  spaceBetween: 32,
on: {
  init(swiper) {
    const prevBtn = document.querySelector(".review-prev");
    if (swiper.isBeginning && prevBtn) {
      prevBtn.style.opacity = 0.4;
      prevBtn.style.pointerEvents = "none";
    }
    
  },
  reachEnd(swiper) {
    swiperNextStop();
  },
  fromEdge(swiper) {
    swiperNextAwait();
  },
  slideChange(swiper) {
    const prevBtn = document.querySelector(".review-prev");
    const nextBtn = document.querySelector(".review-next");

    // prev
    if (swiper.isBeginning) {
      prevBtn.style.opacity = 0.4;
      prevBtn.style.pointerEvents = "none";
    } else {
      prevBtn.style.opacity = 1;
      prevBtn.style.pointerEvents = "auto";
    }

    // next
    if (swiper.isEnd) {
      nextBtn.style.opacity = 0.4;
      nextBtn.style.pointerEvents = "none";
    } else {
      nextBtn.style.opacity = 1;
      nextBtn.style.pointerEvents = "auto";
    }
  }
}

};
