<script setup>
// bring cart components and state
import { cart } from '../store.js'
import { useRouter } from 'vue-router'
// bring computed for calculating total price
import { computed } from 'vue'
import { formatPrice } from '../utils/format.js'
import { productLocation, shopLocation } from '../router/locations.js'
import PageHero from './PageHero.vue'
import OrbitBackdrop from './OrbitBackdrop.vue'

const router = useRouter()

// calculate total price of items in cart
const subtotal = computed(() => cart.getSubtotal())
const tax = computed(() => cart.getTax())
const total = computed(() => cart.getGrandTotal())

// tells store to remove one cart line (a product in a specific colour and size)
const handleRemove = (lineId) => {
  cart.removeFromCart(lineId)
}

// tells store to change the quantity of one cart line by +1 or -1. The store keeps it between 1 and
// what is in stock (and never above the per-line limit), so the buttons cannot overshoot.
const changeQuantity = (item, step) => {
  cart.updateQuantity(item.lineId, item.quantity + step)
}

const itemCountText = computed(() => {
  const n = cart.getItemCount()
  return n === 0 ? 'Nothing in your cart yet.' : `${n} ${n === 1 ? 'item' : 'items'} ready for checkout.`
})

// goes to the checkout page when user clicks proceed to checkout. if empty it displays the alert
const handleCheckout = () => {
  if (cart.items.length === 0) {
    alert('Your cart is empty!')
    return
  }
  
  router.push({ name: 'checkout' })
}
</script>
<template>
  <div class="cart">
    <PageHero eyebrow="Cart" title="Shopping Cart" :text="itemCountText" />

    <div class="sv-container cart-body">
      <div v-if="cart.items.length === 0" class="empty-cart">
        <OrbitBackdrop variant="center" tone="light" />
        <div class="empty-inner">
          <h2>Your cart is empty</h2>
          <p class="empty-message">Start shopping to add items to your cart</p>
          <RouterLink :to="shopLocation()" class="sv-btn sv-btn--primary">Browse the shop</RouterLink>
        </div>
      </div>

      <div v-else class="cart-content">
        <ul class="lines">
          <li v-for="item in cart.items" :key="item.lineId" class="line">
            <RouterLink :to="productLocation(item)" class="line-media" :aria-label="`View ${item.name}`">
              <img :src="item.image" :alt="item.name" />
            </RouterLink>

            <div class="line-main">
              <h3 class="line-name">
                <RouterLink :to="productLocation(item)">{{ item.name }}</RouterLink>
              </h3>
              <p class="line-variant">{{ item.colourName }} · EU {{ item.size }}</p>
              <p class="line-unit">{{ formatPrice(item.price) }} each</p>
              <button type="button" class="sv-btn sv-btn--quiet line-remove" :aria-label="`Remove ${item.name} from cart`" @click="handleRemove(item.lineId)">
                Remove
              </button>
            </div>

            <div class="line-foot">
              <div class="qty" role="group" :aria-label="`Quantity for ${item.name}`">
                <button type="button" class="qty-btn" aria-label="Decrease quantity" :disabled="item.quantity <= 1" @click="changeQuantity(item, -1)">&minus;</button>
                <output class="qty-value" aria-live="polite">{{ item.quantity }}</output>
                <button type="button" class="qty-btn" aria-label="Increase quantity" :disabled="item.quantity >= cart.getMaxQuantity(item)" @click="changeQuantity(item, 1)">+</button>
              </div>
              <p class="line-total">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </li>
        </ul>

        <aside class="summary" aria-labelledby="summary-title">
          <h2 id="summary-title" class="summary-title">Order Summary</h2>
          <dl class="summary-rows">
            <div class="summary-row">
              <dt>Subtotal</dt>
              <dd>{{ formatPrice(subtotal) }}</dd>
            </div>
            <div class="summary-row">
              <dt>Tax (10%)</dt>
              <dd>{{ formatPrice(tax) }}</dd>
            </div>
            <div class="summary-row">
              <dt>Shipping</dt>
              <dd>Free</dd>
            </div>
            <div class="summary-row total">
              <dt>Total</dt>
              <dd>{{ formatPrice(total) }}</dd>
            </div>
          </dl>
          <button type="button" class="sv-btn sv-btn--primary checkout-btn" @click="handleCheckout">Proceed to Checkout</button>
          <RouterLink :to="shopLocation()" class="continue">Continue shopping</RouterLink>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-body {
  padding-block: 40px 88px;
}

.empty-cart {
  position: relative;
  overflow: hidden;
  padding: 80px 20px;
  border-radius: var(--radius-xl);
  background: var(--card);
  text-align: center;
}

.empty-inner {
  position: relative;
}

.empty-inner h2 {
  margin: 0 0 8px 0;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 900;
  letter-spacing: -0.04em;
}

.empty-message {
  margin: 0 0 24px 0;
  color: var(--muted);
  font-size: 17px;
}

.cart-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 32px;
  align-items: start;
}

.lines {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.line {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) auto auto;
  grid-template-areas: 'media main qty total';
  align-items: center;
  gap: 8px 20px;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: var(--card);
}

/* the foot row (quantity + total) sits in the grid on wide screens */
.line-foot {
  display: contents;
}

.line-media {
  grid-area: media;
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--panel);
}

.line-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.line-main {
  grid-area: main;
  min-width: 0;
}

.line-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.line-name a {
  color: var(--text);
}

.line-variant,
.line-unit {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.line-remove {
  margin: 6px 0 0 -12px;
  min-height: 40px;
  font-size: 14px;
}

.qty {
  grid-area: qty;
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.qty-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.qty-btn:hover:not(:disabled) {
  background: var(--panel);
}

.qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.qty-value {
  min-width: 28px;
  text-align: center;
  font-weight: 800;
}

.line-total {
  grid-area: total;
  min-width: 110px;
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  text-align: right;
}

.summary {
  position: sticky;
  top: 96px;
  padding: 28px;
  border-radius: var(--radius-lg);
  background: var(--card);
}

.summary-title {
  margin: 0 0 20px 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.summary-rows {
  margin: 0 0 24px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0;
  color: var(--muted);
}

.summary-row dd {
  margin: 0;
  color: var(--text);
  font-weight: 700;
}

.summary-row.total {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  color: var(--text);
  font-size: 20px;
  font-weight: 800;
}

.summary-row.total dd {
  color: var(--accent);
  font-weight: 900;
}

.checkout-btn {
  width: 100%;
  min-height: 56px;
  font-size: 16px;
}

.continue {
  display: block;
  margin-top: 16px;
  text-align: center;
  color: var(--muted);
  font-weight: 600;
}

.continue:hover {
  color: var(--text);
}

@media (max-width: 960px) {
  .cart-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .summary {
    position: static;
  }
}

/* phones: picture and details side by side, quantity and total on their own row */
@media (max-width: 640px) {
  .cart-body {
    padding-block: 24px 56px;
  }

  .line {
    grid-template-columns: 92px minmax(0, 1fr);
    grid-template-areas: 'media main';
    gap: 12px 14px;
    padding: 14px;
    border-radius: var(--radius-md);
    align-items: start;
  }

  .line-foot {
    display: flex;
    grid-column: 1 / -1;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .line-name {
    font-size: 16px;
  }

  .line-total {
    min-width: 0;
    font-size: 17px;
  }

  .summary {
    padding: 22px 18px;
  }

  .empty-cart {
    padding: 56px 20px;
    border-radius: var(--radius-lg);
  }
}
</style>
