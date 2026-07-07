import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const PREFIXES = new Set(['CIV','COD','CPV','CRO','CUW','CZE'])

function bitsToHex(bits) {
  let out = ''
  for (let i = 0; i < bits.length; i += 4) {
    const nibble = (bits[i] << 3) | (bits[i + 1] << 2) | (bits[i + 2] << 1) | bits[i + 3]
    out += nibble.toString(16)
  }
  return out
}

async function hashes(filePath) {
  const a = await sharp(filePath).resize(8, 8, { fit: 'fill', kernel: 'nearest' }).grayscale().raw().toBuffer()
  const avg = [...a].reduce((sum, v) => sum + v, 0) / a.length
  const aHash = bitsToHex([...a].map(v => (v >= avg ? 1 : 0)))

  const d = await sharp(filePath).resize(9, 8, { fit: 'fill', kernel: 'nearest' }).grayscale().raw().toBuffer()
  const bits = []
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) bits.push(d[y * 9 + x] > d[y * 9 + x + 1] ? 1 : 0)
  }
  const dHash = bitsToHex(bits)

  const meta = await sharp(filePath).metadata()
  return { aHash, dHash, width: meta.width, height: meta.height, format: meta.format }
}

export default async function handler(_req, res) {
  try {
    const dir = path.join(process.cwd(), 'public', 'stickers')
    const files = fs.readdirSync(dir)
      .filter(name => /\.(png|jpe?g)$/i.test(name))
      .filter(name => PREFIXES.has((name.match(/^([A-Z]+)/) || [])[1]))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    const output = []
    for (const name of files) {
      output.push({ name, ...(await hashes(path.join(dir, name))) })
    }

    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json(output)
  } catch (error) {
    res.status(500).json({ error: error?.message || String(error) })
  }
}
