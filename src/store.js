import { reactive } from 'vue'
import { products } from './data/products.js'
import { TAX_RATE, MAX_QTY_PER_LINE, EU_SIZES } from './data/constants.js'
import {
  getProductById,
  getVariant,
  getStock,
  getDefaultSelection,
  makeLineId
} from './data/catalog.js'

// Products now live in src/data/products.js. Re-exported so existing
// imports of `products` from this file keep working.
export { products }
export { TAX_RATE, MAX_QTY_PER_LINE }

// Money is kept in naira with at most 2 decimals.
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

// Cart lines are identified by product + colour + size (`lineId`), so the same
// shoe in two sizes is two lines, and the same size twice is one line with quantity 2.
export const cart = reactive({
  items: [],

  // addToCart(product, { colourId, size })
  // Existing callers pass only the product; in that case the first in-stock
  // colour and size is used (temporary until the size picker exists).
  // Returns { ok: true, lineId } or { ok: false, reason }.
  addToCart(product, selection = {}) {
    // Always use the catalogue's own data, never values passed in by the caller.
    const catalogProduct = getProductById(product?.id)
    if (!catalogProduct) return { ok: false, reason: 'unknown-product' }

    const fallback = getDefaultSelection(catalogProduct, selection.colourId ?? null)
    const colourId = selection.colourId ?? fallback?.colourId
    const size = Number(selection.size ?? fallback?.size)

    const variant = getVariant(catalogProduct, colourId)
    if (!variant) return { ok: false, reason: 'unknown-colour' }
    if (!EU_SIZES.includes(size)) return { ok: false, reason: 'unknown-size' }

    const stock = getStock(catalogProduct, colourId, size)
    if (stock <= 0) return { ok: false, reason: 'out-of-stock' }

    const lineId = makeLineId(catalogProduct.id, colourId, size)
    const existing = this.items.find((item) => item.lineId === lineId)

    if (existing) {
      if (existing.quantity >= Math.min(MAX_QTY_PER_LINE, stock)) {
        return { ok: false, reason: 'max-quantity' }
      }
      existing.quantity += 1
    } else {
      this.items.push({
        lineId,
        id: catalogProduct.id, // product id (kept for existing components)
        slug: catalogProduct.slug,
        name: catalogProduct.name,
        price: catalogProduct.price,
        image: variant.images.card,
        colourId,
        colourName: variant.colourName,
        size,
        quantity: 1
      })
    }
    return { ok: true, lineId }
  },

  // Removes one cart line (not every size of that product).
  removeFromCart(lineId) {
    this.items = this.items.filter((item) => item.lineId !== lineId)
  },

  // Highest quantity allowed for a line: the lower of the store limit and the stock.
  getMaxQuantity(item) {
    const product = getProductById(item.id)
    return Math.min(MAX_QTY_PER_LINE, getStock(product, item.colourId, item.size))
  },

  // Sets a line's quantity. Ignores values below 1 and caps at the maximum.
  // Returns the quantity now on the line, or false if nothing changed.
  updateQuantity(lineId, quantity) {
    const item = this.items.find((i) => i.lineId === lineId)
    const wanted = Math.floor(Number(quantity))
    if (!item || !Number.isFinite(wanted) || wanted < 1) return false
    item.quantity = Math.min(wanted, this.getMaxQuantity(item))
    return item.quantity
  },

  // All money calculations live here so Cart and Checkout always agree.
  getSubtotal() {
    return round2(this.items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  },

  getTax() {
    return round2(this.getSubtotal() * TAX_RATE)
  },

  getGrandTotal() {
    return round2(this.getSubtotal() + this.getTax())
  },

  // Existing name, still the pre-tax subtotal.
  getTotal() {
    return this.getSubtotal()
  },

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0)
  },

  clearCart() {
    this.items = []
  }
})
