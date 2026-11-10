<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { products } from '../store.js'
import { CATEGORIES, COLLECTIONS } from '../data/constants.js'
import { countByCategory, getCategory, isCategoryId, isCollectionId, resolveShopFilter } from '../data/catalog.js'
import { siteCopy } from '../data/siteCopy.js'
import { SITE_COLLECTION } from '../config/site.js'
import PageHero from '../components/PageHero.vue'
import CategoryNav from '../components/CategoryNav.vue'
import ProductCatalog from '../components/ProductCatalog.vue'

// The Shop page shows what the address asks for:
//   /shop                       every product
//   /shop?category=running      only that category
//   /shop?collection=drop-07    only that collection (the new arrivals)
// The rules live in resolveShopFilter (data/catalog.js).
const route = useRoute()
const filter = computed(() => resolveShopFilter(route.query, products))
const visible = computed(() => filter.value.products)
const category = computed(() => filter.value.category)
const collection = computed(() => filter.value.collection)
const unknown = computed(() => filter.value.unknown)

const counts = countByCategory(products)
const navCategories = CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: counts[c.id] }))

const title = computed(() => {
  if (isCategoryId(category.value)) return siteCopy.categories.headings[category.value]
  if (isCollectionId(collection.value)) return COLLECTIONS.find((c) => c.id === collection.value).label
  return `All ${SITE_COLLECTION}`
})

const text = computed(() => {
  if (unknown.value) return siteCopy.shop.unknownCategory
  if (isCategoryId(category.value)) return siteCopy.categories.descriptions[category.value]
  if (isCollectionId(collection.value)) return siteCopy.shop.collection
  return siteCopy.shop.all
})

const eyebrow = computed(() => {
  const n = visible.value.length
  return `${n} ${n === 1 ? 'pair' : 'pairs'}`
})

const activeId = computed(() => (getCategory(category.value) ? category.value : ''))
</script>

<template>
  <div class="shop">
    <PageHero :eyebrow="eyebrow" :title="title" :text="text" />
    <div class="sv-container shop-body">
      <CategoryNav :categories="navCategories" :total="products.length" :active-id="activeId" />
      <p class="sv-sr-only" role="status" aria-live="polite">{{ title }}: {{ eyebrow }}</p>
      <ProductCatalog :products="visible" :empty-text="siteCopy.shop.empty" />
    </div>
  </div>
</template>

<style scoped>
.shop-body {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-block: 40px 88px;
}

@media (max-width: 640px) {
  .shop-body {
    gap: 24px;
    padding-block: 24px 56px;
  }
}
</style>
