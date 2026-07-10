(() => {
  const processed = new WeakSet()

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim()
  }

  function escapeXml(value) {
    return clean(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  function cardData(img) {
    const card = img.closest('.sticker, .crestSticker')
    const code = clean(
      card?.querySelector(':scope > b')?.textContent ||
      card?.querySelector('.crestCode')?.textContent ||
      img.alt.match(/[A-Z]{2,4}\d{1,2}/)?.[0] ||
      'FIFA26'
    )
    const prefix = code.match(/^[A-Z]+/)?.[0] || 'FIFA26'
    let name = clean(card?.querySelector(':scope > span:not(.crestCode):not(.crestState)')?.textContent || img.alt || 'Figurita')
    name = name
      .replace(/^Figurita\s+[A-Z]{2,4}\d{1,2}\s*-\s*/i, '')
      .replace(/^Figurita\s+/i, '')
    return { code, prefix, name }
  }

  function wrapName(name, max = 20) {
    const words = clean(name).split(' ')
    const lines = []
    let line = ''
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      if (candidate.length > max && line) {
        lines.push(line)
        line = word
      } else {
        line = candidate
      }
    }
    if (line) lines.push(line)
    return lines.slice(0, 3)
  }

  function fallbackSrc(img) {
    const { code, prefix, name } = cardData(img)
    const lines = wrapName(name)
    const lineSvg = lines.map((line, index) =>
      `<text x="180" y="${252 + index * 34}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${lines.length > 2 ? 24 : 28}" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`
    ).join('')

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#071b2d"/>
          <stop offset="1" stop-color="#17598a"/>
        </linearGradient>
      </defs>
      <rect width="360" height="480" rx="22" fill="url(#g)"/>
      <rect x="18" y="18" width="324" height="444" rx="18" fill="none" stroke="#78c7ff" stroke-width="3"/>
      <circle cx="180" cy="142" r="70" fill="#ffffff" fill-opacity="0.10" stroke="#78c7ff" stroke-width="3"/>
      <text x="180" y="160" text-anchor="middle" font-family="Arial,sans-serif" font-size="44" font-weight="800" fill="#ffffff">${escapeXml(prefix)}</text>
      ${lineSvg}
      <text x="180" y="392" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="800" fill="#78c7ff">${escapeXml(code)}</text>
      <text x="180" y="430" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#d8edf9">FOTO PENDIENTE DE VERIFICACIÓN</text>
    </svg>`

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }

  function isGenericMissing(img) {
    try {
      return decodeURIComponent(img.currentSrc || img.src || '').includes('Sin foto')
    } catch {
      return String(img.currentSrc || img.src || '').includes('Sin foto')
    }
  }

  function replace(img) {
    if (!(img instanceof HTMLImageElement) || processed.has(img)) return
    processed.add(img)
    img.src = fallbackSrc(img)
    img.dataset.fallbackCard = 'verified-name'
  }

  function inspect(img) {
    if (!(img instanceof HTMLImageElement)) return
    if (isGenericMissing(img)) replace(img)
  }

  document.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement) replace(event.target)
  }, true)

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue
        if (node.matches('img')) inspect(node)
        node.querySelectorAll?.('img').forEach(inspect)
      }
    }
  })

  function start() {
    document.querySelectorAll('img').forEach(inspect)
    observer.observe(document.documentElement, { childList: true, subtree: true })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true })
  else start()
})()
