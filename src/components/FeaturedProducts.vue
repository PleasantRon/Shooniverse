<script setup>
import { computed, ref } from 'vue'
import { CATEGORIES } from '../data/constants.js'
import { siteCopy } from '../data/siteCopy.js'
import { SITE_COLLECTION } from '../config/site.js'
import { shopLocation } from '../router/locations.js'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  // the "All" view: a selection from every category
  products: { type: Array, required: true },
  // every product, grouped by category id: { running: [...], boots: [...] }
  byCategory: { type: Object, default: () => ({}) }
})

const selected = ref('all')

// "All" plus one chip for each category that has products.
const chips = computed(() => [
  { id: 'all', label: 'All' },
  ...CATEGORIES.filter((c) => (props.byCategory[c.id] ?? []).length > 0)
])

// A category chip shows everything in that category.
const visible = computed(() =>
  selected.value === 'all' ? props.products : (props.byCategory[selected.value] ?? [])
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
            class="sv-chip"
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
          <ProductCard :product="product" />
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

  .chips {
    flex-wrap: nowrap;
    margin-inline: calc(var(--gutter) * -1);
    padding: 2px var(--gutter) 6px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .chips::-webkit-scrollbar {
    display: none;
  }

  .chips .sv-chip {
    flex: none;
  }
}

/* very small phones: one column rather than squeezing two */
@media (max-width: 319px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
