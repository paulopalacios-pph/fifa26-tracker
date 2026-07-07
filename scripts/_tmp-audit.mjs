import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const prefixes = new Set(['CIV', 'COD', 'CPV', 'CRO', 'CUW', 'CZE'])
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const tempDir = path.join(process.cwd(), '.tmp-ocr')
fs.mkdirSync(tempDir, { recursive: true })

const names = fs.readdirSync(sourceDir)
  .filter(name => /\.(png|jpe?g)$/i.test(name))
  .filter(name => {
    const match = name.match(/^([A-Z]+)/)
    return match && prefixes.has(match[1])
  })
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))

const worker = await createWorker('eng')
await worker.setParameters({
  tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  preserve_interword_spaces: '1'
})

console.log(`OCR_AUDIT_COUNT=${names.length}`)
for (const name of names) {
  const source = path.join(sourceDir, name)
  const metadata = await sharp(source).metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1
  const top = Math.max(0, Math.floor(height * 0.52))
  const cropHeight = Math.max(1, height - top)
  const prepared = path.join(tempDir, `${name}.png`)

  await sharp(source)
    .extract({ left: 0, top, width, height: cropHeight })
    .resize({ width: Math.max(900, width * 3), withoutEnlargement: false })
    .grayscale()
    .normalize()
    .sharpen()
    .png()
    .toFile(prepared)

  const { data } = await worker.recognize(prepared)
  const text = String(data.text || '')
    .replace(/\s+/g, ' ')
    .trim()
  console.log(`OCR_RESULT|${name}|${text}`)
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('OCR_AUDIT_DONE')
