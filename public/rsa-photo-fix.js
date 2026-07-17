(() => {
  // South Africa: imágenes verificadas visualmente contra el álbum completo.
  const PHOTOS = {
    RSA2: '/rsa/RSA2.jpg',
    RSA7: '/rsa/RSA7.jpg',
    RSA8: '/rsa/RSA8.jpg',
    RSA15: '/rsa/RSA15.jpg'
  };

  function apply(root = document) {
    const cards = root.querySelectorAll ? root.querySelectorAll('.sticker') : [];
    for (const card of cards) {
      const code = (card.querySelector('b')?.textContent || '').trim().toUpperCase();
      const img = card.querySelector('.stickerImage img');
      if (!img || !PHOTOS[code] || img.dataset.verifiedRsa === 'true') continue;
      img.src = PHOTOS[code];
      img.dataset.verifiedRsa = 'true';
    }
  }

  function run() {
    apply();
    new MutationObserver(() => apply())
      .observe(document.body, { childList: true, subtree: true });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', run)
    : run();
})();
