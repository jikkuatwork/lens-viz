import { computed, onMounted, ref } from 'vue'

const MOCK_USER_KEY = 'cx_lens_mock_user'
const FETCH_HEADERS = { Accept: 'application/json' }

function isEnabled(value) {
  return value === '1' || value === 'true' || value === 'yes'
}

function hasMockQueryParam() {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('mockAuth') || params.get('mock-auth')
  if (!raw) return false
  return isEnabled(raw.toLowerCase())
}

function isLocalHost(hostname = window.location.hostname) {
  const host = String(hostname || '').toLowerCase()
  if (!host) return false

  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host === '[::1]'
  ) {
    return true
  }

  if (host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.nip.io')) {
    return true
  }

  if (host.startsWith('192.168.') || host.startsWith('10.')) {
    return true
  }

  const private172 = host.match(/^172\.(\d{1,3})\./)
  if (private172) {
    const secondOctet = Number(private172[1])
    if (Number.isInteger(secondOctet) && secondOctet >= 16 && secondOctet <= 31) {
      return true
    }
  }

  return false
}

function buildMockUser() {
  return {
    id: 'mock-' + Date.now(),
    email: 'guest@lens.app',
    name: 'Guest Presenter',
    picture: null,
    provider: 'mock-local'
  }
}

function resolveCanUseMockAuth() {
  if (isEnabled(String(import.meta.env.VITE_FORCE_MOCK_AUTH || '').toLowerCase())) {
    return true
  }

  if (isEnabled(String(import.meta.env.VITE_ALLOW_MOCK_AUTH || '').toLowerCase())) {
    return true
  }

  if (hasMockQueryParam()) {
    return true
  }

  return (
    isLocalHost()
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
  const mockAuthEnabled = ref(resolveCanUseMockAuth())

  const isAuthenticated = computed(() => !!user.value)
  const canUseMockAuth = computed(() => mockAuthEnabled.value)

  async function checkAuth() {
    loading.value = true
    error.value = null

    let timeout
    try {
      const controller = new AbortController()
      timeout = setTimeout(() => controller.abort(), 2800)
      const response = await fetch('/api/me', {
        credentials: 'include',
        headers: FETCH_HEADERS,
        signal: controller.signal
      })
      clearTimeout(timeout)

      if (response.ok) {
        const data = await response.json()
        user.value = data.user || null
      }
    } catch {
      // Network failure should still allow mock auth fallback.
    } finally {
      if (timeout) clearTimeout(timeout)
    }

    if (!user.value && canUseMockAuth.value) {
      const stored = localStorage.getItem(MOCK_USER_KEY)
      if (stored) {
        const parsed = safeParseUser(stored)
        if (parsed && typeof parsed === 'object') {
          user.value = parsed
        }
      }
    }

    loading.value = false
  }

  function signInWithGoogle() {
    error.value = null

    if (canUseMockAuth.value) {
      signInDemo()
      return
    }

    const redirect = window.location.origin + '/#/slide/1'
    window.location.href = '/auth/login?provider=google&redirect=' + encodeURIComponent(redirect)
  }

  function signInDemo() {
    if (!canUseMockAuth.value) {
      error.value = 'Presentation mode is disabled in this environment.'
      return
    }

    const mockUser = buildMockUser()
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
    user.value = mockUser
  }

  function signOut() {
    localStorage.removeItem(MOCK_USER_KEY)
    user.value = null

    fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: FETCH_HEADERS
    }).catch(() => {
      // Ignore logout endpoint failures in local/demo mode.
    })
  }

  onMounted(checkAuth)

  return {
    user,
    loading,
    error,
    isAuthenticated,
    canUseMockAuth,
    signInWithGoogle,
    signInDemo,
    signOut,
    checkAuth
  }
}
