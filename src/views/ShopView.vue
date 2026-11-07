<script setup>
import ProductCatalog from '../components/ProductCatalog.vue'
import { SITE_NAME, SITE_COLLECTION } from '../config/site.js'
</script>

<template>
  <div class="page">
    <ProductCatalog :heading="`All ${SITE_COLLECTION}`" :subheading="`Every pair in the ${SITE_NAME} catalogue`" />
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
