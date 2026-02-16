<template>
  <div class="admin-page">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ArrowLeft :size="16" stroke-width="1.5" />
          <span>Back to Lens</span>
        </button>
      </div>
      <div class="header-center">
        <span class="admin-badge">Admin</span>
      </div>
      <div class="header-right">
        <span class="admin-email">{{ userEmail }}</span>
      </div>
    </header>

    <!-- Tabs -->
    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'invites' }"
        @click="goTab('invites')"
      >
        <Ticket :size="14" stroke-width="1.5" />
        <span>Invite Codes</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'requests' }"
        @click="goTab('requests')"
      >
        <UserCheck :size="14" stroke-width="1.5" />
        <span>Requests</span>
        <span v-if="pendingCount > 0" class="tab-count">{{ pendingCount }}</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'analytics' }"
        @click="goTab('analytics')"
      >
        <BarChart3 :size="14" stroke-width="1.5" />
        <span>Analytics</span>
      </button>
    </div>

    <!-- Invite Codes Tab -->
    <div v-if="activeTab === 'invites'" class="tab-content">
      <div class="section-header">
        <h2 class="section-title">Invite Codes</h2>
        <div class="generate-row">
          <input
            v-model="inviteLabel"
            class="label-input"
            type="text"
            placeholder="Label (e.g. Client name)"
            maxlength="50"
          />
          <button class="generate-btn" @click="generateCode" :disabled="generating">
            <Plus :size="14" stroke-width="2" />
            <span>{{ generating ? 'Generating...' : 'Generate Code' }}</span>
          </button>
        </div>
      </div>

      <div v-if="invites.length === 0" class="empty-state">
        <Ticket :size="32" stroke-width="1" />
        <p>No invite codes yet</p>
        <span>Generate a code to invite external users</span>
      </div>

      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Label</th>
              <th>Status</th>
              <th>Created</th>
              <th>Used By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in sortedInvites" :key="inv.id">
              <td>
                <code class="code-cell" @click="copyCode(inv.code)" title="Click to copy">
                  {{ inv.code }}
                </code>
              </td>
              <td class="label-cell">{{ inv.label || '—' }}</td>
              <td>
                <span class="status-badge" :class="inviteStatus(inv).cls">
                  {{ inviteStatus(inv).label }}
                </span>
              </td>
              <td class="date-cell">{{ formatDate(inv.createdAt) }}</td>
              <td class="email-cell">{{ inv.usedBy || '—' }}</td>
              <td>
                <button
                  v-if="!inv.usedBy && !inv.revoked"
                  class="revoke-btn"
                  @click="revokeCode(inv.id)"
                >
                  Revoke
                </button>
                <span v-else class="action-na">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Requests Tab -->
    <div v-if="activeTab === 'requests'" class="tab-content">
      <div class="section-header">
        <h2 class="section-title">Access Requests</h2>
      </div>

      <div v-if="requestsLoading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="requests.length === 0" class="empty-state">
        <UserCheck :size="32" stroke-width="1" />
        <p>No access requests</p>
      </div>

      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Requested</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in sortedRequests" :key="req.id">
              <td class="email-cell">{{ req.email }}</td>
              <td>{{ req.name || '—' }}</td>
              <td class="date-cell">{{ formatDate(req.requestedAt) }}</td>
              <td>
                <span class="status-badge" :class="requestStatusCls(req.status)">
                  {{ req.status }}
                </span>
              </td>
              <td>
                <div v-if="req.status === 'pending'" class="action-btns">
                  <button class="approve-btn" @click="approveRequest(req.id)">Approve</button>
                  <button class="deny-btn" @click="denyRequest(req.id)">Deny</button>
                </div>
                <span v-else class="action-na">{{ req.reviewedBy ? 'by ' + req.reviewedBy : '—' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Analytics Tab -->
    <div v-if="activeTab === 'analytics'" class="tab-content">
      <div class="section-header">
        <h2 class="section-title">Analytics</h2>
      </div>

      <div v-if="analyticsLoading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>

      <template v-else>
        <!-- Stat Cards -->
        <div class="stat-cards">
          <div class="stat-card">
            <span class="stat-value">{{ analytics.total }}</span>
            <span class="stat-label">Total Events</span>
          </div>
          <div
            v-for="(count, type) in analytics.byType"
            :key="type"
            class="stat-card"
          >
            <span class="stat-value">{{ count }}</span>
            <span class="stat-label">{{ type }}</span>
          </div>
        </div>

        <!-- Slide Engagement -->
        <div v-if="slideEngagement.hasData" class="engagement-card">
          <h3 class="engagement-title">Slide Engagement</h3>
          <div class="engagement-table">
            <div class="engagement-header">
              <span class="eng-col-slide">Slide</span>
              <span class="eng-col-views">Views</span>
              <span class="eng-col-time">Avg Time</span>
              <span class="eng-col-bar"></span>
            </div>
            <div v-for="s in slideEngagement.slides" :key="s.index" class="engagement-row">
              <span class="eng-col-slide">{{ String(s.index + 1).padStart(2, '0') }}</span>
              <span class="eng-col-views">{{ s.views }}</span>
              <span class="eng-col-time">{{ s.views > 0 ? (s.avgMs / 1000).toFixed(1) + 's' : '\u2014' }}</span>
              <span class="eng-col-bar">
                <span class="eng-bar" :style="{ width: s.barPct + '%' }"></span>
              </span>
            </div>
          </div>
          <div class="engagement-footer">
            Drop-off: {{ slideEngagement.dropOffPct }}% reach slide 07
          </div>
        </div>

        <!-- Events Table -->
        <div v-if="analytics.events && analytics.events.length > 0" class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Event</th>
                <th>Device</th>
                <th>Invite Code</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="evt in analytics.events" :key="evt.id">
                <td class="date-cell">{{ formatDate(evt.timestamp) }}</td>
                <td class="email-cell">{{ evt.userEmail || '—' }}</td>
                <td><code class="event-type">{{ evt.type }}</code></td>
                <td class="device-cell" :title="evt.userAgent">{{ parseDevice(evt.userAgent) }}</td>
                <td class="mono-cell">
                  <template v-if="evt.metadata?.inviteCode">
                    <code>{{ evt.metadata.inviteCode }}</code>
                    <span v-if="inviteLabelMap[evt.metadata.inviteCode]" class="invite-label-hint">{{ inviteLabelMap[evt.metadata.inviteCode] }}</span>
                  </template>
                  <template v-else>—</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <BarChart3 :size="32" stroke-width="1" />
          <p>No events recorded yet</p>
        </div>
      </template>
    </div>

    <!-- Copied toast -->
    <Transition name="toast">
      <div v-if="showCopied" class="toast">Copied!</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Ticket, BarChart3, Plus, UserCheck } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const user = inject('user')
const appRole = inject('appRole')

const fetchOpts = { credentials: 'include', headers: { 'Accept': 'application/json' } }

const validTabs = ['invites', 'requests', 'analytics']
const activeTab = ref(validTabs.includes(route.params.tab) ? route.params.tab : 'invites')

watch(() => route.params.tab, (tab) => {
  if (validTabs.includes(tab)) {
    activeTab.value = tab
    if (tab === 'requests') loadRequests()
    if (tab === 'analytics') loadAnalytics()
  }
})

function goTab(tab) {
  router.replace('/admin/' + tab)
}
const invites = ref([])
const inviteLabel = ref('')
const generating = ref(false)
const showCopied = ref(false)

const requests = ref([])
const requestsLoading = ref(false)

const analytics = ref({ total: 0, byType: {}, events: [] })
const analyticsLoading = ref(false)

const userEmail = computed(() => user.value?.email || '')

const sortedInvites = computed(() =>
  [...invites.value].sort((a, b) => b.createdAt - a.createdAt)
)

const sortedRequests = computed(() =>
  [...requests.value].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return b.requestedAt - a.requestedAt
  })
)

