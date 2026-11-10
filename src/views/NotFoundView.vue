<script setup>
import NotFoundState from '../components/NotFoundState.vue'
</script>

<template>
  <div class="sv-container not-found-page">
    <NotFoundState />
  </div>
</template>

<style scoped>
.not-found-page {
  padding-block: 40px 88px;
}

@media (max-width: 640px) {
  .not-found-page {
    padding-block: 20px 56px;
  }
}
</style>
