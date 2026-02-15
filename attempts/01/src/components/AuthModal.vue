<template>
  <div class="auth-overlay">
    <div class="auth-modal">
      <!-- Logo -->
      <div class="auth-logo">
        <svg width="32" height="32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="56" stroke="var(--accent)" stroke-width="2.5" opacity="0.3"/>
          <circle cx="60" cy="60" r="36" stroke="var(--accent)" stroke-width="2" opacity="0.5"/>
          <circle cx="60" cy="60" r="16" fill="var(--accent)" opacity="0.8"/>
          <line x1="60" y1="4" x2="60" y2="28" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
          <line x1="60" y1="92" x2="60" y2="116" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
          <line x1="4" y1="60" x2="28" y2="60" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
          <line x1="92" y1="60" x2="116" y2="60" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
        </svg>
        <span class="auth-logo-text">Lens</span>
      </div>

      <p class="auth-subtitle">AI Research Pipeline</p>

      <button class="auth-btn" @click="$emit('login')">
        Sign in to continue
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['login'])
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.auth-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 48px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(20px);
  min-width: 340px;
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-logo-text {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.auth-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: -12px;
  letter-spacing: 0.3px;
}

.auth-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-accent);
  background: var(--accent-dim);
  color: var(--accent);
}

.auth-btn:hover {
  background: var(--accent-subtle);
  border-color: var(--accent);
  box-shadow: 0 0 20px var(--accent-glow);
}
</style>
