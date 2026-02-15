<script setup>
import { provide, ref } from 'vue'
import { useAuth } from './composables/useAuth.js'
import LensNavBar from './components/LensNavBar.vue'
import AuthModal from './components/AuthModal.vue'
import WelcomePage from './components/WelcomePage.vue'

const auth = useAuth()
const showAuthModal = ref(false)

provide('auth', auth)
provide('showAuthModal', showAuthModal)
</script>

<template>
  <div class="app-shell">
    <LensNavBar />

    <main class="app-main">
      <div v-if="auth.loading.value" class="loading-state">
        <div class="spinner"></div>
      </div>
      <WelcomePage v-else-if="!auth.isAuthenticated.value" />
      <router-view v-else />
    </main>

    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<style scoped>
.app-shell {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.loading-state {
  height: 100%;
  display: grid;
  place-items: center;
}

.spinner {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 2px solid color-mix(in srgb, var(--z-border) 70%, transparent);
  border-top-color: var(--z-accent-500);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
