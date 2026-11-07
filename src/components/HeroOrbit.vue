<script setup>
import { computed, ref } from 'vue'
import { SITE_NAME } from '../config/site.js'
import { formatPrice } from '../utils/format.js'
import { productLocation } from '../router/locations.js'

// The hero showcase: one main shoe with signature shoes orbiting around it.
// Everything moves with CSS transforms only (no animation library). Satellite
// shoes sit on two tilted orbital planes; each one is turned back to face the
// viewer, so the 3D perspective makes it grow and shrink as it passes the main shoe.
const props = defineProps({
  product: { type: Object, required: true },
  // colourway of the main shoe: { colourName }
  variant: { type: Object, required: true },
  // [{ product, variant }] shown in orbit (up to 4)
  satellites: { type: Array, default: () => [] }
})

// Two orbital planes with two shoes each.
const planes = computed(() =>
  [props.satellites.slice(0, 2), props.satellites.slice(2, 4)].filter((group) => group.length > 0)
)

// Pause control (WCAG 2.2.2: moving content that starts automatically can be paused).
const paused = ref(false)
</script>

<template>
  <div class="stage" :class="{ 'is-paused': paused }">
    <span class="stage-word" aria-hidden="true">{{ SITE_NAME }}</span>

    <!-- orbit rings and trails sit in their own layer behind the shoes, so they never cut through a shoe -->
    <div class="scene scene--tracks" aria-hidden="true">
      <div v-for="(group, p) in planes" :key="p" class="plane" :class="`plane--${p}`">
        <span class="ring"></span>
        <div v-for="(item, i) in group" :key="item.product.id" class="orbit" :class="`orbit--${i}`">
          <span class="trail"></span>
        </div>
      </div>
    </div>

    <div class="scene">
      <!-- decorative orbiting shoes: the same products are linked in the Featured section -->
      <div v-for="(group, p) in planes" :key="p" class="plane" :class="`plane--${p}`" aria-hidden="true">
        <div v-for="(item, i) in group" :key="item.product.id" class="orbit" :class="`orbit--${i}`">
          <RouterLink :to="productLocation(item.product)" class="sat" tabindex="-1">
            <span class="sat-bob">
              <img class="sat-card" :src="item.variant.images.card" alt="" />
            </span>
          </RouterLink>
        </div>
      </div>

      <RouterLink
        :to="productLocation(product)"
        class="main"
        :aria-label="`${product.name}, ${variant.colourName}, ${formatPrice(product.price)}`"
      >
        <img class="main-card" :src="product.image" alt="" />
      </RouterLink>
    </div>

    <RouterLink :to="productLocation(product)" class="stage-tag" tabindex="-1" aria-hidden="true">
      <span class="stage-tag-name">{{ product.name }}</span>
      <span class="stage-tag-price">{{ formatPrice(product.price) }}</span>
    </RouterLink>

    <button
      type="button"
      class="stage-pause"
      :aria-pressed="paused"
      :aria-label="paused ? 'Play shoe orbit animation' : 'Pause shoe orbit animation'"
      @click="paused = !paused"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path v-if="!paused" d="M8 5v14M16 5v14" />
        <path v-else d="M8 5l11 7-11 7z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  /* sizes below use cqmin (the smaller side of the card) so the orbits fit at any card shape;
     container queries need a definite height, so this is height rather than min-height */
  container-type: size;
  height: 520px;
  overflow: hidden;
  isolation: isolate;
  border-radius: var(--radius-xl);
  background: var(--accent);
  color: var(--accent-text);
}

.stage-word {
  position: absolute;
  left: 50%;
  bottom: 6%;
  transform: translateX(-50%);
  font-size: clamp(72px, 13vw, 190px);
  font-weight: 900;
  letter-spacing: -0.06em;
  line-height: 0.8;
  white-space: nowrap;
  opacity: 0.14;
  user-select: none;
}

/* ---------- 3D scene ---------- */
.scene {
  position: absolute;
  inset: 0;
  perspective: 150cqmin;
  transform-style: preserve-3d;
}

.scene--tracks {
  pointer-events: none;
}

.plane {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateZ(var(--roll)) rotateX(var(--pitch));
}

/* inner plane: shallower and slower */
.plane--0 {
  --d: 58cqmin; /* orbit diameter */
  --tile: 19cqmin; /* satellite width */
  --pitch: 58deg;
  --roll: -16deg;
  --period: 28s;
}

/* outer plane: wider, turning the other way */
.plane--1 {
  --d: 72cqmin;
  --tile: 16cqmin;
  --pitch: 62deg;
  --roll: 18deg;
  --period: 44s;
}

/* starting angles so the four shoes are spread around the main shoe */
.plane--0 .orbit--0 { --start: 20deg; }
.plane--0 .orbit--1 { --start: 200deg; }
.plane--1 .orbit--0 { --start: 110deg; }
.plane--1 .orbit--1 { --start: 290deg; }

.ring,
.orbit {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--d);
  aspect-ratio: 1;
  translate: -50% -50%;
  border-radius: 50%;
}

