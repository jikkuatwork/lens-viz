<template>
  <div class="auth-page">
    <div class="auth-orb orb-1" />
    <div class="auth-orb orb-2" />
    <div class="auth-orb orb-3" />

    <div class="auth-card">
      <div class="auth-logo">
        <img src="/assets/logo.svg" alt="Lens" class="auth-logo-img" />
      </div>

      <h1 class="auth-title">Access Required</h1>
      <p class="auth-subtitle">Signed in as {{ userEmail }}</p>

      <div class="auth-divider" />

      <!-- Request Access section -->
      <div v-if="!requestStatus" class="action-section">
        <button class="request-btn" @click="handleRequest" :disabled="requesting">
          <ShieldCheck :size="16" stroke-width="1.5" />
          <span>{{ requesting ? 'Requesting...' : 'Request Access' }}</span>
        </button>
        <Transition name="msg">
          <p v-if="requestError" class="error-msg">{{ requestError }}</p>
        </Transition>
      </div>

      <!-- Pending state -->
      <div v-else-if="requestStatus === 'pending'" class="status-section">
        <div class="status-badge status-pending">
          <Clock :size="14" stroke-width="1.5" />
          <span>Access requested — awaiting review</span>
        </div>
        <p class="status-hint">An admin will review your request.</p>
      </div>

      <!-- Denied state -->
      <div v-else-if="requestStatus === 'denied'" class="status-section">
        <div class="status-badge status-denied">
          <ShieldX :size="14" stroke-width="1.5" />
          <span>Access request denied</span>
        </div>
        <p class="status-hint">Contact an administrator for access.</p>
      </div>

      <!-- Invite code section -->
      <div class="section-label">
        <span class="label-line"></span>
        <span class="label-text">Have an invite code?</span>
        <span class="label-line"></span>
      </div>

      <form class="invite-form" @submit.prevent="handleRedeem">
        <div class="invite-row">
          <input
            ref="codeInput"
            v-model="code"
            class="invite-input"
            type="text"
            maxlength="8"
            placeholder="XXXXXXXX"
            :disabled="redeeming"
            autocomplete="off"
            spellcheck="false"
            @input="handleCodeInput"
          />
          <button
            class="invite-btn"
            type="submit"
            :disabled="code.length < 8 || redeeming"
          >
            <Ticket :size="14" stroke-width="1.5" />
            <span>{{ redeeming ? 'Checking...' : 'Redeem' }}</span>
          </button>
        </div>
        <Transition name="msg">
          <p v-if="codeError" class="error-msg">{{ codeError }}</p>
        </Transition>
      </form>

      <button class="sign-out-link" @click="$emit('logout')">
        Sign out
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { Ticket, ShieldCheck, Clock, ShieldX } from 'lucide-vue-next'

defineEmits(['logout'])

const user = inject('user')
const redeemInvite = inject('redeemInvite')
const requestAccessFn = inject('requestAccess')
const accessRequestStatus = inject('accessRequestStatus')

const userEmail = computed(() => user.value?.email || '')
const requestStatus = computed(() => accessRequestStatus.value)

// Request access
const requesting = ref(false)
const requestError = ref('')

async function handleRequest() {
  if (requesting.value) return
  requesting.value = true
  requestError.value = ''
  const result = await requestAccessFn()
  if (!result.success) {
    requestError.value = result.error
  }
  requesting.value = false
}

// Invite code
const code = ref('')
const codeError = ref('')
const redeeming = ref(false)

function handleCodeInput() {
  code.value = code.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  codeError.value = ''
}

async function handleRedeem() {
  if (code.value.length < 8 || redeeming.value) return
  redeeming.value = true
  codeError.value = ''
  const result = await redeemInvite(code.value)
  if (!result.success) {
    codeError.value = result.error
  }
  redeeming.value = false
}
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

.auth-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: orbFloat 12s ease-in-out infinite alternate;
}

.orb-1 {
  width: 400px; height: 400px;
  background: var(--accent); opacity: 0.06;
  top: -10%; left: -5%;
}
.orb-2 {
  width: 300px; height: 300px;
  background: var(--purple); opacity: 0.05;
  bottom: -5%; right: -5%;
  animation-delay: -4s;
}
.orb-3 {
  width: 250px; height: 250px;
  background: var(--blue); opacity: 0.04;
  top: 50%; right: 20%;
  animation-delay: -8s;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -20px) scale(1.1); }
  100% { transform: translate(-20px, 30px) scale(0.95); }
}

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

.auth-logo {
  margin-bottom: 20px;
  animation: logoIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}
.auth-logo-img { width: 52px; height: 52px; }

@keyframes logoIn {
  0% { opacity: 0; transform: scale(0.7); }
  60% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

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
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  margin: 0;
  animation: fadeIn 0.5s ease 0.35s both;
}

.auth-divider {
  width: 40px;
  height: 1px;
  background: var(--border);
  margin: 28px 0;
  animation: fadeIn 0.5s ease 0.4s both;
}

/* ── Request Access ── */
.action-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  animation: fadeIn 0.5s ease 0.5s both;
}

.request-btn {
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
  border: 1px solid var(--border-accent);
  background: var(--accent-dim);
  color: var(--accent);
}

.request-btn:hover:not(:disabled) {
  background: var(--accent-subtle);
  box-shadow: 0 0 24px var(--accent-glow);
  transform: translateY(-1px);
}

.request-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
}

.request-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Status ── */
.status-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  animation: fadeIn 0.5s ease 0.5s both;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
}

.status-pending {
  background: var(--orange-dim);
  color: var(--orange);
  border: 1px solid rgba(245, 158, 11, 0.15);
}

.status-denied {
  background: var(--rose-dim);
  color: var(--rose);
  border: 1px solid rgba(244, 63, 94, 0.15);
}

.status-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
}

/* ── Section label ── */
.section-label {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 24px 0 16px;
  animation: fadeIn 0.5s ease 0.55s both;
}

.label-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.label-text {
  font-size: 11px;
  color: var(--text-tertiary);
  white-space: nowrap;
  letter-spacing: 0.3px;
}

/* ── Invite code ── */
.invite-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fadeIn 0.5s ease 0.6s both;
}

.invite-row {
  display: flex;
  gap: 8px;
}

.invite-input {
  flex: 1;
  padding: 10px 12px;
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 4px;
  text-align: center;
  color: var(--text-primary);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
  transition: all 0.2s ease;
}

.invite-input::placeholder {
  color: var(--text-tertiary);
  letter-spacing: 4px;
  font-weight: 400;
}

.invite-input:focus {
  border-color: var(--border-accent);
  box-shadow: 0 0 16px var(--accent-glow);
}

.invite-input:disabled { opacity: 0.6; }

.invite-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-sm);
  background: var(--accent-dim);
  color: var(--accent);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.invite-btn:hover:not(:disabled) {
  background: var(--accent-subtle);
  box-shadow: 0 0 16px var(--accent-glow);
}

.invite-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.error-msg {
  font-size: 12px;
  color: var(--rose);
  margin: 0;
  text-align: center;
}

.msg-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.msg-leave-active { transition: opacity 0.15s ease; }
.msg-enter-from { opacity: 0; transform: translateY(-4px); }
.msg-leave-to { opacity: 0; }

/* ── Sign out ── */
.sign-out-link {
  margin-top: 20px;
  padding: 0;
  border: none;
  background: none;
  font-size: 12px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: color 0.2s ease;
  animation: fadeIn 0.5s ease 0.7s both;
}

.sign-out-link:hover {
  color: var(--accent);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
