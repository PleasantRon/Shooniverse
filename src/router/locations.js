import { ROUTE_NAMES } from './routes.js'

// One place that builds router locations, so components do not repeat
// route names and param shapes.

export const homeLocation = () => ({ name: ROUTE_NAMES.HOME })

// A section of the homepage, e.g. homeSectionLocation('about') -> /#about
export const homeSectionLocation = (id) => ({ name: ROUTE_NAMES.HOME, hash: `#${id}` })

// The shop, optionally filtered, e.g. shopLocation({ category: 'running' })
export const shopLocation = (query) =>
  query ? { name: ROUTE_NAMES.SHOP, query } : { name: ROUTE_NAMES.SHOP }

export const productLocation = (product) => ({
  name: ROUTE_NAMES.PRODUCT,
  params: { slug: product.slug }
})

export const cartLocation = () => ({ name: ROUTE_NAMES.CART })