.ring {
  border: 1px solid color-mix(in srgb, var(--accent-text) 38%, transparent);
}

.orbit {
  transform-style: preserve-3d;
  transform: rotateZ(var(--start));
  animation: orbit-spin var(--period) linear infinite;
  will-change: transform;
}

.plane--1 .orbit {
  animation-direction: reverse;
}

/* fading arc behind each shoe */
.trail {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0 80%,
    color-mix(in srgb, var(--accent-text) 75%, transparent) 100%
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
}

.plane--1 .trail {
  transform: scaleX(-1);
}

/* the satellite sits at the top of its orbit and is rotated back to face the viewer */
.sat {
  position: absolute;
  left: 50%;
  top: 0;
  display: block;
  width: var(--tile);
  translate: -50% -50%;
  transform: rotateZ(calc(var(--start) * -1)) rotateX(calc(var(--pitch) * -1)) rotateZ(calc(var(--roll) * -1));
  animation: sat-face var(--period) linear infinite;
  will-change: transform;
  text-decoration: none;
}

.plane--1 .sat {
  animation-direction: reverse;
}

.sat-bob {
  display: block;
  animation: bob 6.5s ease-in-out infinite alternate;
}

.orbit--1 .sat-bob {
  animation-duration: 8s;
  animation-delay: -2.5s;
}

.plane--1 .sat-bob {
  animation-duration: 9.5s;
}

.sat-card {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: calc(var(--tile) * 0.16);
  box-shadow: 0 1.6cqmin 4cqmin rgba(0, 0, 0, 0.28);
  animation: pop-in 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.plane--0 .orbit--0 .sat-card { animation-delay: 0.35s; }
.plane--0 .orbit--1 .sat-card { animation-delay: 0.5s; }
.plane--1 .orbit--0 .sat-card { animation-delay: 0.65s; }
.plane--1 .orbit--1 .sat-card { animation-delay: 0.8s; }

/* ---------- main shoe ---------- */
.main {
  position: absolute;
  left: 50%;
  top: 50%;
  display: block;
  width: 50cqmin;
  translate: -50% -50%;
  transform: rotateZ(-4deg) rotateY(-6deg);
  animation: main-float 9s ease-in-out infinite;
  will-change: transform;
}

.main-card {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.28);
  animation: pop-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.main:focus-visible {
  outline: 3px solid var(--accent-text);
  outline-offset: 6px;
  border-radius: var(--radius-lg);
}

/* ---------- label and pause button ---------- */
.stage-tag {
  position: absolute;
  left: 24px;
  bottom: 24px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  border-radius: var(--radius-pill);
  background: var(--card);
  color: var(--text);
  box-shadow: var(--shadow);
  text-decoration: none;
}

.stage-tag:hover {
  text-decoration: none;
}

.stage-tag-name {
  font-weight: 700;
}

.stage-tag-price {
  color: var(--muted);
  font-weight: 600;
}

.stage-pause {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent-text) 18%, transparent);
  color: var(--accent-text);
}

.stage-pause:hover {
  background: color-mix(in srgb, var(--accent-text) 30%, transparent);
}

.stage-pause:focus-visible {
  outline: 3px solid var(--accent-text);
  outline-offset: 2px;
}

.stage-pause svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ---------- pausing: button, keyboard focus, and (with a mouse) hovering ---------- */
.stage.is-paused .scene *,
.stage:focus-within .scene * {
  animation-play-state: paused;
}

@media (hover: hover) {
  .stage:hover .scene * {
    animation-play-state: paused;
  }
}

/* ---------- motion (transforms and opacity only) ---------- */
@keyframes orbit-spin {
  from { transform: rotateZ(var(--start)); }
  to { transform: rotateZ(calc(var(--start) + 360deg)); }
}

@keyframes sat-face {
  from {
    transform: rotateZ(calc(var(--start) * -1)) rotateX(calc(var(--pitch) * -1)) rotateZ(calc(var(--roll) * -1));
  }
  to {
    transform: rotateZ(calc(var(--start) * -1 - 360deg)) rotateX(calc(var(--pitch) * -1)) rotateZ(calc(var(--roll) * -1));
  }
}

@keyframes bob {
  from { transform: translateY(-1.2cqmin) rotate(-2deg); }
  to { transform: translateY(1.2cqmin) rotate(2deg); }
}

@keyframes main-float {
  0%, 100% { transform: translateY(0) rotateZ(-4deg) rotateY(-6deg); }
  50% { transform: translateY(-2.2cqmin) rotateZ(-2deg) rotateY(6deg); }
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.7); }
}

/* Reduced motion: a still composition, with the shoes spread around the main shoe. */
@media (prefers-reduced-motion: reduce) {
  .scene *,
  .scene *::before {
    animation: none !important;
  }

  .stage-pause {
    display: none;
  }
}

@media (max-width: 960px) {
  .stage {
    height: 420px;
  }
}

@media (max-width: 480px) {
  .stage {
    height: 340px;
    border-radius: var(--radius-lg);
  }

  .stage-tag {
    left: 16px;
    bottom: 16px;
  }
}
</style>
