import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const names = ['SCO16.jpg', 'URU7.jpg', 'URU14.jpg', 'URU19.jpg', 'URU20.jpg']
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const tempDir = path.join(process.cwd(), '.tmp-phase2-batch5-refine')
fs.mkdirSync(tempDir, { recursive: true })
const worker = await createWorker('eng')

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

const crops = [
  ['FULL', 0.00, 1.00],
  ['LOWER75', 0.25, 0.75],
  ['LOWER60', 0.40, 0.60],
  ['LOWER45', 0.55, 0.45],
  ['MID50', 0.30, 0.50],
  ['BOTTOM30', 0.70, 0.30]
]

console.log(`BATCH5_REFINE_COUNT=${names.length}`)
for (const name of names) {
  const source = path.join(sourceDir, name)
  const metadata = await sharp(source).metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1
  const candidates = []

  for (const [cropLabel, start, portion] of crops) {
    const top = Math.min(height - 1, Math.max(0, Math.floor(height * start)))
    const cropHeight = Math.max(1, Math.min(height - top, Math.floor(height * portion)))

    for (const variant of ['NORMAL', 'THRESHOLD', 'INVERT', 'RED', 'GREEN', 'BLUE']) {
      const output = path.join(tempDir, `${name}-${cropLabel}-${variant}.png`)
      let pipeline = sharp(source)
        .extract({ left: 0, top, width, height: cropHeight })
        .resize({ width: 2000, withoutEnlargement: false })

      if (variant === 'RED') pipeline = pipeline.extractChannel(0)
      else if (variant === 'GREEN') pipeline = pipeline.extractChannel(1)
      else if (variant === 'BLUE') pipeline = pipeline.extractChannel(2)
      else pipeline = pipeline.grayscale()

      pipeline = pipeline.normalize().sharpen()
      if (variant === 'THRESHOLD') pipeline = pipeline.threshold(150)
      if (variant === 'INVERT') pipeline = pipeline.negate().threshold(150)
      await pipeline.png().toFile(output)

      for (const mode of [PSM.SPARSE_TEXT, PSM.SINGLE_BLOCK, PSM.SINGLE_LINE]) {
        await worker.setParameters({ tessedit_pageseg_mode: mode, preserve_interword_spaces: '1' })
        const result = await worker.recognize(output)
        const text = clean(result.data.text)
        if (text && text.length >= 3) candidates.push(`${cropLabel}/${variant}/${mode}:${text}`)
      }
    }
  }

  console.log(`BATCH5_REFINE|${name}|${candidates.join(' || ')}`)
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('BATCH5_REFINE_DONE')
