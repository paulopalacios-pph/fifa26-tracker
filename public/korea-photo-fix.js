(() => {
  // Fuente única entregada por Paulo: lámina completa de Corea.
  // Se recorta en el navegador para evitar duplicar 14 archivos binarios.
  const CELLS = {
    KOR1: [0, 0],   // Escudo
    KOR2: [0, 1],   // Hyeonwoo Jo
    KOR3: [0, 3],   // Seunggyu Kim
    KOR5: [2, 0],   // Yumin Cho
    KOR6: [0, 2],   // Youngwoo Seol
    KOR7: [3, 0],   // Hanbeom Lee
    KOR9: [1, 0],   // Myungjae Lee
    KOR10: [2, 1],  // Jaesung Lee
    KOR12: [1, 1],  // Kangin Lee
    KOR14: [1, 3],  // Seungho Paik
    KOR15: [1, 2],  // Jens Castrop
    KOR18: [2, 3],  // Heungmin Son
    KOR19: [3, 1],  // Heechan Hwang
    KOR20: [2, 2]   // Hyeongyu Oh
  };

  const X = [0, 281 / 1123, 561 / 1123, 841 / 1123, 1];
  const Y = [0, 375 / 1501, 750 / 1501, 1125 / 1501, 1];
  const CROPS = {};
  let sourcePromise;

  function loadSource() {
    if (sourcePromise) return sourcePromise;
    sourcePromise = fetch('/korea-source.b64')
      .then((response) => {
        if (!response.ok) throw new Error(`Korea source: ${response.status}`);
        return response.text();
      })
      .then((base64) => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = `data:image/jpeg;base64,${base64.trim()}`;
      }));
    return sourcePromise;
  }

  function makeCrop(source, row, col) {
    const sx = Math.round(X[col] * source.naturalWidth);
    const sy = Math.round(Y[row] * source.naturalHeight);
    const ex = Math.round(X[col + 1] * source.naturalWidth);
    const ey = Math.round(Y[row + 1] * source.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = ex - sx;
    canvas.height = ey - sy;
    canvas.getContext('2d').drawImage(
      source,
      sx, sy, ex - sx, ey - sy,
      0, 0, canvas.width, canvas.height
    );
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  async function cropFor(code) {
    if (CROPS[code]) return CROPS[code];
    const cell = CELLS[code];
    if (!cell) return null;
    const source = await loadSource();
    CROPS[code] = makeCrop(source, cell[0], cell[1]);
    return CROPS[code];
  }

  async function apply(root = document) {
    const cards = root.querySelectorAll ? root.querySelectorAll('.sticker') : [];
    for (const card of cards) {
      const code = (card.querySelector('b')?.textContent || '').trim().toUpperCase();
      const img = card.querySelector('.stickerImage img');
      if (!img || !CELLS[code] || img.dataset.verifiedKorea === 'true') continue;
      const src = await cropFor(code);
      if (src) {
        img.src = src;
        img.dataset.verifiedKorea = 'true';
      }
    }

    const crests = root.querySelectorAll ? root.querySelectorAll('.crestSticker') : [];
    for (const card of crests) {
      const code = (card.querySelector('.crestCode')?.textContent || '').trim().toUpperCase();
      const img = card.querySelector('img');
      if (!img || !CELLS[code] || img.dataset.verifiedKorea === 'true') continue;
      const src = await cropFor(code);
      if (src) {
        img.src = src;
        img.dataset.verifiedKorea = 'true';
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
