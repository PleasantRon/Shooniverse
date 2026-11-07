import { ref } from 'vue'
import { applyTheme, nextTheme, readStoredTheme, resolveTheme, saveTheme } from '../utils/theme.js'

// Shared by every component that needs the theme.
const theme = ref('light')
let started = false

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null // blocked by browser settings
  }
}

// Call once at start-up (main.js). Saved choice first, then the operating system.
export function initTheme() {
  if (started || typeof window === 'undefined') return
  started = true
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
  theme.value = resolveTheme({ stored: readStoredTheme(getStorage()), prefersDark: !!media?.matches })
  applyTheme(theme.value, document.documentElement)

  // Follow the operating system while the shopper has not chosen a theme.
  media?.addEventListener?.('change', (event) => {
    if (readStoredTheme(getStorage()) !== null) return
    theme.value = event.matches ? 'dark' : 'light'
    applyTheme(theme.value, document.documentElement)
  })
}

export function toggleTheme() {
  theme.value = nextTheme(theme.value)
  applyTheme(theme.value, document.documentElement)
  saveTheme(getStorage(), theme.value)
}

export function useTheme() {
  return { theme, toggleTheme }
}
