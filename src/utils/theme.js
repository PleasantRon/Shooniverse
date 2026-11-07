// Theme helpers with no framework dependency, so they can be tested directly.
// The same rules are mirrored in the small inline script in index.html, which
// sets the theme before first paint to avoid a flash of the wrong theme.

export const THEME_KEY = 'shoeniverse-theme'

export const isTheme = (value) => value === 'light' || value === 'dark'

// Saved choice, or null if none / storage unavailable / value not valid.
export function readStoredTheme(storage) {
  try {
    const value = storage?.getItem(THEME_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

export function saveTheme(storage, theme) {
  if (!isTheme(theme)) return false
  try {
    storage.setItem(THEME_KEY, theme)
    return true
  } catch {
    return false
  }
}

// A saved preference wins; otherwise follow the operating system.
export function resolveTheme({ stored, prefersDark }) {
  if (isTheme(stored)) return stored
  return prefersDark ? 'dark' : 'light'
}

export const nextTheme = (theme) => (theme === 'dark' ? 'light' : 'dark')

export function applyTheme(theme, root) {
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
}
