import { products } from './products.js'
import { CATEGORIES, COLLECTIONS, EU_SIZES } from './constants.js'
import { getFeatured, getNewArrivals, getAvailableSizes } from './catalog.js'
import { siteCopy } from './siteCopy.js'

const SHOWCASE_SIZE = 8
const ORBIT_SIZE = 4

const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const colourDistance = (a, b) => Math.hypot(...channels(a).map((v, i) => v - channels(b)[i]))
const hasStock = (variant) => getAvailableSizes(variant).length > 0

// Signature shoes that orbit the hero shoe: featured and new products (not the hero),
// each in the existing colourway that looks most different from the ones already chosen,
// so the orbit shows a varied set of the demo colours.
export function pickOrbitShoes(hero, count = ORBIT_SIZE) {
  const heroVariant = hero.variants.find((v) => v.images.card === hero.image) ?? hero.variants[0]
  const seen = new Set([hero.id])
  const candidates = [...getFeatured(), ...getNewArrivals()].filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })

  const chosen = [heroVariant.swatch]
  return candidates.slice(0, count).map((product) => {
    const options = product.variants.filter(hasStock)
    const variant = options
      .map((v) => ({ v, score: Math.min(...chosen.map((swatch) => colourDistance(v.swatch, swatch))) }))
      .sort((a, b) => b.score - a.score)[0].v
    chosen.push(variant.swatch)
    return { product, variant }
  })
}

// Decides what the homepage shows, using only the existing product data.
// A plain function so the selection rules can be tested without a browser.
export function getHomepageContent() {
  const newArrivals = getNewArrivals()

  // The hero shows the flagship: the first product in catalogue order that is
  // both new and featured. Reorder products.js to change it.
  const hero =
    products.find((p) => p.isNew && p.isFeatured) ?? getFeatured()[0] ?? products[0] ?? null

  // Product grid ("All" view): one product from every category, so the first screen shows the
  // whole range. Preferred: featured, then new, then catalogue order. The hero is not repeated.
  const pickForCategory = (categoryId) => {
    const inCategory = products.filter((p) => p.category === categoryId && p.id !== hero?.id)
    return inCategory.find((p) => p.isFeatured) ?? inCategory.find((p) => p.isNew) ?? inCategory[0] ?? null
  }
  const showcase = CATEGORIES.map((c) => pickForCategory(c.id)).filter(Boolean).slice(0, SHOWCASE_SIZE)

  // Choosing a category chip shows every product in that category.
  const showcaseByCategory = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, products.filter((p) => p.category === c.id)])
  )

  // One card per category with its description, pair count and a representative product
  // (not the hero, and not the one already shown in the grid, so images are not repeated).
  const shown = new Set([hero?.id, ...showcase.map((p) => p.id)])
  const categories = CATEGORIES.map((category) => {
    const inCategory = products.filter((p) => p.category === category.id)
    const product =
      inCategory.find((p) => !shown.has(p.id)) ?? inCategory.find((p) => p.id !== hero?.id) ?? inCategory[0] ?? null
    return {
      ...category,
      description: siteCopy.categories.descriptions[category.id],
      count: inCategory.length,
      product
    }
  }).filter((category) => category.count > 0)

  // The current drop is the collection of the newest arrival.
  const dropCollection = newArrivals[0]
    ? COLLECTIONS.find((c) => c.id === newArrivals[0].collection)
    : null
  const drop = dropCollection
    ? {
        ...dropCollection,
        count: products.filter((p) => p.collection === dropCollection.id).length
      }
    : null

  const stats = {
    styles: products.length,
    categories: categories.length,
    sizes: `${EU_SIZES[0]}\u2013${EU_SIZES[EU_SIZES.length - 1]}`
  }

  const heroVariant = hero ? (hero.variants.find((v) => v.images.card === hero.image) ?? hero.variants[0]) : null
  const heroOrbit = hero ? pickOrbitShoes(hero) : []

  return { hero, heroVariant, heroOrbit, showcase, showcaseByCategory, categories, drop, stats }
}
