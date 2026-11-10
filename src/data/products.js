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
//   artwork    -> which placeholder silhouette the image generator draws (see scripts/artwork.mjs);
//                 ignored once real photography replaces the placeholders. Default: 'sneaker'.
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
  },
  // ---------- Lifestyle ----------
  {
    id: 13, slug: 'solstice-02', name: 'Solstice 02', price: 105000, artwork: 'skate',
    shortDescription: 'Low-profile cupsole in smooth leather',
    longDescription: 'A flat, wide-toed cupsole with a clean leather upper and tonal stitching. Easy to wear with almost anything.',
    category: 'lifestyle', collection: 'core',
    materials: ['Smooth leather upper', 'Vulcanised cupsole', 'Cotton laces'],
    fit: 'True to size. Roomy toe box.', tags: ['cupsole', 'leather', 'low-top'],
    isNew: false, isFeatured: false, createdAt: '2026-06-02',
    colours: [['white', [2, 3, 4, 3, 2, 1]], ['sand', [1, 2, 3, 2, 0, 0]]]
  },
  {
    id: 14, slug: 'eclipse-low', name: 'Eclipse Low', price: 90000, artwork: 'skate',
    shortDescription: 'Dark-on-dark skate profile with a padded collar',
    longDescription: 'A low skate silhouette in a deep tonal colourway, with a padded collar and a durable cupsole built for daily wear.',
    category: 'lifestyle', collection: 'core',
    materials: ['Suede and canvas upper', 'Padded collar', 'Rubber cupsole'],
    fit: 'True to size. Snug heel.', tags: ['skate', 'suede', 'tonal'],
    isNew: false, isFeatured: false, createdAt: '2026-06-20',
    colours: [['black', [0, 3, 4, 3, 2, 1]], ['grey', [2, 2, 3, 2, 1, 0]]]
  },
  // ---------- Basketball ----------
  {
    id: 15, slug: 'zenith-high', name: 'Zenith High', price: 145000, artwork: 'hightop',
    shortDescription: 'High-top with ankle support and a cushioned sole',
    longDescription: 'A basketball-inspired high-top with a padded collar, a strap across the ankle and a cushioned midsole for stability.',
    category: 'court', collection: 'core',
    materials: ['Leather and mesh upper', 'Padded high collar', 'Herringbone rubber outsole'],
    fit: 'True to size. Secure ankle fit.', tags: ['high-top', 'basketball', 'support'],
    isNew: false, isFeatured: false, createdAt: '2026-07-04',
    colours: [['white', [1, 2, 3, 2, 2, 1]], ['navy', [0, 2, 2, 3, 1, 0]]]
  },
  {
    id: 16, slug: 'baseline-88', name: 'Baseline 88', price: 98000, artwork: 'hightop',
    shortDescription: 'Retro high-top with a classic court look',
    longDescription: 'A throwback high-top with a clean leather upper, a perforated toe and a flat court sole.',
    category: 'court', collection: 'core',
    materials: ['Leather upper', 'Cushioned sockliner', 'Flat rubber sole'],
    fit: 'True to size. Standard width.', tags: ['retro', 'high-top', 'leather'],
    isNew: false, isFeatured: false, createdAt: '2026-07-22',
    colours: [['signal', [1, 2, 2, 2, 1, 0]], ['black', [2, 3, 3, 2, 1, 1]]]
  },
  // ---------- Everyday ----------
  {
    id: 17, slug: 'drift-trainer', name: 'Drift Trainer', price: 55000, artwork: 'trainer',
    shortDescription: 'Light, slim trainer for everyday wear',
    longDescription: 'A slim knit trainer with a soft footbed and a thick, flexible sole. Made for long days and short commutes.',
    category: 'everyday', collection: 'core',
    materials: ['Knit upper', 'Soft foam footbed', 'Flexible rubber sole'],
    fit: 'True to size. Stretchy collar.', tags: ['knit', 'light', 'daily'],
    isNew: false, isFeatured: false, createdAt: '2026-05-30',
    colours: [['grey', [3, 4, 4, 3, 2, 1]], ['navy', [2, 3, 3, 2, 2, 1]], ['sand', [1, 2, 3, 2, 0, 0]]]
  },
  {
    id: 18, slug: 'commuter-knit', name: 'Commuter Knit', price: 62000, artwork: 'trainer',
    shortDescription: 'Breathable knit trainer with a cushioned heel',
    longDescription: 'A breathable one-piece knit upper with a cushioned heel and a grippy outsole for city streets.',
    category: 'everyday', collection: 'core',
    materials: ['One-piece knit upper', 'Cushioned heel', 'Grip rubber outsole'],
    fit: 'True to size. Sock-like fit.', tags: ['knit', 'breathable', 'city'],
    isNew: false, isFeatured: false, createdAt: '2026-08-14',
    colours: [['black', [2, 3, 3, 3, 2, 1]], ['olive', [1, 2, 2, 2, 1, 0]]]
  },
  // ---------- Formal ----------
  {
    id: 19, slug: 'regent-oxford', name: 'Regent Oxford', price: 135000, artwork: 'oxford',
    shortDescription: 'Classic leather Oxford for the office and occasions',
    longDescription: 'A closed-lacing Oxford with a clean toe line, a leather lining and a stacked heel. The one to wear when it matters.',
    category: 'formal', collection: 'core',
    materials: ['Full-grain leather upper', 'Leather lining', 'Leather and rubber sole'],
    fit: 'True to size. Narrow to standard width.', tags: ['oxford', 'office', 'leather'],
    isNew: false, isFeatured: false, createdAt: '2026-04-12',
    colours: [['black', [1, 2, 3, 3, 2, 1]], ['brown', [1, 2, 2, 2, 1, 0]]]
  },
  {
    id: 20, slug: 'sterling-derby', name: 'Sterling Derby', price: 120000, artwork: 'oxford',
    shortDescription: 'Open-lacing derby with a flexible sole',
    longDescription: 'A derby with open lacing for an easier fit, a smooth leather upper and a flexible sole for long working days.',
    category: 'formal', collection: 'core',
    materials: ['Smooth leather upper', 'Leather lining', 'Flexible rubber sole'],
    fit: 'True to size. Standard width.', tags: ['derby', 'office', 'leather'],
    isNew: false, isFeatured: false, createdAt: '2026-04-28',
    colours: [['navy', [0, 2, 2, 2, 1, 1]], ['tan', [1, 2, 3, 2, 1, 0]]]
  },
  {
    id: 21, slug: 'chancery-brogue', name: 'Chancery Brogue', price: 145000, artwork: 'brogue',
    shortDescription: 'Full brogue with perforated detailing',
    longDescription: 'A full brogue with classic perforations along the toe and seams, finished on a leather sole with a stacked heel.',
    category: 'formal', collection: 'core',
    materials: ['Calf leather upper', 'Leather lining', 'Leather sole'],
    fit: 'True to size. Standard width.', tags: ['brogue', 'formal', 'leather'],
    isNew: false, isFeatured: false, createdAt: '2026-05-06',
    colours: [['tan', [1, 1, 2, 2, 1, 0]], ['burgundy', [0, 2, 2, 1, 1, 0]]]
  },
  {
    id: 22, slug: 'mayfair-cap-toe', name: 'Mayfair Cap-Toe', price: 128000, artwork: 'oxford',
    shortDescription: 'Sleek cap-toe Oxford in polished leather',
    longDescription: 'A sleek cap-toe Oxford with a slim profile and a polished finish. Dressy enough for a wedding, sharp enough for the office.',
    category: 'formal', collection: 'core',
    materials: ['Polished leather upper', 'Leather lining', 'Leather sole'],
    fit: 'True to size. Slim fit.', tags: ['cap-toe', 'oxford', 'polished'],
    isNew: false, isFeatured: false, createdAt: '2026-05-24',
    colours: [['black', [2, 2, 3, 2, 1, 1]], ['burgundy', [1, 1, 2, 2, 0, 0]]]
  },
  // ---------- Loafers ----------
  {
    id: 23, slug: 'marlow-penny', name: 'Marlow Penny', price: 95000, artwork: 'loafer',
    shortDescription: 'Penny loafer in soft leather',
    longDescription: 'A penny loafer with a saddle strap, a soft leather upper and a light sole. Smart enough for work, easy enough for weekends.',
    category: 'loafers', collection: 'core',
    materials: ['Soft leather upper', 'Leather lining', 'Light rubber sole'],
    fit: 'True to size. Easy slip-on fit.', tags: ['penny', 'slip-on', 'leather'],
    isNew: false, isFeatured: false, createdAt: '2026-06-08',
    colours: [['brown', [2, 3, 3, 2, 1, 1]], ['black', [1, 2, 3, 2, 1, 0]]]
  },
  {
    id: 24, slug: 'sorrel-suede', name: 'Sorrel Suede', price: 88000, artwork: 'loafer',
    shortDescription: 'Unlined suede loafer for warm days',
    longDescription: 'A lightly structured suede loafer with an unlined interior for a soft, breathable fit.',
    category: 'loafers', collection: 'core',
    materials: ['Suede upper', 'Unlined interior', 'Flexible rubber sole'],
    fit: 'True to size. Soft, roomy fit.', tags: ['suede', 'unlined', 'summer'],
    isNew: false, isFeatured: false, createdAt: '2026-06-26',
    colours: [['tan', [1, 2, 3, 2, 1, 0]], ['navy', [2, 2, 2, 2, 1, 0]]]
  },
  {
    id: 25, slug: 'capri-driver', name: 'Capri Driver', price: 72000, artwork: 'loafer',
    shortDescription: 'Flexible driving loafer with a grip sole',
    longDescription: 'A relaxed driving loafer with a flexible sole and a cushioned footbed, made for comfort behind the wheel and on foot.',
    category: 'loafers', collection: 'core',
    materials: ['Leather upper', 'Cushioned footbed', 'Flexible grip sole'],
    fit: 'True to size. Roomy fit.', tags: ['driving', 'flexible', 'casual'],
    isNew: false, isFeatured: false, createdAt: '2026-07-12',
    colours: [['sand', [2, 3, 3, 2, 1, 1]], ['olive', [1, 2, 2, 1, 1, 0]]]
  },
  {
    id: 26, slug: 'harbour-tassel', name: 'Harbour Tassel', price: 105000, artwork: 'tassel',
    shortDescription: 'Tassel loafer with a polished finish',
    longDescription: 'A dress loafer with a hand-finished tassel, a slim leather sole and a polished upper.',
    category: 'loafers', collection: 'core',
    materials: ['Polished leather upper', 'Leather lining', 'Leather sole'],
    fit: 'True to size. Slim fit.', tags: ['tassel', 'dress', 'polished'],
    isNew: false, isFeatured: false, createdAt: '2026-08-02',
    colours: [['burgundy', [1, 2, 2, 1, 1, 0]], ['black', [1, 2, 3, 2, 1, 1]]]
  },
  // ---------- Boots ----------
  {
    id: 27, slug: 'nightfall-chelsea', name: 'Nightfall Chelsea', price: 165000, artwork: 'chelsea',
    shortDescription: 'Leather Chelsea boot with elastic side panels',
    longDescription: 'A sleek Chelsea boot with elastic side panels, a pull tab and a durable sole. Equally at home with a suit or jeans.',
    category: 'boots', collection: 'core',
    materials: ['Leather upper', 'Elastic side panels', 'Rubber sole'],
    fit: 'True to size. Snug ankle.', tags: ['chelsea', 'leather', 'ankle'],
    isNew: false, isFeatured: false, createdAt: '2026-08-20',
    colours: [['black', [1, 2, 3, 2, 1, 1]], ['brown', [0, 2, 2, 2, 1, 0]]]
  },
  {
    id: 28, slug: 'mercer-chelsea', name: 'Mercer Chelsea', price: 135000, artwork: 'chelsea',
    shortDescription: 'Suede Chelsea boot with a cushioned footbed',
    longDescription: 'A soft suede Chelsea boot with a cushioned footbed and a lightweight sole for everyday wear.',
    category: 'boots', collection: 'core',
    materials: ['Suede upper', 'Elastic side panels', 'Lightweight rubber sole'],
    fit: 'True to size. Standard width.', tags: ['chelsea', 'suede', 'everyday'],
    isNew: false, isFeatured: false, createdAt: '2026-09-02',
    colours: [['tan', [1, 2, 2, 2, 1, 0]], ['olive', [0, 1, 2, 2, 1, 0]]]
  },
  {
    id: 29, slug: 'ridge-hiker', name: 'Ridge Hiker', price: 155000, artwork: 'hiker',
    shortDescription: 'Lace-up hiking boot with a deep-lug sole',
    longDescription: 'A lace-up boot built for trails and bad weather, with a padded collar, a reinforced toe and a deep-lug outsole.',
    category: 'boots', collection: 'core',
    materials: ['Waxed leather upper', 'Padded collar', 'Deep-lug rubber outsole'],
    fit: 'True to size. Room for thick socks.', tags: ['hiking', 'trail', 'weatherproof'],
    isNew: false, isFeatured: false, createdAt: '2026-09-16',
    colours: [['brown', [1, 2, 3, 2, 1, 1]], ['olive', [0, 2, 2, 1, 1, 0]]]
  },
  {
    id: 30, slug: 'foundry-work-boot', name: 'Foundry Work Boot', price: 125000, artwork: 'hiker',
    shortDescription: 'Tough lace-up work boot with a stable sole',
    longDescription: 'A hard-wearing lace-up work boot with a stable sole, a reinforced toe and a padded collar for long shifts.',
    category: 'boots', collection: 'core',
    materials: ['Full-grain leather upper', 'Reinforced toe', 'Oil-resistant rubber sole'],
    fit: 'True to size. Wide toe box.', tags: ['work', 'durable', 'lace-up'],
    isNew: false, isFeatured: false, createdAt: '2026-09-30',
    colours: [['black', [2, 3, 3, 3, 2, 1]], ['tan', [1, 2, 3, 2, 1, 0]]]
  },
  // ---------- Sandals and slides ----------
  {
    id: 31, slug: 'tidal-slide', name: 'Tidal Slide', price: 28000, artwork: 'slide',
    shortDescription: 'Cushioned everyday slide with a wide strap',
    longDescription: 'A soft, cushioned slide with a wide strap and a contoured footbed. Easy to wear after training or around the house.',
    category: 'sandals', collection: 'core',
    materials: ['Moulded foam strap', 'Contoured footbed', 'Grip sole'],
    fit: 'True to size. Generous fit.', tags: ['slide', 'cushioned', 'recovery'],
    isNew: false, isFeatured: false, createdAt: '2026-06-14',
    colours: [['navy', [3, 4, 4, 3, 2, 1]], ['black', [3, 4, 5, 4, 3, 2]], ['white', [2, 3, 3, 2, 1, 1]]]
  },
  {
    id: 32, slug: 'cove-slide', name: 'Cove Slide', price: 32000, artwork: 'slide',
    shortDescription: 'Leather-look slide with a moulded footbed',
    longDescription: 'A smarter slide with a leather-look strap and a moulded footbed. Dressy enough for warm evenings.',
    category: 'sandals', collection: 'core',
    materials: ['Leather-look strap', 'Moulded footbed', 'Rubber sole'],
    fit: 'True to size. Standard fit.', tags: ['slide', 'leather-look', 'summer'],
    isNew: false, isFeatured: false, createdAt: '2026-07-08',
    colours: [['tan', [2, 3, 3, 2, 1, 0]], ['black', [2, 3, 4, 3, 2, 1]]]
  },
  {
    id: 33, slug: 'lagoon-sandal', name: 'Lagoon Sandal', price: 45000, artwork: 'sandal',
    shortDescription: 'Adjustable sandal with a heel strap',
    longDescription: 'A light sandal with an adjustable heel strap and a cushioned footbed, made for warm days and long walks.',
    category: 'sandals', collection: 'core',
    materials: ['Webbing straps', 'Cushioned footbed', 'Grip rubber sole'],
    fit: 'True to size. Adjustable fit.', tags: ['sandal', 'adjustable', 'summer'],
    isNew: false, isFeatured: false, createdAt: '2026-07-26',
    colours: [['olive', [2, 3, 3, 2, 1, 1]], ['sand', [2, 2, 3, 2, 1, 0]]]
  },
  {
    id: 34, slug: 'sahel-strap', name: 'Sahel Strap', price: 52000, artwork: 'sandal',
    shortDescription: 'Leather strap sandal with a cork-style footbed',
    longDescription: 'A leather strap sandal with a heel strap and a cork-style footbed that moulds to your foot over time.',
    category: 'sandals', collection: 'core',
    materials: ['Leather straps', 'Cork-style footbed', 'Rubber sole'],
    fit: 'True to size. Adjustable fit.', tags: ['sandal', 'leather', 'footbed'],
    isNew: false, isFeatured: false, createdAt: '2026-08-08',
    colours: [['brown', [1, 2, 3, 2, 1, 0]], ['tan', [2, 2, 3, 2, 1, 1]]]
  }
].map(makeProduct)
