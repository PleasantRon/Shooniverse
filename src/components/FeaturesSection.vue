<script setup>
import { siteCopy } from '../data/siteCopy.js'

// Benefit cards. The wording lives in src/data/siteCopy.js.
defineProps({
  benefits: { type: Array, default: () => siteCopy.benefits }
})
</script>

<template>
  <ul class="benefits">
    <li v-for="benefit in benefits" :key="benefit.title" class="benefit">
      <span class="benefit-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" focusable="false">
          <template v-if="benefit.icon === 'truck'">
            <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
          </template>
          <template v-else-if="benefit.icon === 'return'">
            <path d="M9 7H5v4" />
            <path d="M5 11a7 7 0 1 1 2 6" />
          </template>
          <template v-else>
            <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
            <path d="M9 12l2 2 4-4" />
          </template>
        </svg>
      </span>
      <h3 class="benefit-title">{{ benefit.title }}</h3>
      <p class="benefit-text">{{ benefit.text }}</p>
    </li>
  </ul>
</template>

<style scoped>
.benefits {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.benefit {
  padding: 28px;
  border: 1px solid var(--promo-border);
  border-radius: var(--radius-lg);
  background: var(--promo-card);
  color: var(--promo-text);
}

.benefit-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-text);
}

.benefit-icon svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.benefit-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.benefit-text {
  margin: 0;
  color: var(--promo-muted);
  font-size: 15px;
}

@media (max-width: 860px) {
  .benefits {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
