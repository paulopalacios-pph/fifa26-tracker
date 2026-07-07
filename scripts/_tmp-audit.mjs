import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const prefixes = new Set(['CIV', 'COD', 'CPV', 'CRO', 'CUW', 'CZE'])
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const outputPath = path.join(process.cwd(), 'public', '_tmp-image-audit.json')

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
console.log(`Generated ${outputPath} with ${results.length} images.`)
