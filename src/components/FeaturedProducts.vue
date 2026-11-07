<script setup>
import { computed, ref } from 'vue'
import { CATEGORIES } from '../data/constants.js'
import { siteCopy } from '../data/siteCopy.js'
import { SITE_COLLECTION } from '../config/site.js'
import { shopLocation } from '../router/locations.js'
import HomeProductCard from './HomeProductCard.vue'

const props = defineProps({
  products: { type: Array, required: true }
})

const selected = ref('all')

// "All" plus one chip for each category that has products in this grid.
const chips = computed(() => [
  { id: 'all', label: 'All' },
  ...CATEGORIES.filter((c) => props.products.some((p) => p.category === c.id))
])

const visible = computed(() =>
  selected.value === 'all' ? props.products : props.products.filter((p) => p.category === selected.value)
)

const status = computed(() => `Showing ${visible.value.length} ${visible.value.length === 1 ? 'pair' : 'pairs'}`)
</script>

<template>
  <section id="featured" class="featured" aria-labelledby="featured-title">
    <div class="sv-container">
      <div class="head">
        <div class="head-copy">
          <h2 id="featured-title" class="sv-section-title">{{ siteCopy.featured.title }}</h2>
          <p class="sv-section-text">{{ siteCopy.featured.text }}</p>
        </div>
        <div class="chips" role="group" aria-label="Filter by category">
          <button
            v-for="chip in chips"
            :key="chip.id"
            type="button"
            class="chip"
            :aria-pressed="selected === chip.id"
            @click="selected = chip.id"
          >
            {{ chip.label }}
          </button>
        </div>
      </div>

      <p class="sv-sr-only" role="status" aria-live="polite">{{ status }}</p>

      <ul class="grid">
        <li v-for="product in visible" :key="product.id">
          <HomeProductCard :product="product" />
        </li>
      </ul>

      <div class="more">
        <RouterLink :to="shopLocation()" class="sv-btn sv-btn--ghost">View all {{ SITE_COLLECTION }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured {
  padding: 72px 0;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 24px 40px;
  margin-bottom: 40px;
}

.head-copy {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  min-height: 44px;
  padding: 0 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
}

.chip:hover {
  border-color: var(--text);
}

.chip[aria-pressed='true'] {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--accent-text);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 36px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.more {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 16px;
  }
}

@media (max-width: 480px) {
  .featured {
    padding: 48px 0;
  }
}
</style>
