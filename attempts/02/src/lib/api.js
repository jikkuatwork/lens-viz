const API_ROOT = '/api'

async function parseResponse(response) {
  const payload = await response.json()
  if (!response.ok) {
    const message = payload?.error?.message || 'Request failed'
    throw new Error(message)
  }
  return payload
}

export async function fetchPipelineRuntime() {
  try {
    const response = await fetch(`${API_ROOT}/pipeline`, {
      headers: { Accept: 'application/json' }
    })
    return await parseResponse(response)
  } catch (error) {
    console.warn('[pipeline] runtime fetch fallback:', error.message)
    return null
  }
}
