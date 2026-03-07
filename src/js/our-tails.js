import axios from 'axios';
import iziToast from 'izitoast';
import { handleAnimalClick } from './modal.js';

const api = axios.create({
  baseURL: 'https://paw-hut.b.goit.study/api',
});

const refs = {
  categories: document.querySelector('.tails-category'),
  animals: document.querySelector('.tails-list'),
  loader: document.querySelector('.loader'),
  pagination: document.querySelector('.tails-pagination'),
  pageNumbers: document.querySelector('.pagination-numbers'),
  prevBtn: document.querySelector('.tails-pagination .prev-btn'),
  nextBtn: document.querySelector('.tails-pagination .next-btn'),
};

const state = {
  page: 1,
  categoryId: null,
};

const getLimit = () => (window.innerWidth >= 1440 ? 9 : 8);

let lastLimit = getLimit();

const showLoader = () => {
  if (refs.loader) {
    refs.loader.classList.remove('is-hidden');
  }
};

const hideLoader = () => {
  if (refs.loader) {
    refs.loader.classList.add('is-hidden');
  }
};

const hidePagination = () => {
  if (refs.pagination) {
    refs.pagination.classList.add('is-hidden');
  }
};

const init = async () => {
  if (!refs.categories || !refs.animals) {
    return;
  }

  refs.categories.addEventListener('click', handleCategoryChange);
  refs.animals.addEventListener('click', handleMoreBtnClick);

  if (refs.pagination) {
    refs.pagination.addEventListener('click', handlePageChange);
  }

  window.addEventListener('resize', handleResize);

  await loadCategories();
  await updateAnimals();
};

const loadCategories = async () => {
  try {
    const response = await api.get('/categories');
    const categories = response.data;

    let html =
      '<li><button class="category-btn active" data-id="all">Всі</button></li>';

    categories.forEach(cat => {
      html += `<li><button class="category-btn" data-id="${cat._id}">${cat.name}</button></li>`;
    });

    refs.categories.innerHTML = html;
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити категорії. Спробуйте ще раз.',
      position: 'topRight',
    });
    console.error('Помилка при завантаженні категорій:', error);
  }
};

const updateAnimals = async () => {
  showLoader();
  hidePagination();

  try {
    const limit = getLimit();
    const params = {
      page: state.page,
      limit: limit,
    };

    if (state.categoryId !== null) {
      params.categoryId = state.categoryId;
    }

    const response = await api.get('/animals', { params });
    const data = response.data;

    renderAnimals(data.animals);
    renderPagination(data.totalItems, limit);
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити тварин. Спробуйте ще раз.',
      position: 'topRight',
    });
    console.error('Помилка при завантаженні тварин:', error);
  } finally {
    hideLoader();
  }
};

const renderAnimals = animals => {
  const html = animals
    .map(animal => {
      const tagsHtml = animal.categories
        .map(cat => {
          return `<span class="tails-tag">${cat.name}</span>`;
        })
        .join('');

      return `
      <li class="tails-item">
        <div class="tails-item-img-wrap">
           <img src="${animal.image}" alt="${animal.name}" class="tails-item-img" />
        </div>
        <div class="tails-item-content">
          <p class="tails-item-species">${animal.species}</p>
          <h3 class="tails-item-name">${animal.name}</h3>
          <div class="tails-item-tags">
             ${tagsHtml}
          </div>
          <div class="tails-item-info">
             <span class="tails-info-text">${animal.age}</span>
             <span class="tails-info-text">${animal.gender}</span>
          </div>
          <p class="tails-item-desc">${animal.shortDescription}</p>
          <button class="tails-item-btn-more" data-id="${animal._id}">Дізнатись більше</button>
        </div>
      </li>
    `;
    })
    .join('');

  refs.animals.innerHTML = html;
};

