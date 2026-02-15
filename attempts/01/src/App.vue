<template>
  <div class="app-root">
    <div class="ambient-bg"></div>
    <div class="dot-grid"></div>

    <!-- Loading state -->
    <div v-if="loading" class="app-loading">
      <div class="loading-spinner"></div>
    </div>

    <!-- Auth gate -->
    <AuthModal
      v-else-if="!user"
      @login="handleLogin"
    />

    <!-- Main app -->
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import AuthModal from './components/AuthModal.vue'
import { useAuth } from './composables/useAuth.js'
import { useAnalytics } from './composables/useAnalytics.js'

const { user, loading, login, logout } = useAuth()
const { track } = useAnalytics()

// Theme persistence
const lightMode = ref(false)

function initTheme() {
  const stored = localStorage.getItem('lens_theme')
  if (stored) {
    lightMode.value = stored === 'light'
  } else {
    lightMode.value = window.matchMedia('(prefers-color-scheme: light)').matches
  }
  document.documentElement.classList.toggle('light', lightMode.value)
}

function toggleTheme() {
  lightMode.value = !lightMode.value
  document.documentElement.classList.toggle('light', lightMode.value)
  localStorage.setItem('lens_theme', lightMode.value ? 'light' : 'dark')
  track('theme_toggle', { theme: lightMode.value ? 'light' : 'dark' })
}

// Provide theme + auth to children
provide('lightMode', lightMode)
provide('toggleTheme', toggleTheme)
provide('user', user)
provide('logout', logout)
provide('track', track)

function handleLogin() {
  track('sign_in')
  login()
}

onMounted(() => {
  initTheme()
  track('session_start')
})
</script>

<style scoped>
.app-root {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.app-loading {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}
</style>
