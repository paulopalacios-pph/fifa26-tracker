import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const names = [
  'RSA01.png','RSA02.png','RSA03.png','RSA04.png','RSA05.png','RSA07.png','RSA10.png','RSA11.png','RSA13.jpg','RSA14.png','RSA15.png',
  'UZB18.jpg','UZB20.jpg'
]
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const tempDir = path.join(process.cwd(), '.tmp-phase2-batch6-refine')
fs.mkdirSync(tempDir, { recursive: true })
const worker = await createWorker('eng')

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

const crops = [
  ['FULL', 0.00, 1.00],
  ['LOWER70', 0.30, 0.70],
  ['LOWER50', 0.50, 0.50],
  ['BOTTOM32', 0.68, 0.32]
]

console.log(`BATCH6_REFINE_COUNT=${names.length}`)
for (const name of names) {
  const source = path.join(sourceDir, name)
  const metadata = await sharp(source).metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1
  const outputs = []
  const seen = new Set()

  for (const [cropLabel, start, portion] of crops) {
    const top = Math.min(height - 1, Math.max(0, Math.floor(height * start)))
    const cropHeight = Math.max(1, Math.min(height - top, Math.floor(height * portion)))

    for (const variant of ['NORMAL', 'BLUE', 'THRESHOLD']) {
      const output = path.join(tempDir, `${name}-${cropLabel}-${variant}.png`)
      let pipeline = sharp(source)
        .extract({ left: 0, top, width, height: cropHeight })
        .resize({ width: 2000, withoutEnlargement: false })
      if (variant === 'BLUE') pipeline = pipeline.extractChannel(2)
      else pipeline = pipeline.grayscale()
      pipeline = pipeline.normalize().sharpen()
      if (variant === 'THRESHOLD') pipeline = pipeline.threshold(150)
      await pipeline.png().toFile(output)

      for (const mode of [PSM.SPARSE_TEXT, PSM.SINGLE_BLOCK]) {
        await worker.setParameters({ tessedit_pageseg_mode: mode, preserve_interword_spaces: '1' })
        const result = await worker.recognize(output)
        const text = clean(result.data.text)
        if (!text || text.length < 3) continue
        const key = text.toUpperCase()
        if (seen.has(key)) continue
        seen.add(key)
        outputs.push(`${cropLabel}/${variant}/${mode}:${text}`)
      }
    }
  }

  console.log(`BATCH6_REFINE|${name}|${outputs.join(' || ')}`)
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('BATCH6_REFINE_DONE')
