import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const ambiguous = new Set([
  'CIV1.jpg', 'COD1.jpg', 'COD3.jpg', 'COD7.jpg', 'COD8.jpg',
  'CRO5.jpg', 'CUW1.jpg', 'CUW19.jpg', 'CZE1.jpg'
])
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const tempDir = path.join(process.cwd(), '.tmp-ocr')
fs.mkdirSync(tempDir, { recursive: true })

const names = [...ambiguous].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
const worker = await createWorker('eng')

function clean(text) {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

console.log(`OCR_REFINE_COUNT=${names.length}`)
for (const name of names) {
  const source = path.join(sourceDir, name)
  const metadata = await sharp(source).metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1

  const fullPath = path.join(tempDir, `${name}-full.png`)
  await sharp(source)
    .resize({ width: Math.max(1200, width * 4), withoutEnlargement: false })
    .grayscale().normalize().sharpen().png().toFile(fullPath)
  await worker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT, preserve_interword_spaces: '1' })
  const full = await worker.recognize(fullPath)

  const lowerTop = Math.max(0, Math.floor(height * 0.40))
  const lowerPath = path.join(tempDir, `${name}-lower.png`)
  await sharp(source)
    .extract({ left: 0, top: lowerTop, width, height: Math.max(1, height - lowerTop) })
    .resize({ width: Math.max(1400, width * 5), withoutEnlargement: false })
    .grayscale().normalize().sharpen().png().toFile(lowerPath)
  await worker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT, preserve_interword_spaces: '1' })
  const lower = await worker.recognize(lowerPath)

  const barTop = Math.max(0, Math.floor(height * 0.68))
  const barPath = path.join(tempDir, `${name}-bar.png`)
  await sharp(source)
    .extract({ left: 0, top: barTop, width, height: Math.max(1, height - barTop) })
    .resize({ width: Math.max(1600, width * 6), withoutEnlargement: false })
    .grayscale().normalize().threshold(155).png().toFile(barPath)
  await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK, preserve_interword_spaces: '1' })
  const bar = await worker.recognize(barPath)

  console.log(`OCR_REFINE|${name}|FULL=${clean(full.data.text)}|LOWER=${clean(lower.data.text)}|BAR=${clean(bar.data.text)}`)
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('OCR_REFINE_DONE')
