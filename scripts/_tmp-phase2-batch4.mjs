import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const names = [
  'KSA7.jpg', 'KSA14.jpg', 'KSA15.jpg', 'KSA16.jpg', 'KSA19.jpg',
  'NOR5.jpg', 'NOR8.jpg', 'NOR9.jpg', 'NOR11.jpg', 'NOR12.jpg',
  'NOR13.jpg', 'NOR15.jpg', 'NOR18.jpg', 'NOR20.jpg', 'PAN4.jpg'
]
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const tempDir = path.join(process.cwd(), '.tmp-phase2-batch4-refine')
fs.mkdirSync(tempDir, { recursive: true })
const worker = await createWorker('eng')

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

const crops = [
  ['FULL', 0.00, 1.00],
  ['LOWER70', 0.30, 0.70],
  ['LOWER55', 0.45, 0.55],
  ['LOWER40', 0.60, 0.40],
  ['MID45', 0.35, 0.45],
  ['BOTTOM25', 0.75, 0.25]
]

console.log(`BATCH4_REFINE_COUNT=${names.length}`)
for (const name of names) {
  const source = path.join(sourceDir, name)
  const metadata = await sharp(source).metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1
  const candidates = []

  for (const [label, start, portion] of crops) {
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

  console.log(`BATCH4_REFINE|${name}|${candidates.join(' || ')}`)
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('BATCH4_REFINE_DONE')
