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


import { getReview, paramsSwiperReview, writeRevier } from './js/review';


const element = document.querySelector(".swiper-wrapper")

firsLoadet()

async function firsLoadet(){
   try{
    
    const views = await getReview()
    console.log(views);
    element.innerHTML = writeRevier(views);
    const swiperReview = new Swiper('.swiper', paramsSwiperReview);
   }catch(error){
    console.log(error);
   }finally{
   }
}






