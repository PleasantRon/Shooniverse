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
