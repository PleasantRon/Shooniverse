// Run with:  node --test tests/*.test.mjs
// Phase 5: orbit design tokens, theme handling, header/footer shell, and homepage navigation.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { root, read, walk } from './helpers.mjs'
import {
  THEME_KEY, isTheme, readStoredTheme, saveTheme, resolveTheme, nextTheme, applyTheme
} from '../src/utils/theme.js'
import { cartAriaLabel, cartBadgeText } from '../src/utils/format.js'
import { scrollBehavior, HEADER_OFFSET } from '../src/router/guards.js'
import { routes } from '../src/router/routes.js'
import { cart } from '../src/store.js'
import { siteCopy } from '../src/data/siteCopy.js'
import { getHomepageContent } from '../src/data/homepage.js'
import { getProductBySlug } from '../src/data/catalog.js'
import { homeLocation, homeSectionLocation, shopLocation, productLocation, cartLocation } from '../src/router/locations.js'

const srcFiles = walk(join(root, 'src')).filter((f) => /\.(vue|js|css)$/.test(f))

// A tiny stand-in for localStorage
const fakeStorage = (initial = {}) => {
  const data = { ...initial }
  return { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v) }, data }
}

// ---------- theme ----------
test('theme: a saved choice wins; otherwise the operating system decides', () => {
  assert.equal(resolveTheme({ stored: 'dark', prefersDark: false }), 'dark')
  assert.equal(resolveTheme({ stored: 'light', prefersDark: true }), 'light')
  assert.equal(resolveTheme({ stored: null, prefersDark: true }), 'dark')
  assert.equal(resolveTheme({ stored: null, prefersDark: false }), 'light')
  assert.equal(resolveTheme({ stored: 'purple', prefersDark: true }), 'dark') // invalid value ignored
})

test('theme: reading tolerates missing, invalid and blocked storage', () => {
  assert.equal(readStoredTheme(fakeStorage()), null)
  assert.equal(readStoredTheme(fakeStorage({ [THEME_KEY]: 'banana' })), null)
  assert.equal(readStoredTheme(null), null)
  assert.equal(readStoredTheme({ getItem() { throw new Error('blocked') } }), null)
})

test('theme: the choice persists across "reloads" and is only saved when valid', () => {
  const storage = fakeStorage()
  assert.equal(saveTheme(storage, 'dark'), true)
  assert.equal(storage.data[THEME_KEY], 'dark')
  // a fresh page load reads it back, even if the OS prefers light
  assert.equal(resolveTheme({ stored: readStoredTheme(storage), prefersDark: false }), 'dark')
  assert.equal(saveTheme(storage, 'sepia'), false)
  assert.equal(storage.data[THEME_KEY], 'dark')
  assert.equal(saveTheme({ setItem() { throw new Error('full') } }, 'light'), false)
})

test('theme: toggling flips between light and dark, and applies data-theme to the root', () => {
  assert.equal(nextTheme('light'), 'dark')
  assert.equal(nextTheme('dark'), 'light')
  assert.ok(isTheme('light') && isTheme('dark') && !isTheme('auto'))
  const attrs = {}
  const root = { setAttribute: (k, v) => { attrs[k] = v }, style: {} }
  applyTheme('dark', root)
  assert.equal(attrs['data-theme'], 'dark')
  assert.equal(root.style.colorScheme, 'dark')
})

