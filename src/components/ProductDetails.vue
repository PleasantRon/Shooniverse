<script setup>
import { computed, ref } from 'vue'
import { cart } from '../store.js'
import { EU_SIZES } from '../data/constants.js'
import { getVariant, getDefaultSelection, getCategoryLabel, getCollectionLabel } from '../data/catalog.js'
import { formatPrice } from '../utils/format.js'
import { shopLocation, cartLocation } from '../router/locations.js'
import OrbitBackdrop from './OrbitBackdrop.vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const initial = getDefaultSelection(props.product)
const colourId = ref(initial?.colourId ?? props.product.variants[0].colourId)
const size = ref(null) // shoppers choose a size themselves
const imageIndex = ref(0)
const message = ref({ type: '', text: '' })

const variant = computed(() => getVariant(props.product, colourId.value))
const gallery = computed(() => variant.value.images.gallery)
const mainImage = computed(() => gallery.value[imageIndex.value] ?? variant.value.images.card)

const categoryLabel = computed(() => getCategoryLabel(props.product))
const collectionLabel = computed(() => getCollectionLabel(props.product))

const stockFor = (s) => variant.value.stock[s] ?? 0
const colourSoldOut = computed(() => EU_SIZES.every((s) => stockFor(s) === 0))
const canAdd = computed(() => size.value !== null && stockFor(size.value) > 0)

const stockText = computed(() => {
  if (colourSoldOut.value) return 'Sold out in this colour'
  if (size.value === null) return 'Select a size'
  const left = stockFor(size.value)
  return left <= 3 ? `Only ${left} left in EU ${size.value}` : `In stock in EU ${size.value}`
})

const clearMessage = () => {
  message.value = { type: '', text: '' }
}

const chooseColour = (id) => {
  colourId.value = id
  imageIndex.value = 0
  // keep the size only if it is still available in the new colour
  if (size.value !== null && stockFor(size.value) === 0) size.value = null
  clearMessage()
}

const chooseSize = (s) => {
  if (stockFor(s) === 0) return
  size.value = s
  clearMessage()
}

const reasons = {
  'out-of-stock': 'That size has just sold out.',
  'max-quantity': 'Every available pair in that size is already in your cart.'
}

const addToCart = () => {
  if (!canAdd.value) return
  const result = cart.addToCart(props.product, { colourId: colourId.value, size: size.value })
  message.value = result.ok
    ? { type: 'success', text: 'Added to your cart.' }
    : { type: 'error', text: reasons[result.reason] ?? 'Could not add this item.' }
}
</script>

<template>
  <article class="details">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <RouterLink :to="shopLocation()">Shop</RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink :to="shopLocation({ category: product.category })">{{ categoryLabel }}</RouterLink>
      <span aria-hidden="true">/</span>
      <span class="breadcrumb-current">{{ product.name }}</span>
    </nav>

    <div class="details-grid">
      <div class="gallery">
        <div class="stage">
          <OrbitBackdrop variant="center" tone="accent" />
          <img class="stage-image" :src="mainImage" :alt="`${product.name} in ${variant.colourName}`" />
        </div>
        <div class="thumbs">
          <button
            v-for="(src, i) in gallery"
            :key="src"
            type="button"
            class="thumb"
            :class="{ selected: imageIndex === i }"
            :aria-label="`Show image ${i + 1} of ${gallery.length}`"
            :aria-pressed="imageIndex === i"
            @click="imageIndex = i"
          >
            <img :src="src" alt="" />
          </button>
        </div>
      </div>

      <div class="info">
        <p class="sv-eyebrow">
          {{ categoryLabel }}<template v-if="collectionLabel"> · {{ collectionLabel }}</template>
          <span v-if="product.isNew" class="badge">New</span>
        </p>
        <h1 class="name">{{ product.name }}</h1>
        <p class="price">{{ formatPrice(product.price) }}</p>
        <p class="short">{{ product.shortDescription }}</p>

        <div class="option">
          <p class="option-label">Colour: <strong>{{ variant.colourName }}</strong></p>
          <div class="swatches">
            <button
              v-for="v in product.variants"
              :key="v.id"
              type="button"
              class="swatch"
              :class="{ selected: v.colourId === colourId }"
              :style="{ background: v.swatch }"
              :aria-label="v.colourName"
              :aria-pressed="v.colourId === colourId"
              @click="chooseColour(v.colourId)"
            ></button>
          </div>
        </div>

        <div class="option">
          <p class="option-label">Size (EU)</p>
          <div class="sizes">
            <button
              v-for="s in EU_SIZES"
              :key="s"
              type="button"
              class="size"
              :class="{ selected: size === s }"
              :disabled="stockFor(s) === 0"
              :aria-pressed="size === s"
              :aria-label="`EU ${s}${stockFor(s) === 0 ? ', sold out' : ''}`"
              @click="chooseSize(s)"
            >
              {{ s }}
            </button>
          </div>
          <p class="stock" :class="{ low: size !== null && stockFor(size) <= 3 }">{{ stockText }}</p>
        </div>

        <button type="button" class="sv-btn sv-btn--primary add-btn" :disabled="!canAdd" @click="addToCart">
          Add to Cart
        </button>
        <p class="message" :class="message.type" role="status" aria-live="polite">
          {{ message.text }}
          <RouterLink v-if="message.type === 'success'" :to="cartLocation()">View cart</RouterLink>
        </p>

        <div class="long">
          <h2>About this shoe</h2>
          <p>{{ product.longDescription }}</p>
          <h2>Materials</h2>
          <ul>
            <li v-for="m in product.materials" :key="m">{{ m }}</li>
          </ul>
          <h2>Fit</h2>
          <p>{{ product.fit }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: var(--muted);
  font-size: 14px;
}

