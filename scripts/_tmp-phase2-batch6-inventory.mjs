import fs from 'node:fs'
import path from 'node:path'

const prefixes = ['ALG','ARG','AUS','AUT','BEL','BIH','BRA','CAN','CIV','COD','COL','CPV','CRO','CUW','CZE','ECU','EGY','ENG','ESP','FRA','GER','GHA','HAI','IRN','IRQ','JOR','JPN','KOR','KSA','MAR','MEX','NED','NOR','NZL','PAN','PAR','POR','QAT','RSA','SCO','SEN','SUI','SWE','TUN','TUR','URU','USA','UZB']
const source = fs.readFileSync(path.join(process.cwd(), 'src', 'stickerAssets.js'), 'utf8')
const keys = [...source.matchAll(/"([A-Z]{3}\d+)"\s*:/g)].map(match => match[1])
const files = fs.readdirSync(path.join(process.cwd(), 'public', 'stickers')).filter(name => /\.(png|jpe?g)$/i.test(name))

console.log(`BATCH6_PREFIX_COUNT=${prefixes.length}`)
for (const prefix of prefixes) {
  const mapped = keys.filter(key => key.startsWith(prefix))
  const physical = files.filter(name => name.startsWith(prefix))
  console.log(`BATCH6_INV|${prefix}|mapped=${mapped.length}|keys=${mapped.join(',')}|files=${physical.length}|names=${physical.sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).join(',')}`)
}
