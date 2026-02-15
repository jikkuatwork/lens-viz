<template>
  <div class="stage-welcome" @click="start">
    <div class="hero">
      <!-- Logo -->
      <div class="hero-logo">
        <img src="/assets/logo.svg" alt="Lens" class="hero-logo-img" />
      </div>

      <!-- Title -->
      <h1 class="hero-title">Lens</h1>
      <p class="hero-subtitle">AI Research Pipeline</p>

      <!-- Description -->
      <p class="hero-desc">
        From fund documents to structured, searchable startup intelligence
        — fully automated by agentic AI.
      </p>

      <!-- CTA -->
      <button class="hero-cta" @click.stop="start">
        <span class="cta-text">Explore the Pipeline</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Hint -->
      <span class="hero-hint">or press any key</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const track = inject('track')

function start() {
  track('pipeline_start')
  router.push('/slide/01')
}

function handleKey(e) {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
    e.preventDefault()
    start()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKey)
})
</script>

<style scoped>
.stage-welcome {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-logo {
  margin-bottom: 24px;
}

.hero-logo-img {
  width: 64px;
  height: 64px;
}

.hero-title {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -1px;
  line-height: 1;
  margin-bottom: 8px;
}

.hero-subtitle {
  font-size: 15px;
  font-weight: 400;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  margin-bottom: 28px;
}

.hero-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-tertiary);
  text-align: center;
  max-width: 380px;
  margin-bottom: 36px;
}

.hero-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-accent);
  background: var(--accent-dim);
  color: var(--accent);
}

.hero-cta:hover {
  background: var(--accent-subtle);
  border-color: var(--accent);
  box-shadow: 0 0 24px var(--accent-glow);
}

.hero-cta:active {
  transform: scale(0.98);
}

.hero-hint {
  margin-top: 16px;
  font-size: 11px;
  color: var(--text-tertiary);
  letter-spacing: 0.3px;
  opacity: 0.6;
}
</style>
