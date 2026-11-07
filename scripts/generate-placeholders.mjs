// Generates consistent placeholder images (4:3, bone background, tinted sneaker
// silhouette, no lettering) for every product colourway listed in src/data/products.js.
// Run:  node scripts/generate-placeholders.mjs
// Safe to re-run. Real photography can replace these files, or a colour can
// point at other files through the `images` override in products.js.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { products } from '../src/data/products.js'
import { IMAGE_VIEWS } from '../src/data/constants.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const transforms = {
  side: 'translate(100 230) scale(2.5)',
  angle: 'translate(150 200) rotate(-10 200 100) scale(2.4)',
  detail: 'translate(-420 -60) scale(5)'
}

function svg(product, variant, view) {
  const label = `${product.name} · ${variant.colourName} · ${view}` // accessible name only, never drawn
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${esc(label)}">
<rect width="1200" height="900" fill="#EDEAE3"/>
<g transform="${transforms[view]}" stroke="#111" stroke-width="3" stroke-linejoin="round">
<path d="M20 140C20 110 40 100 70 95L110 60C130 50 150 70 170 80C200 95 260 90 320 120C360 135 385 140 385 155V165H20Z" fill="${variant.swatch}"/>
<path d="M15 165H390V182Q390 190 380 190H25Q15 190 15 182Z" fill="#F7F5F0"/>
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
