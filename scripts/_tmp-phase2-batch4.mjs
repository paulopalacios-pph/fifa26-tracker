import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const tempDir = path.join(process.cwd(), '.tmp-phase2-batch4-deep')
const names = ['NOR9.jpg', 'NOR13.jpg', 'NOR15.jpg']
fs.mkdirSync(tempDir, { recursive: true })

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

const worker = await createWorker('eng')
const cropSpecs = [
  ['FULL', 0.00, 1.00],
  ['LOWER70', 0.30, 0.70],
  ['LOWER55', 0.45, 0.55],
  ['LOWER40', 0.60, 0.40],
  ['MIDLOW', 0.38, 0.48],
  ['BOTTOM30', 0.70, 0.30]
]
const variants = [
  ['GRAY', null, null, false],
  ['GRAYINV', null, null, true],
  ['RED', 0, null, false],
  ['GREEN', 1, null, false],
  ['BLUE', 2, null, false],
  ['T110', null, 110, false],
  ['T145', null, 145, false],
  ['T180', null, 180, false],
  ['IT145', null, 145, true]
]

for (const name of names) {
  const source = path.join(sourceDir, name)
  const metadata = await sharp(source).metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1
  console.log(`BATCH4_DEEP_META|${name}|${width}x${height}|${metadata.format}|${metadata.space || ''}`)
  const seen = new Set()
  const outputs = []

  for (const [cropLabel, start, portion] of cropSpecs) {
    const top = Math.min(height - 1, Math.max(0, Math.floor(height * start)))
    const cropHeight = Math.max(1, Math.min(height - top, Math.floor(height * portion)))

    for (const [variantLabel, channel, threshold, invert] of variants) {
      const output = path.join(tempDir, `${name}-${cropLabel}-${variantLabel}.png`)
      let pipeline = sharp(source)
        .extract({ left: 0, top, width, height: cropHeight })
        .resize({ width: 2200, withoutEnlargement: false })
      if (channel !== null) pipeline = pipeline.extractChannel(channel)
      else pipeline = pipeline.grayscale()
      pipeline = pipeline.normalize().sharpen()
      if (invert) pipeline = pipeline.negate()
      if (threshold !== null) pipeline = pipeline.threshold(threshold)
      await pipeline.png().toFile(output)

      for (const mode of [PSM.SPARSE_TEXT, PSM.SINGLE_BLOCK, PSM.SINGLE_LINE]) {
        await worker.setParameters({ tessedit_pageseg_mode: mode, preserve_interword_spaces: '1' })
        const result = await worker.recognize(output)
        const text = clean(result.data.text)
        if (!text || text.length < 4 || !/[A-Za-z]{3}/.test(text)) continue
        const key = text.toUpperCase()
        if (seen.has(key)) continue
        seen.add(key)
        outputs.push(`${cropLabel}/${variantLabel}/${mode}:${text}`)
      }
    }
  }

  console.log(`BATCH4_DEEP|${name}|${outputs.slice(0, 80).join(' || ')}`)
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('BATCH4_DEEP_DONE')
