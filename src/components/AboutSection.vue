<script setup>
import { siteCopy } from '../data/siteCopy.js'
import { shopLocation } from '../router/locations.js'

defineProps({
  // { styles, categories, sizes } from the catalogue
  stats: { type: Object, required: true }
})
</script>

<template>
  <section id="about" class="about" aria-labelledby="about-title">
    <div class="sv-container about-grid">
      <div class="about-intro">
        <p class="sv-eyebrow">{{ siteCopy.about.eyebrow }}</p>
        <h2 id="about-title" class="sv-section-title">{{ siteCopy.about.title }}</h2>
      </div>

      <div class="about-body">
        <p v-for="paragraph in siteCopy.about.paragraphs" :key="paragraph" class="about-text">{{ paragraph }}</p>

        <dl class="stats">
          <div class="stat">
            <dt>Styles</dt>
            <dd>{{ stats.styles }}</dd>
          </div>
          <div class="stat">
            <dt>Categories</dt>
            <dd>{{ stats.categories }}</dd>
          </div>
          <div class="stat">
            <dt>EU sizes</dt>
            <dd>{{ stats.sizes }}</dd>
          </div>
        </dl>

        <RouterLink :to="shopLocation()" class="sv-btn sv-btn--primary">Explore the shop</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 72px 0 96px;
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 56px;
  align-items: start;
}

.about-intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.about-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.about-text {
  margin: 0;
  color: var(--muted);
  font-size: 18px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  margin: 8px 0;
}

.stat {
  padding: 18px 20px;
  border-radius: var(--radius-md);
  background: var(--card);
}

.stat dt {
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
}

.stat dd {
  margin: 4px 0 0 0;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

@media (max-width: 860px) {
  .about {
    padding: 48px 0 64px;
  }

  .about-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
}

@media (max-width: 480px) {
  .stat dd {
    font-size: 26px;
  }

  .stat {
    padding: 14px;
  }
}
</style>
