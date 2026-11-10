// Run with:  node --test tests/
// Uses Node's built-in test runner; no extra dependencies.
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { products, cart, TAX_RATE } from '../src/store.js'
import { EU_SIZES, CATEGORIES } from '../src/data/constants.js'
import { getProductBySlug, getStock, getDefaultSelection, isProductInStock } from '../src/data/catalog.js'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const bySlug = (slug) => getProductBySlug(slug)

test.beforeEach(() => cart.clearCart())

// ---------- product data ----------
test('products have unique ids and slugs and valid prices', () => {
  assert.equal(new Set(products.map((p) => p.id)).size, products.length)
  assert.equal(new Set(products.map((p) => p.slug)).size, products.length)
  for (const p of products) assert.ok(Number.isInteger(p.price) && p.price > 0, p.name)
})

test('every product belongs to a defined category, and every category has products', () => {
  const allowed = new Set(CATEGORIES.map((c) => c.id))
  for (const p of products) assert.ok(allowed.has(p.category), `${p.name}: ${p.category}`)
  for (const id of allowed) assert.ok(products.some((p) => p.category === id), `no products in ${id}`)
})

test('every variant covers EU 40-45 with non-negative whole-number stock', () => {
  for (const p of products) for (const v of p.variants) {
    assert.deepEqual(Object.keys(v.stock).map(Number), EU_SIZES)
    for (const n of Object.values(v.stock)) assert.ok(Number.isInteger(n) && n >= 0)
  }
})

test('every product can be bought in at least one size', () => {
  for (const p of products) assert.ok(isProductInStock(p), p.name)
})

test('data covers multi-colour products and unavailable sizes', () => {
  assert.ok(products.some((p) => p.variants.length >= 2))
  assert.ok(products.some((p) => p.variants.some((v) => Object.values(v.stock).includes(0))))
  assert.ok(products.some((p) => p.isNew) && products.some((p) => p.isFeatured))
})

test('size availability is per colour, not per product', () => {
  const p = bySlug('classic-runner-pro')
  assert.equal(getStock(p, 'black', 43), 0)
  assert.ok(getStock(p, 'white', 43) > 0)
})

test('derived fields used by existing components exist', () => {
  for (const p of products) {
    assert.equal(typeof p.image, 'string')
    assert.equal(p.description, p.shortDescription)
  }
})

test('every placeholder image path exists on disk', () => {
  for (const p of products) for (const v of p.variants) {
    for (const path of [v.images.card, ...v.images.gallery]) {
      assert.ok(existsSync(join(publicDir, path)), path)
    }
  }
})

// ---------- cart ----------
test('same shoe in two sizes creates two lines', () => {
  const p = bySlug('classic-runner-pro')
  cart.addToCart(p, { colourId: 'black', size: 40 })
  cart.addToCart(p, { colourId: 'black', size: 41 })
  assert.equal(cart.items.length, 2)
  assert.deepEqual(cart.items.map((i) => i.lineId), ['1:black:40', '1:black:41'])
})

test('same shoe, same size increments one line', () => {
  const p = bySlug('classic-runner-pro')
  cart.addToCart(p, { colourId: 'black', size: 40 })
  cart.addToCart(p, { colourId: 'black', size: 40 })
  assert.equal(cart.items.length, 1)
  assert.equal(cart.items[0].quantity, 2)
})

test('same size in a different colour is a separate line', () => {
  const p = bySlug('classic-runner-pro')
  cart.addToCart(p, { colourId: 'black', size: 40 })
  cart.addToCart(p, { colourId: 'white', size: 40 })
  assert.equal(cart.items.length, 2)
})

test('existing call style addToCart(product) still works', () => {
  const p = bySlug('apex-trail-runner')
  const result = cart.addToCart(p)
  assert.equal(result.ok, true)
  const expected = getDefaultSelection(p)
  assert.equal(cart.items[0].colourId, expected.colourId)
  assert.equal(cart.items[0].size, expected.size)
  assert.ok(getStock(p, expected.colourId, expected.size) > 0)
})

test('unavailable sizes cannot be added', () => {
  const p = bySlug('classic-runner-pro')
  const result = cart.addToCart(p, { colourId: 'black', size: 43 })
  assert.deepEqual(result, { ok: false, reason: 'out-of-stock' })
  assert.equal(cart.items.length, 0)
})

