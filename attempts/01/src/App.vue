<template>
  <div class="app-root">
    <div class="ambient-bg"></div>
    <div class="dot-grid"></div>

    <!-- Mobile gate -->
    <div v-if="isMobile" class="mobile-gate">
      <div class="mobile-card">
        <img src="/assets/logo.svg" alt="Lens" class="mobile-logo" />
        <h2 class="mobile-title">Desktop Only</h2>
        <p class="mobile-desc">
          Lens is designed for desktop browsers.<br/>
          Please visit on a larger screen for the full experience.
        </p>
        <div class="mobile-hint">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="var(--accent)" stroke-width="1.2" fill="none"/>
            <line x1="5" y1="13" x2="11" y2="13" stroke="var(--accent)" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span>1024px minimum width</span>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="app-loading">
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
import { ref, provide, watch, onMounted, onUnmounted } from 'vue'
import AuthModal from './components/AuthModal.vue'
import { useAuth } from './composables/useAuth.js'
import { useAnalytics } from './composables/useAnalytics.js'

const { user, loading, login, logout } = useAuth()
const { track } = useAnalytics()

// ── Mobile detection ──
const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
}

// ── Theme (default: light, persisted server-side) ──
const lightMode = ref(true)

function applyTheme(isLight) {
  lightMode.value = isLight
  document.documentElement.classList.toggle('light', isLight)
}

async function loadPreferences() {
  try {
    const res = await fetch('/api/preferences', {
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    })
    if (res.ok) {
      const { preferences } = await res.json()
      if (preferences && typeof preferences.theme === 'string') {
        applyTheme(preferences.theme === 'light')
      }
    }
  } catch {
    // keep default (light)
  }
}

async function saveThemePreference(theme) {
  try {
    await fetch('/api/preferences', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme }),
    })
  } catch {
    // fail silently
  }
}

function toggleTheme() {
  const newLight = !lightMode.value
  applyTheme(newLight)
  const theme = newLight ? 'light' : 'dark'
  saveThemePreference(theme)
  track('theme_toggle', { theme })
}

// Load prefs once user is authenticated
watch(user, (u) => {
  if (u) loadPreferences()
})

// Provide to children
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
  // Default to light on first render
  applyTheme(true)
  checkMobile()
  window.addEventListener('resize', checkMobile)
  track('session_start')
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
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

/* ── Mobile Gate ── */
.mobile-gate {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: 24px;
}

.mobile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 32px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  max-width: 340px;
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-logo {
  width: 40px;
  height: 40px;
  margin-bottom: 20px;
}

.mobile-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  margin-bottom: 10px;
}

.mobile-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.mobile-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--accent-dim);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
  color: var(--accent);
}
</style>
