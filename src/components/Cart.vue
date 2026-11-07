<script setup>
// bring cart components and state
import { cart } from '../store.js'
import { useRouter } from 'vue-router'
// bring computed for calculating total price
import { computed } from 'vue'

const router = useRouter()

// calculate total price of items in cart
const subtotal = computed(() => cart.getSubtotal())
const tax = computed(() => cart.getTax())
const total = computed(() => cart.getGrandTotal())

// tells store to remove one cart line (a product in a specific colour and size)
const handleRemove = (lineId) => {
  cart.removeFromCart(lineId)
}

// tells store to update quantity of a specific item in the cart. It finds the item by its productId and updates its quantity but only if the new quantity is greater than 0.
const handleQuantityChange = (lineId, event) => {
  const quantity = parseInt(event.target.value)
  cart.updateQuantity(lineId, quantity)
}

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
  <div class="cart-container">
    <h2>Shopping Cart</h2>
    
    <div v-if="cart.items.length === 0" class="empty-cart">
      <p>Your cart is empty</p>
      <p class="empty-message">Start shopping to add items to your cart</p>
      <RouterLink :to="{ name: 'shop' }" class="empty-link">Browse the shop</RouterLink>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.lineId" class="cart-item">
          <div class="item-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-variant">{{ item.colourName }} · EU {{ item.size }}</p>
            <p class="item-price">₦{{ item.price.toFixed(2) }}</p>
          </div>
          <div class="item-quantity">
            <label>Qty:</label>
            <select :value="item.quantity" @change="handleQuantityChange(item.lineId, $event)">
              <option v-for="n in cart.getMaxQuantity(item)" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="item-subtotal">
            <p>₦{{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
          <button @click="handleRemove(item.lineId)" class="remove-btn">Remove</button>
        </div>
      </div>

      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₦{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Tax (10%):</span>
          <span>₦{{ tax.toFixed(2) }}</span>
        </div>
        <div class="summary-row shipping">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>₦{{ total.toFixed(2) }}</span>
        </div>
        <button @click="handleCheckout" class="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.cart-container h2 {
  margin: 0 0 30px 0;
  color: #2c3e50;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

.empty-cart p {
  margin: 0;
  color: #666;
  font-size: 18px;
}

.empty-message {
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr 80px 100px 80px;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.item-image {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 4px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.item-price {
  margin: 0;
  color: #42b983;
  font-weight: bold;
}

.item-quantity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.item-quantity label {
  font-size: 12px;
  color: #666;
}

.item-quantity select {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.item-subtotal {
  text-align: center;
}

.item-subtotal p {
  margin: 0;
  font-weight: bold;
  color: #2c3e50;
}

.remove-btn {
  padding: 6px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #c0392b;
}

.cart-summary {
  background: #f9f9f9;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.cart-summary h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.summary-row.shipping {
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}

.summary-row.total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid #ddd;
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}

.checkout-btn {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-btn:hover {
  background: #359268;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 60px 1fr 50px;
    gap: 12px;
  }

  .item-subtotal,
  .remove-btn {
    display: none;
  }

  .cart-summary {
    position: static;
  }
}

.item-variant {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #666;
}

.empty-link {
  display: inline-block;
  margin-top: 16px;
  color: #42b983;
  font-weight: 600;
}
</style>
