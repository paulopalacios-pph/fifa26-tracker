import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const prefixes = new Set(['CIV', 'COD', 'CPV', 'CRO', 'CUW', 'CZE'])
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const outputPath = path.join(process.cwd(), 'public', '_tmp-image-audit.json')
const contactPath = path.join(process.cwd(), 'public', '_tmp-contact.jpg')

function bitsToHex(bits) {
  let output = ''
  for (let index = 0; index < bits.length; index += 4) {
    const value = (bits[index] << 3) | (bits[index + 1] << 2) | (bits[index + 2] << 1) | bits[index + 3]
    output += value.toString(16)
  }
  return output
}

async function imageHashes(filePath) {
  const averagePixels = await sharp(filePath)
    .resize(8, 8, { fit: 'fill', kernel: 'nearest' })
    .grayscale()
    .raw()
    .toBuffer()
  const average = [...averagePixels].reduce((sum, value) => sum + value, 0) / averagePixels.length
  const aHash = bitsToHex([...averagePixels].map(value => value >= average ? 1 : 0))

  const differencePixels = await sharp(filePath)
    .resize(9, 8, { fit: 'fill', kernel: 'nearest' })
    .grayscale()
    .raw()
    .toBuffer()
  const differenceBits = []
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      differenceBits.push(differencePixels[y * 9 + x] > differencePixels[y * 9 + x + 1] ? 1 : 0)
    }
  }

  const metadata = await sharp(filePath).metadata()
  return {
    aHash,
    dHash: bitsToHex(differenceBits),
    width: metadata.width,
    height: metadata.height,
    format: metadata.format
  }
}

const names = fs.readdirSync(sourceDir)
  .filter(name => /\.(png|jpe?g)$/i.test(name))
  .filter(name => {
    const match = name.match(/^([A-Z]+)/)
    return match && prefixes.has(match[1])
  })
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))

const results = []
for (const name of names) {
  results.push({ name, ...(await imageHashes(path.join(sourceDir, name))) })
}
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2) + '\n', 'utf8')

const cellWidth = 180
const imageHeight = 240
const labelHeight = 28
const cellHeight = imageHeight + labelHeight
const columns = 4
const rows = Math.ceil(names.length / columns)
const composites = []

for (let index = 0; index < names.length; index += 1) {
  const name = names[index]
  const left = (index % columns) * cellWidth
  const top = Math.floor(index / columns) * cellHeight
  const image = await sharp(path.join(sourceDir, name))
    .resize(cellWidth, imageHeight, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 76 })
    .toBuffer()
  composites.push({ input: image, left, top })

  const safeName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const label = Buffer.from(`<svg width="${cellWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="90" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="black">${safeName}</text></svg>`)
  composites.push({ input: label, left, top: top + imageHeight })
}

await sharp({ create: { width: columns * cellWidth, height: rows * cellHeight, channels: 3, background: '#d9d9d9' } })
  .composite(composites)
  .jpeg({ quality: 72, chromaSubsampling: '4:4:4' })
  .toFile(contactPath)

const contactBase64 = fs.readFileSync(contactPath).toString('base64')
const chunkSize = 700
const chunkCount = Math.ceil(contactBase64.length / chunkSize)
console.log(`AUDIT_CONTACT_CHUNKS=${chunkCount}`)
for (let index = 0; index < chunkCount; index += 1) {
  const chunk = contactBase64.slice(index * chunkSize, (index + 1) * chunkSize)
  console.log(`AUDIT_CONTACT_${String(index).padStart(3, '0')}=${chunk}`)
}
console.log(`Generated audit for ${results.length} images.`)
