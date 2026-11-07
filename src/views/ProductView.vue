<script setup>
import { computed } from 'vue'
import { getProductBySlug } from '../data/catalog.js'
import ProductDetails from '../components/ProductDetails.vue'
import NotFoundState from '../components/NotFoundState.vue'

// The router passes the :slug param in as a prop.
const props = defineProps({
  slug: { type: String, required: true }
})

const product = computed(() => getProductBySlug(props.slug))
</script>

<template>
  <div class="page">
    <!-- key makes the details reset when moving from one product to another -->
    <ProductDetails v-if="product" :key="product.slug" :product="product" />
    <NotFoundState
      v-else
      title="Shoe not found"
      message="That product doesn't exist or is no longer available."
    />
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>
