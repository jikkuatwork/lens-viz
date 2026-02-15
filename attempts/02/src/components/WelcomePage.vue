<script setup>
import { computed, inject, ref } from 'vue'

const auth = inject('auth')

const loading = ref(false)

const isLocal = computed(() => {
  const host = window.location.hostname
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.nip.io') ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    host.startsWith('172.')
  )
})

async function signIn() {
  loading.value = true
  try {
    await auth.signInWithGoogle()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="welcome-wrap">
    <div class="welcome-card z-scale-in">
      <img src="/assets/logo.svg" alt="Lens" class="welcome-logo" />
      <p class="micro-label">CX Lens Pipeline Visualizer</p>
      <h1>Welcome</h1>
      <p class="welcome-copy">
        Sign in to enter slide mode and present each pipeline step with detailed visuals.
      </p>

      <div class="welcome-actions">
        <button class="welcome-btn welcome-btn-primary" :disabled="loading" @click="signIn">
          {{ loading ? 'Signing in...' : 'Continue with Google' }}
        </button>
        <button v-if="isLocal" class="welcome-btn" @click="auth.signInDemo()">Continue as Guest (Local)</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.welcome-wrap {
  height: 100%;
  display: grid;
  place-items: center;
  padding: 16px;
}

.welcome-card {
  width: min(620px, 100%);
  border-radius: 20px;
  border: 1px solid color-mix(in srgb, var(--z-border) 52%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 88%, white 12%);
  box-shadow: var(--shadow-lg);
  padding: 26px;
  text-align: center;
}

.welcome-logo {
  width: 86px;
  height: 86px;
  margin: 0 auto 10px;
}

h1 {
  margin: 6px 0 0;
  font-size: 42px;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--z-text);
}

.welcome-copy {
  margin: 14px auto 0;
  max-width: 520px;
  color: var(--z-text-sub);
  font-size: 15px;
  line-height: 1.5;
}

.welcome-actions {
  margin-top: 20px;
  display: grid;
  gap: 10px;
  max-width: 320px;
  margin-inline: auto;
}

.welcome-btn {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-border) 60%, transparent);
  background: color-mix(in srgb, var(--z-surface) 84%, white 16%);
  color: var(--z-text);
  font-size: 14px;
  font-weight: 600;
  padding: 10px 14px;
}

.welcome-btn-primary {
  background: var(--z-accent-500);
  border-color: color-mix(in srgb, var(--z-accent-600) 60%, transparent);
  color: var(--z-on-accent);
}

.welcome-btn:disabled {
  opacity: 0.55;
}
</style>
