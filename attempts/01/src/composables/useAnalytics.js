const STORAGE_KEY = 'lens_analytics'
const MAX_EVENTS = 100
const isDev = import.meta.env.DEV

function getStoredEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function storeEvent(event) {
  const events = getStoredEvents()
  events.push(event)
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

async function postEvent(event) {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(event),
    })
  } catch {
    // fail silently
  }
}

export function useAnalytics() {
  function track(name, properties = {}) {
    const event = {
      name,
      properties,
      timestamp: new Date().toISOString(),
    }

    storeEvent(event)
    postEvent(event)

    if (isDev) {
      console.log('[analytics]', name, properties)
    }
  }

  return { track }
}
