import path from 'node:path'
import sharp from 'sharp'

const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const outputPath = path.join(process.cwd(), 'public', '_tmp-nor-batch4.jpg')
const names = ['NOR9.jpg', 'NOR13.jpg', 'NOR15.jpg']
const cellWidth = 420
const imageHeight = 560
const labelHeight = 50
const composites = []

for (let index = 0; index < names.length; index += 1) {
  const name = names[index]
  const image = await sharp(path.join(sourceDir, name))
    .resize(cellWidth, imageHeight, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toBuffer()

  composites.push({ input: image, left: index * cellWidth, top: 0 })
  const label = Buffer.from(`<svg width="${cellWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="210" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="black">${name}</text></svg>`)
  composites.push({ input: label, left: index * cellWidth, top: imageHeight })
}

await sharp({
  create: {
    width: names.length * cellWidth,
    height: imageHeight + labelHeight,
    channels: 3,
    background: '#d0d0d0'
  }
})
  .composite(composites)
  .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
  .toFile(outputPath)

console.log(`BATCH4_VISUAL=${outputPath}`)
