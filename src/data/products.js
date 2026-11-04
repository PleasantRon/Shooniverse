import { EU_SIZES, COLOURS, IMAGE_VIEWS, IMAGE_BASE, IMAGE_EXT } from './constants.js'

// ---------------------------------------------------------------------
// Product data model
//
// product = {
//   id, slug, name, price (whole naira),
//   shortDescription, longDescription,
//   category   -> see CATEGORIES in constants.js
//   collection -> see COLLECTIONS in constants.js
//   materials[], fit, tags[],
//   isNew, isFeatured, createdAt,
//   variants: [                       one per colourway
//     {
//       id, colourId, colourName, swatch,
//       images: { card, gallery[] },
//       stock: { 40: n, 41: n, ... 45: n }   n = pairs available, 0 = unavailable
//     }
//   ],
//   // Derived for existing components (Phase 2 only, removed when the
//   // product card and cart are rebuilt):
//   image        -> card image of the default variant
//   description  -> same as shortDescription
// }
//
// Size availability lives on each variant, because a size can be sold
// out in one colour and available in another.
//
// Real photography: replace the files at the placeholder paths, or give a
// colour an explicit `images` override (see makeVariant). Components only
// read variant.images, so nothing else changes.
// ---------------------------------------------------------------------

const imagePath = (slug, colourId, view) =>
  `${IMAGE_BASE}/${slug}/${colourId}-${view}.${IMAGE_EXT}`

const stockBySize = (list) =>
  Object.fromEntries(EU_SIZES.map((size, i) => [size, list[i] ?? 0]))

// A colour entry is [colourId, stockList] or [colourId, stockList, imagesOverride]
function makeVariant(slug, [colourId, stockList, imagesOverride]) {
  const colour = COLOURS[colourId]
  const gallery =
    imagesOverride?.gallery ?? IMAGE_VIEWS.map((view) => imagePath(slug, colourId, view))
  return {
    id: `${slug}-${colourId}`,
    colourId,
    colourName: colour.name,
    swatch: colour.swatch,
    images: { card: imagesOverride?.card ?? gallery[0], gallery },
    stock: stockBySize(stockList)
  }
}

function makeProduct({ colours, ...rest }) {
  const variants = colours.map((c) => makeVariant(rest.slug, c))
  const defaultVariant =
    variants.find((v) => Object.values(v.stock).some((n) => n > 0)) ?? variants[0]
  return {
    ...rest,
    variants,
    image: defaultVariant.images.card,
    description: rest.shortDescription
  }
}

