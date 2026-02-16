# Plan: Access Control, Invite Codes & Admin Panel

## Context

The app currently allows **any Google-authenticated user** full access. The client needs:
- Restrict to `@storybrain.com` and `@investigate.vc` emails (auto-admin)
- One-time invite codes for outside users (viewer access)
- Admin panel at `/admin` to manage codes + view analytics with IP/timestamp

Roles are determined **at the app layer** (email domain check in `api/main.js`), not via holm's instance-wide role system. The dev provider already supports testing by entering any email.

---

## Files to Modify (5)

| File | What changes |
|------|-------------|
| `api/main.js` | Add `getAppRole()`, enrich `/api/me`, add 5 admin endpoints, add IP to events |
| `src/composables/useAuth.js` | Expose `appRole`, `needsInvite`, `redeemInvite()` |
| `src/App.vue` | Add invite gate between auth gate and router-view, provide `appRole` |
| `src/router.js` | Add `/admin` route |
| `src/components/PipelineView.vue` | Add "Admin Panel" link in user dropdown for admins |

## Files to Create (2)

| File | Purpose |
|------|---------|
| `src/components/InviteGate.vue` | Invite code entry screen (mirrors AuthModal card style) |
| `src/pages/AdminPage.vue` | Two-tab admin panel (Invite Codes + Analytics) |

---

## Implementation Steps

### Step 1: Server-side access control (`api/main.js`)

**Add 3 helper functions** (after existing `genId()`):

```js
function getAppRole(user) {
  if (!user) return null
  var email = (user.email || '').toLowerCase()
  // Admin domains
  if (email.indexOf('@storybrain.com') !== -1 ||
      email.indexOf('@investigate.vc') !== -1) {
    return 'app-admin'
  }
  // Whitelisted via invite code
  var allowed = ds.findOne('allowed_users', { email: email })
  if (allowed) return 'viewer'
  return null
}

function requireAppAdmin(user) {
  if (!user) { respond(401, { error: 'Auth required' }); return false }
  if (getAppRole(user) !== 'app-admin') { respond(403, { error: 'Admin access required' }); return false }
  return true
}

function generateCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O, 1/I/L
  var code = ''
  for (var i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code
}
```

**Modify `/api/me`** — return enriched user with `appRole`:
```js
if (request.path === '/api/me') {
  if (!user) { respond({ user: null }) }
  else {
    respond({ user: {
      id: user.id, email: user.email, name: user.name,
      picture: user.picture, provider: user.provider,
      appRole: getAppRole(user)
    }})
  }
}
```

**Add IP to event storage** (existing `POST /api/events`):
```js
ip: request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || null,
userEmail: user ? user.email : null
```

**Add 5 new endpoints** (before the fallback block):

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/invite/redeem` | any user | Validate code, whitelist email, mark code used |
| GET | `/api/admin/invites` | app-admin | List all invite codes |
| POST | `/api/admin/invites` | app-admin | Generate 1-N codes (max 20) |
| POST | `/api/admin/invites/revoke` | app-admin | Revoke an unused code by id |
| GET | `/api/admin/analytics` | app-admin | Return events with limit param |

**Collections used:**
- `invite_codes`: `{ id, code, createdBy, createdAt, usedBy, usedAt, revoked, revokedAt }`
- `allowed_users`: `{ id, email, inviteCode, addedAt, addedBy }`

---

### Step 2: Auth composable (`src/composables/useAuth.js`)

Add to the composable (no structural changes to existing code):

```js
import { ref, readonly, computed } from 'vue'  // add computed

// After existing checkSession/login/logout:
const appRole = computed(() => user.value?.appRole || null)
const isAppAdmin = computed(() => appRole.value === 'app-admin')
const needsInvite = computed(() => user.value && !appRole.value)

