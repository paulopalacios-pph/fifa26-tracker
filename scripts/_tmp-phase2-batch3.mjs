import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const names = [
  'GHA3.jpg', 'GHA13.jpg', 'GHA17.jpg', 'GHA20.jpg',
  'IRQ14.jpg', 'IRQ15.jpg', 'IRQ16.jpg', 'IRQ17.jpg',
  'JOR14.jpg', 'JOR15.jpg', 'JOR16.jpg'
]
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const tempDir = path.join(process.cwd(), '.tmp-phase2-batch3-refine')
fs.mkdirSync(tempDir, { recursive: true })
const worker = await createWorker('eng')

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

const cropSpecs = [
  ['FULL', 0.00, 1.00],
  ['LOWER70', 0.30, 0.70],
  ['LOWER55', 0.45, 0.55],
  ['LOWER40', 0.60, 0.40],
  ['MID45', 0.35, 0.45],
  ['BOTTOM25', 0.75, 0.25]
]

console.log(`BATCH3_REFINE_COUNT=${names.length}`)
for (const name of names) {
  const source = path.join(sourceDir, name)
  const metadata = await sharp(source).metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1
  const candidates = []

  for (const [label, start, portion] of cropSpecs) {
    const top = Math.min(height - 1, Math.max(0, Math.floor(height * start)))
    const cropHeight = Math.max(1, Math.min(height - top, Math.floor(height * portion)))

    for (const variant of ['NORMAL', 'THRESHOLD', 'INVERT']) {
      const output = path.join(tempDir, `${name}-${label}-${variant}.png`)
      let pipeline = sharp(source)
        .extract({ left: 0, top, width, height: cropHeight })
        .resize({ width: 1800, withoutEnlargement: false })
        .grayscale().normalize().sharpen()
      if (variant === 'THRESHOLD') pipeline = pipeline.threshold(150)
      if (variant === 'INVERT') pipeline = pipeline.negate().threshold(150)
      await pipeline.png().toFile(output)

      for (const mode of [PSM.SPARSE_TEXT, PSM.SINGLE_BLOCK, PSM.SINGLE_LINE]) {
        await worker.setParameters({ tessedit_pageseg_mode: mode, preserve_interword_spaces: '1' })
        const result = await worker.recognize(output)
        const text = clean(result.data.text)
        if (text && text.length >= 3) candidates.push(`${label}/${variant}/${mode}:${text}`)
      }
    }
  }

  console.log(`BATCH3_REFINE|${name}|${candidates.join(' || ')}`)
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('BATCH3_REFINE_DONE')
