<script setup>
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = inject('auth')
const showAuthModal = inject('showAuthModal')

const router = useRouter()
const showUserMenu = ref(false)

function goHome() {
  showUserMenu.value = false
  router.push('/slide/1')
}

function closeMenu() {
  showUserMenu.value = false
}
</script>

<template>
  <header class="nav safe-top">
    <div class="nav-inner">
      <button class="brand" @click="goHome">
        <img src="/assets/logo.svg" alt="Lens" class="brand-logo" />
        <span class="brand-text">Lens</span>
      </button>

      <div class="spacer"></div>

      <div class="right">
        <button
          @click="auth.isAuthenticated.value ? (showUserMenu = !showUserMenu) : (showAuthModal = true)"
          class="avatar"
          :class="{ authed: auth.isAuthenticated.value }">
          <img
            v-if="auth.user.value?.picture"
            :src="auth.user.value.picture"
            :alt="auth.user.value.name"
            class="avatar-img" />
          <span v-else-if="auth.isAuthenticated.value" class="avatar-txt">{{ auth.user.value?.name?.charAt(0) || 'U' }}</span>
          <svg v-else class="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>

        <div v-if="showUserMenu && auth.isAuthenticated.value" class="menu z-slide-down">
          <button class="menu-home" @click="goHome">
            <img src="/assets/logo.svg" alt="Lens" class="menu-logo" />
            <span>Lens</span>
          </button>

          <div class="menu-user">
            <p>{{ auth.user.value?.name }}</p>
            <span>{{ auth.user.value?.email }}</span>
          </div>

          <button class="menu-item" @click="auth.signOut(); closeMenu()">Sign out</button>
        </div>

        <div v-if="showUserMenu" class="menu-backdrop" @click="closeMenu"></div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  height: 48px;
  border-bottom: 1px solid color-mix(in srgb, var(--z-border) 50%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 78%, white 22%);
  backdrop-filter: blur(18px);
  position: relative;
  z-index: 60;
}

.nav-inner {
  height: 100%;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand {
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
}

.brand-logo {
  width: 25px;
  height: 25px;
}

.brand-text {
  font-size: 16px;
  font-weight: 610;
  color: var(--z-text);
}

.spacer {
  flex: 1;
}

.right {
  position: relative;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 0;
  background: color-mix(in srgb, var(--z-surface) 85%, white 15%);
  display: grid;
  place-items: center;
}

.avatar.authed {
  background: color-mix(in srgb, var(--z-accent-200) 35%, transparent);
}

.avatar-icon {
  width: 16px;
  height: 16px;
  color: var(--z-text-faint);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
}

.avatar-txt {
  font-size: 13px;
  font-weight: 650;
  color: color-mix(in srgb, var(--z-accent-700) 60%, var(--z-text) 40%);
}

.menu {
  position: absolute;
  right: 0;
  top: 38px;
  width: 220px;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--z-border) 55%, transparent);
  background: var(--z-surface-alt);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 100;
}

.menu-home {
  width: 100%;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--z-border-sub) 65%, transparent);
  background: color-mix(in srgb, var(--z-surface) 84%, white 16%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--z-text);
}

.menu-logo {
  width: 21px;
  height: 21px;
}

.menu-user {
  padding: 10px 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--z-border-sub) 65%, transparent);
}

.menu-user p {
  margin: 0;
  font-size: 13px;
  color: var(--z-text);
}

.menu-user span {
  font-size: 11px;
  color: var(--z-text-faint);
}

.menu-item {
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--z-text-sub);
  text-align: left;
  padding: 9px 12px;
  font-size: 13px;
}

.menu-item:hover {
  background: color-mix(in srgb, var(--z-surface) 88%, white 12%);
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
}
</style>