async function redeemInvite(code) { ... }
// POSTs to /api/invite/redeem, re-fetches /api/me on success
// Returns { success, error }
```

Return all new values from the composable.

---

### Step 3: Invite gate in `App.vue`

Insert between auth gate (line 31-34) and main app (line 37):

```html
<!-- Auth gate -->
<AuthModal v-else-if="!user" @login="handleLogin" />

<!-- NEW: Invite code gate -->
<InviteGate v-else-if="needsInvite" @logout="handleLogout" />

<!-- Main app -->
<router-view v-else />
```

Script changes:
- Import `InviteGate`
- Destructure `needsInvite`, `appRole`, `redeemInvite` from `useAuth()`
- `provide('appRole', appRole)` and `provide('redeemInvite', redeemInvite)`
- Add `handleLogout` function

---

### Step 4: InviteGate component (`src/components/InviteGate.vue`)

New component matching AuthModal's visual style:
- Same `.auth-page`, ambient orbs, glass card layout
- Monospace 8-char input field (uppercase, letter-spaced)
- Submit button, error message display
- "Sign in with different account" link (triggers logout)
- Calls `redeemInvite()` via inject

---

### Step 5: Router (`src/router.js`)

Add one route:
```js
{ path: '/admin', name: 'admin', component: () => import('./pages/AdminPage.vue') }
```

No router guard needed — App.vue's gate handles unauthenticated/unauthorized users, AdminPage does an `appRole` check on mount and redirects non-admins.

---

### Step 6: Admin page (`src/pages/AdminPage.vue`)

Two-tab panel with glass-card styling:

**Header**: Back to Lens button, admin badge, user email
**Tab 1 — Invite Codes**:
- Generate button (creates 1 code)
- Table: Code (mono), Status badge (Active/Used/Revoked), Created date, Used By, Revoke action
- Empty state when no codes

**Tab 2 — Analytics**:
- Summary stat cards (total events, breakdown by type)
- Events table: Timestamp, User email, Event type, IP, URL

Icons from `lucide-vue-next`: `ArrowLeft`, `Ticket`, `BarChart3`, `Plus`
Scoped CSS using existing app CSS variables (`.glass-card`, `--accent`, `--border`, etc.)

---

### Step 7: Admin link in PipelineView dropdown

In `PipelineView.vue` dropdown menu (after theme toggle, before sign out):

```html
<button v-if="isAppAdmin" class="dropdown-item" @click="goToAdmin">
  <Settings :size="14" stroke-width="1.5" />
  <span>Admin</span>
</button>
```

Inject `appRole`, compute `isAppAdmin`, import `Settings` from lucide.

---

## Verification

### Deploy & test via dev provider:

```bash
holm @local app deploy ./attempts/01 --name lens-pipeline-viz --spa
```

1. **Admin flow**: Dev login as `test@storybrain.com` → sees app → dropdown has "Admin" → `/admin` shows invite codes + analytics tabs → generate code → copy code
2. **Invite flow**: Dev login as `viewer@gmail.com` → sees invite gate → paste code → gate lifts → sees presentation → no Admin in dropdown
3. **Unauthorized flow**: Dev login as `random@other.com` → sees invite gate → bad code shows error
4. **Viewer blocked from admin**: As viewer, navigate to `/admin` → redirected to `/`
5. **Revoke**: As admin, revoke an unused code → code shows "Revoked" badge
6. **Analytics**: As admin, click Analytics tab → see events with timestamps and emails
7. **Theme**: Verify invite gate + admin page respect light/dark mode

### API verification via holm test:

```bash
holm test create-user --email "admin@storybrain.com" --name "Admin"
holm test run attempts/01/api/main.js /api/me -u admin@storybrain.com
# Expect: appRole: 'app-admin'

holm test run attempts/01/api/main.js /api/admin/invites -X POST \
  -d '{"count":1}' -u admin@storybrain.com
# Expect: 201, code generated

holm test run attempts/01/api/main.js /api/me -u viewer@gmail.com
# Expect: appRole: null
```
