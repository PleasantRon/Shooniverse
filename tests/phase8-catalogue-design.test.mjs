// Run with:  node --test tests/*.test.mjs
// Phase 8: wider catalogue, working category filtering, one design system on every page,
// mobile layouts, and the central logo.
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join, sep } from 'node:path'
import { root, src, read, walk } from './helpers.mjs'
import { ARTWORK } from '../scripts/artwork.mjs'
import { products, cart } from '../src/store.js'
import { CATEGORIES, COLLECTIONS } from '../src/data/constants.js'
import {
  filterProducts, countByCategory, resolveShopFilter, getCategory, isCategoryId, getProductBySlug
} from '../src/data/catalog.js'
import { getHomepageContent } from '../src/data/homepage.js'
import { siteCopy } from '../src/data/siteCopy.js'
import { shopLocation } from '../src/router/locations.js'
import { scrollBehavior } from '../src/router/guards.js'
import { formatPrice } from '../src/utils/format.js'
import { SITE_LOGO, applySiteMeta } from '../src/config/site.js'

const ORIGINAL_TEN = ['classic-runner-pro', 'apex-trail-runner', 'comfort-casual-walk', 'sprint-speed-racer', 'meridian-01', 'halo-low', 'dusk-mid', 'ring-road', 'pavement-90', 'kerb-runner']
const artworkOf = (p) => p.artwork ?? 'sneaker'
const svgOf = (path) => readFileSync(join(root, 'public', path), 'utf8')
const vueFiles = walk(src).filter((f) => f.endsWith('.vue'))

// ================= catalogue =================
test('catalogue: 32 products across 8 categories, four in each', () => {
  assert.equal(products.length, 32)
  assert.equal(CATEGORIES.length, 8)
  for (const c of CATEGORIES) assert.equal(products.filter((p) => p.category === c.id).length, 4, c.id)
})

test('catalogue: no duplicate or inconsistent records (ids, slugs, names, prices)', () => {
  for (const key of ['id', 'slug', 'name']) assert.equal(new Set(products.map((p) => p[key])).size, products.length, key)
  for (const p of products) {
    assert.match(p.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, p.slug)
    assert.ok(Number.isInteger(p.price) && p.price >= 20000 && p.price <= 200000, `${p.name}: ${p.price}`)
    assert.ok(p.shortDescription.length > 10 && p.longDescription.length > 40 && p.materials.length >= 2 && p.fit, p.name)
    assert.ok(CATEGORIES.some((c) => c.id === p.category) && COLLECTIONS.some((c) => c.id === p.collection), p.name)
  }
})

test('catalogue: the original ten products are unchanged and still come first', () => {
  assert.deepEqual(products.slice(0, 10).map((p) => p.slug), ORIGINAL_TEN)
  const prices = [50000, 70000, 40000, 60000, 120000, 95000, 135000, 110000, 65000, 85000]
  assert.deepEqual(products.slice(0, 10).map((p) => p.price), prices)
})

test('catalogue: product counts match the real products in each category', () => {
  const counts = countByCategory()
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), products.length)
  for (const c of CATEGORIES) assert.equal(counts[c.id], products.filter((p) => p.category === c.id).length)
})

test('images: no two colourways share an image file and every file exists', () => {
  const seen = new Set()
  for (const p of products) for (const v of p.variants) for (const path of v.images.gallery) {
    assert.ok(!seen.has(path), `${path} is used twice`)
    seen.add(path)
    assert.ok(existsSync(join(root, 'public', path)), path)
  }
  assert.equal(seen.size, products.reduce((n, p) => n + p.variants.length * 3, 0))
})

