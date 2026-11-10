<script setup>
// Decorative orbit rings, placed behind a section's content. Static (no motion).
// The parent needs position: relative and overflow: hidden.
//   variant: 'corner' rings cut off in the top-right corner, 'center' rings around the middle
//   tone:    'dark' for dark bands, 'accent' for blue panels, 'light' for the page background
defineProps({
  variant: { type: String, default: 'corner' },
  tone: { type: String, default: 'dark' }
})
</script>

<template>
  <span class="orbit-backdrop" :class="[`orbit-backdrop--${variant}`, `orbit-backdrop--${tone}`]" aria-hidden="true">
    <span class="ring ring-a"></span>
    <span class="ring ring-b"></span>
  </span>
</template>

<style scoped>
.orbit-backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.ring {
  position: absolute;
  border: 1px solid var(--ring-a);
  border-radius: 50%;
}

.ring-b {
  border-color: var(--ring-b);
}

/* colours */
.orbit-backdrop--dark {
  --ring-a: var(--promo-border);
  --ring-b: color-mix(in srgb, var(--accent) 60%, transparent);
}

.orbit-backdrop--accent {
  --ring-a: color-mix(in srgb, var(--accent-text) 22%, transparent);
  --ring-b: color-mix(in srgb, var(--accent-text) 38%, transparent);
}

.orbit-backdrop--light {
  --ring-a: var(--border);
  --ring-b: color-mix(in srgb, var(--accent) 35%, transparent);
}

/* positions */
.orbit-backdrop--corner .ring-a {
  top: -220px;
  right: -140px;
  width: 560px;
  height: 560px;
}

.orbit-backdrop--corner .ring-b {
  top: -120px;
  right: -40px;
  width: 360px;
  height: 360px;
}

.orbit-backdrop--center .ring-a {
  top: 50%;
  left: 50%;
  width: 118%;
  aspect-ratio: 1;
  translate: -50% -50%;
}

.orbit-backdrop--center .ring-b {
  top: 50%;
  left: 50%;
  width: 82%;
  aspect-ratio: 1;
  translate: -50% -50%;
}

@media (max-width: 640px) {
  .orbit-backdrop--corner .ring-a {
    top: -200px;
    right: -200px;
  }

  .orbit-backdrop--corner .ring-b {
    top: -110px;
    right: -120px;
  }
}
</style>
