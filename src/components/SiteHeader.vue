<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { cart } from '../store.js'
import { cartAriaLabel, cartBadgeText } from '../utils/format.js'
import BrandLink from './BrandLink.vue'
import { homeLocation, homeSectionLocation, shopLocation, cartLocation } from '../router/locations.js'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const itemCount = computed(() => cart.getItemCount())

// Active route indication. About is a section of the homepage (/#about).
const isAbout = computed(() => route.name === 'home' && route.hash === '#about')
const isHome = computed(() => route.name === 'home' && !isAbout.value)
const isShop = computed(() => ['shop', 'product'].includes(route.name))
const isCart = computed(() => route.name === 'cart')

// Mobile menu
const menuOpen = ref(false)
watch(() => route.fullPath, () => (menuOpen.value = false))
const onKeydown = (event) => {
  if (event.key === 'Escape') menuOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="site-header">
    <div class="sv-container header-inner">
      <BrandLink :size="36" />

      <nav id="site-nav" class="nav" :class="{ open: menuOpen }" aria-label="Main">
        <RouterLink
          :to="homeLocation()"
          class="nav-link"
          :class="{ active: isHome }"
          :aria-current-value="isHome ? 'page' : 'false'"
        >
          Home
        </RouterLink>
        <RouterLink
          :to="shopLocation()"
          class="nav-link"
          :class="{ active: isShop }"
          :aria-current-value="isShop ? 'page' : 'false'"
        >
          Shop
        </RouterLink>
        <RouterLink
          :to="homeSectionLocation('about')"
          class="nav-link"
          :class="{ active: isAbout }"
          :aria-current-value="isAbout ? 'page' : 'false'"
        >
          About
        </RouterLink>
      </nav>

      <div class="actions">
        <RouterLink
          :to="cartLocation()"
          class="icon-btn cart-link"
          :class="{ active: isCart }"
          :aria-label="cartAriaLabel(itemCount)"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8V7a3 3 0 0 1 6 0v1" />
          </svg>
          <span v-if="itemCount > 0" class="badge" aria-hidden="true">{{ cartBadgeText(itemCount) }}</span>
        </RouterLink>

        <ThemeToggle />

        <button
          type="button"
          class="menu-btn"
          :aria-expanded="menuOpen"
          aria-controls="site-nav"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path v-if="!menuOpen" d="M4 7h16M4 12h16M4 17h16" />
            <path v-else d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 72px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: var(--radius-pill);
  color: var(--muted);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background: var(--panel);
  color: var(--text);
  text-decoration: none;
}

.nav-link.active {
  background: var(--panel);
  color: var(--text);
}

.actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-btn,
.menu-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  text-decoration: none;
}

.icon-btn:hover,
.menu-btn:hover {
  background: var(--panel);
  text-decoration: none;
}

.icon-btn.active {
  background: var(--panel);
}

.icon-btn svg,
.menu-btn svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.badge {
  position: absolute;
  top: 2px;
  right: 0;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: var(--radius-pill);
  background: var(--accent);
  color: var(--accent-text);
  font-size: 11px;
  font-weight: 800;
  line-height: 20px;
  text-align: center;
}

.menu-btn {
  display: none;
}

@media (max-width: 860px) {
  .menu-btn {
    display: inline-flex;
  }

  .nav {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    left: var(--gutter);
    right: var(--gutter);
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--card);
    box-shadow: var(--shadow);
  }

  .nav.open {
    display: flex;
  }

  .nav-link {
    min-height: 48px;
    font-size: 17px;
  }
}
</style>
