// Brand details live here. Change the name or wording once and it updates the
// header, footer, homepage copy, browser title and page metadata.
//
// Not included on purpose: the localStorage key in utils/theme.js (changing it
// would reset every visitor's saved theme), package.json "name", and the repo name.

export const SITE_NAME = 'Shooniverse'

// The brand's own word for its overall collection, used in shared copy such as
// "All Shooz". Individual products keep ordinary words ("running shoe", "sneaker").
export const SITE_COLLECTION = 'Shooz'
export const SITE_TAGLINE = `A ${SITE_COLLECTION} destination for every step.`
export const SITE_DESCRIPTION = `Lifestyle, running, court and everyday ${SITE_COLLECTION}, chosen for how they look and how you live in them.`

// Title used on the homepage tab.
export const SITE_HOME_TITLE = `${SITE_NAME} \u00b7 Premium ${SITE_COLLECTION}`

// Browser tab title for a page, e.g. pageTitle('Shop') -> "Shop · Shooniverse".
export function pageTitle(title) {
  return title ? `${title} \u00b7 ${SITE_NAME}` : SITE_HOME_TITLE
}

const escapeAttribute = (text) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Fills the %SITE_NAME% and %SITE_DESCRIPTION% placeholders in index.html.
// Used by the small Vite plugin in vite.config.js, so the very first HTML the
// browser receives already has the right title and description.
export function applySiteMeta(html) {
  return html
    .replaceAll('%SITE_NAME%', escapeAttribute(SITE_NAME))
    .replaceAll('%SITE_DESCRIPTION%', escapeAttribute(SITE_DESCRIPTION))
}
