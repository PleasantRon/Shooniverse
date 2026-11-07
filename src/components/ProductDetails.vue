<script setup>
import { computed, ref } from 'vue'
import { cart } from '../store.js'
import { EU_SIZES } from '../data/constants.js'
import { getVariant, getDefaultSelection, getCategoryLabel, getCollectionLabel } from '../data/catalog.js'

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
      <RouterLink :to="{ name: 'shop' }">Shop</RouterLink>
      <span aria-hidden="true"> / </span>
      <span>{{ product.name }}</span>
    </nav>

    <div class="details-grid">
      <div class="gallery">
        <div class="main-image">
          <img :src="mainImage" :alt="`${product.name} in ${variant.colourName}`" />
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
        <p class="eyebrow">
          {{ categoryLabel }}<span v-if="collectionLabel"> · {{ collectionLabel }}</span>
          <span v-if="product.isNew" class="badge">New</span>
        </p>
        <h2 class="name">{{ product.name }}</h2>
        <p class="price">₦{{ product.price.toFixed(2) }}</p>
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

        <button type="button" class="add-btn" :disabled="!canAdd" @click="addToCart">
          Add to Cart
        </button>
        <p class="message" :class="message.type" role="status" aria-live="polite">
          {{ message.text }}
          <RouterLink v-if="message.type === 'success'" :to="{ name: 'cart' }">View cart</RouterLink>
        </p>

        <div class="long">
          <h3>About this shoe</h3>
          <p>{{ product.longDescription }}</p>
          <h3>Materials</h3>
          <ul>
            <li v-for="m in product.materials" :key="m">{{ m }}</li>
          </ul>
          <h3>Fit</h3>
          <p>{{ product.fit }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.breadcrumb {
  margin-bottom: 24px;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #42b983;
}

.details-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  align-items: start;
}

.main-image {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.thumbs {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.thumb {
  width: 84px;
  padding: 0;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  overflow: hidden;
}

.thumb img {
  width: 100%;
  display: block;
  aspect-ratio: 4 / 3;
  object-fit: contain;
}

.thumb.selected {
  border-color: #2c3e50;
}

.eyebrow {
  margin: 0 0 8px 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #666;
}

.badge {
  margin-left: 8px;
  padding: 2px 8px;
  background: #2c3e50;
  color: white;
  border-radius: 3px;
  font-size: 11px;
}

.name {
  margin: 0 0 8px 0;
  font-size: 36px;
  color: #2c3e50;
}

.price {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  color: #42b983;
}

.short {
  margin: 0 0 24px 0;
  color: #444;
}

.option {
  margin-bottom: 24px;
}

.option-label {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #2c3e50;
}

.swatches,
.sizes {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #ccc;
  cursor: pointer;
  outline-offset: 3px;
}

.swatch.selected {
  border-color: #2c3e50;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #2c3e50;
}

.size {
  min-width: 52px;
  min-height: 44px;
  padding: 0 12px;
  border: 2px solid #2c3e50;
  background: white;
  color: #2c3e50;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
}

.size:hover:not(:disabled) {
  background: #f0f0f0;
}

.size.selected {
  background: #2c3e50;
  color: white;
}

.size:disabled {
  border-color: #ccc;
  color: #767676;
  background: #f5f5f5;
  text-decoration: line-through;
  cursor: not-allowed;
}

.stock {
  margin: 10px 0 0 0;
  font-size: 14px;
  color: #666;
}

.stock.low {
  color: #b03a2e;
}

.add-btn {
  width: 100%;
  min-height: 52px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.add-btn:hover:not(:disabled) {
  background: #2c3e50;
}

.add-btn:disabled {
  background: #ccc;
  color: #555;
  cursor: not-allowed;
}

.message {
  min-height: 24px;
  margin: 10px 0 0 0;
  font-size: 14px;
}

.message.success {
  color: #1e7e4f;
}

.message.error {
  color: #b03a2e;
}

.message a {
  margin-left: 8px;
  color: #2c3e50;
  font-weight: 600;
}

.long {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.long h3 {
  margin: 16px 0 6px 0;
  font-size: 15px;
  color: #2c3e50;
}

.long p,
.long ul {
  margin: 0;
  color: #444;
  line-height: 1.5;
}

.long ul {
  padding-left: 20px;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .name {
    font-size: 28px;
  }
}
</style>
