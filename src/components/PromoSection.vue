<script setup>
import { siteCopy } from '../data/siteCopy.js'
import FeaturesSection from './FeaturesSection.vue'
import { shopLocation } from '../router/locations.js'

defineProps({
  dropLabel: { type: String, default: '' },
  newArrivalsLocation: { type: Object, default: () => shopLocation() }
})
</script>

<template>
  <section id="benefits" class="promo" aria-labelledby="promo-title">
    <div class="sv-container">
      <div class="band">
        <span class="ring ring-a" aria-hidden="true"></span>
        <span class="ring ring-b" aria-hidden="true"></span>

        <div class="band-copy">
          <p v-if="dropLabel" class="band-eyebrow">{{ dropLabel }}</p>
          <h2 id="promo-title" class="band-title">{{ siteCopy.promo.title }}</h2>
          <p class="band-text">{{ siteCopy.promo.text }}</p>
          <RouterLink :to="newArrivalsLocation" class="sv-btn sv-btn--invert">
            {{ dropLabel ? `Shop ${dropLabel}` : 'Shop new arrivals' }}
          </RouterLink>
        </div>

        <FeaturesSection />
      </div>
    </div>
  </section>
</template>

<style scoped>
.promo {
  padding: 24px 0 72px;
}

.band {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding: 72px 56px;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: var(--promo-bg);
  color: var(--promo-text);
}

.ring {
  position: absolute;
  border: 1px solid var(--promo-border);
  border-radius: 50%;
  pointer-events: none;
}

.ring-a {
  top: -220px;
  right: -140px;
  width: 560px;
  height: 560px;
}

.ring-b {
  top: -120px;
  right: -40px;
  width: 360px;
  height: 360px;
  border-color: var(--accent);
  opacity: 0.6;
}

.band-copy {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  max-width: 640px;
}

.band-eyebrow {
  margin: 0;
  color: var(--promo-accent);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.band-title {
  margin: 0;
  font-size: clamp(36px, 5.5vw, 68px);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 1;
}

.band-text {
  margin: 0;
  color: var(--promo-muted);
  font-size: 18px;
}

@media (max-width: 860px) {
  .band {
    gap: 40px;
    padding: 48px 28px;
    border-radius: var(--radius-lg);
  }
}

@media (max-width: 480px) {
  .promo {
    padding-bottom: 48px;
  }

  .band {
    padding: 36px 20px;
  }
}
</style>
