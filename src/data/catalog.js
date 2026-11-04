import { products } from './products.js'
import { EU_SIZES } from './constants.js'

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
