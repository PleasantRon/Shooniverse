// Run with:  node --test tests/phase3-router.integration.test.mjs
// Exercises the real vue-router (memory history, stub page components).
// It needs `vue` and `vue-router` installed (npm install). If either is missing
// the tests are SKIPPED, not passed.
import test from 'node:test'
import assert from 'node:assert/strict'

let VueRouter = null
let storeModule = null
try {
  VueRouter = await import('vue-router')
  storeModule = await import('../src/store.js')
} catch {
  // dependencies not installed in this environment
}
const run = VueRouter && storeModule ? test : test.skip

const { routes } = await import('../src/router/routes.js')
const { getProductBySlug } = await import('../src/data/catalog.js')

const Stub = { render: () => null }
const stubRoutes = routes.map((r) => ({ ...r, component: Stub }))

async function makeRouter() {
  const { createAppRouter } = await import('../src/router/index.js')
  const history = VueRouter.createMemoryHistory()
  const router = createAppRouter({ history, routes: stubRoutes, cartStore: storeModule.cart })
  await router.push('/')
  await router.isReady()
  return router
}

// router.back()/forward() finish asynchronously
async function waitForPath(router, path) {
  for (let i = 0; i < 100; i++) {
    if (router.currentRoute.value.fullPath === path) return
    await new Promise((r) => setTimeout(r, 5))
  }
  assert.equal(router.currentRoute.value.fullPath, path)
}

run('each main path resolves to its named route', async () => {
  const router = await makeRouter()
  for (const [path, name] of [['/', 'home'], ['/shop', 'shop'], ['/cart', 'cart'], ['/checkout', 'checkout']]) {
    assert.equal(router.resolve(path).name, name)
  }
  const product = router.resolve('/product/meridian-01')
  assert.equal(product.name, 'product')
  assert.equal(product.params.slug, 'meridian-01')
})

run('unknown paths fall through to the not-found route', async () => {
  const router = await makeRouter()
  assert.equal(router.resolve('/nope').name, 'not-found')
  assert.equal(router.resolve('/product/').name, 'not-found')
  assert.equal(router.resolve('/shop/extra/segments').name, 'not-found')
})

run('an unknown product slug still routes to the product page, which shows not-found', async () => {
  const router = await makeRouter()
  await router.push('/product/not-a-real-shoe')
  assert.equal(router.currentRoute.value.name, 'product')
  assert.equal(getProductBySlug(router.currentRoute.value.params.slug), null)
})

run('navigating between screens, with back and forward', async () => {
  const router = await makeRouter()
  await router.push({ name: 'shop' })
  await router.push({ name: 'product', params: { slug: 'halo-low' } })
  await router.push({ name: 'cart' })
  assert.equal(router.currentRoute.value.fullPath, '/cart')
  router.back()
  await waitForPath(router, '/product/halo-low')
  router.back()
  await waitForPath(router, '/shop')
  router.forward()
  await waitForPath(router, '/product/halo-low')
})

run('cart contents survive navigation', async () => {
  const { cart } = storeModule
  cart.clearCart()
  const router = await makeRouter()
  cart.addToCart(getProductBySlug('classic-runner-pro'), { colourId: 'black', size: 40 })
  cart.addToCart(getProductBySlug('classic-runner-pro'), { colourId: 'black', size: 41 })
  for (const path of ['/shop', '/product/kerb-runner', '/cart', '/checkout', '/']) await router.push(path)
  assert.equal(cart.items.length, 2)
  assert.equal(cart.getGrandTotal(), 110000)
  cart.clearCart()
})

run('checkout redirects to the cart when empty, and opens when not', async () => {
  const { cart } = storeModule
  cart.clearCart()
  const router = await makeRouter()
  await router.push('/checkout')
  assert.equal(router.currentRoute.value.name, 'cart')
  cart.addToCart(getProductBySlug('kerb-runner'))
  await router.push('/checkout')
  assert.equal(router.currentRoute.value.name, 'checkout')
  cart.clearCart()
})
