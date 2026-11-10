<script setup>
import { SITE_NAME } from '../config/site.js'
import { homeLocation } from '../router/locations.js'
import OrbitLogo from './OrbitLogo.vue'

defineProps({
  size: { type: Number, default: 36 }
})
</script>

<template>
  <RouterLink :to="homeLocation()" class="brand-link" :aria-label="`${SITE_NAME} home`">
    <OrbitLogo :size="size" />
    <span class="brand-word">{{ SITE_NAME }}</span>
  </RouterLink>
</template>

<style scoped>
.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  text-decoration: none;
}

.brand-link:hover {
  text-decoration: none;
}

.brand-word {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

/* narrow phones: a slightly smaller logo and name so the header always fits */
@media (max-width: 400px) {
  .brand-link {
    gap: 8px;
  }

  .brand-link :deep(.orbit-logo) {
    width: 30px;
    height: 30px;
  }

  .brand-word {
    font-size: 19px;
  }
}
</style>
