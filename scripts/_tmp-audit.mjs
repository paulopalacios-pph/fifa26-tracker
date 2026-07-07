import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const prefixes = ['CIV', 'COD', 'CPV', 'CRO', 'CUW', 'CZE']
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const outputDir = path.join(process.cwd(), 'public')

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

for (const prefix of prefixes) {
  const names = fs.readdirSync(sourceDir)
    .filter(name => new RegExp(`^${prefix}\\d+\\.(png|jpe?g)$`, 'i').test(name))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))

  const cellWidth = 320
  const cellHeight = 155
  const columns = 2
  const rows = Math.max(1, Math.ceil(names.length / columns))
  const composites = []

  for (let index = 0; index < names.length; index += 1) {
    const name = names[index]
    const filePath = path.join(sourceDir, name)
    const metadata = await sharp(filePath).metadata()
    const width = metadata.width || 1
    const height = metadata.height || 1
    const cropTop = Math.max(0, Math.floor(height * 0.62))
    const cropHeight = Math.max(1, height - cropTop)

    const full = await sharp(filePath)
      .resize(100, 125, { fit: 'contain', background: '#ffffff' })
      .jpeg({ quality: 78, chromaSubsampling: '4:4:4' })
      .toBuffer()

    const namebar = await sharp(filePath)
      .extract({ left: 0, top: cropTop, width, height: cropHeight })
      .resize(220, 125, { fit: 'contain', background: '#ffffff' })
      .jpeg({ quality: 82, chromaSubsampling: '4:4:4' })
      .toBuffer()

    const left = (index % columns) * cellWidth
    const top = Math.floor(index / columns) * cellHeight
    composites.push({ input: full, left, top })
    composites.push({ input: namebar, left: left + 100, top })

    const label = Buffer.from(`<svg width="${cellWidth}" height="30" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="160" y="21" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="black">${escapeXml(name)}</text></svg>`)
    composites.push({ input: label, left, top: top + 125 })
  }

  const sheet = await sharp({
    create: {
      width: columns * cellWidth,
      height: rows * cellHeight,
      channels: 3,
      background: '#d7d7d7'
    }
  })
    .composite(composites)
    .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
    .toBuffer()

  fs.writeFileSync(path.join(outputDir, `_tmp-${prefix}.txt`), sheet.toString('base64'), 'utf8')
  console.log(`Generated ${prefix}: ${names.length} images, ${sheet.length} bytes.`)
}
