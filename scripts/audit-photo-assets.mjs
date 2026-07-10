import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { STICKER_ASSETS } from '../src/stickerAssets.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const TEAM_CODES = [
  'MEX','RSA','KOR','CZE','CAN','BIH','QAT','SUI','BRA','MAR','HAI','SCO',
  'USA','PAR','AUS','TUR','GER','CUW','CIV','ECU','NED','JPN','SWE','TUN',
  'BEL','EGY','IRN','NZL','ARG','ALG','AUT','JOR','FRA','SEN','NOR','IRQ',
  'POR','COD','UZB','COL','CRO','GHA','PAN','KSA','ENG','ESP','URU','CPV'
]

function isMissingPlaceholder(value) {
  return typeof value === 'string' && value.startsWith('data:image/') && decodeURIComponent(value).includes('Sin foto')
}

function publicFileExists(assetPath) {
  if (!assetPath?.startsWith('/')) return false
  return fs.existsSync(path.join(root, 'public', assetPath.replace(/^\//, '')))
}

const report = []
let valid = 0
let placeholders = 0
let broken = 0
let unresolved = 0

for (const team of TEAM_CODES) {
  const teamReport = { team, valid: [], placeholders: [], broken: [], unresolved: [] }

  for (let number = 1; number <= 20; number += 1) {
    const code = `${team}${number}`
    const mapped = STICKER_ASSETS[code]

    if (mapped) {
      if (isMissingPlaceholder(mapped)) {
        teamReport.placeholders.push(code)
        placeholders += 1
      } else if (mapped.startsWith('data:image/') || publicFileExists(mapped)) {
        teamReport.valid.push(code)
        valid += 1
      } else {
        teamReport.broken.push(code)
        broken += 1
      }
      continue
    }

    const defaultPath = `/stickers/${code}.jpg`
    if (publicFileExists(defaultPath)) {
      teamReport.valid.push(code)
      valid += 1
    } else {
      teamReport.unresolved.push(code)
      unresolved += 1
    }
  }

  report.push(teamReport)
}

console.log('\nFIFA26 PHOTO AUDIT')
console.log('===================')
console.log(`Selecciones revisadas: ${TEAM_CODES.length}`)
console.log(`Códigos revisados: ${TEAM_CODES.length * 20}`)
console.log(`Con imagen disponible: ${valid}`)
console.log(`Con tarjeta Sin foto: ${placeholders}`)
console.log(`Rutas mapeadas rotas: ${broken}`)
console.log(`Sin mapeo ni JPG por defecto: ${unresolved}`)

for (const item of report) {
  if (!item.placeholders.length && !item.broken.length && !item.unresolved.length) continue
  console.log(`\n${item.team}`)
  if (item.placeholders.length) console.log(`  Sin foto: ${item.placeholders.join(', ')}`)
  if (item.broken.length) console.log(`  Ruta rota: ${item.broken.join(', ')}`)
  if (item.unresolved.length) console.log(`  Sin archivo: ${item.unresolved.join(', ')}`)
}

if (broken > 0) {
  console.error(`\nERROR: existen ${broken} rutas de imágenes mapeadas que no apuntan a un archivo real.`)
  process.exitCode = 1
}
