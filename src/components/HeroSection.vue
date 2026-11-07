<script setup>
import { siteCopy } from '../data/siteCopy.js'
import { homeSectionLocation, shopLocation } from '../router/locations.js'
import HeroOrbit from './HeroOrbit.vue'

defineProps({
  // the main shoe and its colourway (from the existing catalogue)
  product: { type: Object, default: null },
  variant: { type: Object, default: null },
  // shoes orbiting the main shoe: [{ product, variant }]
  satellites: { type: Array, default: () => [] },
  eyebrow: { type: String, default: 'New arrivals' },
  newArrivalsLocation: { type: Object, default: () => shopLocation() }
})
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="sv-container hero-grid">
      <div class="hero-copy">
        <p class="sv-eyebrow">{{ eyebrow }}</p>
        <h1 id="hero-title" class="hero-title">
          {{ siteCopy.hero.titleLead }} <span class="hero-accent">{{ siteCopy.hero.titleAccent }}</span>
        </h1>
        <p class="hero-text">{{ siteCopy.hero.text }}</p>
        <div class="hero-actions">
          <RouterLink :to="newArrivalsLocation" class="sv-btn sv-btn--primary">Shop new arrivals</RouterLink>
          <RouterLink :to="homeSectionLocation('categories')" class="sv-btn sv-btn--ghost">
            Browse categories
          </RouterLink>
        </div>
      </div>

      <HeroOrbit v-if="product && variant" :product="product" :variant="variant" :satellites="satellites" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 56px 0 72px;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  align-items: center;
  gap: 56px;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

.hero-title {
  margin: 0;
  font-size: clamp(48px, 7vw, 96px);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.95;
}

.hero-accent {
  color: var(--accent);
}

.hero-text {
  max-width: 44ch;
  margin: 0;
  color: var(--muted);
  font-size: 18px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 960px) {
  .hero {
    padding: 32px 0 56px;
  }

  .hero-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
  }
}

@media (max-width: 480px) {
  .hero-text {
    font-size: 16px;
  }

  .hero-actions .sv-btn {
    flex: 1 1 100%;
  }
}
</style>
