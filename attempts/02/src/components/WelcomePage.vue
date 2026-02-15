<script setup>
import { inject, ref } from 'vue'

const auth = inject('auth')
const loading = ref(false)

const previewLabels = [
  'Data ingest orchestration',
  'Query expansion map',
  'Structured extraction',
  'Research agent swarm',
  'Schema enrichment',
  'Final brief packaging',
  'Semantic retrieval layer'
]

async function onPrimary() {
  loading.value = true
  auth.error.value = null

  try {
    await auth.signInWithGoogle()
  } finally {
    loading.value = false
  }
}

function onGuest() {
  auth.error.value = null
  auth.signInDemo()
}
</script>

<template>
  <section class="welcome-wrap">
    <div class="aura aura-left" aria-hidden="true"></div>
    <div class="aura aura-right" aria-hidden="true"></div>

    <div class="welcome-card z-scale-in">
      <header class="welcome-head">
        <img src="/assets/logo.svg" alt="Lens" class="welcome-logo" />
        <div>
          <p class="micro-label">CX Lens Presentation Deck</p>
          <h1>Elegant pipeline storytelling for investor rooms.</h1>
        </div>
      </header>

      <p class="welcome-copy">
        Enter presentation mode to navigate the full agentic flow from document intake to semantic retrieval with live-style telemetry.
      </p>

      <ul class="preview-grid">
        <li v-for="label in previewLabels" :key="label">{{ label }}</li>
      </ul>

      <div v-if="auth.error.value" class="welcome-error">{{ auth.error.value }}</div>

      <div class="welcome-actions">
        <button class="welcome-btn welcome-btn-primary" :disabled="loading" @click="onPrimary">
          {{ loading ? 'Entering...' : 'Continue with Google' }}
        </button>
        <button v-if="auth.canUseMockAuth.value" class="welcome-btn" @click="onGuest">
          Continue in Presentation Mode
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.welcome-wrap {
  position: relative;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow: hidden;
}

.aura {
  position: absolute;
  width: 540px;
  height: 540px;
  filter: blur(80px);
  opacity: 0.45;
  border-radius: 999px;
  pointer-events: none;
}

.aura-left {
  left: -220px;
  top: -160px;
  background: color-mix(in srgb, var(--z-accent-300) 60%, transparent);
}

.aura-right {
  right: -220px;
  bottom: -180px;
  background: color-mix(in srgb, #5bc3ff 48%, transparent);
}

.welcome-card {
  position: relative;
  z-index: 2;
  width: min(900px, 100%);
  border-radius: 26px;
  border: 1px solid color-mix(in srgb, var(--z-border) 50%, transparent);
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--z-surface-alt) 82%, white 18%), color-mix(in srgb, var(--z-surface) 75%, white 25%));
  box-shadow: 0 28px 80px rgba(6, 14, 20, 0.18);
  padding: clamp(22px, 2.8vw, 36px);
  display: grid;
  gap: 18px;
}

.welcome-head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
}

.welcome-logo {
  width: clamp(56px, 6vw, 74px);
  height: clamp(56px, 6vw, 74px);
}

h1 {
  margin: 6px 0 0;
  max-width: 24ch;
  font-size: clamp(2rem, 3.5vw, 3rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--z-text);
}

.welcome-copy {
  margin: 0;
  max-width: 70ch;
  color: var(--z-text-sub);
  font-size: clamp(0.95rem, 1.3vw, 1.08rem);
  line-height: 1.55;
}

.preview-grid {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 9px;
}

.preview-grid li {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 72%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 78%, white 22%);
  padding: 8px 12px;
  color: var(--z-text-sub);
  font-size: 12px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.welcome-error {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, #ef4444 35%, transparent);
  background: color-mix(in srgb, #ef4444 12%, var(--z-surface-alt) 88%);
  color: #b91c1c;
  font-size: 13px;
  padding: 9px 12px;
}

.welcome-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.welcome-btn {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-border) 60%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 80%, white 20%);
  color: var(--z-text);
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0.01em;
  padding: 10px 18px;
}

.welcome-btn-primary {
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--z-accent-500) 84%, transparent),
    color-mix(in srgb, #45c1ff 68%, var(--z-accent-500) 32%)
  );
  border-color: color-mix(in srgb, var(--z-accent-600) 60%, transparent);
  color: var(--z-on-accent);
}

.welcome-btn:disabled {
  opacity: 0.55;
}

@media (max-width: 780px) {
  .welcome-wrap {
    padding: 14px;
  }

  .welcome-head {
    grid-template-columns: 1fr;
  }
}
</style>
