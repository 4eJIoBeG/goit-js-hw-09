import galleryItems from './gallery-items';

const root = {
  gallery: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  modalOverlay: document.querySelector('.lightbox__overlay'),
  modalImage: document.querySelector('.lightbox__image'),
};

//Создаем галлерею по шаблону и добавляем блок галереи в HTML
const images = galleryItems
  .map(
    (image, index) =>
      `<li class="gallery__item">
        <a class="gallery__link" href="${image.original}">
          <img
            class="gallery__image"
            src="${image.preview}"
            data-source="${image.original}"
            data-index="${index}"
            alt="${image.description}"
          />
        </a>
      </li>`
  )
  .join('');
root.gallery.insertAdjacentHTML('afterbegin', images);

//При открытии модального окна
const openModal = event => {
  event.preventDefault();
  window.addEventListener('keydown', slider);
  window.addEventListener('keydown', closeModal);
  if (event.target.nodeName === 'IMG') {
    root.modal.classList.add('is-open');
    root.modalImage.src = event.target.dataset.source;
    root.modalImage.alt = event.target.alt;
    root.modalImage.dataset.index = event.target.dataset.index;
  }
  return;
};

//При закрытии модального окна
const closeModal = event => {
  if (
    event.target.dataset.action === 'close-lightbox' ||
    event.target.className === 'lightbox__overlay' ||
    event.code === 'Escape'
  ) {
    root.modalImage.src = '';
    root.modalImage.alt = '';
    root.modalImage.classList.add('activeImg');
    root.modalImage.dataset.index = '';
    root.modal.classList.remove('is-open');
    window.removeEventListener('keydown', closeModal);
    window.removeEventListener('keydown', slider);
  }
  return;
};

//Прокрутка галлерии стрелками
const slider = event => {
  const currentImage = document.querySelector('.lightbox__content > img');
  const allImages = document.querySelectorAll('ul img');
  let indexImage = Number(root.modalImage.dataset.index);

  if (event.code === 'ArrowLeft') {
    indexImage -= 1;
    if (indexImage < 0) {
      indexImage = allImages.length - 1;
    }
    setSliderData(allImages, currentImage, indexImage);
  }

  if (event.code === 'ArrowRight') {
    indexImage += 1;
    if (indexImage >= allImages.length) {
      indexImage = 0;
    }
    setSliderData(allImages, currentImage, indexImage);
  }
  return;
};

//Добавление атрибутов изображениям в слайдере
const setSliderData = (allImages, currentImage, indexImage) => {
  currentImage.src = allImages[indexImage].dataset.source;
  currentImage.dataset.index = allImages[indexImage].dataset.index;
  currentImage.alt = allImages[indexImage].alt;
};

//Слушатели событий при открытом и закрытом модальном окне
root.gallery.addEventListener('click', openModal);
root.modal.addEventListener('click', closeModal);
root.modalImage.addEventListener('keydown', closeModal);
