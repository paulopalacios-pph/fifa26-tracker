import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { createWorker, PSM } from 'tesseract.js'

const prefixes = new Set(['KSA', 'NOR', 'NZL', 'PAN', 'PAR', 'QAT'])
const sourceDir = path.join(process.cwd(), 'public', 'stickers')
const tempDir = path.join(process.cwd(), '.tmp-phase2-batch4')
fs.mkdirSync(tempDir, { recursive: true })

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
await worker.setParameters({
  tessedit_pageseg_mode: PSM.SPARSE_TEXT,
  preserve_interword_spaces: '1'
})

console.log(`BATCH4_COUNT=${names.length}`)
console.log(`BATCH4_FILES=${names.join(',')}`)

for (const name of names) {
  const source = path.join(sourceDir, name)
  const metadata = await sharp(source).metadata()
  const width = metadata.width || 1
  const height = metadata.height || 1
  const top = Math.max(0, Math.floor(height * 0.38))
  const prepared = path.join(tempDir, `${name}.png`)

  await sharp(source)
    .extract({ left: 0, top, width, height: Math.max(1, height - top) })
    .resize({ width: Math.max(1500, width * 4), withoutEnlargement: false })
    .grayscale()
    .normalize()
    .sharpen()
    .png()
    .toFile(prepared)

  const result = await worker.recognize(prepared)
  console.log(`BATCH4|${name}|${clean(result.data.text)}`)
}

await worker.terminate()
fs.rmSync(tempDir, { recursive: true, force: true })
console.log('BATCH4_DONE')
