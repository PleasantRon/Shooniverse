<script setup>
import { cart } from '../store.js'
import { shopLocation } from '../router/locations.js'
import { SITE_COLLECTION } from '../config/site.js'
import ProductCard from './ProductCard.vue'

// The product grid used on the Shop page: two columns on phones, more on wider screens.
// Pages decide which products to show.
defineProps({
  products: { type: Array, default: () => [] },
  emptyText: { type: String, default: '' }
})

// add products
const handleAddToCart = (product) => { cart.addToCart(product) }
</script>

<template>
  <ul v-if="products.length" class="grid">
    <li v-for="product in products" :key="product.id">
      <ProductCard :product="product" detailed quick-add @add-to-cart="handleAddToCart" />
    </li>
  </ul>
  <div v-else class="empty">
    <p>{{ emptyText }}</p>
    <RouterLink :to="shopLocation()" class="sv-btn sv-btn--primary">See all {{ SITE_COLLECTION }}</RouterLink>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 36px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 56px 20px;
  border-radius: var(--radius-lg);
  background: var(--card);
  text-align: center;
}

.empty p {
  margin: 0;
  color: var(--muted);
  font-size: 17px;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 14px;
  }
}

/* very small phones: one column rather than squeezing two */
@media (max-width: 319px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
