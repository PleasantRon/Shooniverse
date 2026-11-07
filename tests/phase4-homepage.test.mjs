// Run with:  node --test tests/*.test.mjs
// Homepage content rules (which products appear where) and static checks on the
// homepage source. Updated in Phase 5 for the orbit design.
import test from 'node:test'
import assert from 'node:assert/strict'
import { read } from './helpers.mjs'
import { products } from '../src/store.js'
import { getHomepageContent } from '../src/data/homepage.js'
import { CATEGORIES } from '../src/data/constants.js'
import { getProductBySlug, getNewArrivals } from '../src/data/catalog.js'
import { formatPrice } from '../src/utils/format.js'

const content = getHomepageContent()

const homepageFiles = [
  'src/views/HomeView.vue',
  'src/components/HeroSection.vue',
  'src/components/HeroOrbit.vue',
  'src/components/BrandLink.vue',
  'src/components/HomeProductCard.vue',
  'src/components/FeaturedProducts.vue',
  'src/components/CategoriesSection.vue',
  'src/components/FeaturesSection.vue',
  'src/components/PromoSection.vue',
  'src/components/AboutSection.vue'
]

// ---------- content rules ----------
test('hero is the flagship: the first new and featured product in catalogue order', () => {
  assert.ok(content.hero)
  assert.ok(content.hero.isNew && content.hero.isFeatured)
  assert.equal(content.hero.slug, 'meridian-01')
})

test('product grid: real catalogue products only, hero excluded, featured first, at most 8', () => {
  const ids = new Set(products.map((p) => p.id))
  assert.ok(content.showcase.length > 0 && content.showcase.length <= 8)
  for (const p of content.showcase) {
    assert.ok(ids.has(p.id), p.name)
    assert.notEqual(p.id, content.hero.id)
  }
  assert.equal(new Set(content.showcase.map((p) => p.id)).size, content.showcase.length)
  const firstNonFeatured = content.showcase.findIndex((p) => !p.isFeatured)
  if (firstNonFeatured >= 0) assert.ok(content.showcase.slice(firstNonFeatured).every((p) => !p.isFeatured))
})

test('every category has a card with a description, a count and a product from that category', () => {
  assert.deepEqual(content.categories.map((c) => c.id), CATEGORIES.map((c) => c.id))
  assert.equal(content.categories.reduce((sum, c) => sum + c.count, 0), products.length)
  for (const c of content.categories) {
    assert.ok(c.description && c.description.length > 10, c.id)
    assert.ok(c.product && c.product.category === c.id, c.id)
    assert.ok(c.product.image.startsWith('/images/products/'))
    assert.notEqual(c.product.id, content.hero.id)
  }
})

test('the drop describes the current collection', () => {
  assert.equal(content.drop.id, 'drop-07')
  assert.equal(content.drop.label, 'Drop 07')
  assert.equal(content.drop.count, products.filter((p) => p.collection === 'drop-07').length)
  assert.ok(getNewArrivals().every((p) => p.collection === 'drop-07'))
})

test('stats come from the catalogue', () => {
  assert.equal(content.stats.styles, products.length)
  assert.equal(content.stats.categories, CATEGORIES.length)
  assert.equal(content.stats.sizes, '40\u201345')
})

test('every product shown on the homepage has a working detail-page slug', () => {
  const shown = [content.hero, ...content.showcase, ...content.categories.map((c) => c.product)]
  for (const p of shown) assert.equal(getProductBySlug(p.slug), p)
})

test('naira prices are formatted with thousands separators', () => {
  assert.equal(formatPrice(content.hero.price), '\u20a6120,000')
  for (const p of [content.hero, ...content.showcase]) assert.match(formatPrice(p.price), /^\u20a6\d{1,3}(,\d{3})*$/)
})

// ---------- static checks on the source ----------
test('HomeView composes hero, categories, featured, promo and about; no shop grid or old sections', () => {
  const view = read('src/views/HomeView.vue')
  for (const c of ['HeroSection', 'CategoriesSection', 'FeaturedProducts', 'PromoSection', 'AboutSection']) {
    assert.match(view, new RegExp(`<${c}`), c)
  }
  assert.doesNotMatch(view, /ProductCatalog|TestimonialsSection/)
})

test('homepage components make no external requests and use no inline styles or emoji', () => {
  for (const f of homepageFiles) {
    const text = read(f)
    assert.doesNotMatch(text, /https?:\/\//, `${f}: external URL`)
    assert.doesNotMatch(text, /\sstyle="/, `${f}: inline style`)
    assert.doesNotMatch(text, /\p{Extended_Pictographic}/u, `${f}: emoji`)
  }
})

test('homepage links are built by the shared location helpers; cards link to product detail pages', () => {
  assert.match(read('src/components/HomeProductCard.vue'), /productLocation\(product\)/)
  assert.match(read('src/components/HeroOrbit.vue'), /productLocation\(product\)/)
  assert.match(read('src/components/HeroSection.vue'), /homeSectionLocation\('categories'\)/)
  assert.match(read('src/components/CategoriesSection.vue'), /shopLocation\(\{ category: category\.id \}\)/)
  assert.match(read('src/views/HomeView.vue'), /shopLocation\(\{ collection: drop\.id \}\)/)
  for (const f of homepageFiles) {
    const text = read(f)
    assert.doesNotMatch(text, /href="\/|<a href/, `${f}: raw link`)
    assert.doesNotMatch(text, /:to="\{ name:/, `${f}: route object written by hand`)
  }
})

test('images have alt attributes and the page has exactly one h1', () => {
  for (const f of homepageFiles) {
    for (const tag of read(f).match(/<img\b[^>]*>/g) ?? []) assert.match(tag, /\salt=|:alt=/, `${f}: ${tag}`)
  }
  const h1s = homepageFiles.flatMap((f) => read(f).match(/<h1\b/g) ?? [])
  assert.equal(h1s.length, 1)
})

test('cart and checkout components are untouched by the homepage redesign', () => {
  const cart = read('src/components/Cart.vue')
  const checkout = read('src/components/Checkout.vue')
  assert.match(cart, /router\.push\(\{ name: 'checkout' \}\)/)
  assert.match(checkout, /Demo checkout \u2014 no payment will be collected\./)
  assert.match(checkout, /router\.push\(\{ name: 'shop' \}\)/)
})
