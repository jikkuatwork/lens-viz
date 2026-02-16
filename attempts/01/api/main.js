// Holm Serverless API
// Globals: request, respond, holm.app.ds, holm.app.kv, holm.auth.*

var ds = holm.app.ds
var user = holm.auth.getUser()

// ─── Helpers ─────────────────────────────────────────────────────────

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function getAppRole(u) {
  if (!u) return null
  var email = (u.email || '').toLowerCase()
  if (email.indexOf('@storybrain.com') !== -1 ||
      email.indexOf('@investigate.vc') !== -1) {
    return 'app-admin'
  }
  var allowed = ds.findOne('allowed_users', { email: email })
  if (allowed) return 'viewer'
  return null
}

function requireAppAdmin(u) {
  if (!u) { respond(401, { error: 'Auth required' }); return false }
  if (getAppRole(u) !== 'app-admin') { respond(403, { error: 'Admin access required' }); return false }
  return true
}

function generateCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  var code = ''
  for (var i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code
}

// ─── Auth ────────────────────────────────────────────────────────────

if (request.path === '/api/me') {
  if (!user) {
    respond({ user: null })
  } else {
    var role = getAppRole(user)
    var accessReq = null
    if (!role) {
      var req = ds.findOne('access_requests', { email: user.email.toLowerCase() })
      if (req) accessReq = req.status
    }
    respond({ user: {
      id: user.id, email: user.email, name: user.name,
      picture: user.picture, provider: user.provider,
      appRole: role,
      accessRequestStatus: accessReq
    }})
  }
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
      userEmail: user ? user.email : null,
      ip: request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || request.headers['cf-connecting-ip'] || null,
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
    var prefs = holm.app.kv.get('prefs:' + user.id) || {}
    respond({ preferences: prefs })
  }
}

else if (request.path === '/api/preferences' && request.method === 'PUT') {
  if (!user) {
    respond(401, { error: 'Sign in required' })
  } else {
    var existing = holm.app.kv.get('prefs:' + user.id) || {}
    var updates = request.body || {}
    var keys = Object.keys(updates)
    for (var i = 0; i < keys.length; i++) {
      existing[keys[i]] = updates[keys[i]]
    }
    holm.app.kv.set('prefs:' + user.id, existing)
    respond({ preferences: existing })
  }
}

// ─── Invite Code Redemption (public — no auth required) ─────────────

else if (request.path === '/api/invite/redeem' && request.method === 'POST') {
  var code = (request.body.code || '').toUpperCase().trim()
  if (!code) { respond(400, { error: 'Code is required' }) }
  else {
    var invite = ds.findOne('invite_codes', { code: code })
    if (!invite) { respond(400, { error: 'Invalid invite code' }) }
    else if (invite.usedBy) { respond(400, { error: 'Code already used' }) }
    else if (invite.revoked) { respond(400, { error: 'Code has been revoked' }) }
    else {
      var usedBy = user ? user.email : 'anonymous'
      ds.update('invite_codes', { id: invite.id }, {
        usedBy: usedBy,
        usedAt: Date.now()
      })
      // If authenticated, also whitelist the email
      if (user) {
        ds.insert('allowed_users', {
          id: genId(),
          email: user.email.toLowerCase(),
          inviteCode: code,
          addedAt: Date.now(),
          addedBy: 'invite'
        })
      }
      respond({ success: true, code: invite.code })
    }
  }
}

// ─── Access Request (authenticated) ─────────────────────────────────

else if (request.path === '/api/access/request' && request.method === 'POST') {
  if (!user) { respond(401, { error: 'Auth required' }) }
  else {
    var email = user.email.toLowerCase()
    var existing = ds.findOne('access_requests', { email: email })
    if (existing) {
      respond({ success: true, status: existing.status })
    } else {
      ds.insert('access_requests', {
        id: genId(),
        email: email,
        name: user.name || '',
        requestedAt: Date.now(),
        status: 'pending',
        reviewedBy: null,
        reviewedAt: null
      })
      respond(201, { success: true, status: 'pending' })
    }
  }
}

// ─── Admin: List Access Requests ─────────────────────────────────────

else if (request.path === '/api/admin/requests' && request.method === 'GET') {
  if (requireAppAdmin(user)) {
    var requests = ds.find('access_requests', {})
    respond({ requests: requests })
  }
}

