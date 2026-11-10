<script setup>
import { getHomepageContent } from '../data/homepage.js'
import { shopLocation } from '../router/locations.js'
import HeroSection from '../components/HeroSection.vue'
import CategoriesSection from '../components/CategoriesSection.vue'
import FeaturedProducts from '../components/FeaturedProducts.vue'
import PromoSection from '../components/PromoSection.vue'
import AboutSection from '../components/AboutSection.vue'

// What to show is decided in src/data/homepage.js from the existing product data.
const { hero, heroVariant, heroOrbit, showcase, showcaseByCategory, categories, drop, stats } = getHomepageContent()

const eyebrow = drop ? `${drop.label} · New arrivals` : 'New arrivals'
const newArrivalsLocation = drop ? shopLocation({ collection: drop.id }) : shopLocation()
</script>

<template>
  <div class="home">
    <HeroSection
      :product="hero"
      :variant="heroVariant"
      :satellites="heroOrbit"
      :eyebrow="eyebrow"
      :new-arrivals-location="newArrivalsLocation"
    />
    <CategoriesSection :categories="categories" />
    <FeaturedProducts v-if="showcase.length" :products="showcase" :by-category="showcaseByCategory" />
    <PromoSection :drop-label="drop ? drop.label : ''" :new-arrivals-location="newArrivalsLocation" />
    <AboutSection :stats="stats" />
  </div>
</template>
