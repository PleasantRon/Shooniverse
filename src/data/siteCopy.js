// Editable copy for the homepage and the site shell. Edit the wording here;
// the components only display it. Keep claims limited to what the shop
// actually does today.
import { CATEGORIES } from './constants.js'
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from '../config/site.js'

export const siteCopy = {
  tagline: SITE_TAGLINE,
  brandDescription: SITE_DESCRIPTION,

  hero: {
    titleLead: 'Walk your own',
    titleAccent: 'orbit.',
    text: 'Premium sneakers for every kind of move. Lifestyle, running, court and everyday styles, delivered nationwide.'
  },

  categories: {
    title: 'Shop by category',
    text: 'Four ways into the catalogue. Pick the one that fits how you move.',
    descriptions: {
      lifestyle: 'Clean lines and statement soles for everyday style.',
      running: 'Cushioned, lightweight pairs for road, trail and city miles.',
      court: 'Basketball-inspired silhouettes with a supportive fit.',
      everyday: 'Easy, comfortable pairs made for all-day wear.'
    }
  },

  featured: {
    title: 'Fresh picks for every step',
    text: 'A selection from the current catalogue. Filter by category or open any pair to choose your colour and size.'
  },

  promo: {
    title: 'First in line for every drop.',
    text: "New arrivals land in drops. Browse the latest collection and choose your size while it's in stock."
  },

  benefits: [
    {
      icon: 'truck',
      title: 'Shipping',
      text: 'We deliver nationwide. Fast, reliable shipping across the country.'
    },
    {
      icon: 'return',
      title: 'Returns',
      text: 'Our returns policy will be shared here. Until then, check the size and fit notes on each product page.'
    },
    {
      icon: 'quality',
      title: 'Quality and materials',
      text: 'Carefully selected premium materials, with the full materials list on every product page.'
    }
  ],

  about: {
    eyebrow: `About ${SITE_NAME}`,
    title: 'Built for the way you move.',
    paragraphs: [
      `${SITE_NAME} is a footwear destination for every step. We bring together lifestyle, running, court and everyday pairs, chosen for how they look and how you live in them.`
    ]
  }
}

// Fail loudly in development if a category has no description.
for (const category of CATEGORIES) {
  if (!siteCopy.categories.descriptions[category.id]) {
    throw new Error(`siteCopy: missing description for category "${category.id}"`)
  }
}
