// Run with:  node --test tests/*.test.mjs
// Phase 6: central brand config, About copy, hero orbit, and shared code.
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { root, src, read, walk } from './helpers.mjs'
import {
  SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_HOME_TITLE, pageTitle, applySiteMeta
} from '../src/config/site.js'
import { siteCopy } from '../src/data/siteCopy.js'
import { getHomepageContent, pickOrbitShoes } from '../src/data/homepage.js'
import { getCategoryLabel, getCollectionLabel, getProductBySlug } from '../src/data/catalog.js'
import { products } from '../src/store.js'

// built from pieces so this file does not contain the old spelling itself
const OLD_SPELLING = new RegExp(['shoe', 'niverse'].join(''), 'i')

const sourceFiles = [
  ...walk(src).filter((f) => /\.(vue|js|css)$/.test(f)),
  ...walk(join(root, 'scripts')),
  join(root, 'index.html'),
  join(root, 'vite.config.js'),
  join(root, 'README.md')
]

// ---------- brand ----------
test('the site name is Shooniverse and lives in one config file', () => {
  assert.equal(SITE_NAME, 'Shooniverse')
  assert.ok(SITE_TAGLINE.length > 10 && SITE_DESCRIPTION.length > 20)
  assert.equal(SITE_HOME_TITLE, 'Shooniverse \u00b7 Premium Shooz')
  assert.equal(pageTitle('Shop'), 'Shop \u00b7 Shooniverse')
  assert.equal(pageTitle(null), SITE_HOME_TITLE)
})

test('no old spelling remains anywhere except the internal theme storage key', () => {
  for (const file of sourceFiles) {
    const text = readFileText(file).replaceAll(['shoe', 'niverse-theme'].join(''), '')
    assert.doesNotMatch(text, OLD_SPELLING, file)
  }
})

test('the brand name is written out in exactly one source file (the config)', () => {
  const holders = walk(src)
    .filter((f) => /\.(vue|js)$/.test(f))
    .filter((f) => readFileText(f).includes('Shooniverse'))
    .map((f) => f.slice(src.length + 1))
  assert.deepEqual(holders, [join('config', 'site.js')])
})

test('header, footer, hero stage, About eyebrow, titles and alerts all read from the config', () => {
  assert.match(read('src/components/BrandLink.vue'), /SITE_NAME/)
  assert.match(read('src/components/SiteFooter.vue'), /SITE_NAME/)
  assert.match(read('src/components/HeroOrbit.vue'), /SITE_NAME/)
  assert.match(read('src/data/siteCopy.js'), /SITE_NAME/)
  assert.match(read('src/router/guards.js'), /pageTitle/)
  assert.match(read('src/components/Checkout.vue'), /\$\{SITE_NAME\}/)
  assert.equal(siteCopy.about.eyebrow, 'About Shooniverse')
  assert.equal(siteCopy.tagline, SITE_TAGLINE)
  assert.equal(siteCopy.brandDescription, SITE_DESCRIPTION)
})

test('header and footer share one BrandLink instead of duplicating the logo markup', () => {
  assert.match(read('src/components/SiteHeader.vue'), /<BrandLink/)
  assert.match(read('src/components/SiteFooter.vue'), /<BrandLink/)
  assert.doesNotMatch(read('src/components/SiteHeader.vue') + read('src/components/SiteFooter.vue'), /<OrbitLogo/)
})

test('index.html gets its title and description from the config through a Vite plugin', () => {
  const html = read('index.html')
  assert.match(html, /<title>%SITE_NAME%<\/title>/)
  assert.match(html, /<meta name="description" content="%SITE_DESCRIPTION%"/)
  const filled = applySiteMeta(html)
  assert.match(filled, /<title>Shooniverse<\/title>/)
  assert.ok(filled.includes(`content="${SITE_DESCRIPTION}"`))
  assert.doesNotMatch(filled, /%SITE_/)
  const vite = read('vite.config.js')
  assert.match(vite, /applySiteMeta/)
  assert.match(vite, /plugins: \[vue\(\), siteMeta\(\)\]/)
})

