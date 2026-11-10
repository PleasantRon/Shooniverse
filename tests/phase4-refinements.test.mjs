// Run with:  node --test tests/*.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { root, read } from './helpers.mjs'
import { products } from '../src/store.js'

test('footer tagline is updated', () => {
  const footer = read('src/components/SiteFooter.vue')
  const config = read('src/config/site.js')
  assert.match(config, /SITE_TAGLINE = `A \$\{SITE_COLLECTION\} destination for every step\.`/) // the tagline lives in the site config
  assert.match(footer, /siteCopy\.tagline/) // the footer shows it
  assert.doesNotMatch(footer + config, /If at all|An e-commerce store/)
  assert.match(footer, /<footer class="footer"/)
})

test('every referenced product image exists and is a lettering-free SVG', () => {
  // the card image is the same file as the first gallery image, so count unique files
  const paths = new Set(
    products.flatMap((p) => p.variants.flatMap((v) => [v.images.card, ...v.images.gallery]))
  )
  for (const path of paths) {
    const file = join(root, 'public', path)
    assert.ok(existsSync(file), `${path} is missing`)
    const svg = readFileSync(file, 'utf8')
    assert.match(svg, /viewBox="0 0 1200 900"/, path)
    assert.doesNotMatch(svg, /<text[\s>]/i, `${path} draws text`)
    assert.doesNotMatch(svg, /placeholder/i, `${path} mentions placeholder`)
  }
  // three views for every colourway of every product
  assert.equal(paths.size, products.reduce((n, p) => n + p.variants.length * 3, 0))
})

test('no stray SVG files: every file on disk is referenced by the product data', () => {
  const referenced = new Set(
    products.flatMap((p) => p.variants.flatMap((v) => [v.images.card, ...v.images.gallery]))
  )
  const base = join(root, 'public/images/products')
  const onDisk = readdirSync(base).flatMap((dir) =>
    readdirSync(join(base, dir)).map((f) => `/images/products/${dir}/${f}`)
  )
  assert.deepEqual(new Set(onDisk), referenced)
})

test('the generator no longer draws any lettering', () => {
  const script = read('scripts/generate-placeholders.mjs')
  assert.doesNotMatch(script, /<text/)
  assert.doesNotMatch(script, /PLACEHOLDER/)
})
