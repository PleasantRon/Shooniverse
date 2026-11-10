<script setup>
import OrbitBackdrop from './OrbitBackdrop.vue'

// The dark title band at the top of Shop, Cart and Checkout. It is the page's <h1>.
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  text: { type: String, default: '' }
})
</script>

<template>
  <section class="page-hero">
    <OrbitBackdrop variant="corner" tone="dark" />
    <div class="sv-container page-hero-inner">
      <p v-if="eyebrow" class="page-hero-eyebrow">{{ eyebrow }}</p>
      <h1 class="page-hero-title">{{ title }}</h1>
      <p v-if="text" class="page-hero-text">{{ text }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  overflow: hidden;
  background: var(--promo-bg);
  color: var(--promo-text);
}

.page-hero-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding-block: 56px 60px;
}

.page-hero-eyebrow {
  margin: 0;
  color: var(--promo-accent);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.page-hero-title {
  margin: 0;
  font-size: clamp(36px, 6.5vw, 76px);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 1;
}

.page-hero-text {
  max-width: 52ch;
  margin: 4px 0 0 0;
  color: var(--promo-muted);
  font-size: 17px;
}

@media (max-width: 640px) {
  .page-hero-inner {
    padding-block: 36px 40px;
  }

  .page-hero-text {
    font-size: 15px;
  }
}
</style>