test('index.html sets the theme before first paint using the same storage key and loads Archivo', () => {
  const html = read('index.html')
  assert.ok(html.includes(`'${THEME_KEY}'`))
  assert.match(html, /setAttribute\('data-theme'/)
  assert.match(html, /prefers-color-scheme: dark/)
  assert.match(html, /family=Archivo:wght@400;500;600;700;800;900/)
  assert.doesNotMatch(html, /Anton|Space\+Mono/)
})

test('the toggle lives in the header, uses the shared theme state, and has an accessible name', () => {
  assert.match(read('src/components/SiteHeader.vue'), /<ThemeToggle/)
  const toggle = read('src/components/ThemeToggle.vue')
  assert.match(toggle, /useTheme/)
  assert.match(toggle, /Switch to (dark|light) theme/)
  assert.match(read('src/main.js'), /initTheme\(\)/)
})

// ---------- design tokens ----------
test('light and dark tokens match the approved palette', () => {
  const css = read('src/style.css')
  const light = css.slice(css.indexOf(':root {'), css.indexOf(":root[data-theme='dark']"))
  const dark = css.slice(css.indexOf(":root[data-theme='dark']"), css.indexOf('* {'))
  for (const [name, value] of Object.entries({
    '--bg': '#eeeff2', '--panel': '#e0e2e8', '--card': '#ffffff', '--text': '#101114',
    '--muted': '#5d6270', '--border': '#d4d6dd', '--accent': '#2b3dff', '--accent-text': '#ffffff'
  })) assert.ok(light.includes(`${name}: ${value};`), `light ${name}`)
  for (const [name, value] of Object.entries({
    '--bg': '#0d0e11', '--panel': '#1b1d24', '--card': '#15171c', '--text': '#f1f2f5',
    '--muted': '#9a9fad', '--border': '#2a2d36', '--accent': '#6b7aff', '--accent-text': '#0d0e11'
  })) assert.ok(dark.includes(`${name}: ${value};`), `dark ${name}`)
  assert.match(css, /--font: 'Archivo'/)
})

test('no old ink/bone/volt tokens, fonts or helper classes remain anywhere in src', () => {
  const old = /var\(--(ink|bone|volt|grey|line|pad|font-display|font-mono)\b|--(ink|bone|volt):|Anton|Space Mono|sv-(display|label|chip|tile|link|section-head)\b|#d4ff3a|#edeae3/i
  // product data is excluded: "Volt" is the name of a real shoe colourway, not a design token
  for (const f of srcFiles.filter((f) => !f.includes(join('src', 'data')))) {
    assert.doesNotMatch(readFileSync(f, 'utf8'), old, f)
  }
})

test('motion and focus: reduced-motion is respected and keyboard focus is visible', () => {
  const css = read('src/style.css')
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(css, /:focus-visible/)
  for (const f of ['CategoriesSection', 'HomeProductCard']) {
    const text = read(`src/components/${f}.vue`)
    if (/transform 0\.\d+s|transition: transform/.test(text)) {
      assert.match(text, /prefers-reduced-motion: no-preference/, `${f}: motion not guarded`)
    }
  }
})

// ---------- no invented prices or promises ----------
test('no hardcoded dollar prices in the homepage, shell or site copy', () => {
  const files = [
    'src/data/siteCopy.js', 'src/data/homepage.js', 'src/views/HomeView.vue',
    'src/components/HeroSection.vue', 'src/components/HeroOrbit.vue', 'src/components/HomeProductCard.vue', 'src/components/FeaturedProducts.vue',
    'src/components/CategoriesSection.vue', 'src/components/PromoSection.vue', 'src/components/AboutSection.vue',
    'src/components/SiteHeader.vue', 'src/components/SiteFooter.vue'
  ]
  for (const f of files) assert.doesNotMatch(read(f), /\$\s?\d|USD|dollar/i, f)
  // every displayed price goes through the naira formatter
  for (const f of ['HeroOrbit', 'HomeProductCard']) assert.match(read(`src/components/${f}.vue`), /formatPrice\(product\.price\)/)
})

test('site copy makes no invented guarantees, policies or numbers', () => {
  const text = JSON.stringify(siteCopy)
  assert.doesNotMatch(text, /free shipping|money.?back|\d+[- ]day|guarantee|warranty|lifetime|Port Harcourt|newsletter/i)
  assert.deepEqual(siteCopy.benefits.map((b) => b.title), ['Shipping', 'Returns', 'Quality and materials'])
})

// ---------- header ----------
test('header has Home, Shop, About (via the router), a cart link, theme toggle and mobile menu', () => {
  const h = read('src/components/SiteHeader.vue')
  assert.match(h, /:to="homeLocation\(\)"/)
  assert.match(h, /:to="shopLocation\(\)"/)
  assert.match(h, /:to="homeSectionLocation\('about'\)"/)
  assert.match(h, /:to="cartLocation\(\)"/)
  assert.match(h, /<BrandLink/)
  assert.doesNotMatch(h, /<a\b/) // application routes use RouterLink, not plain anchors
  assert.match(h, /<nav id="site-nav"[^>]*aria-label="Main"/)
  assert.match(h, /:aria-expanded="menuOpen"/)
  assert.match(h, /aria-controls="site-nav"/)
  assert.match(h, /event\.key === 'Escape'/)
  assert.match(h, /watch\(\(\) => route\.fullPath/) // menu closes after navigating
})

test('header cart badge reads the existing cart store', () => {
  const h = read('src/components/SiteHeader.vue')
  assert.match(h, /cart\.getItemCount\(\)/)
  assert.match(h, /cartAriaLabel\(itemCount\)/)
  assert.match(h, /cartBadgeText\(itemCount\)/)

  cart.clearCart()
  assert.equal(cart.getItemCount(), 0)
  cart.addToCart(getProductBySlug('classic-runner-pro'), { colourId: 'black', size: 40 })
  cart.addToCart(getProductBySlug('classic-runner-pro'), { colourId: 'black', size: 40 })
  cart.addToCart(getProductBySlug('kerb-runner'))
  assert.equal(cart.getItemCount(), 3)
  assert.equal(cartBadgeText(cart.getItemCount()), '3')
  assert.equal(cartAriaLabel(cart.getItemCount()), 'Cart, 3 items')
  cart.removeFromCart(cart.items[0].lineId)
  assert.equal(cart.getItemCount(), 1)
  assert.equal(cartAriaLabel(cart.getItemCount()), 'Cart, 1 item')
  cart.clearCart()
  assert.equal(cartAriaLabel(cart.getItemCount()), 'Cart, empty')
})

test('badge and label helpers handle odd values', () => {
  assert.equal(cartBadgeText(100), '99+')
  assert.equal(cartBadgeText(99), '99')
  assert.equal(cartBadgeText(undefined), '0')
  assert.equal(cartAriaLabel(-4), 'Cart, empty')
  assert.equal(cartAriaLabel('2'), 'Cart, 2 items')
})

// ---------- router: in-page links ----------
test('links like /#about scroll to the section below the sticky header; other rules unchanged', () => {
  const never = () => false
  assert.deepEqual(scrollBehavior({ hash: '#about' }, {}, null, never), { el: '#about', top: HEADER_OFFSET, behavior: 'smooth' })
  assert.deepEqual(scrollBehavior({ hash: '#about' }, {}, null, () => true), { el: '#about', top: HEADER_OFFSET, behavior: 'auto' })
  assert.deepEqual(scrollBehavior({ hash: '' }, {}, null, never), { top: 0 })
  const saved = { left: 0, top: 480 }
  assert.equal(scrollBehavior({ hash: '#about' }, {}, saved, never), saved) // back/forward wins
})

test('routes are unchanged by the redesign', () => {
  assert.deepEqual(
    routes.map((r) => [r.name, r.path]),
    [['home', '/'], ['shop', '/shop'], ['product', '/product/:slug'], ['cart', '/cart'], ['checkout', '/checkout'], ['not-found', '/:pathMatch(.*)*']]
  )
})

// ---------- footer and in-page targets ----------
test('location helpers build valid router locations, and every #section target exists on the homepage', () => {
  const routeNames = new Set(routes.map((r) => r.name))
  const product = getProductBySlug('meridian-01')
  for (const loc of [homeLocation(), shopLocation(), shopLocation({ category: 'running' }), productLocation(product), cartLocation(), homeSectionLocation('about')]) {
    assert.ok(routeNames.has(loc.name), loc.name)
  }
  assert.deepEqual(productLocation(product), { name: 'product', params: { slug: 'meridian-01' } })
  assert.deepEqual(shopLocation({ collection: 'drop-07' }), { name: 'shop', query: { collection: 'drop-07' } })
  assert.deepEqual(homeSectionLocation('about'), { name: 'home', hash: '#about' })

  const shell = read('src/components/SiteFooter.vue') + read('src/components/SiteHeader.vue') + read('src/components/HeroSection.vue')
  const homepageSource = ['AboutSection', 'PromoSection', 'CategoriesSection', 'FeaturedProducts']
    .map((f) => read(`src/components/${f}.vue`)).join('\n')
  for (const [, id] of shell.matchAll(/homeSectionLocation\('([a-z-]+)'\)/g)) {
    assert.ok(homepageSource.includes(`id="${id}"`), `#${id} has no target section`)
  }
  assert.doesNotMatch(shell, /href="#?"/) // no dead placeholder links
})

test('footer: four columns, category links match the catalogue, current-year copyright', () => {
  const f = read('src/components/SiteFooter.vue')
  assert.match(f, /footer-brand/)
  for (const heading of ['Shop', 'Support', 'Company']) assert.match(f, new RegExp(`>${heading}</h2>`))
  assert.match(f, /v-for="category in CATEGORIES"/)
  assert.match(f, /new Date\(\)\.getFullYear\(\)/)
  assert.match(f, /All rights reserved/)
})

// ---------- shell behaviour ----------
test('only the homepage uses the new surface; other screens keep their light surface for now', () => {
  const app = read('src/App.vue')
  assert.match(app, /'legacy-surface': !isHome/)
  assert.match(app, /<RouterView/)
  for (const f of ['Cart', 'Checkout', 'ProductCard', 'ProductDetails', 'ProductCatalog']) {
    assert.doesNotMatch(read(`src/components/${f}.vue`), /var\(--(accent|panel|card)\b/, `${f} should not be restyled yet`)
  }
})

test('homepage images all exist on disk', () => {
  const c = getHomepageContent()
  const shown = [c.hero, ...c.showcase, ...c.categories.map((x) => x.product)]
  for (const p of shown) assert.ok(existsSync(join(root, 'public', p.image)), p.image)
})
