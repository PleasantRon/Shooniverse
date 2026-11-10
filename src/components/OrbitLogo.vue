<script setup>
import { SITE_LOGO } from '../config/site.js'

// The brand logo. The image comes from the site config, so replacing the logo file
// (or changing SITE_LOGO) updates every place it appears, and the browser-tab icon.
defineProps({
  size: { type: Number, default: 36 }
})
</script>

<template>
  <img class="orbit-logo" :src="SITE_LOGO" :width="size" :height="size" alt="" />
</template>

<style scoped>
.orbit-logo {
  display: block;
  flex: none;
}
</style>
