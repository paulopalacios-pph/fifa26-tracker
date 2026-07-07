import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const prefixes = new Set(['EGY', 'GHA', 'HAI', 'IRN', 'IRQ', 'JOR'])
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const tempDir = path.join(process.cwd(), '.tmp-phase2-batch3')
fs.mkdirSync(tempDir, { recursive: true })

function bitsToHex(bits) {
  let output = ''
  for (let index = 0; index < bits.length; index += 4) {
    const value = (bits[index] << 3) | (bits[index + 1] << 2) | (bits[index + 2] << 1) | bits[index + 3]
    output += value.toString(16)
  }
  return output
}

async function hashes(filePath) {
  const avgPixels = await sharp(filePath)
    .resize(8, 8, { fit: 'fill', kernel: 'nearest' })
    .grayscale().raw().toBuffer()
  const avg = [...avgPixels].reduce((sum, value) => sum + value, 0) / avgPixels.length
  const aHash = bitsToHex([...avgPixels].map(value => value >= avg ? 1 : 0))

  const diffPixels = await sharp(filePath)
    .resize(9, 8, { fit: 'fill', kernel: 'nearest' })
    .grayscale().raw().toBuffer()
  const bits = []
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      bits.push(diffPixels[y * 9 + x] > diffPixels[y * 9 + x + 1] ? 1 : 0)
    }
  }
  return { aHash, dHash: bitsToHex(bits) }
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

const names = fs.readdirSync(sourceDir)
  .filter(name => /\.(png|jpe?g)$/i.test(name))
  .filter(name => {
    const match = name.match(/^([A-Z]+)/)
    return match && prefixes.has(match[1])
  })
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))

const worker = await createWorker('eng')
await worker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT, preserve_interword_spaces: '1' })
console.log(`BATCH3_COUNT=${names.length}`)

for (const name of names) {
  const source = path.join(sourceDir, name)
  const metadata = await sharp(source).metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1
  const lowerTop = Math.max(0, Math.floor(height * 0.40))
  const prepared = path.join(tempDir, `${name}.png`)

  await sharp(source)
    .extract({ left: 0, top: lowerTop, width, height: Math.max(1, height - lowerTop) })
    .resize({ width: Math.max(1400, width * 4), withoutEnlargement: false })
    .grayscale().normalize().sharpen().png().toFile(prepared)

  const [{ aHash, dHash }, ocr] = await Promise.all([
    hashes(source),
    worker.recognize(prepared)
  ])

  console.log(`BATCH3|${name}|${aHash}|${dHash}|${clean(ocr.data.text)}`)
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('BATCH3_DONE')
