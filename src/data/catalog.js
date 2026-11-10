import { products } from './products.js'
import { EU_SIZES, CATEGORIES, COLLECTIONS } from './constants.js'

// Read-only helpers over the product data. Components and the store use
// these instead of digging through the data structure themselves.

export const getProductById = (id) => products.find((p) => p.id === Number(id)) ?? null
export const getProductBySlug = (slug) => products.find((p) => p.slug === slug) ?? null

export const getVariant = (product, colourId) =>
  product?.variants.find((v) => v.colourId === colourId) ?? null

// Pairs available for one colour and size. Unknown combinations return 0.
export function getStock(product, colourId, size) {
  const variant = getVariant(product, colourId)
  return variant?.stock[Number(size)] ?? 0
}

export const isAvailable = (product, colourId, size) => getStock(product, colourId, size) > 0

export const getAvailableSizes = (variant) =>
  EU_SIZES.filter((size) => (variant?.stock[size] ?? 0) > 0)

export const isProductInStock = (product) =>
  product.variants.some((v) => getAvailableSizes(v).length > 0)

// First in-stock colour and size. Returns null when the product is sold out.
// Pass a colourId to stay within a colour the shopper already chose.
export function getDefaultSelection(product, colourId = null) {
  const candidates = colourId
    ? product.variants.filter((v) => v.colourId === colourId)
    : product.variants
  for (const variant of candidates) {
    const size = getAvailableSizes(variant)[0]
    if (size !== undefined) return { colourId: variant.colourId, size }
  }
  return null
}

// Identifies a cart line: same product + colour + size = same line.
export const makeLineId = (productId, colourId, size) => `${productId}:${colourId}:${size}`

export const getFeatured = () => products.filter((p) => p.isFeatured)
export const getNewArrivals = () =>
  products.filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

// Display names for a product's category and collection ('' if unknown).
export const getCategoryLabel = (product) =>
  CATEGORIES.find((c) => c.id === product.category)?.label ?? ''
export const getCollectionLabel = (product) =>
  COLLECTIONS.find((c) => c.id === product.collection)?.label ?? ''

// ---------- categories and filtering ----------
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id) ?? null
export const isCategoryId = (id) => getCategory(id) !== null
export const isCollectionId = (id) => COLLECTIONS.some((c) => c.id === id)

// Filters a product list. `category` and `collection` are ids; a blank value means
// "no filter". An id that does not exist matches nothing (it never falls back to everything).
export function filterProducts(list, { category, collection } = {}) {
  return list.filter(
    (p) => (!category || p.category === category) && (!collection || p.collection === collection)
  )
}

// How many products each category holds, e.g. { running: 4, boots: 4, ... }.
export function countByCategory(list = products) {
  return Object.fromEntries(CATEGORIES.map((c) => [c.id, list.filter((p) => p.category === c.id).length]))
}

// Reads the Shop page address (?category=...&collection=...) and returns what to show.
// An id that does not exist shows nothing (unknown: true) rather than everything.
export function resolveShopFilter(query = {}, list = products) {
  const first = (value) => (Array.isArray(value) ? value[0] : value) ?? ''
  const category = first(query.category)
  const collection = first(query.collection)
  const unknown =
    (category !== '' && !isCategoryId(category)) || (collection !== '' && !isCollectionId(collection))
  return {
    category,
    collection,
    unknown,
    products: unknown ? [] : filterProducts(list, { category, collection })
  }
}
