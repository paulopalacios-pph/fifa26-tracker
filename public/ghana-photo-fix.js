(() => {
  // Ghana: imágenes extraídas y verificadas visualmente contra código + nombre.
  // row0: GHA1, GHA2, GHA5, GHA6
  // row1: GHA7, GHA8, GHA9, GHA10
  // row2: GHA12, GHA14, GHA16, GHA20
  const CELLS = {
    GHA1: ['/ghana/row0.b64', 0],
    GHA2: ['/ghana/row0.b64', 1],
    GHA5: ['/ghana/row0.b64', 2],
    GHA6: ['/ghana/row0.b64', 3],
    GHA7: ['/ghana/row1.b64', 0],
    GHA8: ['/ghana/row1.b64', 1],
    GHA9: ['/ghana/row1.b64', 2],
    GHA10: ['/ghana/row1.b64', 3],
    GHA12: ['/ghana/row2.b64', 0],
    GHA14: ['/ghana/row2.b64', 1],
    GHA16: ['/ghana/row2.b64', 2],
    GHA20: ['/ghana/row2.b64', 3]
  };

  const sourcePromises = new Map();
  const crops = new Map();

  function loadSource(path) {
    if (sourcePromises.has(path)) return sourcePromises.get(path);
    const promise = fetch(path)
      .then((response) => {
        if (!response.ok) throw new Error(`Ghana source ${path}: ${response.status}`);
        return response.text();
      })
      .then((base64) => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = `data:image/jpeg;base64,${base64.trim()}`;
      }));
    sourcePromises.set(path, promise);
    return promise;
  }

  function makeCrop(source, column) {
    const left = Math.round((column / 4) * source.naturalWidth);
    const right = Math.round(((column + 1) / 4) * source.naturalWidth);
    const canvas = document.createElement('canvas');
    canvas.width = right - left;
    canvas.height = source.naturalHeight;
    canvas.getContext('2d').drawImage(
      source,
      left, 0, right - left, source.naturalHeight,
      0, 0, canvas.width, canvas.height
    );
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  async function srcFor(code) {
    if (crops.has(code)) return crops.get(code);
    const cell = CELLS[code];
    if (!cell) return null;
    const source = await loadSource(cell[0]);
    const src = makeCrop(source, cell[1]);
    crops.set(code, src);
    return src;
  }

  async function apply(root = document) {
    const cards = root.querySelectorAll ? root.querySelectorAll('.sticker') : [];
    for (const card of cards) {
      const code = (card.querySelector('b')?.textContent || '').trim().toUpperCase();
      const img = card.querySelector('.stickerImage img');
      if (!img || !CELLS[code] || img.dataset.verifiedGhana === 'true') continue;
      const src = await srcFor(code);
      if (src) {
        img.src = src;
        img.dataset.verifiedGhana = 'true';
      }
    }

    const crests = root.querySelectorAll ? root.querySelectorAll('.crestSticker') : [];
    for (const card of crests) {
      const code = (card.querySelector('.crestCode')?.textContent || '').trim().toUpperCase();
      const img = card.querySelector('img');
      if (!img || code !== 'GHA1' || img.dataset.verifiedGhana === 'true') continue;
      const src = await srcFor(code);
      if (src) {
        img.src = src;
        img.dataset.verifiedGhana = 'true';
      }
    }
  }

  function run() {
    apply().catch(console.error);
    new MutationObserver(() => apply().catch(console.error))
      .observe(document.body, { childList: true, subtree: true });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', run)
    : run();
})();