// ─── Admin: Approve Access Request ───────────────────────────────────

else if (request.path === '/api/admin/requests/approve' && request.method === 'POST') {
  if (requireAppAdmin(user)) {
    var id = request.body.id
    if (!id) { respond(400, { error: 'Request id is required' }) }
    else {
      var req = ds.findOne('access_requests', { id: id })
      if (!req) { respond(404, { error: 'Request not found' }) }
      else {
        ds.update('access_requests', { id: id }, {
          status: 'approved',
          reviewedBy: user.email,
          reviewedAt: Date.now()
        })
        // Whitelist the user
        var alreadyAllowed = ds.findOne('allowed_users', { email: req.email })
        if (!alreadyAllowed) {
          ds.insert('allowed_users', {
            id: genId(),
            email: req.email,
            inviteCode: null,
            addedAt: Date.now(),
            addedBy: 'admin-approve:' + user.email
          })
        }
        respond({ success: true })
      }
    }
  }
}

// ─── Admin: Deny Access Request ──────────────────────────────────────

else if (request.path === '/api/admin/requests/deny' && request.method === 'POST') {
  if (requireAppAdmin(user)) {
    var id = request.body.id
    if (!id) { respond(400, { error: 'Request id is required' }) }
    else {
      var req = ds.findOne('access_requests', { id: id })
      if (!req) { respond(404, { error: 'Request not found' }) }
      else {
        ds.update('access_requests', { id: id }, {
          status: 'denied',
          reviewedBy: user.email,
          reviewedAt: Date.now()
        })
        respond({ success: true })
      }
    }
  }
}

// ─── Admin: List Invite Codes ────────────────────────────────────────

else if (request.path === '/api/admin/invites' && request.method === 'GET') {
  if (requireAppAdmin(user)) {
    var codes = ds.find('invite_codes', {})
    respond({ invites: codes })
  }
}

// ─── Admin: Generate Invite Codes ────────────────────────────────────

else if (request.path === '/api/admin/invites' && request.method === 'POST') {
  if (requireAppAdmin(user)) {
    var count = Math.min(Math.max(parseInt(request.body.count) || 1, 1), 20)
    var label = (request.body.label || '').trim()
    var created = []
    for (var i = 0; i < count; i++) {
      var invite = {
        id: genId(),
        code: generateCode(),
        label: label || null,
        createdBy: user.email,
        createdAt: Date.now(),
        usedBy: null,
        usedAt: null,
        revoked: false,
        revokedAt: null
      }
      ds.insert('invite_codes', invite)
      created.push(invite)
    }
    respond(201, { invites: created })
  }
}

// ─── Admin: Revoke Invite Code ───────────────────────────────────────

else if (request.path === '/api/admin/invites/revoke' && request.method === 'POST') {
  if (requireAppAdmin(user)) {
    var id = request.body.id
    if (!id) { respond(400, { error: 'Invite id is required' }) }
    else {
      var invite = ds.findOne('invite_codes', { id: id })
      if (!invite) { respond(404, { error: 'Invite not found' }) }
      else if (invite.usedBy) { respond(400, { error: 'Cannot revoke a used code' }) }
      else {
        ds.update('invite_codes', { id: id }, {
          revoked: true,
          revokedAt: Date.now()
        })
        respond({ success: true })
      }
    }
  }
}

// ─── Admin: Analytics ────────────────────────────────────────────────

else if (request.path === '/api/admin/analytics' && request.method === 'GET') {
  if (requireAppAdmin(user)) {
    var allEvents = ds.find('events', {})
    var limit = parseInt(request.query.limit) || 100
    var recent = allEvents.sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0) }).slice(0, limit)

    var byType = {}
    allEvents.forEach(function(evt) {
      var t = evt.type || 'unknown'
      byType[t] = (byType[t] || 0) + 1
    })

    respond({
      total: allEvents.length,
      byType: byType,
      events: recent
    })
  }
}

// ─── Debug: Headers ──────────────────────────────────────────────────

else if (request.path === '/api/debug/headers' && request.method === 'GET') {
  if (requireAppAdmin(user)) {
    respond({ headers: request.headers })
  }
}

// ─── Fallback ────────────────────────────────────────────────────────

else {
  respond(404, { error: 'Not found' })
}