test('invalid product, colour and size are rejected', () => {
  const p = bySlug('classic-runner-pro')
  assert.equal(cart.addToCart({ id: 999 }).reason, 'unknown-product')
  assert.equal(cart.addToCart(p, { colourId: 'pink', size: 40 }).reason, 'unknown-colour')
  assert.equal(cart.addToCart(p, { colourId: 'black', size: 38 }).reason, 'unknown-size')
  assert.equal(cart.items.length, 0)
})

test('quantity cannot exceed available stock', () => {
  const p = bySlug('classic-runner-pro') // black EU 45 has 1 pair
  assert.equal(cart.addToCart(p, { colourId: 'black', size: 45 }).ok, true)
  assert.deepEqual(cart.addToCart(p, { colourId: 'black', size: 45 }), { ok: false, reason: 'max-quantity' })
  assert.equal(cart.items[0].quantity, 1)
})

test('price and name come from the catalogue, not the caller', () => {
  cart.addToCart({ id: 1, price: 1, name: 'Hacked' }, { colourId: 'black', size: 40 })
  assert.equal(cart.items[0].price, 50000)
  assert.equal(cart.items[0].name, 'Classic Runner Pro')
})

test('increase and decrease quantity, with limits', () => {
  const p = bySlug('classic-runner-pro') // black EU 41 has 5 pairs
  cart.addToCart(p, { colourId: 'black', size: 41 })
  const id = cart.items[0].lineId
  assert.equal(cart.updateQuantity(id, 3), 3)
  assert.equal(cart.updateQuantity(id, 2), 2)
  assert.equal(cart.updateQuantity(id, 0), false)
  assert.equal(cart.updateQuantity(id, -4), false)
  assert.equal(cart.updateQuantity(id, 'abc'), false)
  assert.equal(cart.items[0].quantity, 2)
  assert.equal(cart.updateQuantity(id, 99), 5) // capped at stock
  assert.equal(cart.getMaxQuantity(cart.items[0]), 5)
  assert.equal(cart.updateQuantity('nope', 2), false)
})

test('remove deletes only the chosen line', () => {
  const p = bySlug('classic-runner-pro')
  cart.addToCart(p, { colourId: 'black', size: 40 })
  cart.addToCart(p, { colourId: 'black', size: 41 })
  cart.removeFromCart('1:black:40')
  assert.deepEqual(cart.items.map((i) => i.lineId), ['1:black:41'])
})

test('empty cart totals are zero', () => {
  assert.equal(cart.getItemCount(), 0)
  assert.equal(cart.getSubtotal(), 0)
  assert.equal(cart.getTax(), 0)
  assert.equal(cart.getGrandTotal(), 0)
})

test('subtotal, 10% tax and total are correct', () => {
  cart.addToCart(bySlug('classic-runner-pro'), { colourId: 'black', size: 40 }) // 50,000
  cart.addToCart(bySlug('classic-runner-pro'), { colourId: 'black', size: 40 }) // x2
  cart.addToCart(bySlug('apex-trail-runner'), { colourId: 'olive', size: 40 }) // 70,000
  assert.equal(TAX_RATE, 0.1)
  assert.equal(cart.getItemCount(), 3)
  assert.equal(cart.getSubtotal(), 170000)
  assert.equal(cart.getTotal(), 170000) // existing name = subtotal
  assert.equal(cart.getTax(), 17000)
  assert.equal(cart.getGrandTotal(), 187000)
  assert.ok(Math.abs(cart.getGrandTotal() - cart.getSubtotal() * 1.1) < 0.005) // matches old formula
})

test('clearCart empties the cart (checkout completion)', () => {
  cart.addToCart(bySlug('kerb-runner'))
  cart.clearCart()
  assert.equal(cart.items.length, 0)
  assert.equal(cart.getGrandTotal(), 0)
})

// ---------- checkout (static source check; the component itself is not rendered here) ----------
import { readFileSync } from 'node:fs'
test('Checkout.vue contains no payment or card fields', () => {
  const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'src/components/Checkout.vue'), 'utf8')
  assert.doesNotMatch(src, /cardNumber|cardExpiry|cardCVC|card number|expiry|cvc|payment information/i)
})

test('Checkout.vue shows the demo notice', () => {
  const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'src/components/Checkout.vue'), 'utf8')
  assert.ok(src.includes('Demo checkout — no payment will be collected.'))
})