// NOTE: descriptions, materials, fit notes and stock numbers are placeholder
// content for development. Replace with real product information.
export const products = [
  {
    id: 1,
    slug: 'classic-runner-pro',
    name: 'Classic Runner Pro',
    price: 50000,
    shortDescription: 'Lightweight running shoe with excellent cushioning',
    longDescription:
      'A dependable everyday runner built around a soft, responsive midsole and a breathable upper. Made for road miles and daily wear alike.',
    category: 'running',
    collection: 'core',
    materials: ['Engineered mesh upper', 'Cushioned EVA midsole', 'Rubber outsole'],
    fit: 'True to size. Standard width.',
    tags: ['road', 'cushioned', 'daily'],
    isNew: false,
    isFeatured: true,
    createdAt: '2026-02-14',
    colours: [
      ['black', [3, 5, 2, 0, 4, 1]],
      ['white', [2, 0, 3, 4, 1, 0]]
    ]
  },
  {
    id: 3,
    slug: 'apex-trail-runner',
    name: 'Apex Trail Runner',
    price: 70000,
    shortDescription: 'Built for off-road adventures and tough terrain',
    longDescription:
      'Deep lugs, a reinforced toe and a protective upper take the Apex Trail Runner from gravel paths to muddy descents.',
    category: 'running',
    collection: 'core',
    materials: ['Ripstop mesh upper', 'Protective toe cap', 'Multi-directional lug outsole'],
    fit: 'True to size. Snug midfoot; size up for thick socks.',
    tags: ['trail', 'grip', 'outdoor'],
    isNew: false,
    isFeatured: false,
    createdAt: '2026-03-02',
    colours: [
      ['olive', [2, 3, 4, 3, 2, 0]],
      ['black', [0, 2, 3, 2, 0, 0]]
    ]
  },
  {
    id: 5,
    slug: 'comfort-casual-walk',
    name: 'Comfort Casual Walk',
    price: 40000,
    shortDescription: 'All-day comfort for walking and casual activities',
    longDescription:
      'A soft, low-profile sneaker with a cushioned footbed and a flexible sole, made to be worn from morning to night.',
    category: 'everyday',
    collection: 'core',
    materials: ['Knit upper', 'Padded collar', 'Flexible rubber outsole'],
    fit: 'True to size. Roomy toe box.',
    tags: ['walking', 'comfort'],
    isNew: false,
    isFeatured: false,
    createdAt: '2026-01-20',
    colours: [
      ['sand', [4, 6, 5, 4, 3, 2]],
      ['navy', [3, 4, 0, 3, 2, 2]]
    ]
  },
  {
    id: 6,
    slug: 'sprint-speed-racer',
    name: 'Sprint Speed Racer',
    price: 60000,
    shortDescription: 'Aerodynamic design for maximum speed and agility',
    longDescription:
      'A sleek, low-weight racer with a snappy forefoot and a streamlined upper, designed for fast days and short distances.',
    category: 'running',
    collection: 'core',
    materials: ['Seamless mesh upper', 'Lightweight foam midsole', 'Rubber outsole'],
    fit: 'Runs slightly narrow; consider half a size up if between sizes.',
    tags: ['speed', 'race', 'lightweight'],
    isNew: false,
    isFeatured: false,
    createdAt: '2026-04-08',
    colours: [['signal', [1, 2, 3, 2, 0, 0]]]
  },
  {
    id: 7,
    slug: 'meridian-01',
    name: 'Meridian 01',
    price: 120000,
    shortDescription: 'The Drop 07 flagship: clean lines, bold sole',
    longDescription:
      'Meridian 01 pairs a sculpted leather upper with an exaggerated midsole. It is the centrepiece of Drop 07 and made to be noticed.',
    category: 'lifestyle',
    collection: 'drop-07',
    materials: ['Full-grain leather upper', 'Sculpted foam midsole', 'Gum rubber outsole'],
    fit: 'True to size. Break-in period of a few wears.',
    tags: ['flagship', 'leather', 'statement'],
    isNew: true,
    isFeatured: true,
    createdAt: '2026-10-20',
    colours: [
      ['bone', [2, 4, 3, 2, 1, 0]],
      ['ink', [1, 0, 2, 3, 2, 1]]
    ]
  },
  {
    id: 8,
    slug: 'halo-low',
    name: 'Halo Low',
    price: 95000,
    shortDescription: 'Low-profile court style with a soft suede finish',
    longDescription:
      'A slim, low-cut sneaker with a suede overlay and a minimal sole. Easy to pair with almost anything.',
    category: 'lifestyle',
    collection: 'drop-07',
    materials: ['Suede and leather upper', 'Cupsole construction', 'Cotton laces'],
    fit: 'True to size. Slim fit.',
    tags: ['suede', 'low-top', 'minimal'],
    isNew: true,
    isFeatured: false,
    createdAt: '2026-10-20',
    colours: [
      ['ink', [0, 3, 4, 3, 2, 1]],
      ['sand', [2, 2, 3, 0, 0, 0]]
    ]
  },
  {
    id: 9,
    slug: 'dusk-mid',
    name: 'Dusk Mid',
    price: 135000,
    shortDescription: 'Basketball-inspired mid-top with ankle support',
    longDescription:
      'A mid-cut silhouette inspired by classic basketball shoes, with a padded collar, a supportive heel and a durable outsole.',
    category: 'court',
    collection: 'drop-07',
    materials: ['Leather and mesh upper', 'Padded ankle collar', 'Herringbone rubber outsole'],
    fit: 'True to size. Secure heel lock.',
    tags: ['mid-top', 'basketball', 'statement'],
    isNew: true,
    isFeatured: true,
    createdAt: '2026-10-27',
    colours: [
      ['navy', [1, 2, 3, 2, 2, 1]],
      ['ink', [0, 1, 2, 2, 1, 0]]
    ]
  },
  {
    id: 10,
    slug: 'ring-road',
    name: 'Ring Road',
    price: 110000,
    shortDescription: 'Retro court shoe with a clean, durable build',
    longDescription:
      'A court classic reworked with a cleaner upper and a cushioned sockliner, built for city streets and long days on your feet.',
    category: 'court',
    collection: 'core',
    materials: ['Leather upper', 'Cushioned sockliner', 'Vulcanised rubber sole'],
    fit: 'True to size. Standard width.',
    tags: ['retro', 'leather', 'court'],
    isNew: false,
    isFeatured: false,
    createdAt: '2026-08-05',
    colours: [
      ['white', [2, 3, 3, 2, 1, 1]],
      ['signal', [1, 2, 0, 2, 2, 0]]
    ]
  },
  {
    id: 11,
    slug: 'pavement-90',
    name: 'Pavement 90',
    price: 65000,
    shortDescription: 'Throwback everyday runner in easy neutrals',
    longDescription:
      'A 90s-inspired everyday sneaker with layered overlays and a chunky, comfortable sole, available in three easy-to-wear colourways.',
    category: 'everyday',
    collection: 'core',
    materials: ['Mesh and synthetic suede upper', 'Dual-density midsole', 'Rubber outsole'],
    fit: 'True to size. Generous fit.',
    tags: ['retro', 'neutral', 'daily'],
    isNew: false,
    isFeatured: false,
    createdAt: '2026-05-18',
    colours: [
      ['grey', [3, 4, 5, 4, 3, 2]],
      ['sand', [2, 3, 3, 0, 2, 1]],
      ['olive', [1, 2, 2, 2, 1, 1]]
    ]
  },
  {
    id: 12,
    slug: 'kerb-runner',
    name: 'Kerb Runner',
    price: 85000,
    shortDescription: 'City runner with a responsive ride and street styling',
    longDescription:
      'Built for fast commutes and weekend runs, the Kerb Runner combines a responsive midsole with a sharp, streetwear-ready look.',
    category: 'running',
    collection: 'core',
    materials: ['Technical knit upper', 'Responsive foam midsole', 'Rubber outsole'],
    fit: 'True to size. Snug heel.',
    tags: ['city', 'responsive', 'streetwear'],
    isNew: false,
    isFeatured: true,
    createdAt: '2026-09-12',
    colours: [
      ['ink', [2, 3, 4, 3, 2, 1]],
      ['volt', [0, 1, 2, 1, 0, 0]]
    ]
  }
].map(makeProduct)