.breadcrumb a {
  color: var(--muted);
  font-weight: 600;
}

.breadcrumb a:hover {
  color: var(--text);
}

.breadcrumb-current {
  color: var(--text);
  font-weight: 700;
}

.details-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 48px;
  align-items: start;
}

.stage {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 5 / 4;
  padding: 8%;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: var(--accent);
}

.stage-image {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.25);
}

.thumbs {
  display: flex;
  gap: 12px;
  margin-top: 14px;
}

.thumb {
  width: 88px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  background: var(--panel);
  cursor: pointer;
}

.thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.thumb:hover {
  border-color: var(--border);
}

.thumb.selected {
  border-color: var(--accent);
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.badge {
  margin-left: 4px;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  background: var(--accent);
  color: var(--accent-text);
  font-size: 11px;
  font-weight: 800;
}

.name {
  margin: 16px 0 6px 0;
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 1;
}

.price {
  margin: 0 0 14px 0;
  font-size: 24px;
  font-weight: 800;
}

.short {
  margin: 0 0 28px 0;
  color: var(--muted);
  font-size: 17px;
}

.option {
  width: 100%;
  margin-bottom: 24px;
}

.option-label {
  margin: 0 0 10px 0;
  font-size: 14px;
}

.swatches,
.sizes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.swatch {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
}

.swatch.selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent);
}

.size {
  min-width: 56px;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--card);
  color: var(--text);
  font-weight: 700;
}

.size:hover:not(:disabled) {
  border-color: var(--text);
}

.size.selected {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--accent-text);
}

.size:disabled {
  background: transparent;
  color: var(--muted);
  text-decoration: line-through;
  opacity: 0.55;
  cursor: not-allowed;
}

.stock {
  margin: 10px 0 0 0;
  color: var(--muted);
  font-size: 14px;
}

.stock.low {
  color: var(--danger);
  font-weight: 700;
}

.add-btn {
  width: 100%;
  min-height: 56px;
  font-size: 16px;
}

.message {
  min-height: 24px;
  margin: 12px 0 0 0;
  font-size: 14px;
  font-weight: 600;
}

.message.success {
  color: var(--accent);
}

.message.error {
  color: var(--danger);
}

.message a {
  margin-left: 8px;
  font-weight: 800;
}

.long {
  width: 100%;
  margin-top: 28px;
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--card);
}

.long h2 {
  margin: 20px 0 6px 0;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--muted);
}

.long h2:first-child {
  margin-top: 0;
}

.long p,
.long ul {
  margin: 0;
  line-height: 1.55;
}

.long ul {
  padding-left: 20px;
}

@media (max-width: 860px) {
  .details-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
}

@media (max-width: 480px) {
  .stage {
    border-radius: var(--radius-lg);
  }

  .thumb {
    width: calc((100% - 24px) / 3);
  }

  .thumbs {
    gap: 12px;
  }

  .long {
    padding: 20px;
  }
}
</style>
