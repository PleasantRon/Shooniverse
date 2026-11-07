<script setup>
defineProps({
  size: { type: Number, default: 36 }
})
</script>

<template>
  <svg class="orbit-logo" :width="size" :height="size" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <circle cx="20" cy="20" r="18" class="orbit-logo-disc" />
    <ellipse cx="20" cy="20" rx="15" ry="6" class="orbit-logo-ring" transform="rotate(-25 20 20)" />
    <circle cx="20" cy="20" r="4" class="orbit-logo-core" />
    <circle cx="33.6" cy="13.7" r="3" class="orbit-logo-core" />
  </svg>
</template>

<style scoped>
.orbit-logo {
  display: block;
  flex: none;
}

.orbit-logo-disc {
  fill: var(--accent);
}

.orbit-logo-ring {
  fill: none;
  stroke: var(--accent-text);
  stroke-width: 2;
}

.orbit-logo-core {
  fill: var(--accent-text);
}
</style>
