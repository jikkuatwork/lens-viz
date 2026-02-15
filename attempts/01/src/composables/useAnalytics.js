const isDev = import.meta.env.DEV

const fetchOpts = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
}

async function postEvent(event) {
  try {
    await fetch('/api/events', {
      ...fetchOpts,
      method: 'POST',
      body: JSON.stringify(event),
    })
  } catch {
    // fail silently — analytics should never break the app
  }
}

export function useAnalytics() {
  function track(type, metadata = {}) {
    const event = {
      type,
      metadata,
      timestamp: Date.now(),
      url: window.location.href,
    }

    postEvent(event)

    if (isDev) {
      console.log('[analytics]', type, metadata)
    }
  }

  return { track }
}
