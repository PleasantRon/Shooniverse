<script setup>
import { shopLocation, homeLocation } from '../router/locations.js'
import OrbitBackdrop from './OrbitBackdrop.vue'

defineProps({
  title: { type: String, default: 'Page not found' },
  message: { type: String, default: "We couldn't find what you were looking for." }
})
</script>

<template>
  <section class="not-found">
    <OrbitBackdrop variant="center" tone="light" />
    <div class="not-found-inner">
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <div class="not-found-actions">
        <RouterLink :to="shopLocation()" class="sv-btn sv-btn--primary">Back to the shop</RouterLink>
        <RouterLink :to="homeLocation()" class="sv-btn sv-btn--ghost">Go to the homepage</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  position: relative;
  overflow: hidden;
  padding: 88px 20px;
  border-radius: var(--radius-xl);
  background: var(--card);
  text-align: center;
}

.not-found-inner {
  position: relative;
}

.not-found h1 {
  margin: 0 0 10px 0;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 900;
  letter-spacing: -0.04em;
}

.not-found p {
  margin: 0 0 28px 0;
  color: var(--muted);
  font-size: 17px;
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 480px) {
  .not-found {
    padding: 56px 20px;
    border-radius: var(--radius-lg);
  }
}
</style>
