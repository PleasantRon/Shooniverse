<script setup>
defineProps({
  title: { type: String, default: 'Page not found' },
  message: { type: String, default: "We couldn't find what you were looking for." }
})
</script>

<template>
  <section class="not-found">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <div class="not-found-actions">
      <RouterLink :to="{ name: 'shop' }" class="nf-btn">Back to the shop</RouterLink>
      <RouterLink :to="{ name: 'home' }" class="nf-link">Go to the homepage</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found h2 {
  margin: 0 0 10px 0;
  font-size: 32px;
  color: #2c3e50;
}

.not-found p {
  margin: 0 0 24px 0;
  color: #666;
}

.not-found-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.nf-btn {
  display: inline-block;
  padding: 12px 24px;
  background: #42b983;
  color: white;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
}

.nf-btn:hover {
  background: #2c3e50;
}

.nf-link {
  color: #2c3e50;
}
</style>