test('images: each shoe type has its own artwork (no running shoe picture on a formal shoe)', () => {
  const allowed = {
    lifestyle: ['sneaker', 'skate'], running: ['sneaker'], court: ['sneaker', 'hightop'], everyday: ['sneaker', 'trainer'],
    formal: ['oxford', 'brogue'], loafers: ['loafer', 'tassel'], boots: ['chelsea', 'hiker'], sandals: ['slide', 'sandal']
  }
  for (const p of products) {
    assert.ok(ARTWORK[artworkOf(p)], `${p.name}: unknown artwork`)
    assert.ok(allowed[p.category].includes(artworkOf(p)), `${p.name}: ${artworkOf(p)} in ${p.category}`)
    const svg = svgOf(p.variants[0].images.card)
    assert.ok(svg.includes(ARTWORK[artworkOf(p)].upper), `${p.name}: file does not draw its own artwork`)
    if (artworkOf(p) !== 'sneaker') assert.ok(!svg.includes(ARTWORK.sneaker.upper), `${p.name} reuses the sneaker picture`)
  }
  // every non-sneaker category really looks different
  const signature = (cat) => new Set(products.filter((p) => p.category === cat).map((p) => svgOf(p.variants[0].images.card).match(/<path d="([^"]+)" fill="#/)[1]))
  const formalLook = [...signature('formal')].join()
  for (const other of ['running', 'boots', 'sandals', 'loafers']) assert.notEqual([...signature(other)].join(), formalLook)
})

test('images: the original demo shoes keep their silhouette and colours', () => {
  for (const slug of ORIGINAL_TEN) {
    const p = getProductBySlug(slug)
    assert.equal(artworkOf(p), 'sneaker', slug)
    for (const v of p.variants) {
      const svg = svgOf(v.images.card)
      assert.ok(svg.includes(ARTWORK.sneaker.upper) && svg.includes(ARTWORK.sneaker.sole), slug)
      assert.ok(svg.includes(`fill="${v.swatch}"`), slug)
    }
  }
})

test('catalogue: one source of product data (no second product list anywhere)', () => {
  const holders = walk(src)
    .filter((f) => /\.(vue|js)$/.test(f))
    .filter((f) => /\bslug:\s*'/.test(readFileSync(f, 'utf8')))
    .map((f) => f.slice(src.length + 1).split(sep).join('/'))
  assert.deepEqual(holders, ['data/products.js'])
})

// ================= category filtering =================
test('filtering: every category shows exactly its own products; All shows everything', () => {
  for (const c of CATEGORIES) {
    const list = filterProducts(products, { category: c.id })
    assert.equal(list.length, 4, c.id)
    assert.ok(list.every((p) => p.category === c.id))
  }
  assert.equal(filterProducts(products, {}).length, 32)
  assert.equal(filterProducts(products, { collection: 'drop-07' }).length, 3)
})

test('filtering: the Shop address (?category=) decides what is shown', () => {
  assert.equal(resolveShopFilter({}).products.length, 32)
  const running = resolveShopFilter({ category: 'running' })
  assert.deepEqual(running.products.map((p) => p.slug).sort(), ['apex-trail-runner', 'classic-runner-pro', 'kerb-runner', 'sprint-speed-racer'])
  assert.ok(resolveShopFilter({ category: 'formal' }).products.every((p) => /oxford|derby|brogue|cap-toe/i.test(p.name)))
  assert.deepEqual(resolveShopFilter({ category: 'court' }).products.map((p) => p.category), ['court', 'court', 'court', 'court'])
  assert.deepEqual(resolveShopFilter({ category: ['boots', 'running'] }).products.map((p) => p.category), ['boots', 'boots', 'boots', 'boots'])
  assert.equal(resolveShopFilter({ category: 'lifestyle', collection: 'drop-07' }).products.length, 2)
})

test('filtering: an unknown category or collection shows nothing, never everything', () => {
  for (const query of [{ category: 'nope' }, { collection: 'nope' }, { category: 'running', collection: 'nope' }]) {
    const result = resolveShopFilter(query)
    assert.equal(result.unknown, true)
    assert.deepEqual(result.products, [])
  }
  assert.deepEqual(filterProducts(products, { category: 'nope' }), []) // the filter itself never falls back to everything
  assert.deepEqual(filterProducts(products, { collection: 'nope' }), [])
  assert.equal(isCategoryId('boots'), true)
  assert.equal(isCategoryId('Boots'), false)
  assert.equal(getCategory('nope'), null)
})

test('filtering: every link into the shop (homepage cards, footer, shop chips) lands on its own collection', () => {
  const content = getHomepageContent()
  for (const card of content.categories) {
    const loc = shopLocation({ category: card.id })
    assert.deepEqual(loc, { name: 'shop', query: { category: card.id } })
    const shown = resolveShopFilter(loc.query).products
    assert.equal(shown.length, card.count, `homepage says ${card.count} ${card.id}`)
    assert.ok(shown.every((p) => p.category === card.id))
  }
  assert.equal(content.categories.length, CATEGORIES.length)
  for (const c of CATEGORIES) assert.equal(content.showcaseByCategory[c.id].length, 4)
})

test('filtering: the Shop page reads the address, links with real URLs, and every category has a heading', () => {
  const shop = read('src/views/ShopView.vue')
  assert.match(shop, /resolveShopFilter\(route\.query/)
  assert.match(shop, /siteCopy\.categories\.headings/)
  assert.match(shop, /<CategoryNav/)
  const nav = read('src/components/CategoryNav.vue')
  assert.match(nav, /shopLocation\(\{ category: category\.id \}\)/)
  assert.match(nav, /aria-current/)
  for (const c of CATEGORIES) {
    assert.ok(siteCopy.categories.headings[c.id] && siteCopy.categories.descriptions[c.id], c.id)
  }
  assert.equal(siteCopy.categories.headings.court, 'Basketball Shooz')
  assert.equal(siteCopy.categories.headings.formal, 'Formal Shooz')
  assert.equal(siteCopy.categories.headings.running, 'Running Shooz')
  assert.equal(siteCopy.categories.headings.lifestyle, 'Lifestyle Shooz')
})

test('filtering: changing the filter keeps the scroll position; other navigation still starts at the top', () => {
  const never = () => false
  const shop = (query) => ({ name: 'shop', path: '/shop', hash: '', query })
  assert.equal(scrollBehavior(shop({ category: 'boots' }), shop({}), null, never), false)
  assert.deepEqual(scrollBehavior({ name: 'cart', path: '/cart', hash: '' }, shop({}), null, never), { top: 0 })
  assert.deepEqual(scrollBehavior({ name: 'product', path: '/product/a', hash: '' }, { name: 'product', path: '/product/b' }, null, never), { top: 0 })
})

// ================= design system =================
test('colours: no hardcoded hex colours or old greens in any component', () => {
  for (const file of vueFiles) {
    const text = readFileSync(file, 'utf8').replace(/-webkit-mask:.*|mask:.*/g, '') // "#000" in a mask is transparency, not a colour
    const stripped = text.replace(/href="#[^"]*"|hash: '#[^']*'|`#\$\{[^`]*`/g, '')
    assert.doesNotMatch(stripped, /#[0-9a-fA-F]{3,8}\b/, file)
    assert.doesNotMatch(text, /green|#42b983|#2c3e50/i, file)
  }
})

test('colours: the stylesheet holds only the approved palette plus one error colour', () => {
  const css = read('src/style.css')
  const approved = new Set([
    // light and dark themes
    '#eeeff2', '#e0e2e8', '#ffffff', '#101114', '#5d6270', '#d4d6dd', '#2b3dff',
    '#0d0e11', '#1b1d24', '#15171c', '#f1f2f5', '#9a9fad', '#2a2d36', '#6b7aff',
    // readable accent on the always-dark band, and the single error colour (light and dark)
    '#8f9bff', '#b42318', '#ff8f85', '#000'
  ])
  const used = new Set((css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).map((c) => c.toLowerCase()))
  for (const colour of used) assert.ok(approved.has(colour), `${colour} is not in the approved palette`)
  assert.match(css, /--danger: #b42318/)
})

test('colours: Add to Cart, checkout and cart controls use the brand accent', () => {
  assert.match(read('src/components/ProductCard.vue'), /sv-btn sv-btn--primary product-add/)
  assert.match(read('src/components/ProductDetails.vue'), /sv-btn sv-btn--primary add-btn/)
  assert.match(read('src/components/Cart.vue'), /sv-btn sv-btn--primary checkout-btn/)
  assert.match(read('src/components/Checkout.vue'), /sv-btn sv-btn--primary" :disabled="!isFormValid"/)
  const css = read('src/style.css')
  assert.match(css, /\.sv-btn--primary \{\s*background: var\(--accent\);/)
  assert.match(css, /\.sv-chip\[aria-pressed='true'\][\s\S]*?background: var\(--accent\)/)
  assert.match(css, /\.sv-input:focus \{[^}]*var\(--accent\)/)
})

test('design: every page opens with the same dark orbit band or accent stage, and has one h1', () => {
  for (const f of ['ShopView', 'Cart', 'Checkout']) {
    const file = f === 'ShopView' ? 'src/views/ShopView.vue' : `src/components/${f}.vue`
    assert.match(read(file), /<PageHero/, f)
    assert.doesNotMatch(read(file), /<h1/, `${f} gets its h1 from PageHero`)
  }
  assert.match(read('src/components/PageHero.vue'), /<h1 class="page-hero-title">/)
  assert.match(read('src/components/PageHero.vue'), /<OrbitBackdrop/)
  for (const f of ['ProductDetails', 'NotFoundState', 'AboutSection', 'PromoSection']) {
    assert.match(read(`src/components/${f}.vue`), /<OrbitBackdrop/, f)
  }
  assert.equal((read('src/components/ProductDetails.vue').match(/<h1\b/g) ?? []).length, 1)
  assert.equal((read('src/components/NotFoundState.vue').match(/<h1\b/g) ?? []).length, 1)
})

test('design: pages fade in gently and the global rule respects reduced motion', () => {
  const css = read('src/style.css')
  assert.match(css, /\.main-content > \* \{\s*animation: page-in/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration: 0\.01ms !important/)
  assert.doesNotMatch(read('src/App.vue'), /<Transition/) // would delay page content and in-page scrolling
})

test('design: prices are formatted the same way on every page', () => {
  for (const f of ['Cart', 'Checkout', 'ProductDetails', 'ProductCard']) {
    const text = read(`src/components/${f}.vue`)
    assert.match(text, /formatPrice\(/, f)
    assert.doesNotMatch(text, /toFixed\(/, f)
  }
  assert.equal(formatPrice(404800), '\u20a6404,800')
  assert.equal(formatPrice(1234.5), '\u20a61,234.50')
  assert.equal(formatPrice(0), '\u20a60')
})

test('cart: the money shown matches the store (subtotal, 10% tax, total)', () => {
  cart.clearCart()
  cart.addToCart(getProductBySlug('apex-trail-runner'), { colourId: 'olive', size: 40 }) // 70,000
  cart.addToCart(getProductBySlug('regent-oxford'), { colourId: 'black', size: 42 }) // 135,000
  cart.addToCart(getProductBySlug('regent-oxford'), { colourId: 'black', size: 42 })
  cart.addToCart(getProductBySlug('tidal-slide'), { colourId: 'navy', size: 43 }) // 28,000
  assert.equal(cart.items.length, 3)
  assert.equal(formatPrice(cart.getSubtotal()), '\u20a6368,000')
  assert.equal(formatPrice(cart.getTax()), '\u20a636,800')
  assert.equal(formatPrice(cart.getGrandTotal()), '\u20a6404,800')
  cart.removeFromCart(cart.items[0].lineId)
  assert.equal(formatPrice(cart.getSubtotal()), '\u20a6298,000')
  cart.clearCart()
  assert.equal(formatPrice(cart.getGrandTotal()), '\u20a60')
})

// ================= mobile layouts =================
test('mobile: category cards use two columns on phones, with one column only on tiny screens', () => {
  const css = read('src/components/CategoriesSection.vue')
  assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/)
  assert.match(css, /@media \(max-width: 699px\) \{\s*\.cards \{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/)
  assert.match(css, /@media \(max-width: 319px\) \{\s*\.cards \{\s*grid-template-columns: minmax\(0, 1fr\)/)
})

test('mobile: product grids show two products per row on phones (Shop and homepage)', () => {
  for (const f of ['ProductCatalog', 'FeaturedProducts']) {
    const css = read(`src/components/${f}.vue`)
    assert.match(css, /@media \(max-width: 760px\) \{\s*\.grid \{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/, f)
    assert.match(css, /@media \(max-width: 319px\) \{\s*\.grid \{\s*grid-template-columns: minmax\(0, 1fr\)/, f)
  }
  const card = read('src/components/ProductCard.vue')
  assert.match(card, /@media \(max-width: 560px\)/)
  assert.match(card, /aspect-ratio: 4 \/ 3/) // consistent image proportions
  assert.match(card, /-webkit-line-clamp: 2/)
})

test('mobile: category chips scroll sideways on phones instead of stacking into rows', () => {
  assert.match(read('src/components/CategoryNav.vue'), /@media \(max-width: 640px\)[\s\S]*overflow-x: auto/)
})

test('mobile: the cart row cannot overlap or overflow', () => {
  const css = read('src/components/Cart.vue')
  assert.doesNotMatch(css, /80px 1fr 80px 100px 80px/) // the old fixed-width columns
  assert.match(css, /\.line \{[^}]*grid-template-columns: 112px minmax\(0, 1fr\) auto auto/)
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*grid-template-columns: 92px minmax\(0, 1fr\)/)
  assert.match(css, /\.line-main \{[^}]*min-width: 0/)
  assert.match(css, /overflow-wrap: anywhere/)
  assert.match(css, /\.line-media \{[^}]*aspect-ratio: 4 \/ 3/)
  assert.match(css, /\.qty-btn \{[^}]*width: 44px;[^}]*height: 44px/) // easy to tap
  const tpl = read('src/components/Cart.vue')
  assert.match(tpl, /aria-label="`Remove \$\{item\.name\} from cart`"|:aria-label="`Remove \$\{item\.name\} from cart`"/)
  assert.match(tpl, /router\.push\(\{ name: 'checkout' \}\)/)
})

test('mobile: checkout fields stack on phones and are properly labelled', () => {
  const text = read('src/components/Checkout.vue')
  assert.match(text, /@media \(max-width: 640px\)[\s\S]*\.form-row--three \{\s*grid-template-columns: minmax\(0, 1fr\)/)
  const labels = (text.match(/<label class="field">/g) ?? []).length
  const inputs = (text.match(/<input /g) ?? []).length
  assert.equal(labels, inputs) // every field sits inside its label
  assert.match(text, /autocomplete="postal-code"/)
  assert.match(text, /Demo checkout \u2014 no payment will be collected\./)
})

test('mobile: the header fits the narrowest phones', () => {
  assert.match(read('src/components/BrandLink.vue'), /@media \(max-width: 400px\)/)
  assert.match(read('src/components/SiteHeader.vue'), /@media \(max-width: 360px\)[\s\S]*width: 40px/)
  assert.match(read('src/components/ThemeToggle.vue'), /@media \(max-width: 360px\)/)
})

// ================= logo and favicon =================
test('logo: one file in /public, referenced from the site config', () => {
  assert.equal(SITE_LOGO, '/brand/logo.svg')
  assert.ok(existsSync(join(root, 'public/brand/logo.svg')))
  assert.match(read('src/components/OrbitLogo.vue'), /import \{ SITE_LOGO \}/)
  assert.match(read('src/components/OrbitLogo.vue'), /:src="SITE_LOGO"/)
})

test('logo: it is the existing orbit icon (same shapes and colours as before)', () => {
  const svg = read('public/brand/logo.svg')
  assert.match(svg, /<circle cx="20" cy="20" r="18" fill="#2b3dff"\/>/)
  assert.match(svg, /<ellipse cx="20" cy="20" rx="15" ry="6" fill="none" stroke="#ffffff" stroke-width="2" transform="rotate\(-25 20 20\)"\/>/)
  assert.match(svg, /<circle cx="20" cy="20" r="4" fill="#ffffff"\/>/)
  assert.match(svg, /<circle cx="33.6" cy="13.7" r="3" fill="#ffffff"\/>/)
})

test('logo: the header and footer both use it through BrandLink, and nothing else draws its own copy', () => {
  assert.match(read('src/components/BrandLink.vue'), /<OrbitLogo/)
  for (const f of ['SiteHeader', 'SiteFooter']) assert.match(read(`src/components/${f}.vue`), /<BrandLink/)
  const holders = walk(src).filter((f) => /rx="15"/.test(readFileSync(f, 'utf8')))
  assert.deepEqual(holders, [])
})

test('favicon: the browser-tab icon is the same central logo', () => {
  const html = read('index.html')
  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="%SITE_LOGO%" \/>/)
  const filled = applySiteMeta(html)
  assert.match(filled, /<link rel="icon" type="image\/svg\+xml" href="\/brand\/logo\.svg" \/>/)
  assert.doesNotMatch(filled, /vite\.svg|%SITE_/)
})