const renderPagination = (totalItems, limit) => {
  if (!refs.pagination) {
    return;
  }

  const totalPages = Math.ceil(totalItems / limit);

  if (totalPages <= 1) {
    refs.pagination.classList.add('is-hidden');
    return;
  }

  refs.pagination.classList.remove('is-hidden');

  if (state.page === 1) {
    refs.prevBtn.disabled = true;
  } else {
    refs.prevBtn.disabled = false;
  }

  if (state.page === totalPages) {
    refs.nextBtn.disabled = true;
  } else {
    refs.nextBtn.disabled = false;
  }

  const createNumberBtn = (pageNumber, content) => {
    let activeClass = '';

    if (pageNumber === state.page) {
      activeClass = 'active';
    }

    return `<button class="page-btn num-btn ${activeClass}" data-page="${pageNumber}">${content}</button>`;
  };

  const isMobile = window.innerWidth < 768;
  let html = '';

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      html += createNumberBtn(i, i);
    }
  } else if (isMobile) {
    const pagesToShow = new Set([1, totalPages]);

    if (state.page <= 3) {
      pagesToShow.add(2);
      pagesToShow.add(3);
      pagesToShow.add(4);
    } else if (state.page >= totalPages - 2) {
      pagesToShow.add(totalPages - 3);
      pagesToShow.add(totalPages - 2);
      pagesToShow.add(totalPages - 1);
    } else {
      pagesToShow.add(state.page - 1);
      pagesToShow.add(state.page);
      pagesToShow.add(state.page + 1);
    }

    const pages = [...pagesToShow]
      .filter(pageNumber => pageNumber >= 1 && pageNumber <= totalPages)
      .sort((a, b) => a - b);

    pages.forEach((pageNumber, index) => {
      if (index > 0 && pageNumber - pages[index - 1] > 1) {
        html += '<span class="page-dots">...</span>';
      }

      html += createNumberBtn(pageNumber, pageNumber);
    });
  } else {
    html += createNumberBtn(1, 1);

    if (state.page > 3) {
      html += '<span class="page-dots">...</span>';
    }

    let start = Math.max(2, state.page - 1);
    let end = Math.min(totalPages - 1, state.page === 1 ? 3 : state.page + 1);

    for (let i = start; i <= end; i++) {
      html += createNumberBtn(i, i);
    }

    if (state.page < totalPages - 2) {
      html += '<span class="page-dots">...</span>';
    }

    html += createNumberBtn(totalPages, totalPages);
  }

  refs.pageNumbers.innerHTML = html;
};

const handleCategoryChange = event => {
  if (event.target.nodeName !== 'BUTTON') {
    return;
  }

  let id = event.target.dataset.id;

  if (id === 'all') {
    id = null;
  }

  if (id === state.categoryId) {
    return;
  }

  const buttons = document.querySelectorAll('.category-btn');

  buttons.forEach(button => {
    if (button === event.target) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  state.categoryId = id;
  state.page = 1;

  refs.pagination.classList.add('is-hidden');

  updateAnimals();
};

const handlePageChange = event => {
  const btn = event.target.closest('.page-btn');

  if (!btn || btn.disabled === true) {
    return;
  }

  if (btn.classList.contains('prev-btn')) {
    state.page -= 1;
  } else if (btn.classList.contains('next-btn')) {
    state.page += 1;
  } else if (btn.dataset.page) {
    state.page = Number(btn.dataset.page);
  }

  const section = document.getElementById('find-friend');
  if (section) {
    window.location.href = '#find-friend';
  }

  updateAnimals();
};

const handleResize = () => {
  const newLimit = getLimit();

  if (lastLimit !== newLimit) {
    lastLimit = newLimit;
    state.page = 1;
    updateAnimals();
  }
};

const handleMoreBtnClick = event => {
  const button = event.target.closest('.tails-item-btn-more');

  if (!button) {
    return;
  }

  const animalId = button.dataset.id;

  if (!animalId) {
    return;
  }

  handleAnimalClick(animalId);
};

document.addEventListener('DOMContentLoaded', init);


