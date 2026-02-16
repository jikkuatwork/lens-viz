import { ref, readonly, computed } from 'vue'

const user = ref(null)
const loading = ref(true)
const hasInviteAccess = ref(!!localStorage.getItem('lens_invite_access'))

// Match holm-sdk fetch defaults
const fetchOpts = { credentials: 'include', headers: { 'Accept': 'application/json' } }

export function useAuth() {
  async function checkSession() {
    loading.value = true
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      const res = await fetch('/api/me', { ...fetchOpts, signal: controller.signal })
      clearTimeout(timeout)
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          user.value = data.user
        }
      }
    } catch {
      user.value = null
    }
    loading.value = false
  }

  function login(redirect = location.href) {
    location.href = '/auth/login?redirect=' + encodeURIComponent(redirect)
  }

  async function logout() {
    try {
      await fetch('/auth/logout', {
        ...fetchOpts,
        method: 'POST',
        headers: { ...fetchOpts.headers, 'Content-Type': 'application/json' },
        body: '{}'
      })
    } catch {
      // Ignore network errors
    }
    user.value = null
    localStorage.removeItem('lens_invite_access')
    hasInviteAccess.value = false
    window.location.href = '/'
  }

  const appRole = computed(() => user.value?.appRole || null)
  const isAppAdmin = computed(() => appRole.value === 'app-admin')
  const needsInvite = computed(() => !!user.value && !appRole.value)
  const accessRequestStatus = computed(() => user.value?.accessRequestStatus || null)

  // Redeem invite code (public — works without auth)
  async function redeemInvite(code) {
    try {
      const res = await fetch('/api/invite/redeem', {
        ...fetchOpts,
        method: 'POST',
        headers: { ...fetchOpts.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.error || 'Invalid code' }
      // Store anonymous access in localStorage
      localStorage.setItem('lens_invite_access', data.code || code)
      hasInviteAccess.value = true
      // If user is signed in, re-fetch to get updated appRole
      if (user.value) await checkSession()
      return { success: true }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // Request access (authenticated users only)
  async function requestAccess() {
    try {
      const res = await fetch('/api/access/request', {
        ...fetchOpts,
        method: 'POST',
        headers: { ...fetchOpts.headers, 'Content-Type': 'application/json' },
        body: '{}'
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.error || 'Request failed' }
      // Re-fetch user to get updated accessRequestStatus
      await checkSession()
      return { success: true, status: data.status }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  checkSession()

  return {
    user: readonly(user),
    loading: readonly(loading),
    isLoggedIn: () => !!user.value,
    appRole,
    isAppAdmin,
    needsInvite,
    hasInviteAccess: readonly(hasInviteAccess),
    accessRequestStatus,
    login,
    logout,
    redeemInvite,
    requestAccess,
  }
}