const pendingCount = computed(() =>
  requests.value.filter(r => r.status === 'pending').length
)

const inviteLabelMap = computed(() => {
  const map = {}
  invites.value.forEach(inv => {
    if (inv.label) map[inv.code] = inv.label
  })
  return map
})

const slideEngagement = computed(() => {
  const events = analytics.value.events || []
  const navEvents = events.filter(e => e.type === 'stage_navigate' && e.metadata?.durationMs != null)

  // Group by 'from' slide
  const bySlide = {}
  for (const evt of navEvents) {
    const from = evt.metadata.from
    if (from == null) continue
    if (!bySlide[from]) bySlide[from] = { views: 0, totalMs: 0 }
    bySlide[from].views++
    bySlide[from].totalMs += evt.metadata.durationMs
  }

  // Build sorted array
  const slides = []
  let maxAvg = 0
  for (let i = 0; i < 7; i++) {
    const data = bySlide[i]
    if (data) {
      const avg = data.totalMs / data.views
      maxAvg = Math.max(maxAvg, avg)
      slides.push({ index: i, views: data.views, avgMs: avg })
    } else {
      slides.push({ index: i, views: 0, avgMs: 0 })
    }
  }
  slides.forEach(s => {
    s.barPct = maxAvg > 0 ? (s.avgMs / maxAvg) * 100 : 0
  })

  // Drop-off: unique sessions reaching each slide
  const allNavEvents = events.filter(e => e.type === 'stage_navigate')
  const sessionsPerSlide = {}
  for (let i = 0; i < 7; i++) sessionsPerSlide[i] = new Set()

  for (const evt of allNavEvents) {
    const session = evt.userEmail || 'anonymous'
    const stage = evt.metadata?.stage
    const from = evt.metadata?.from
    if (stage != null && sessionsPerSlide[stage]) sessionsPerSlide[stage].add(session)
    if (from != null && sessionsPerSlide[from]) sessionsPerSlide[from].add(session)
  }

  const viewEvents = events.filter(e => e.type === 'stage_view')
  for (const evt of viewEvents) {
    const session = evt.userEmail || 'anonymous'
    const stage = evt.metadata?.stage
    if (stage != null && sessionsPerSlide[stage]) sessionsPerSlide[stage].add(session)
  }

  const totalSessions = Math.max(1, sessionsPerSlide[0]?.size || 1)
  const lastSlideReach = sessionsPerSlide[6]?.size || 0
  const dropOffPct = Math.round((lastSlideReach / totalSessions) * 100)

  return { slides, dropOffPct, hasData: navEvents.length > 0 }
})

