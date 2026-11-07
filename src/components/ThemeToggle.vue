<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { theme, toggleTheme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleTheme"
  >
    <!-- moon (shown in light theme: click for dark) -->
    <svg v-if="!isDark" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
    </svg>
    <!-- sun (shown in dark theme: click for light) -->
    <svg v-else viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
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
}

.theme-toggle:hover {
  background: var(--panel);
}

.theme-toggle svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
