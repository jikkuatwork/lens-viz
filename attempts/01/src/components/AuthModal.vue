<template>
  <div class="auth-page">
    <!-- Floating ambient orbs -->
    <div class="auth-orb orb-1" />
    <div class="auth-orb orb-2" />
    <div class="auth-orb orb-3" />

    <!-- Center card -->
    <div class="auth-card">
      <!-- Logo -->
      <div class="auth-logo">
        <img src="/assets/logo.svg" alt="Lens" class="auth-logo-img" />
      </div>

      <!-- Text -->
      <h1 class="auth-title">Lens</h1>
      <p class="auth-subtitle">AI Research Pipeline</p>

      <!-- Divider -->
      <div class="auth-divider" />

      <!-- Sign in button -->
      <button class="auth-btn" @click="$emit('login')">
        <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>Sign in with Google</span>
      </button>

      <!-- Footer hint -->
      <p class="auth-footer">Explore fund data through semantic search</p>
    </div>
  </div>
</template>

<script setup>
defineEmits(['login'])
</script>

<style scoped>
.auth-page {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  overflow: hidden;
}

/* ── Ambient orbs ── */
.auth-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: orbFloat 12s ease-in-out infinite alternate;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: var(--accent);
  opacity: 0.06;
  top: -10%;
  left: -5%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: var(--purple);
  opacity: 0.05;
  bottom: -5%;
  right: -5%;
  animation-delay: -4s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: var(--blue);
  opacity: 0.04;
  top: 50%;
  right: 20%;
  animation-delay: -8s;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -20px) scale(1.1); }
  100% { transform: translate(-20px, 30px) scale(0.95); }
}

/* ── Card ── */
.auth-card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 56px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  min-width: 360px;
  animation: cardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardIn {
  0% { opacity: 0; transform: translateY(20px) scale(0.97); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── Logo ── */
.auth-logo {
  margin-bottom: 20px;
  animation: logoIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.auth-logo-img {
  width: 52px;
  height: 52px;
}

@keyframes logoIn {
  0% { opacity: 0; transform: scale(0.7); }
  60% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

/* ── Typography ── */
.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.8px;
  line-height: 1;
  margin: 0 0 6px;
  animation: fadeIn 0.5s ease 0.25s both;
}

.auth-subtitle {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  margin: 0;
  animation: fadeIn 0.5s ease 0.35s both;
}

/* ── Divider ── */
.auth-divider {
  width: 40px;
  height: 1px;
  background: var(--border);
  margin: 28px 0;
  animation: fadeIn 0.5s ease 0.4s both;
}

/* ── Sign-in button ── */
.auth-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-primary);
  animation: fadeIn 0.5s ease 0.5s both;
}

.auth-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-accent);
  box-shadow: 0 0 24px var(--accent-glow);
  transform: translateY(-1px);
}

.auth-btn:active {
  transform: translateY(0) scale(0.99);
}

.google-icon {
  flex-shrink: 0;
}

/* ── Footer ── */
.auth-footer {
  margin: 24px 0 0;
  font-size: 11px;
  color: var(--text-tertiary);
  letter-spacing: 0.2px;
  animation: fadeIn 0.5s ease 0.6s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
