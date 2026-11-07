// Formats a naira amount, e.g. 50000 -> "₦50,000".
// Pass { decimals: 2 } to show kobo, e.g. "₦50,000.00".
export function formatPrice(amount, { decimals = 0 } = {}) {
  const n = Number(amount)
  const safe = Number.isFinite(n) ? n : 0
  return '₦' + safe.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

// Accessible name for the header cart link.
export function cartAriaLabel(count) {
  const n = Number.isFinite(Number(count)) ? Math.max(0, Math.floor(Number(count))) : 0
  if (n === 0) return 'Cart, empty'
  return `Cart, ${n} ${n === 1 ? 'item' : 'items'}`
}

// Text shown in the cart badge; large counts are shortened.
export function cartBadgeText(count) {
  const n = Number.isFinite(Number(count)) ? Math.max(0, Math.floor(Number(count))) : 0
  return n > 99 ? '99+' : String(n)
}
