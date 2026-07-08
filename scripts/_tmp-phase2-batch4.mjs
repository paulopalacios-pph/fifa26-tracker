import path from 'node:path'
import sharp from 'sharp'

const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const names = ['NOR9.jpg', 'NOR13.jpg', 'NOR15.jpg']

function bitsToHex(bits) {
  let output = ''
  for (let index = 0; index < bits.length; index += 4) {
    const value = (bits[index] << 3) | (bits[index + 1] << 2) | (bits[index + 2] << 1) | bits[index + 3]
    output += value.toString(16)
  }
  return output
}

for (const name of names) {
  const filePath = path.join(sourceDir, name)
  const averagePixels = await sharp(filePath)
    .resize(8, 8, { fit: 'fill', kernel: 'nearest' })
    .grayscale().raw().toBuffer()
  const average = [...averagePixels].reduce((sum, value) => sum + value, 0) / averagePixels.length
  const aHash = bitsToHex([...averagePixels].map(value => value >= average ? 1 : 0))

  const differencePixels = await sharp(filePath)
    .resize(9, 8, { fit: 'fill', kernel: 'nearest' })
    .grayscale().raw().toBuffer()
  const differenceBits = []
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      differenceBits.push(differencePixels[y * 9 + x] > differencePixels[y * 9 + x + 1] ? 1 : 0)
    }
  }
  const dHash = bitsToHex(differenceBits)
  console.log(`BATCH4_HASH|${name}|${aHash}|${dHash}`)
}
