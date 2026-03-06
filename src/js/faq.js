import Accordion from 'accordion-js';

const faqContainer = document.querySelector('.accordion-container');

if (faqContainer) {
  new Accordion(faqContainer, {
    duration: 300,
    showMultiple: false,
  });
}

