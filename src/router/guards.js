import { getProductBySlug } from '../data/catalog.js'
import { ROUTE_NAMES } from './routes.js'
import { pageTitle } from '../config/site.js'

// Checkout needs something to check out. Direct visits (typed URL, refresh,
// bookmark) with an empty cart are sent to the cart page instead.
export function checkoutGuard(to, cartStore) {
  if (to.meta?.requiresItems && cartStore.items.length === 0) {
    return { name: ROUTE_NAMES.CART, replace: true }
  }
  return true
}

// Browser tab title for a route.
export function routeTitle(to) {
  if (to.name === ROUTE_NAMES.PRODUCT) {
    const product = getProductBySlug(to.params.slug)
    return pageTitle(product ? product.name : 'Shoe not found')
  }
  return pageTitle(to.meta?.title)
}

// Space kept clear above an in-page target (the header is sticky).
export const HEADER_OFFSET = 88

// Back/forward restores the saved position, links like /#about scroll to the
// section, everything else starts at the top.
export function scrollBehavior(to, from, savedPosition, reduceMotion = prefersReducedMotion) {
  if (savedPosition) return savedPosition
  if (to.hash) {
    return { el: to.hash, top: HEADER_OFFSET, behavior: reduceMotion() ? 'auto' : 'smooth' }
  }
  return { top: 0 }
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}
