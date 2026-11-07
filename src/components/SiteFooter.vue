<script setup>
import { CATEGORIES } from '../data/constants.js'
import { siteCopy } from '../data/siteCopy.js'
import { SITE_NAME } from '../config/site.js'
import { homeLocation, homeSectionLocation, shopLocation, cartLocation } from '../router/locations.js'
import BrandLink from './BrandLink.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="sv-container">
      <div class="footer-grid">
        <div class="footer-brand">
          <BrandLink :size="32" />
          <p class="footer-text">{{ siteCopy.brandDescription }}</p>
        </div>

        <nav class="footer-col" aria-labelledby="footer-shop">
          <h2 id="footer-shop" class="footer-heading">Shop</h2>
          <ul>
            <li><RouterLink :to="shopLocation()">All sneakers</RouterLink></li>
            <li><RouterLink :to="shopLocation({ collection: 'drop-07' })">New arrivals</RouterLink></li>
            <li v-for="category in CATEGORIES" :key="category.id">
              <RouterLink :to="shopLocation({ category: category.id })">{{ category.label }}</RouterLink>
            </li>
          </ul>
        </nav>

        <nav class="footer-col" aria-labelledby="footer-support">
          <h2 id="footer-support" class="footer-heading">Support</h2>
          <ul>
            <li><RouterLink :to="homeSectionLocation('benefits')">Shipping</RouterLink></li>
            <li><RouterLink :to="homeSectionLocation('benefits')">Returns</RouterLink></li>
            <li><RouterLink :to="homeSectionLocation('benefits')">Quality and materials</RouterLink></li>
            <li><RouterLink :to="cartLocation()">Your cart</RouterLink></li>
          </ul>
        </nav>

        <nav class="footer-col" aria-labelledby="footer-company">
          <h2 id="footer-company" class="footer-heading">Company</h2>
          <ul>
            <li><RouterLink :to="homeSectionLocation('about')">About {{ SITE_NAME }}</RouterLink></li>
            <li><RouterLink :to="homeLocation()">Home</RouterLink></li>
          </ul>
        </nav>
      </div>

      <div class="footer-legal">
        <p>&copy; {{ year }} {{ SITE_NAME }}. All rights reserved.</p>
        <p>{{ siteCopy.tagline }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 72px 0 32px;
  background: var(--panel);
  color: var(--text);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
}

.footer-text {
  max-width: 36ch;
  margin: 16px 0 0 0;
  color: var(--muted);
}

.footer-heading {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--muted);
}

.footer-col ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-col li + li {
  margin-top: 10px;
}

.footer-col a {
  color: var(--text);
  font-weight: 500;
}

.footer-col a:hover {
  color: var(--accent);
}

.footer-legal {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 14px;
}

.footer-legal p {
  margin: 0;
}

@media (max-width: 860px) {
  .footer {
    padding-top: 56px;
  }

  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
}
</style>
