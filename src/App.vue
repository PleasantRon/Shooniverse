<script setup>
// Main app component that manages the overall layout and view switching between catalog, cart, and checkout.
import { ref } from 'vue'
// Importing the cart state and components
import { cart } from './store.js'
// 
import ProductCatalog from './components/ProductCatalog.vue'
import Cart from './components/Cart.vue'
import Checkout from './components/Checkout.vue'

const currentView = ref('catalog')

// Listen for view change events
window.addEventListener('show-catalog', () => {
  currentView.value = 'catalog'
})

window.addEventListener('show-cart', () => {
  currentView.value = 'cart'
})

window.addEventListener('show-checkout', () => {
  currentView.value = 'checkout'
})

const goToCart = () => {
  currentView.value = 'cart'
}

const goToCatalog = () => {
  currentView.value = 'catalog'
}
</script>

<template>
  <div id="app">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1 @click="goToCatalog" class="logo-text">👟 Shoeniverse</h1>
        </div>
        <nav class="nav">
          <button 
            @click="goToCatalog"
            :class="{ active: currentView === 'catalog' }"
            class="nav-btn"
          >
            Shop
          </button>
          <button 
            @click="goToCart"
            :class="{ active: currentView === 'cart' }"
            class="nav-btn"
          >
            Cart <span class="cart-badge" v-if="cart.getItemCount() > 0">{{ cart.getItemCount() }}</span>
          </button>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <ProductCatalog v-if="currentView === 'catalog'" />
      <Cart v-if="currentView === 'cart'" />
      <Checkout v-if="currentView === 'checkout'" />
    </main>

    <footer class="footer">
      <p>&copy; 2026 Shoeniverse. All rights reserved. | An e-commerce store If at all</p>
    </footer>
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: white;
  border-bottom: 2px solid #42b983;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  margin: 0;
  font-size: 24px;
  color: #42b983;
  cursor: pointer;
  transition: transform 0.2s;
}

.logo-text:hover {
  transform: scale(1.05);
}

.nav {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-btn {
  padding: 8px 16px;
  background: transparent;
  border: 2px solid #42b983;
  color: #42b983;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  position: relative;
}

.nav-btn:hover {
  background: #42b983;
  color: white;
}

.nav-btn.active {
  background: #42b983;
  color: white;
}

.cart-badge {
  display: inline-block;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-left: 6px;
  position: absolute;
  top: -8px;
  right: -8px;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 30px 20px;
  margin-top: 40px;
}

.footer p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .header-content {
    height: 60px;
  }

  .logo-text {
    font-size: 20px;
  }

  .nav-btn {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>