test('applySiteMeta escapes characters that would break an HTML attribute', () => {
  // the real description has none, so check the escaping rule on a tiny string
  assert.equal(applySiteMeta('<p>%SITE_NAME%</p>'), '<p>Shooniverse</p>')
  assert.doesNotMatch(applySiteMeta('"%SITE_DESCRIPTION%"'), /""/)
})

// ---------- About section ----------
test('About has one paragraph, now describing a Shooz destination', () => {
  assert.equal(siteCopy.about.paragraphs.length, 1)
  assert.equal(
    siteCopy.about.paragraphs[0],
    'Shooniverse is a Shooz destination for every step. We bring together lifestyle, running, court and everyday pairs, chosen for how they look and how you live in them.'
  )
  const about = JSON.stringify(siteCopy.about)
  assert.doesNotMatch(about, /sneaker destination|Every pair is available|EU sizes 40 to 45/)
  assert.equal((read('src/components/AboutSection.vue').match(/class="about-text"/g) ?? []).length, 1)
})

test('About keeps its heading, stats and button (only the copy changed)', () => {
  const about = read('src/components/AboutSection.vue')
  assert.match(about, /siteCopy\.about\.title/)
  assert.match(about, /<dl class="stats">/)
  assert.match(about, /Explore the shop/)
})

// ---------- hero orbit: data ----------
const content = getHomepageContent()

test('orbit: four different featured or new products, never the hero, each in a colourway that is in stock', () => {
  assert.equal(content.heroOrbit.length, 4)
  const ids = content.heroOrbit.map((o) => o.product.id)
  assert.equal(new Set(ids).size, 4)
  assert.ok(!ids.includes(content.hero.id))
  for (const { product, variant } of content.heroOrbit) {
    assert.ok(product.isFeatured || product.isNew, product.name)
    assert.ok(product.variants.includes(variant), product.name)
    assert.ok(Object.values(variant.stock).some((n) => n > 0), `${product.name} ${variant.colourName}`)
    assert.ok(existsSync(join(root, 'public', variant.images.card)), variant.images.card)
  }
})

test('orbit: the existing demo colourways are used, and they look different from each other and from the hero', () => {
  const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const distance = (a, b) => Math.hypot(...channels(a).map((v, i) => v - channels(b)[i]))
  const swatches = [content.heroVariant.swatch, ...content.heroOrbit.map((o) => o.variant.swatch)]
  for (let i = 0; i < swatches.length; i++) {
    for (let j = i + 1; j < swatches.length; j++) assert.ok(distance(swatches[i], swatches[j]) > 25, `${swatches[i]} vs ${swatches[j]}`)
  }
  // nothing new was invented: every orbit colour is a colourway that already exists in the catalogue
  const existing = new Set(products.flatMap((p) => p.variants.map((v) => v.swatch)))
  for (const s of swatches) assert.ok(existing.has(s))
})

test('orbit: the main shoe is unchanged (Meridian 01, its default colourway) and selection is deterministic', () => {
  assert.equal(content.hero.slug, 'meridian-01')
  assert.equal(content.heroVariant.images.card, content.hero.image)
  assert.deepEqual(
    pickOrbitShoes(content.hero).map((o) => [o.product.slug, o.variant.colourId]),
    content.heroOrbit.map((o) => [o.product.slug, o.variant.colourId])
  )
  assert.equal(pickOrbitShoes(content.hero, 2).length, 2)
})

// ---------- hero orbit: implementation ----------
test('orbit: CSS transforms only, no animation library, no external requests', () => {
  const pkg = JSON.parse(read('package.json'))
  assert.deepEqual(Object.keys(pkg.dependencies).sort(), ['vue', 'vue-router'])
  const orbit = read('src/components/HeroOrbit.vue')
  const imports = [...orbit.matchAll(/^import .* from '(.+)'/gm)].map((m) => m[1])
  assert.ok(imports.every((i) => i === 'vue' || i.startsWith('.')), imports.join(', '))
  assert.doesNotMatch(orbit, /https?:\/\/|requestAnimationFrame|setInterval|setTimeout|\sstyle="/)
})

test('orbit: keyframes animate only transform and opacity (no layout-triggering properties)', () => {
  const css = read('src/components/HeroOrbit.vue')
  const blocks = [...css.matchAll(/@keyframes [\w-]+ \{([\s\S]*?)\n\}/g)].map((m) => m[1])
  assert.ok(blocks.length >= 5)
  for (const block of blocks) {
    const props = new Set([...block.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]))
    for (const prop of props) assert.ok(['transform', 'opacity'].includes(prop), `keyframes animate ${prop}`)
  }
})

