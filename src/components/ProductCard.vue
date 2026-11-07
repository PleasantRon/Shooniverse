<script setup>
import { defineProps, defineEmits } from 'vue'
import { productLocation } from '../router/locations.js'
// 
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const handleAddToCart = () => {
  emit('add-to-cart', props.product)
}
</script>

<template>
  <div class="product-card">
    <RouterLink :to="productLocation(product)" class="card-link">
      <div class="product-image">
        <img :src="product.image" :alt="product.name" />
      </div>
    </RouterLink>
    <div class="product-info">
      <h3>
        <RouterLink :to="productLocation(product)" class="card-link">{{ product.name }}</RouterLink>
      </h3>
      <p class="description">{{ product.description }}</p>
      <div class="product-footer">
        <span class="price">₦{{ product.price.toFixed(2) }}</span>
        <button @click="handleAddToCart" class="add-btn">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 16px;
}

.product-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.description {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.add-btn {
  flex: 1;
  padding: 8px 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #359268;
}

.add-btn:active {
  transform: scale(0.98);
}

.card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

h3 .card-link {
  display: inline;
}

.card-link:hover {
  text-decoration: underline;
}
</style>
