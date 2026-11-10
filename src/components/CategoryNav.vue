<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { shopLocation } from '../router/locations.js'
import { SITE_COLLECTION } from '../config/site.js'

// Category links for the Shop page. Each one is a real link to /shop?category=<id>,
// so the filtered page can be bookmarked, shared and reached with the back button.
const props = defineProps({
  // [{ id, label, count }]
  categories: { type: Array, required: true },
  total: { type: Number, required: true },
  // id of the category being shown, or '' for all
  activeId: { type: String, default: '' }
})

// On phones the row scrolls sideways; bring the active chip into view.
const row = ref(null)
onMounted(async () => {
  await nextTick()
  row.value?.querySelector('[aria-current="page"]')?.scrollIntoView?.({ block: 'nearest', inline: 'center' })
})
</script>

<template>
  <nav class="category-nav" aria-label="Categories">
    <ul ref="row" class="category-list">
      <li>
        <RouterLink :to="shopLocation()" class="sv-chip" :aria-current="props.activeId === '' ? 'page' : undefined">
          All {{ SITE_COLLECTION }} <span class="sv-chip-count">{{ total }}</span>
        </RouterLink>
      </li>
      <li v-for="category in categories" :key="category.id">
        <RouterLink
          :to="shopLocation({ category: category.id })"
          class="sv-chip"
          :aria-current="props.activeId === category.id ? 'page' : undefined"
        >
          {{ category.label }} <span class="sv-chip-count">{{ category.count }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 640px) {
  .category-list {
    flex-wrap: nowrap;
    margin-inline: calc(var(--gutter) * -1);
    padding: 2px var(--gutter) 6px;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }

  .category-list::-webkit-scrollbar {
    display: none;
  }

  .category-list li {
    flex: none;
    scroll-snap-align: start;
  }
}
</style>
