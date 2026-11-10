// Generates consistent placeholder images (4:3, bone background, tinted sneaker
// silhouette for the shoe type, no lettering) for every product colourway listed in src/data/products.js.
// Run:  node scripts/generate-placeholders.mjs
// Safe to re-run. Real photography can replace these files, or a colour can
// point at other files through the `images` override in products.js.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { products } from '../src/data/products.js'
import { IMAGE_VIEWS } from '../src/data/constants.js'
import { ARTWORK, artworkPaths } from './artwork.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

// "detail" zooms in (x5) on a region of the artwork chosen per shoe type
const transforms = {
  side: 'translate(100 230) scale(2.5)',
  angle: 'translate(150 200) rotate(-10 200 100) scale(2.4)'
}
const detail = (name) => {
  const [x, y] = ARTWORK[name].detail
  return `translate(${-x * 5} ${-y * 5}) scale(5)`
}

function svg(product, variant, view) {
  const name = product.artwork ?? 'sneaker'
  const label = `${product.name} \u00b7 ${variant.colourName} \u00b7 ${view}` // accessible name only, never drawn
  const transform = view === 'detail' ? detail(name) : transforms[view]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${esc(label)}">
<rect width="1200" height="900" fill="#EDEAE3"/>
<g transform="${transform}" stroke="#111" stroke-width="3" stroke-linejoin="round">
${artworkPaths(name, variant.swatch)}
</g>
</svg>
`
}

let count = 0
for (const product of products) {
  for (const variant of product.variants) {
    IMAGE_VIEWS.forEach((view, i) => {
      const file = join(root, variant.images.gallery[i].replace(/^\//, ''))
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, svg(product, variant, view))
      count++
    })
  }
}
console.log(`Wrote ${count} placeholder images`)