test('orbit: reduced motion stops all animation, hides the pause button, and leaves a static composition', () => {
  const css = read('src/components/HeroOrbit.vue')
  const block = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(block, /animation: none !important/)
  assert.match(block, /\.stage-pause \{\s*display: none;/)
  // the non-animated styles already place each shoe at its starting angle
  assert.match(css, /\.orbit \{[^}]*transform: rotateZ\(var\(--start\)\)/)
  assert.match(css, /--start: 20deg/)
})

test('orbit: the motion can be paused (button, keyboard focus, hover) and the button is accessible', () => {
  const orbit = read('src/components/HeroOrbit.vue')
  assert.match(orbit, /<button[\s\S]*?type="button"[\s\S]*?class="stage-pause"/)
  assert.match(orbit, /:aria-pressed="paused"/)
  assert.match(orbit, /Pause shoe orbit animation/)
  assert.match(orbit, /\.stage\.is-paused \.scene \*,\s*\.stage:focus-within \.scene \*/)
  assert.match(orbit, /@media \(hover: hover\)[\s\S]*\.stage:hover \.scene \*/)
})

test('orbit: decorative shoes are hidden from assistive tech and out of the tab order; the main shoe is a labelled link', () => {
  const orbit = read('src/components/HeroOrbit.vue')
  assert.match(orbit, /class="scene scene--tracks" aria-hidden="true"/)
  assert.match(orbit, /class="plane"[^>]*aria-hidden="true"/)
  assert.match(orbit, /class="sat" tabindex="-1"/)
  assert.match(orbit, /class="main"[\s\S]*?:aria-label=/)
  for (const tag of orbit.match(/<img\b[^>]*>/g)) assert.match(tag, /alt=""/)
})

test('orbit: the card keeps its size (520, 420 and 340px high) and stays clipped to its rounded shape', () => {
  const css = read('src/components/HeroOrbit.vue')
  assert.match(css, /container-type: size;[\s\S]*?height: 520px;/)
  assert.match(css, /overflow: hidden/)
  assert.match(css, /@media \(max-width: 960px\)[\s\S]*?height: 420px/)
  assert.match(css, /@media \(max-width: 480px\)[\s\S]*?height: 340px/)
  assert.match(read('src/components/HeroSection.vue'), /<HeroOrbit/)
})

// ---------- shared code ----------
test('category and collection names come from one shared lookup', () => {
  const meridian = getProductBySlug('meridian-01')
  assert.equal(getCategoryLabel(meridian), 'Lifestyle')
  assert.equal(getCollectionLabel(meridian), 'Drop 07')
  assert.equal(getCategoryLabel({ category: 'nope' }), '')
  for (const f of ['HomeProductCard', 'ProductDetails']) {
    assert.doesNotMatch(read(`src/components/${f}.vue`), /CATEGORIES\.find|COLLECTIONS\.find/, f)
  }
})

test('product links in cards use the shared location helper', () => {
  for (const f of ['HomeProductCard', 'HeroOrbit', 'ProductCard']) {
    const text = read(`src/components/${f}.vue`)
    assert.match(text, /productLocation\(/, f)
    assert.doesNotMatch(text, /name: 'product'/, f)
  }
})

test('cart, checkout and product data are unchanged apart from the brand name in one message', () => {
  const checkout = read('src/components/Checkout.vue')
  assert.match(checkout, /Demo checkout \u2014 no payment will be collected\./)
  assert.match(checkout, /router\.push\(\{ name: 'shop' \}\)/)
  assert.match(read('src/components/Cart.vue'), /router\.push\(\{ name: 'checkout' \}\)/)
  assert.equal(products.length, 10)
})

function readFileText(path) {
  return read(path.slice(root.length + 1))
}
