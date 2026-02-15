import { computed, onMounted, ref } from 'vue'

const MOCK_USER_KEY = 'cx_lens_mock_user'

function isLocalHost() {
  const host = window.location.hostname
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.nip.io') ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    host.startsWith('172.')
  )
}

function safeParseUser(raw) {
  try {
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  async function checkAuth() {
    try {
      const response = await fetch('/api/me')
      if (response.ok) {
        const data = await response.json()
        user.value = data.user || null
      }
    } catch (e) {
      // network failure falls through to mock mode
    }

    if (!user.value && isLocalHost()) {
      const stored = localStorage.getItem(MOCK_USER_KEY)
      if (stored) {
        user.value = safeParseUser(stored)
      }
    }

    loading.value = false
  }

  function signInWithGoogle() {
    error.value = null

    if (isLocalHost()) {
      const mockUser = {
        id: 'mock-' + Date.now(),
        email: 'guest@lens.app',
        name: 'Guest User',
        picture: null,
        provider: 'mock-local'
      }
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
      user.value = mockUser
      return
    }

    const redirect = window.location.origin + '/#/slide/1'
    window.location.href = '/auth/login?provider=google&redirect=' + encodeURIComponent(redirect)
  }

  function signInDemo() {
    const mockUser = {
      id: 'mock-' + Date.now(),
      email: 'guest@lens.app',
      name: 'Guest User',
      picture: null,
      provider: 'mock-local'
    }
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
    user.value = mockUser
  }

  function signOut() {
    localStorage.removeItem(MOCK_USER_KEY)

    fetch('/auth/logout', { method: 'POST' }).finally(() => {
      user.value = null
    })
  }

  onMounted(checkAuth)

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signInWithGoogle,
    signInDemo,
    signOut,
    checkAuth
  }
}
