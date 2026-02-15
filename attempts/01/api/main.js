// Fazt Serverless API
// Globals: request, respond, fazt.app.ds, fazt.app.kv, fazt.auth.*

var ds = fazt.app.ds
var user = fazt.auth.getUser()

// ─── Auth ────────────────────────────────────────────────────────────

if (request.path === '/api/me') {
  respond({ user: user })
}

// ─── Analytics Events ────────────────────────────────────────────────

else if (request.path === '/api/events' && request.method === 'POST') {
  var events = request.body.events || [request.body]
  var stored = []

  events.forEach(function(evt) {
    var record = {
      id: genId(),
      type: evt.type,
      metadata: evt.metadata || {},
      timestamp: evt.timestamp || Date.now(),
      url: evt.url,
      userId: user ? user.id : null,
      userAgent: request.headers['user-agent']
    }
    ds.insert('events', record)
    stored.push(record)
  })

  respond(201, { stored: stored.length })
}

else if (request.path === '/api/events' && request.method === 'GET') {
  var events = ds.find('events', {})
  respond({ events: events, total: events.length })
}

// ─── Analytics Summary ───────────────────────────────────────────────

else if (request.path === '/api/events/summary' && request.method === 'GET') {
  var allEvents = ds.find('events', {})
  var byType = {}

  allEvents.forEach(function(evt) {
    var t = evt.type || 'unknown'
    byType[t] = (byType[t] || 0) + 1
  })

  var recent = allEvents.slice(-10).reverse()

  respond({
    total: allEvents.length,
    byType: byType,
    recent: recent
  })
}

// ─── User Preferences ────────────────────────────────────────────────

else if (request.path === '/api/preferences' && request.method === 'GET') {
  if (!user) {
    respond({ preferences: {} })
  } else {
    var prefs = fazt.app.kv.get('prefs:' + user.id) || {}
    respond({ preferences: prefs })
  }
}

else if (request.path === '/api/preferences' && request.method === 'PUT') {
  if (!user) {
    respond(401, { error: 'Sign in required' })
  } else {
    var existing = fazt.app.kv.get('prefs:' + user.id) || {}
    var updates = request.body || {}
    // Merge updates into existing prefs
    var keys = Object.keys(updates)
    for (var i = 0; i < keys.length; i++) {
      existing[keys[i]] = updates[keys[i]]
    }
    fazt.app.kv.set('prefs:' + user.id, existing)
    respond({ preferences: existing })
  }
}

// ─── Fallback ────────────────────────────────────────────────────────

else {
  respond(404, { error: 'Not found' })
}

// ─── Helpers ─────────────────────────────────────────────────────────

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
