import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const ANIMAL_URL = 'https://paw-hut.b.goit.study/api/animals';
const ORDER_URL = 'https://paw-hut.b.goit.study/api/orders';

const animalModalBackdrop = document.querySelector('.animal-modal-backdrop');
const orderModalBackdrop = document.querySelector('.order-modal-backdrop');
const orderForm = document.querySelector('.order-form');

let currentAnimalId = null;

export function openModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
}
export function closeModal(modal) {
  if (!modal) return;
  modal.classList.add('is-hidden');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

export async function getAnimalById(id) {
  try {
    let page = 1;
    const limit = 30;
    let foundAnimal = null;

    while (!foundAnimal) {
      const response = await axios.get(
        `${ANIMAL_URL}?page=${page}&limit=${limit}`
      );
      const animals = response.data.animals || [];
      const totalItems = response.data.totalItems || 0;

      foundAnimal = animals.find(animal => animal._id === id) || null;

      const loadedItems = page * limit;
      const isLastPage = loadedItems >= totalItems || animals.length === 0;

      if (foundAnimal || isLastPage) {
        break;
      }

      page += 1;
    }

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

export function renderAnimalModal(animal) {
  if (!animal || !animalModalBackdrop) return;

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

export async function handleAnimalClick(id) {
  const animal = await getAnimalById(id);

  if (animal && animalModalBackdrop) {
    renderAnimalModal(animal);
    openModal(animalModalBackdrop);
  }
}

function clearErrors(form) {
  const inputs = form.querySelectorAll('.order-form-input');
  inputs.forEach(input => {
    input.classList.remove('is-invalid');
    const errorMsg = input.parentNode.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.textContent = '';
      errorMsg.style.display = 'none';
    }
  });
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const orderBtn = form.querySelector('#orderBtn');

  if (!currentAnimalId) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вибрано тварину. Спробуйте відкрити картку знову.',
      position: 'topRight',
    });
    return;
  }

  clearErrors(form);

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
    hasError = true;
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

  const formData = {
    animalId: currentAnimalId,
    name: name,
    phone: phone,
    comment:
      form.elements.message.value.trim() || 'Клієнт не залишив коментаря',
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
    console.error('Server Validation Error:', error.response?.data);
    iziToast.error({
      title: 'Упс',
      message: 'Щось пішло не так.',
      position: 'topRight',
    });
  } finally {
    orderBtn.disabled = false;
  }
}

export function initModalEvents() {
  if (!animalModalBackdrop || !orderModalBackdrop || !orderForm) {
    return;
  }

  animalModalBackdrop
    .querySelector('.modal-close-btn')
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

  orderModalBackdrop
    .querySelector('.modal-close-btn')
    .addEventListener('click', () => closeModal(orderModalBackdrop));
  orderForm.addEventListener('submit', handleFormSubmit);

  orderModalBackdrop.addEventListener('click', event => {
    if (event.target === orderModalBackdrop) {
      closeModal(orderModalBackdrop);
    }
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal(animalModalBackdrop);
      closeModal(orderModalBackdrop);
    }
  });
}
initModalEvents();
