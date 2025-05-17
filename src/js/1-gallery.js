import SimpleLightbox from 'simplelightbox';

async function fetchImages() {
  // Simulating a fetch of images
  try {
    const { default: images } = await import('./images.js');
    console.log(images);
    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

async function initGallery() {
  const images = await fetchImages();

  const galleryEl = document.querySelector('.gallery');
  const template = document.querySelector('#gallery-item-template');
  const fragment = document.createDocumentFragment();

  images.forEach(({ preview, original, description }) => {
    const clone = template.content.cloneNode(true);
    const link = clone.querySelector('a.gallery-link');
    const img = clone.querySelector('img.gallery-image');

    link.href = original;
    img.src = preview;
    img.alt = description;
    img.title = description;
    img.dataset.source = original;

    fragment.appendChild(clone);
  });
  galleryEl.appendChild(fragment);

  let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    // captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
  gallery.on('show.simplelightbox', function (...rest) {
    console.log('Lightbox opened', rest);
  });

  gallery.on('error.simplelightbox', function (...rest) {
    console.log('Lightbox error', rest);
  });
}

initGallery();
