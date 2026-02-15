<script setup>
import { inject, ref } from 'vue'

const emit = defineEmits(['close'])
const auth = inject('auth')

const loading = ref(false)
const error = ref(null)

async function onGoogle() {
  loading.value = true
  error.value = null

  try {
    await auth.signInWithGoogle()
    if (auth.error.value) {
      error.value = auth.error.value
      return
    }
    emit('close')
  } catch (e) {
    error.value = e?.message || 'Sign in failed'
  } finally {
    loading.value = false
  }
}

function onBackdrop(event) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click="onBackdrop">
      <div class="modal z-scale-in">
        <button class="close" @click="emit('close')">×</button>

        <div class="head">
          <img src="/assets/logo.svg" alt="Lens" class="logo" />
          <h2>Enter Deck Mode</h2>
          <p>Use account context or run with local presentation auth.</p>
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <button class="google" :disabled="loading" @click="onGoogle">
          <span>{{ loading ? 'Signing in...' : 'Continue with Google' }}</span>
        </button>

        <div v-if="auth.canUseMockAuth.value" class="divider"><span>or</span></div>

        <button
          v-if="auth.canUseMockAuth.value"
          class="guest"
          @click="auth.signInDemo(); emit('close')">
          Continue in Presentation Mode
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 16px;
}

.modal {
  width: min(460px, 100%);
  border-radius: 22px;
  background: linear-gradient(150deg, color-mix(in srgb, var(--z-surface-alt) 86%, white 14%), color-mix(in srgb, var(--z-surface) 70%, white 30%));
  border: 1px solid color-mix(in srgb, var(--z-border) 55%, transparent);
  box-shadow: var(--shadow-lg);
  padding: 22px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 0;
  background: color-mix(in srgb, var(--z-surface) 80%, white 20%);
  color: var(--z-text-sub);
  font-size: 20px;
  line-height: 1;
}

.head {
  text-align: center;
  margin-bottom: 10px;
}

.logo {
  width: 62px;
  height: 62px;
  margin: 0 auto 8px;
}

.head h2 {
  margin: 0;
  font-size: 24px;
  letter-spacing: -0.01em;
}

.head p {
  margin: 7px 0 0;
  color: var(--z-text-sub);
  font-size: 14px;
}

.error {
  margin: 10px 0;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, #ef4444 35%, transparent);
  background: color-mix(in srgb, #ef4444 12%, var(--z-surface-alt) 88%);
  color: #b91c1c;
  font-size: 12px;
  padding: 8px;
}

.google,
.guest {
  width: 100%;
  border-radius: 999px;
  padding: 11px 14px;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: 0.01em;
}

.google {
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 45%, transparent);
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--z-accent-500) 84%, transparent),
    color-mix(in srgb, #45c1ff 68%, var(--z-accent-500) 32%)
  );
  color: var(--z-on-accent);
}

.guest {
  border: 1px solid color-mix(in srgb, var(--z-border) 55%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 82%, white 18%);
  color: var(--z-text-sub);
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  color: var(--z-text-faint);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
