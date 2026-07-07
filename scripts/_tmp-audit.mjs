import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const source = path.join(process.cwd(), 'public', 'stickers', 'COD7.jpg')
const tempDir = path.join(process.cwd(), '.tmp-ocr-final')
fs.mkdirSync(tempDir, { recursive: true })
const metadata = await sharp(source).metadata()
const width = metadata.width || 1
const height = metadata.height || 1
const worker = await createWorker('eng')
const starts = [0, 0.25, 0.4, 0.55, 0.68]

for (const start of starts) {
  const top = Math.min(height - 1, Math.floor(height * start))
  const output = path.join(tempDir, `crop-${String(start).replace('.', '-')}.png`)
  await sharp(source)
    .extract({ left: 0, top, width, height: height - top })
    .resize({ width: 1800, withoutEnlargement: false })
    .grayscale()
    .normalize()
    .sharpen()
    .png()
    .toFile(output)

  for (const mode of [PSM.SPARSE_TEXT, PSM.SINGLE_BLOCK, PSM.SINGLE_LINE]) {
    await worker.setParameters({ tessedit_pageseg_mode: mode, preserve_interword_spaces: '1' })
    const result = await worker.recognize(output)
    const text = String(result.data.text || '').replace(/\s+/g, ' ').trim()
    if (text) console.log(`COD7_FINAL|${start}|${mode}|${text}`)
  }
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('COD7_FINAL_DONE')
