// Shared catalogue constants. Keep this file free of imports so any
// other data file can use it without circular dependencies.

// EU sizes offered across the store.
export const EU_SIZES = [40, 41, 42, 43, 44, 45]

// Product categories. "court" covers basketball-inspired styles.
export const CATEGORIES = [
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'running', label: 'Running' },
  { id: 'court', label: 'Court', note: 'Basketball-inspired' },
  { id: 'everyday', label: 'Everyday' }
]

// Named collections / drops a product can belong to.
export const COLLECTIONS = [
  { id: 'core', label: 'Core' },
  { id: 'drop-07', label: 'Drop 07' }
]

// One place to define colour names and swatches.
export const COLOURS = {
  black: { name: 'Black', swatch: '#1A1A1A' },
  white: { name: 'White', swatch: '#F4F2EC' },
  ink: { name: 'Ink', swatch: '#111111' },
  sand: { name: 'Sand', swatch: '#CDBFA6' },
  grey: { name: 'Grey', swatch: '#8A8780' },
  navy: { name: 'Navy', swatch: '#1F2A44' },
  olive: { name: 'Olive', swatch: '#5B6B45' },
  signal: { name: 'Signal Red', swatch: '#D7392B' },
  volt: { name: 'Volt', swatch: '#D4FF3A' },
  bone: { name: 'Bone', swatch: '#E4DFD2' }
}

// Image conventions. Every colourway has the same three views, in this order.
// The first view is used for product cards.
export const IMAGE_VIEWS = ['side', 'angle', 'detail']
export const IMAGE_BASE = '/images/products'
export const IMAGE_EXT = 'svg' // placeholders; real photos can use their own paths (see products.js)

// Cart rules
export const TAX_RATE = 0.1
export const MAX_QTY_PER_LINE = 10
