const loaderElement = document.querySelector('.loader');

let pendingRequests = 0;

const syncLoaderState = () => {
  if (!loaderElement) {
    return;
  }

  if (pendingRequests > 0) {
    loaderElement.classList.remove('is-hidden');
    document.body.classList.add('is-loading');
    return;
  }

  loaderElement.classList.add('is-hidden');
  document.body.classList.remove('is-loading');
};

export const showLoader = () => {
  pendingRequests += 1;
  syncLoaderState();
};

export const hideLoader = () => {
  pendingRequests = Math.max(0, pendingRequests - 1);
  syncLoaderState();
};

export const withLoader = async callback => {
  showLoader();
  try {
    return await callback();
  } finally {
    hideLoader();
  }
};