function requestStatusCls(status) {
  if (status === 'pending') return 'status-pending'
  if (status === 'approved') return 'status-approved'
  if (status === 'denied') return 'status-revoked'
  return ''
}

function inviteStatus(inv) {
  if (inv.revoked) return { label: 'Revoked', cls: 'status-revoked' }
  if (inv.usedBy) return { label: 'Used', cls: 'status-used' }
  return { label: 'Active', cls: 'status-active' }
}

function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function shortenUrl(url) {
  if (!url) return '—'
  try {
    const u = new URL(url)
    return u.pathname + u.hash
  } catch {
    return url
  }
}

function parseDevice(ua) {
  if (!ua) return '—'
  let browser = 'Unknown'
  if (ua.includes('Firefox/')) browser = 'Firefox'
  else if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browser = 'Chrome'
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari'

  let os = ''
  if (ua.includes('Mac OS X')) os = 'macOS'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  return os ? `${browser} / ${os}` : browser
}

function goBack() {
  router.push('/')
}

async function loadInvites() {
  try {
    const res = await fetch('/api/admin/invites', fetchOpts)
    if (res.ok) {
      const data = await res.json()
      invites.value = data.invites || []
    }
  } catch { /* ignore */ }
}

async function generateCode() {
  generating.value = true
  try {
    const res = await fetch('/api/admin/invites', {
      ...fetchOpts,
      method: 'POST',
      headers: { ...fetchOpts.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 1, label: inviteLabel.value })
    })
    if (res.ok) {
      inviteLabel.value = ''
      await loadInvites()
    }
  } catch { /* ignore */ }
  generating.value = false
}

async function revokeCode(id) {
  try {
    const res = await fetch('/api/admin/invites/revoke', {
      ...fetchOpts,
      method: 'POST',
      headers: { ...fetchOpts.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      await loadInvites()
    }
  } catch { /* ignore */ }
}

async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code)
    showCopied.value = true
    setTimeout(() => { showCopied.value = false }, 1500)
  } catch { /* ignore */ }
}

async function loadRequests() {
  requestsLoading.value = true
  try {
    const res = await fetch('/api/admin/requests', fetchOpts)
    if (res.ok) {
      const data = await res.json()
      requests.value = data.requests || []
    }
  } catch { /* ignore */ }
  requestsLoading.value = false
}

