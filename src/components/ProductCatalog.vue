<script setup>
import { products as allProducts, cart } from '../store.js'
import ProductCard from './ProductCard.vue'

// Renders a titled grid of product cards. Pages decide which products to show.
defineProps({
  products: { type: Array, default: () => allProducts },
  heading: { type: String, default: 'Featured Collection' },
  subheading: { type: String, default: 'Explore our selection of premium shoes' }
})

// add products
const handleAddToCart = (product) => { cart.addToCart(product) }
</script>

<template>
  <div class="products-section">
    <div class="products-container">
      <div class="catalog-header">
        <h2>{{ heading }}</h2>
        <p>{{ subheading }}</p>
      </div>
      <div class="products-grid">
        <ProductCard v-for="product in products" :key="product.id" :product="product" @add-to-cart="handleAddToCart" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-header {
  text-align: center;
  margin-bottom: 40px;
}

.catalog-header h2 {
  margin: 0 0 10px 0;
  font-size: 32px;
  color: #2c3e50;
}

.catalog-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
