var resource = request.path.replace('/api/', '').split('/')[0]

if (resource === 'me') {
  var user = fazt.auth.getUser()
  respond({ user: user })
} else if (resource === 'analytics') {
  respond(200, { ok: true })
} else {
  respond(404, { error: 'Not found' })
}