async function approveRequest(id) {
  try {
    const res = await fetch('/api/admin/requests/approve', {
      ...fetchOpts,
      method: 'POST',
      headers: { ...fetchOpts.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) await loadRequests()
  } catch { /* ignore */ }
}

async function denyRequest(id) {
  try {
    const res = await fetch('/api/admin/requests/deny', {
      ...fetchOpts,
      method: 'POST',
      headers: { ...fetchOpts.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) await loadRequests()
  } catch { /* ignore */ }
}

async function loadAnalytics() {
  analyticsLoading.value = true
  try {
    const res = await fetch('/api/admin/analytics?limit=200', fetchOpts)
    if (res.ok) {
      analytics.value = await res.json()
    }
  } catch { /* ignore */ }
  analyticsLoading.value = false
}

onMounted(() => {
  if (appRole.value !== 'app-admin') {
    router.replace('/')
    return
  }
  loadInvites()
  loadRequests()
  if (activeTab.value === 'analytics') loadAnalytics()
})
</script>

<style scoped>
.admin-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* ── Header ── */
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 24px;
  flex-shrink: 0;
  background: var(--bg-glass);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  min-width: 180px;
}

.header-right {
  justify-content: flex-end;
}

.header-center {
  display: flex;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-glass);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  border-color: var(--border-accent);
  color: var(--accent);
  background: var(--accent-subtle);
}

.admin-badge {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--accent-dim);
  border: 1px solid var(--border-accent);
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.admin-email {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* ── Tabs ── */
.tab-bar {
  display: flex;
  gap: 2px;
  padding: 8px 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--text-tertiary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--text-secondary);
  background: var(--bg-card);
}

.tab-btn.active {
  color: var(--accent);
  background: var(--accent-dim);
  border-color: var(--border-accent);
}

/* ── Tab Content ── */
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.generate-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.label-input {
  padding: 7px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font-sans);
  outline: none;
  width: 200px;
  transition: border-color 0.2s ease;
}

.label-input::placeholder {
  color: var(--text-tertiary);
}

.label-input:focus {
  border-color: var(--border-accent);
}

.label-cell {
  font-size: 12px;
  color: var(--text-secondary);
}

.generate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-sm);
  background: var(--accent-dim);
  color: var(--accent);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generate-btn:hover:not(:disabled) {
  background: var(--accent-subtle);
  box-shadow: 0 0 20px var(--accent-glow);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Table ── */
.table-wrap {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead {
  background: var(--bg-card);
}

.data-table th {
  padding: 10px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
}

.data-table td {
  padding: 10px 16px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-faint);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: var(--bg-card);
}

.code-cell {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--accent);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.15s ease;
}

.code-cell:hover {
  background: var(--accent-dim);
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.status-active {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--border-accent);
}

.status-used {
  background: var(--blue-dim);
  color: var(--blue);
  border: 1px solid rgba(59, 130, 246, 0.15);
}

.status-revoked {
  background: var(--rose-dim);
  color: var(--rose);
  border: 1px solid rgba(244, 63, 94, 0.15);
}

.status-pending {
  background: var(--orange-dim);
  color: var(--orange);
  border: 1px solid rgba(245, 158, 11, 0.15);
}

.status-approved {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--border-accent);
}

.date-cell {
  font-size: 12px;
  white-space: nowrap;
}

.email-cell {
  font-size: 12px;
}

.mono-cell {
  font-family: var(--font-mono);
  font-size: 11px;
}

.url-cell {
  font-family: var(--font-mono);
  font-size: 11px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.invite-label-hint {
  display: inline-block;
  margin-left: 6px;
  font-family: var(--font-sans);
  font-size: 10px;
  color: var(--text-tertiary);
  font-style: italic;
}

.device-cell {
  font-size: 11px;
  color: var(--text-tertiary);
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-type {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 2px 8px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-secondary);
}

.revoke-btn {
  padding: 4px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: none;
  color: var(--rose);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.revoke-btn:hover {
  background: var(--rose-dim);
  border-color: var(--rose);
}

.action-btns {
  display: flex;
  gap: 6px;
}

.approve-btn {
  padding: 4px 12px;
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-sm);
  background: var(--accent-dim);
  color: var(--accent);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.approve-btn:hover {
  background: var(--accent-subtle);
  box-shadow: 0 0 12px var(--accent-glow);
}

.deny-btn {
  padding: 4px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: none;
  color: var(--rose);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.deny-btn:hover {
  background: var(--rose-dim);
  border-color: var(--rose);
}

.action-na {
  color: var(--text-tertiary);
  font-size: 12px;
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--radius-full);
  background: var(--orange);
  color: #000;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

/* ── Stat Cards ── */
.stat-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 24px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  min-width: 120px;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: capitalize;
}

/* ── Engagement Card ── */
.engagement-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
}

.engagement-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.2px;
}

.engagement-table {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.engagement-header,
.engagement-row {
  display: grid;
  grid-template-columns: 56px 64px 80px 1fr;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}

.engagement-header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
  margin-bottom: 4px;
}

.engagement-header span {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.eng-col-slide {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
}

.eng-col-views {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  text-align: right;
}

.eng-col-time {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  text-align: right;
}

.eng-col-bar {
  position: relative;
  height: 8px;
  background: var(--bg-card);
  border-radius: 4px;
  overflow: hidden;
}

.eng-bar {
  display: block;
  height: 100%;
  background: var(--accent);
  border-radius: 4px;
  opacity: 0.6;
  transition: width 0.3s ease;
}

.engagement-footer {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-tertiary);
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.empty-state p {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 4px 0 0;
}

.empty-state span {
  font-size: 12px;
}

/* ── Loading ── */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 60px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px;
  background: var(--accent-dim);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  z-index: 200;
}

.toast-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(8px); }
.toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
