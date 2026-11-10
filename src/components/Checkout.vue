<script setup>
import { cart } from '../store.js'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SITE_NAME } from '../config/site.js'
import { formatPrice } from '../utils/format.js'
import PageHero from './PageHero.vue'

const router = useRouter()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
})

// track order placement
const orderPlaced = ref(false)

// to calculate subtotal, tax, and total for the order summary
const subtotal = computed(() => cart.getSubtotal())
const tax = computed(() => cart.getTax())
const total = computed(() => cart.getGrandTotal())

// if any is false, submit button will be disabled. ensures that users fill in all required fields before placing an order.
const isFormValid = computed(() => {
  return formData.value.firstName &&
    formData.value.lastName &&
    formData.value.email &&
    formData.value.address &&
    formData.value.city &&
    formData.value.state &&
    formData.value.zipCode
})

const handleSubmit = () => {
  if (!isFormValid.value) {
    alert('Please fill in all fields')
    return
  }

  // display when order is placed
  alert(`Thank you for walking the ${SITE_NAME}! Your shoes will be delivered soon.`)
  orderPlaced.value = true
  
  // Clear cart and reset
  setTimeout(() => {
    cart.clearCart()
    resetForm()
    router.push({ name: 'shop' })
  }, 1000)
}

// reset form and order status after successful order placement 
const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  }
  orderPlaced.value = false
}

// go back to the cart page if user clicks back button on checkout page
const goBack = () => {
  router.push({ name: 'cart' })
}
</script>
<template>
  <div class="checkout">
    <PageHero eyebrow="Checkout" title="Checkout" text="Add your delivery details to place your order." />

    <div class="sv-container checkout-body">
      <div class="checkout-content">
        <form class="checkout-form" @submit.prevent="handleSubmit">
          <fieldset class="form-section">
            <legend>Shipping Information</legend>

            <div class="form-row">
              <label class="field">
                <span class="sv-field-label">First name *</span>
                <input v-model="formData.firstName" class="sv-input" type="text" autocomplete="given-name" placeholder="Ron" required />
              </label>
              <label class="field">
                <span class="sv-field-label">Last name *</span>
                <input v-model="formData.lastName" class="sv-input" type="text" autocomplete="family-name" placeholder="Ami" required />
              </label>
            </div>

            <div class="form-row">
              <label class="field">
                <span class="sv-field-label">Email *</span>
                <input v-model="formData.email" class="sv-input" type="email" autocomplete="email" placeholder="Ron@example.com" required />
              </label>
              <label class="field">
                <span class="sv-field-label">Phone (optional)</span>
                <input v-model="formData.phone" class="sv-input" type="tel" autocomplete="tel" placeholder="+234" />
              </label>
            </div>

            <label class="field">
              <span class="sv-field-label">Address *</span>
              <input v-model="formData.address" class="sv-input" type="text" autocomplete="street-address" placeholder="123 My Street" required />
            </label>

            <div class="form-row form-row--three">
              <label class="field">
                <span class="sv-field-label">City *</span>
                <input v-model="formData.city" class="sv-input" type="text" autocomplete="address-level2" placeholder="PH" required />
              </label>
              <label class="field">
                <span class="sv-field-label">State *</span>
                <input v-model="formData.state" class="sv-input" type="text" autocomplete="address-level1" placeholder="Rivs" required />
              </label>
              <label class="field">
                <span class="sv-field-label">ZIP code *</span>
                <input v-model="formData.zipCode" class="sv-input" type="text" autocomplete="postal-code" placeholder="10000" required />
              </label>
            </div>
          </fieldset>

          <div class="form-actions">
            <button type="button" class="sv-btn sv-btn--ghost" @click="goBack">Back to Cart</button>
            <button type="submit" class="sv-btn sv-btn--primary" :disabled="!isFormValid">Place Order</button>
          </div>
          <p class="demo-note">Demo checkout — no payment will be collected.</p>
        </form>

        <aside class="order-summary" aria-labelledby="order-summary-title">
          <h2 id="order-summary-title" class="summary-title">Order Summary</h2>
          <ul class="summary-items">
            <li v-for="item in cart.items" :key="item.lineId" class="summary-item">
              <span class="summary-thumb"><img :src="item.image" :alt="item.name" /></span>
              <span class="summary-info">
                <span class="summary-name">{{ item.name }}</span>
                <span class="summary-variant">{{ item.colourName }} · EU {{ item.size }} · Qty {{ item.quantity }}</span>
              </span>
              <span class="summary-price">{{ formatPrice(item.price * item.quantity) }}</span>
            </li>
          </ul>
          <dl class="summary-rows">
            <div class="summary-line">
              <dt>Subtotal</dt>
              <dd>{{ formatPrice(subtotal) }}</dd>
            </div>
            <div class="summary-line">
              <dt>Tax (10%)</dt>
              <dd>{{ formatPrice(tax) }}</dd>
            </div>
            <div class="summary-line total">
              <dt>Total</dt>
              <dd>{{ formatPrice(total) }}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-body {
  padding-block: 40px 88px;
}

.checkout-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 32px;
  align-items: start;
}

.checkout-form {
  min-width: 0;
}

.form-section {
  min-width: 0;
  margin: 0 0 24px 0;
  padding: 28px;
  border: 0;
  border-radius: var(--radius-lg);
  background: var(--card);
}

.form-section legend {
  float: left;
  width: 100%;
  margin: 0 0 20px 0;
  padding: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.form-section legend + * {
  clear: both;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-row--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.field {
  display: block;
  min-width: 0;
  margin-bottom: 16px;
}

.field:last-child {
  margin-bottom: 0;
}

.form-row .field {
  margin-bottom: 16px;
}

.form-row:last-child .field {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.form-actions .sv-btn--primary {
  flex: 1 1 200px;
  min-height: 56px;
}

.demo-note {
  margin: 12px 0 0 0;
  color: var(--muted);
  font-size: 13px;
}

.order-summary {
  position: sticky;
  top: 96px;
  min-width: 0;
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

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0 0 20px 0;
  padding: 0 0 20px 0;
  border-bottom: 1px solid var(--border);
  list-style: none;
}

.summary-item {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.summary-thumb {
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--panel);
}

.summary-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.summary-name {
  font-weight: 800;
  overflow-wrap: anywhere;
}

.summary-variant {
  color: var(--muted);
  font-size: 13px;
}

.summary-price {
  font-weight: 800;
  white-space: nowrap;
}

.summary-rows {
  margin: 0;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 0;
  color: var(--muted);
}

.summary-line dd {
  margin: 0;
  color: var(--text);
  font-weight: 700;
}

.summary-line.total {
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  color: var(--text);
  font-size: 20px;
  font-weight: 800;
}

.summary-line.total dd {
  color: var(--accent);
  font-weight: 900;
}

@media (max-width: 960px) {
  .checkout-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .checkout-body {
    padding-block: 24px 56px;
  }

  .form-section,
  .order-summary {
    padding: 22px 18px;
    border-radius: var(--radius-md);
  }

  .form-row,
  .form-row--three {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  .form-actions .sv-btn {
    flex: 1 1 100%;
  }
}
</style>
