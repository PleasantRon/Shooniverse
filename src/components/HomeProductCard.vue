<script setup>
import { formatPrice } from '../utils/format.js'
import { getCategoryLabel } from '../data/catalog.js'
import { productLocation } from '../router/locations.js'

defineProps({
  product: { type: Object, required: true }
})
</script>

<template>
  <article class="product">
    <RouterLink :to="productLocation(product)" class="product-link">
      <div class="product-media">
        <img :src="product.image" :alt="product.name" loading="lazy" />
        <span v-if="product.isNew" class="product-badge">New</span>
      </div>
      <div class="product-body">
        <p class="product-meta">{{ getCategoryLabel(product) }}</p>
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-price">{{ formatPrice(product.price) }}</p>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.product-link {
  display: block;
  color: var(--text);
  text-decoration: none;
}

.product-link:hover {
  text-decoration: none;
}

.product-media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--panel);
}

.product-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: var(--accent);
  color: var(--accent-text);
  font-size: 12px;
  font-weight: 800;
}

.product-body {
  padding: 14px 6px 0;
}

.product-meta {
  margin: 0 0 2px 0;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
}

.product-name {
  margin: 0 0 4px 0;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.product-price {
  margin: 0;
  font-weight: 700;
}

@media (prefers-reduced-motion: no-preference) {
  .product-media img {
    transition: transform 0.4s ease;
  }

  .product-link:hover .product-media img {
    transform: scale(1.04);
  }
}

@media (max-width: 560px) {
  .product-name {
    font-size: 16px;
  }

  .product-media {
    border-radius: var(--radius-md);
  }
}
</style>
