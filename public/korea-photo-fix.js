(() => {
  const ASSETS = {
    KOR1: '/stickers/KOR01.png',
    KOR2: '/stickers/KOR02.png',
    KOR3: '/stickers/KOR04.png',
    KOR5: '/stickers/KOR09.png',
    KOR6: '/stickers/KOR03.png',
    KOR7: '/stickers/KOR13.png',
    KOR9: '/stickers/KOR05.png',
    KOR10: '/stickers/KOR10.png',
    KOR12: '/stickers/KOR06.png',
    KOR14: '/stickers/KOR08.png',
    KOR15: '/stickers/KOR07.png',
    KOR18: '/stickers/KOR12.png',
    KOR19: '/stickers/KOR14.png',
    KOR20: '/stickers/KOR11.png'
  };

  function apply(root = document) {
    const cards = root.querySelectorAll ? root.querySelectorAll('.sticker') : [];
    for (const card of cards) {
      const code = (card.querySelector('b')?.textContent || '').trim().toUpperCase();
      const src = ASSETS[code];
      const img = card.querySelector('.stickerImage img');
      if (src && img && !img.src.endsWith(src)) {
        img.src = src;
        img.dataset.verifiedKorea = 'true';
      }
    }

    const crests = root.querySelectorAll ? root.querySelectorAll('.crestSticker') : [];
    for (const card of crests) {
      const code = (card.querySelector('.crestCode')?.textContent || '').trim().toUpperCase();
      const src = ASSETS[code];
      const img = card.querySelector('img');
      if (src && img && !img.src.endsWith(src)) {
        img.src = src;
        img.dataset.verifiedKorea = 'true';
      }
    }
  }

  function run() {
    apply();
    new MutationObserver(() => apply()).observe(document.body, { childList: true, subtree: true });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', run)
    : run();
})();
