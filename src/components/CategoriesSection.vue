<script setup>
import { siteCopy } from '../data/siteCopy.js'
import { shopLocation } from '../router/locations.js'

defineProps({
  // [{ id, label, note?, description, count, product }]
  categories: { type: Array, required: true }
})
</script>

<template>
  <section id="categories" class="categories" aria-labelledby="categories-title">
    <div class="sv-container">
      <div class="head">
        <h2 id="categories-title" class="sv-section-title">{{ siteCopy.categories.title }}</h2>
        <p class="sv-section-text">{{ siteCopy.categories.text }}</p>
      </div>

      <ul class="cards">
        <li v-for="category in categories" :key="category.id">
          <RouterLink :to="shopLocation({ category: category.id })" class="card">
            <span class="card-media">
              <img v-if="category.product" :src="category.product.image" alt="" loading="lazy" />
            </span>
            <span class="card-name">{{ category.label }}</span>
            <span class="card-text">{{ category.description }}</span>
            <span class="card-meta">
              {{ category.count }} {{ category.count === 1 ? 'style' : 'styles' }}
              <span class="card-arrow" aria-hidden="true">&rarr;</span>
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.categories {
  padding: 72px 0;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px 40px;
  margin-bottom: 40px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  padding: 14px 14px 22px;
  border-radius: var(--radius-lg);
  background: var(--card);
  color: var(--text);
  text-decoration: none;
  transition: box-shadow 0.25s, transform 0.25s;
}

.card:hover {
  text-decoration: none;
  box-shadow: var(--shadow);
}

.card-media {
  display: block;
  aspect-ratio: 4 / 3;
  margin-bottom: 14px;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--panel);
}

.card-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-name {
  padding: 0 8px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.card-text {
  padding: 0 8px;
  color: var(--muted);
  font-size: 15px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding: 14px 8px 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

@media (prefers-reduced-motion: no-preference) {
  .card:hover {
    transform: translateY(-4px);
  }

  .card:hover .card-arrow {
    transform: translateX(4px);
  }

  .card-arrow {
    display: inline-block;
    transition: transform 0.25s;
  }
}

/* tablets and phones: two columns, with proportions that keep the cards compact */
@media (max-width: 699px) {
  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .categories {
    padding: 48px 0;
  }

  .head {
    margin-bottom: 28px;
  }

  .cards {
    gap: 12px;
  }

  .card {
    gap: 4px;
    padding: 10px 10px 16px;
    border-radius: var(--radius-md);
  }

  .card-media {
    margin-bottom: 8px;
    border-radius: var(--radius-sm);
  }

  .card-name {
    padding: 0 4px;
    font-size: 17px;
  }

  .card-text {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    padding: 0 4px;
    font-size: 13px;
    line-height: 1.4;
  }

  .card-meta {
    padding: 10px 4px 0;
    font-size: 13px;
  }
}

/* very small phones: one column rather than squeezing two */
@media (max-width: 319px) {
  .cards {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
