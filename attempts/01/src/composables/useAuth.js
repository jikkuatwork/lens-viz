import { ref, readonly } from 'vue'

const user = ref(null)
const loading = ref(true)

// Match fazt-sdk fetch defaults
const fetchOpts = { credentials: 'include', headers: { 'Accept': 'application/json' } }

export function useAuth() {
  async function checkSession() {
    loading.value = true
    for (let i = 0; i < 3; i++) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 3000)
        const res = await fetch('/api/me', { ...fetchOpts, signal: controller.signal })
        clearTimeout(timeout)
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            user.value = data.user
          }
          break
        }
        await new Promise(r => setTimeout(r, 500))
      } catch {
        if (i === 2) user.value = null
      }
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
    window.location.href = '/'
  }

  checkSession()

  return {
    user: readonly(user),
    loading: readonly(loading),
    isLoggedIn: () => !!user.value,
    login,
    logout,
  }
}
