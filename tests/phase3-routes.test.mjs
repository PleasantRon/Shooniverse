// Run with:  node --test tests/phase3-routes.test.mjs
// Plain Node, no extra dependencies. These tests cover the route table, the
// navigation guard, slug handling and the migration from the old event-based
// navigation. Real in-router navigation is in phase3-router.integration.test.mjs.
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { root, src, read, walk } from './helpers.mjs'
import { SITE_NAME } from '../src/config/site.js'
import { routes, ROUTE_NAMES } from '../src/router/routes.js'
import { checkoutGuard, routeTitle } from '../src/router/guards.js'
import { cart, products } from '../src/store.js'
import { getProductBySlug } from '../src/data/catalog.js'

test.beforeEach(() => cart.clearCart())

// ---------- route table ----------
test('the five main screens have the agreed paths', () => {
  const byName = Object.fromEntries(routes.map((r) => [r.name, r.path]))
  assert.equal(byName[ROUTE_NAMES.HOME], '/')
  assert.equal(byName[ROUTE_NAMES.SHOP], '/shop')
  assert.equal(byName[ROUTE_NAMES.PRODUCT], '/product/:slug')
  assert.equal(byName[ROUTE_NAMES.CART], '/cart')
  assert.equal(byName[ROUTE_NAMES.CHECKOUT], '/checkout')
})

test('route names and paths are unique, and the catch-all is last', () => {
  assert.equal(new Set(routes.map((r) => r.name)).size, routes.length)
  assert.equal(new Set(routes.map((r) => r.path)).size, routes.length)
  const last = routes[routes.length - 1]
  assert.equal(last.name, ROUTE_NAMES.NOT_FOUND)
  assert.match(last.path, /pathMatch/)
})

test('every route has a lazy component that points at a real file', () => {
  for (const r of routes) {
    assert.equal(typeof r.component, 'function', r.name)
    const match = /import\(['"](.+?)['"]\)/.exec(r.component.toString())
    assert.ok(match, `${r.name}: no import() found`)
    const file = resolve(src, 'router', match[1])
    assert.ok(existsSync(file), `${r.name}: ${file} is missing`)
  }
})

test('the product route passes the slug to its view as a prop', () => {
  const route = routes.find((r) => r.name === ROUTE_NAMES.PRODUCT)
  assert.equal(route.props, true)
  assert.match(read('src/views/ProductView.vue'), /slug:\s*\{\s*type:\s*String/)
})

// ---------- slugs ----------
test('every product has a URL-safe slug that resolves back to the product', () => {
  for (const p of products) {
    assert.match(p.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, p.slug)
    assert.equal(getProductBySlug(p.slug), p)
  }
})

test('invalid slugs resolve to nothing (the product page shows its not-found state)', () => {
  for (const slug of ['', 'nope', 'madam-koi-koi', 'elite-red-wings-boots', 'MERIDIAN-01', '../x', '1']) {
    assert.equal(getProductBySlug(slug), null, slug)
  }
  const view = read('src/views/ProductView.vue')
  assert.match(view, /v-if="product"/)
  assert.match(view, /NotFoundState/)
})

// ---------- checkout guard ----------
test('checkout with an empty cart redirects to the cart', () => {
  const to = routes.find((r) => r.name === ROUTE_NAMES.CHECKOUT)
  assert.deepEqual(checkoutGuard(to, cart), { name: ROUTE_NAMES.CART, replace: true })
})

test('checkout with items in the cart is allowed', () => {
  cart.addToCart(getProductBySlug('kerb-runner'))
  const to = routes.find((r) => r.name === ROUTE_NAMES.CHECKOUT)
  assert.equal(checkoutGuard(to, cart), true)
})

test('other routes are never blocked by the guard, even with an empty cart', () => {
  for (const r of routes.filter((r) => r.name !== ROUTE_NAMES.CHECKOUT)) {
    assert.equal(checkoutGuard(r, cart), true, r.name)
  }
})

// ---------- cart state across navigation ----------
test('cart contents survive "navigating" between routes (the store is not tied to a page)', () => {
  cart.addToCart(getProductBySlug('classic-runner-pro'), { colourId: 'black', size: 40 })
  cart.addToCart(getProductBySlug('classic-runner-pro'), { colourId: 'black', size: 41 })
  const before = JSON.stringify(cart.items)
  for (const r of routes) checkoutGuard(r, cart) // guards run on every navigation
  assert.equal(JSON.stringify(cart.items), before)
  assert.equal(cart.getItemCount(), 2)
  assert.equal(cart.getSubtotal(), 100000)
  assert.equal(cart.getTax(), 10000)
  assert.equal(cart.getGrandTotal(), 110000)
})

// ---------- titles ----------
test('tab titles: home, static pages, known and unknown products', () => {
  assert.equal(routeTitle({ name: 'home', meta: { title: null } }), `${SITE_NAME} · Premium sneakers`)
  assert.equal(routeTitle({ name: 'shop', meta: { title: 'Shop' } }), `Shop · ${SITE_NAME}`)
  assert.equal(routeTitle({ name: 'product', params: { slug: 'meridian-01' }, meta: {} }), `Meridian 01 · ${SITE_NAME}`)
  assert.equal(routeTitle({ name: 'product', params: { slug: 'zzz' }, meta: {} }), `Shoe not found · ${SITE_NAME}`)
})

// ---------- migration from the old navigation ----------
test('no trace of the old event-based navigation remains in src/', () => {
  const files = walk(src).filter((f) => /\.(vue|js)$/.test(f))
  for (const f of files) {
    const text = readFileSync(f, 'utf8')
    assert.doesNotMatch(text, /CustomEvent|currentView|show-catalog|show-cart|show-checkout|show-shop/, f)
    assert.doesNotMatch(text, /addEventListener\(\s*['"]show-/, f)
  }
})

test('App.vue renders the routed page and navigates with RouterLink', () => {
  assert.match(read('src/App.vue'), /<RouterView/)
  assert.match(read('src/components/SiteHeader.vue'), /<RouterLink/)
})

test('Cart and Checkout navigate through the router', () => {
  const cartSrc = read('src/components/Cart.vue')
  const checkoutSrc = read('src/components/Checkout.vue')
  assert.match(cartSrc, /router\.push\(\{ name: 'checkout' \}\)/)
  assert.match(checkoutSrc, /router\.push\(\{ name: 'shop' \}\)/) // after the demo order
  assert.match(checkoutSrc, /router\.push\(\{ name: 'cart' \}\)/) // back button
})

test('product pages add to the cart with an explicit colour and size', () => {
  const details = read('src/components/ProductDetails.vue')
  assert.match(details, /cart\.addToCart\(props\.product, \{ colourId: colourId\.value, size: size\.value \}\)/)
  assert.match(details, /EU_SIZES/)
  assert.match(details, /:disabled="stockFor\(s\) === 0"/) // unavailable sizes cannot be chosen
})

test('product data is not duplicated: no component imports data/products.js directly', () => {
  for (const f of walk(join(src, 'components')).concat(walk(join(src, 'views')))) {
    assert.doesNotMatch(readFileSync(f, 'utf8'), /data\/products\.js/, f)
  }
})

test('vue-router is declared as a dependency', () => {
  const pkg = JSON.parse(read('package.json'))
  assert.match(pkg.dependencies['vue-router'], /^\^4\./)
  assert.ok(!('pinia' in pkg.dependencies))
})
