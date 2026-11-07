<script setup>
const testimonials = [
  { name: 'Sarah', role: 'Style Fan', text: 'Lovely shoes, arrived fast!' },
  { name: 'Marcus', role: 'Runner', text: 'Great performance and fit.' },
  { name: 'Amara', role: 'Blogger', text: 'Beautiful craftsmanship.' }
]
</script>

<template>
  <section class="testimonials" aria-labelledby="testimonials-title">
    <div class="sv-container">
      <h2 id="testimonials-title" class="sv-section-title">What customers say</h2>
      <div class="quotes">
        <figure v-for="t in testimonials" :key="t.name" class="quote">
          <blockquote class="quote-text">
            <p>“{{ t.text }}”</p>
          </blockquote>
          <figcaption class="quote-by">
            <strong>{{ t.name }}</strong> · {{ t.role }}
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  padding: 72px 0;
}

.quotes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.quote {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  margin: 0;
  padding: 28px;
  border-radius: var(--radius-lg);
  background: var(--card);
}

.quote-text {
  margin: 0;
}

.quote-text p {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.quote-by {
  color: var(--muted);
  font-size: 14px;
}

.quote-by strong {
  color: var(--text);
}

@media (max-width: 860px) {
  .quotes {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
