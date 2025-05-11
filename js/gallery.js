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
    img.dataset.source = original;

    fragment.appendChild(clone);
  });
  galleryEl.appendChild(fragment);

  let currentIndex = -1;

  galleryEl?.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target.closest('img.gallery-image');
    if (!target) return;

    currentIndex = images.findIndex(
      image => image.original === target.dataset.source
    );

    const showLightbox = index => {
      const { original, description } = images[index];
      const instance = basicLightbox.create(
        `
      <div class="lightbox">
        <img class="lightbox-image" src="${original}" alt="${description}" />
      </div>
      `,
        {
          onShow: instance => {
            console.log('Lightbox opened', instance.element());
            instance.element().addEventListener('click', instance.close);
          },
        }
      );

      instance.show();
    };

    showLightbox(currentIndex);
  });
}

initGallery();
