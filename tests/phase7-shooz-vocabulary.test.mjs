// Run with:  node --test tests/*.test.mjs
// Phase 7: "Shooz" is the brand's own word for its overall collection in shared copy.
import test from 'node:test'
import assert from 'node:assert/strict'
import { join, sep } from 'node:path'
import { root, src, read, walk } from './helpers.mjs'
import {
  SITE_NAME, SITE_COLLECTION, SITE_TAGLINE, SITE_DESCRIPTION, SITE_HOME_TITLE, pageTitle, applySiteMeta
} from '../src/config/site.js'
import { siteCopy } from '../src/data/siteCopy.js'
import { CATEGORIES } from '../src/data/constants.js'
import { products } from '../src/store.js'

// built from pieces so this file does not trip its own searches
const FOOTWEAR = new RegExp(['foot', 'wear'].join(''), 'i')
const SNEAKER_STORE_PHRASES = /sneaker destination|premium sneakers|all sneakers|view all sneakers/i

const projectFiles = () => [
  ...walk(src).filter((f) => /\.(vue|js|css)$/.test(f)),
  join(root, 'index.html'),
  join(root, 'vite.config.js'),
  join(root, 'README.md')
]

// ---------- the vocabulary ----------
test('the collection word is exactly "Shooz" and lives in the central config', () => {
  assert.equal(SITE_COLLECTION, 'Shooz')
  assert.equal(SITE_NAME, 'Shooniverse')
})

test('tagline, description and home tab title use Shooz', () => {
  assert.equal(SITE_TAGLINE, 'A Shooz destination for every step.')
  assert.equal(SITE_DESCRIPTION, 'Lifestyle, running, court and everyday Shooz, chosen for how they look and how you live in them.')
  assert.equal(SITE_HOME_TITLE, 'Shooniverse \u00b7 Premium Shooz')
  assert.equal(pageTitle(null), SITE_HOME_TITLE)
  assert.equal(siteCopy.tagline, SITE_TAGLINE)
  assert.equal(siteCopy.brandDescription, SITE_DESCRIPTION)
})

test('the first page load carries the Shooz description (meta description) and the brand title', () => {
  const html = applySiteMeta(read('index.html'))
  assert.match(html, /<title>Shooniverse<\/title>/)
  assert.ok(html.includes(`content="${SITE_DESCRIPTION}"`))
  assert.match(html, /everyday Shooz,/)
})

test('hero, About, Shop heading, footer link and homepage button use Shooz', () => {
  assert.equal(
    siteCopy.hero.text,
    'Premium Shooz for every kind of move. Lifestyle, running, court and everyday styles, delivered nationwide.'
  )
  assert.match(siteCopy.about.paragraphs[0], /^Shooniverse is a Shooz destination for every step\./)
  assert.match(read('src/views/ShopView.vue'), /`All \$\{SITE_COLLECTION\}`/) // All Shooz
  assert.match(read('src/components/SiteFooter.vue'), />All \{\{ SITE_COLLECTION \}\}<\/RouterLink>/) // All Shooz
  assert.match(read('src/components/FeaturedProducts.vue'), />View all \{\{ SITE_COLLECTION \}\}<\/RouterLink>/) // View all Shooz
  assert.match(read('src/components/ProductCatalog.vue'), /See all \{\{ SITE_COLLECTION \}\}/)
})

test('the word is spelled and capitalised consistently ("Shooz", never "shooz", "Shoez" or "Shoos")', () => {
  for (const file of projectFiles()) {
    const text = read(file.slice(root.length + 1))
    assert.doesNotMatch(text, /(?<![A-Za-z])shooz/, `${file}: lowercase`)
    assert.doesNotMatch(text, /Shoez|Shoos\b|SHOOZ/, `${file}: misspelling`)
  }
})

test('"Shooz" is written out in one place only; components use the constant', () => {
  const holders = walk(src)
    .filter((f) => /\.(vue|js)$/.test(f))
    .filter((f) => /Shooz/.test(read(f.slice(root.length + 1))))
    .map((f) => f.slice(src.length + 1))
  // the config defines it; siteCopy/components only mention it in comments or via the constant
  for (const f of holders) {
    const text = read(join('src', f))
    const withoutComments = text.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '')
    const literal = f === join('config', 'site.js') ? /'Shooz'/ : /Shooz/
    if (f !== join('config', 'site.js')) assert.doesNotMatch(withoutComments, literal, `${f} writes Shooz by hand`)
  }
  assert.ok(holders.includes(join('config', 'site.js')))
})

// ---------- nothing generic left ----------
test('no generic "footwear" wording remains anywhere in the project', () => {
  for (const file of projectFiles()) assert.doesNotMatch(read(file.slice(root.length + 1)), FOOTWEAR, file)
})

test('no shared copy calls the store sneaker-only', () => {
  for (const file of projectFiles().filter((f) => !f.endsWith(join('data', 'products.js')))) {
    assert.doesNotMatch(read(file.slice(root.length + 1)), SNEAKER_STORE_PHRASES, file)
  }
  assert.doesNotMatch(JSON.stringify(siteCopy) + SITE_TAGLINE + SITE_DESCRIPTION, /sneaker/i)
})

test('"shoe(s)" remains only where it means one shoe, an order, or is a code comment or label', () => {
  // These are ordinary-language uses that were deliberately kept.
  const allowed = new Set([
    'config/site.js', // a code comment
    'store.js', 'router/guards.js', 'views/ProductView.vue', 'data/homepage.js',
    'data/products.js', 'components/HeroOrbit.vue', 'components/HeroSection.vue',
    'components/Checkout.vue', 'components/ProductDetails.vue', 'components/TestimonialsSection.vue'
  ])
  const found = walk(src)
    .filter((f) => /\.(vue|js)$/.test(f))
    .filter((f) => /\bshoes?\b/i.test(read(f.slice(root.length + 1))))
    .map((f) => f.slice(src.length + 1).split(sep).join('/'))
  for (const f of found) assert.ok(allowed.has(f), `${f} uses "shoe(s)" but is not on the reviewed list`)
})

// ---------- what must not change ----------
test('the original products and their wording are untouched; new products were added around them', () => {
  const original = ['Classic Runner Pro', 'Apex Trail Runner', 'Comfort Casual Walk', 'Sprint Speed Racer', 'Meridian 01', 'Halo Low', 'Dusk Mid', 'Ring Road', 'Pavement 90', 'Kerb Runner']
  assert.deepEqual(products.slice(0, 10).map((p) => p.name), original)
  assert.equal(products.length, 32)
  assert.deepEqual(CATEGORIES.map((c) => c.label), ['Lifestyle', 'Running', 'Basketball', 'Everyday', 'Formal', 'Loafers', 'Boots', 'Sandals & Slides'])
  // descriptions of individual shoes that really are sneakers keep that word
  assert.equal(products.slice(0, 10).filter((p) => /sneaker/i.test(p.longDescription)).length, 3)
  assert.ok(products.some((p) => /running shoe/i.test(p.shortDescription)))
  assert.ok(products.every((p) => !/Shooz/.test(`${p.name} ${p.shortDescription} ${p.longDescription}`)))
})

test('accessibility labels and the order message keep ordinary language', () => {
  assert.match(read('src/components/HeroOrbit.vue'), /Pause shoe orbit animation/)
  assert.match(read('src/components/Checkout.vue'), /Your shoes will be delivered soon/)
  assert.match(read('src/views/ProductView.vue'), /Shoe not found/)
})
