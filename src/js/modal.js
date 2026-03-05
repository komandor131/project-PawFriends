import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const ANIMAL_URL = 'https://paw-hut.b.goit.study/api/animals';
const ORDER_URL = 'https://paw-hut.b.goit.study/api/orders';

const animalModalBackdrop = document.querySelector('.animal-modal-backdrop');
const orderModalBackdrop = document.querySelector('.order-modal-backdrop');
const orderForm = document.querySelector('.order-form');
const loadingSpinner = document.querySelector('.loader');

let currentAnimalId = null;

/**
 * Functions to open and close modals
 */
export function openModal(modal) {
  modal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
}
export function closeModal(modal) {
  modal.classList.add('is-hidden');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

/**
 * Fetches animal data from the API and finds a specific animal by its ID.
 */
export async function getAnimalById(id) {
  try {
    const response = await axios.get(`${ANIMAL_URL}?page=1&limit=10`);
    const animals = response.data.animals;
    const foundAnimal = animals.find(animal => animal._id === id);

    if (!foundAnimal) {
      iziToast.warning({
        title: 'Упс',
        message: 'Інформацію про цю тваринку не вдалося отримати.',
        position: 'topRight',
      });
      return null;
    }

    return foundAnimal;
  } catch (error) {
    console.error('Error fetching animal data:', error);
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося отримати дані. Перевірте з’єднання.',
      position: 'topRight',
    });
    return null;
  }
}

/**
 * Injects animal data into the modal template and opens the modal.
 */
export function renderAnimalModal(animal) {
  if (!animal) return;

  currentAnimalId = animal._id;

  const img = animalModalBackdrop.querySelector('.animal-image');
  const name = animalModalBackdrop.querySelector('.name');
  const species = animalModalBackdrop.querySelector('.species');
  const age = animalModalBackdrop.querySelector('.age');
  const gender = animalModalBackdrop.querySelector('.gender');
  const infoTexts = animalModalBackdrop.querySelectorAll('.info-text');

  img.src = animal.image;
  img.alt = animal.name;
  name.textContent = animal.name;
  species.textContent = animal.species;
  age.textContent = animal.age;
  gender.textContent = animal.gender;

  if (infoTexts.length >= 3) {
    infoTexts[0].textContent = animal.description;
    infoTexts[1].textContent = animal.healthStatus;
    infoTexts[2].textContent = animal.behavior;
  }
}

/**
 * Coordinates fetching animal data and opening the modal.
 * Used as a main entry point for card click events.
 */
export async function handleAnimalClick(id) {
  const animal = await getAnimalById(id);

  if (animal) {
    renderAnimalModal(animal);
    openModal(animalModalBackdrop);
  }
}

/**
 * Clears all error messages and invalid styles from the form.
 */
function clearErrors(form) {
  const inputs = form.querySelectorAll('.order-form-input');
  inputs.forEach(input => {
    input.classList.remove('is-invalid');
    const errorMsg = form.querySelector('.error-message');
    if (errorMsg && errorMsg.classList.contains('error-message')) {
      errorMsg.textContent = '';
    }
  });
}

/**
 * Handles the form submission event.
 * Validates the input fields and displays error messages if needed.
 * Sends the animal ID, name, phone, and comment as part of the order data.
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const orderBtn = form.querySelector('#orderBtn');

  clearErrors(form);

  // validation
  let hasError = false;
  const name = form.elements.name.value.trim();
  const phone = form.elements.tel.value.trim().replace(/[^\d]/g, '');

  const phonePattern = /^380\d{9}$/;
  if (phone && !phonePattern.test(phone)) {
    const input = form.elements.tel;
    input.classList.add('is-invalid');
    input.parentNode.querySelector('.error-message').style.display = 'block';
    input.parentNode.querySelector('.error-message').textContent =
      'Невірний формат номера. Введіть 380XXXXXXXXX.';
    hasError = true;
  } else if (!phone) {
    const input = form.elements.tel;
    input.classList.add('is-invalid');
    input.parentNode.querySelector('.error-message').style.display = 'block';
    input.parentNode.querySelector('.error-message').textContent =
      'Будь ласка, введіть номер телефону в форматі 380XXXXXXXXX.';
  }

  if (!name) {
    const input = form.elements.name;
    input.classList.add('is-invalid');
    input.parentNode.querySelector('.error-message').style.display = 'block';
    input.parentNode.querySelector('.error-message').textContent =
      "Будь ласка, введіть ваше ім'я.";
    hasError = true;
  }

  if (hasError) return;

  // send data to API
  const formData = {
    animalId: currentAnimalId || '667ad1b8e4b01a2b3c4d5e01',
    name: name,
    phone: phone,
    comment: form.elements.message.value.trim(),
  };

  orderBtn.disabled = true;

  try {
    const response = await axios.post(ORDER_URL, formData);

    iziToast.success({
      title: 'Успіх!',
      message: 'Ваша заявка успішно відправлена.',
      position: 'topRight',
    });

    form.reset();
    closeModal(orderModalBackdrop);
  } catch (error) {
    console.error('Error submitting order:', error);
    iziToast.error({
      title: 'Упс',
      message: 'Щось пішло не так.',
      position: 'topRight',
    });
  } finally {
    orderBtn.disabled = false;
  }
}

/**
 * Initializes event listeners for closing the modal (button, backdrop, Escape key)
 * and switching to the adoption form.
 */
export function initModalEvents() {
  // Animal Modal
  animalModalBackdrop
    .querySelector('#closeModal')
    .addEventListener('click', () => closeModal(animalModalBackdrop));

  animalModalBackdrop
    .querySelector('.adoptBtn')
    .addEventListener('click', () => {
      closeModal(animalModalBackdrop);
      openModal(orderModalBackdrop);
    });

  animalModalBackdrop.addEventListener('click', event => {
    if (event.target === animalModalBackdrop) {
      closeModal(animalModalBackdrop);
    }
  });

  // Order Modal
  orderModalBackdrop
    .querySelector('#closeModal')
    .addEventListener('click', () => closeModal(orderModalBackdrop));
  orderForm.addEventListener('submit', handleFormSubmit);

  orderModalBackdrop.addEventListener('click', event => {
    if (event.target === orderModalBackdrop) {
      closeModal(orderModalBackdrop);
    }
  });

  // Close on Escape key press
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal(animalModalBackdrop);
      closeModal(orderModalBackdrop);
    }
  });
}

// Global initialization
initModalEvents();

// For testing
window.testAnimalModal = handleAnimalClick;
testAnimalModal('667ad1b8e4b01a2b3c4d5e01');

// const detailsBtn = document.querySelector('.tails-btn');
// detailsBtn.addEventListener('click', initModalEvents);
