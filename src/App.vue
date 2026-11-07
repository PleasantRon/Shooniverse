<script setup>
// Main app component: the site header, the routed page, and the footer.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

const route = useRoute()

// Only the homepage uses the new design so far; other screens keep a light surface.
const isHome = computed(() => route.name === 'home')
</script>

<template>
  <div id="app">
    <SiteHeader />
    <main class="main-content" :class="{ 'legacy-surface': !isHome }">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
