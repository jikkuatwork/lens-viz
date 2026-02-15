<template>
  <div class="stage-vector" :class="{ active }">
    <!-- Full-width canvas wrapper -->
    <div class="vector-canvas">

      <!-- Tab pills overlay -->
      <div class="tab-bar">
        <button
          v-for="(tab, i) in tabs"
          :key="tab.id"
          class="tab-pill"
          :class="{ active: activeTab === i }"
          @click="switchTab(i)"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <!-- Auto-progress bar inside active tab -->
          <span
            v-if="activeTab === i"
            class="tab-progress"
            :style="{ animationDuration: tabDuration + 'ms' }"
            :key="'prog-' + tabCycleKey"
          />
        </button>
        <span class="tab-indicator" :style="indicatorStyle" />
      </div>

      <!-- SVG Canvas -->
      <svg class="space-svg" viewBox="0 0 700 420" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- Cluster glow gradients (one per cluster, colored) -->
          <radialGradient v-for="(c, i) in clusters" :key="'cg-'+i" :id="'clusterGlow-'+i" cx="50%" cy="50%" r="50%">
            <stop offset="0%" :stop-color="c.color" stop-opacity="0.12"/>
            <stop offset="100%" :stop-color="c.color" stop-opacity="0"/>
          </radialGradient>
          <!-- Search ripple gradient -->
          <radialGradient id="searchRippleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="var(--purple)" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="var(--purple)" stop-opacity="0"/>
          </radialGradient>
          <!-- Filter boundary gradient -->
          <linearGradient id="filterBoundaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="var(--purple)" stop-opacity="0.2"/>
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <g opacity="0.04">
          <line v-for="n in 14" :key="'v'+n" :x1="n * 50" y1="0" :x2="n * 50" y2="420" stroke="currentColor" stroke-width="0.5"/>
          <line v-for="n in 8" :key="'h'+n" x1="0" :y1="n * 50" x2="700" :y2="n * 50" stroke="currentColor" stroke-width="0.5"/>
        </g>

        <!-- Cluster region glows -->
        <circle
          v-for="(c, i) in clusters"
          :key="'cbg-'+i"
          :cx="c.x" :cy="c.y" :r="c.r"
          :fill="'url(#clusterGlow-'+i+')'"
          class="cluster-region"
          :style="{
            opacity: clusterGlowOpacity,
            transition: 'opacity 0.8s ease',
          }"
        />

        <!-- Cluster region breathing ring -->
        <circle
          v-for="(c, i) in clusters"
          :key="'cring-'+i"
          :cx="c.x" :cy="c.y" :r="c.r"
          fill="none"
          :stroke="c.color"
          stroke-width="0.5"
          class="cluster-ring"
          :style="{
            opacity: clusterGlowOpacity * 0.3,
            transition: 'opacity 0.8s ease',
          }"
        />

        <!-- Point trails (cluster migration) -->
        <circle
          v-for="(t, i) in visibleTrails"
          :key="'trail-'+i"
          :cx="t.x" :cy="t.y" :r="t.r"
          :fill="t.color"
          class="point-trail"
          :style="{ opacity: t.opacity }"
        />

        <!-- Filter boundary path -->
        <path
          v-if="filterBoundaryD"
          :d="filterBoundaryD"
          fill="none"
          stroke="url(#filterBoundaryGrad)"
          stroke-width="1.5"
          stroke-linejoin="round"
          class="filter-boundary"
          :style="{
            opacity: filterBoundaryOpacity,
            transition: 'opacity 0.6s ease',
          }"
        />

        <!-- Bezier connection curves (Search tab) -->
        <path
          v-for="(conn, i) in bezierConnections"
          :key="'bz-'+i"
          :d="conn.d"
          fill="none"
          stroke="var(--purple)"
          stroke-width="1.2"
          stroke-linecap="round"
          class="bezier-conn"
          :style="{
            opacity: conn.opacity,
            strokeDasharray: conn.dashLen,
            strokeDashoffset: conn.dashOffset,
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
            transitionDelay: (i * 0.12) + 's',
          }"
        />

        <!-- Search ripple rings -->
        <g v-if="showSearchPoint">
          <circle
            v-for="r in 3" :key="'ripple-'+r"
            :cx="searchPoint.x" :cy="searchPoint.y"
            :r="10"
            fill="none"
            stroke="var(--purple)"
            stroke-width="1"
            class="ripple-ring"
            :style="{
              animationDelay: ((r - 1) * 0.4) + 's',
              opacity: searchPointOpacity,
            }"
          />
          <!-- Search glow -->
          <circle :cx="searchPoint.x" :cy="searchPoint.y" r="40" fill="url(#searchRippleGlow)"
            :style="{ opacity: searchPointOpacity, transition: 'opacity 0.4s ease' }"
          />
          <!-- Search dot -->
          <circle :cx="searchPoint.x" :cy="searchPoint.y" r="6" fill="var(--purple)"
            class="search-dot"
            :style="{ opacity: searchPointOpacity, transition: 'opacity 0.4s ease' }"
          />
          <!-- Spinning dashed ring -->
          <circle :cx="searchPoint.x" :cy="searchPoint.y" r="18" fill="none"
            stroke="var(--purple)" stroke-width="1" stroke-dasharray="3 3"
            class="search-ring-spin"
            :style="{ opacity: searchPointOpacity * 0.5, transition: 'opacity 0.4s ease' }"
          />
        </g>

        <!-- Search query label -->
        <text
          v-if="showSearchLabel"
          :x="searchPoint.x" :y="searchPoint.y - 28"
          text-anchor="middle"
          fill="var(--purple)"
          font-size="11"
          font-weight="500"
          class="search-query-text"
          :style="{ fontFamily: 'var(--font-mono)' }"
        >{{ searchLabelText }}</text>

        <!-- All 60 data points (always rendered) -->
        <g v-for="(p, i) in points" :key="'pt-'+i">
          <!-- Glow ring for highlighted points -->
          <circle
            v-if="p.glowR > 0"
            :cx="p.cx" :cy="p.cy"
            :r="p.glowR"
            fill="none"
            :stroke="p.fill"
            stroke-width="1"
            class="point-glow-ring"
            :style="{
              opacity: p.glowOpacity,
              transition: 'cx 1s cubic-bezier(0.16,1,0.3,1), cy 1s cubic-bezier(0.16,1,0.3,1), r 0.6s ease, opacity 0.6s ease',
              transitionDelay: (i * 0.015) + 's',
            }"
          />
          <!-- Main point -->
          <circle
            :cx="p.cx" :cy="p.cy"
            :r="p.r"
            :fill="p.fill"
            :opacity="p.opacity"
            class="data-point"
            :style="{
              transition: 'cx 1s cubic-bezier(0.16,1,0.3,1), cy 1s cubic-bezier(0.16,1,0.3,1), r 0.5s ease, opacity 0.5s ease, fill 0.4s ease',
              transitionDelay: (i * 0.015) + 's',
            }"
          />
        </g>

        <!-- Cluster Labels -->
        <text
          v-for="(c, i) in clusters"
          :key="'clbl-'+i"
          :x="c.x" :y="c.y + c.r + 18"
          text-anchor="middle"
          fill="var(--text-secondary)"
          font-size="10"
          font-weight="500"
          :style="{
            fontFamily: 'var(--font-sans)',
            opacity: clusterLabelOpacity,
            transition: 'opacity 0.5s ease',
          }"
        >{{ c.label }}</text>
      </svg>

      <!-- Search results overlay (bottom-right) -->
      <div class="search-results-overlay" :class="{ visible: showSearchResults }">
        <div class="sr-header">Top Results</div>
        <div class="sr-item" v-for="(r, i) in searchResults" :key="'sr-'+i" :style="{ transitionDelay: (i * 0.08) + 's' }">
          <span class="sr-rank">{{ i + 1 }}</span>
          <span class="sr-name">{{ r.name }}</span>
          <span class="sr-score">{{ r.score }}</span>
        </div>
      </div>

      <!-- Filter pills overlay (top-right) -->
      <div class="filter-pills-overlay" :class="{ visible: showFilterPills }">
        <div
          v-for="(f, i) in filterPills"
          :key="'fp-'+i"
          class="filter-pill"
          :class="{ visible: visibleFilterCount > i }"
          :style="{ transitionDelay: (i * 0.15) + 's' }"
        >
          <span class="fp-dot" :style="{ background: f.color }"/>
          <span>{{ f.label }}</span>
        </div>
      </div>

      <!-- Stats overlay (bottom) -->
      <div class="stats-overlay" :class="{ visible: showStats }">
        <span class="stats-text">{{ currentStats }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  active: Boolean,
  stageIndex: Number,
})

// ── Constants ──
const TAB_DURATION = 6000
const POINT_COUNT = 60
const SVG_W = 700
const SVG_H = 420

const tabs = [
  { id: 'cluster', label: 'Cluster' },
  { id: 'search', label: 'Search' },
  { id: 'filter', label: 'Filter' },
]

const clusters = [
  { x: 140, y: 140, r: 65, label: 'Maritime Tech', color: 'var(--accent)' },
  { x: 350, y: 110, r: 55, label: 'Clean Energy', color: 'var(--blue)' },
  { x: 540, y: 150, r: 50, label: 'Offshore', color: 'var(--cyan)' },
  { x: 200, y: 310, r: 50, label: 'Safety & Risk', color: 'var(--orange)' },
  { x: 460, y: 300, r: 55, label: 'Logistics AI', color: 'var(--purple)' },
]

const clusterColors = [
  'var(--accent)', 'var(--blue)', 'var(--cyan)', 'var(--orange)', 'var(--purple)',
]

const searchPoint = { x: 200, y: 185 }

const searchResults = [
  { name: 'Orca AI', score: '0.94' },
  { name: 'Windward', score: '0.91' },
  { name: 'Sea Machines', score: '0.89' },
  { name: 'Greywing', score: '0.86' },
  { name: 'Spire Maritime', score: '0.82' },
]

const filterPills = [
  { label: 'Maritime Tech', color: 'var(--accent)' },
  { label: 'Series A+', color: 'var(--purple)' },
  { label: 'Europe', color: 'var(--blue)' },
]

const sizes = [3, 4, 5]  // Point size variation

// ── Reactive State ──
const activeTab = ref(0)
const tabCycleKey = ref(0)
const tabDuration = ref(TAB_DURATION)

// Phase control
const clusterGlowOpacity = ref(0)
const clusterLabelOpacity = ref(0)
const showSearchPoint = ref(false)
const searchPointOpacity = ref(0)
const showSearchLabel = ref(false)
const searchLabelText = ref('')
const showSearchResults = ref(false)
const showFilterPills = ref(false)
const visibleFilterCount = ref(0)
const filterBoundaryOpacity = ref(0)
const showStats = ref(false)
const currentStats = ref('')

// Trails for cluster migration effect
const trails = ref([])
const visibleTrails = computed(() => trails.value)

// ── Point Generation ──
function generateScatteredPositions() {
  const pts = []
  for (let i = 0; i < POINT_COUNT; i++) {
    pts.push({
      x: 40 + Math.random() * (SVG_W - 80),
      y: 40 + Math.random() * (SVG_H - 80),
    })
  }
  return pts
}

function generateClusteredPositions() {
  const pts = []
  for (let i = 0; i < POINT_COUNT; i++) {
    const ci = i % clusters.length
    const c = clusters[ci]
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * c.r * 0.75
    pts.push({
      x: c.x + Math.cos(angle) * dist,
      y: c.y + Math.sin(angle) * dist,
    })
  }
  return pts
}

const scatteredPos = generateScatteredPositions()
const clusteredPos = generateClusteredPositions()

// Determine which points match the filter (cluster 0 = Maritime Tech, plus some)
const filterMatchIndices = new Set()
for (let i = 0; i < POINT_COUNT; i++) {
  const ci = i % clusters.length
  // Maritime Tech cluster + a few from Safety & Risk
  if (ci === 0 || (ci === 3 && i % 3 === 0)) {
    filterMatchIndices.add(i)
  }
}

// Search: find 5 nearest to searchPoint in clustered positions
const searchHighlightIndices = (() => {
  const dists = clusteredPos.map((p, i) => ({
    i,
    d: Math.hypot(p.x - searchPoint.x, p.y - searchPoint.y),
  }))
  dists.sort((a, b) => a.d - b.d)
  return new Set(dists.slice(0, 5).map(d => d.i))
})()

// Points reactive array — always 60 elements
const points = reactive(
  Array.from({ length: POINT_COUNT }, (_, i) => {
    const ci = i % clusters.length
    return {
      cx: scatteredPos[i].x,
      cy: scatteredPos[i].y,
      r: sizes[i % 3],
      fill: clusterColors[ci],
      opacity: 0,
      glowR: 0,
      glowOpacity: 0,
    }
  })
)

// ── Bezier Connections (Search) ──
const bezierConnectionsRaw = ref([])
const bezierConnections = computed(() => bezierConnectionsRaw.value)

function computeBezierPath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const perpX = -dy * 0.25
  const perpY = dx * 0.25
  const cp1x = x1 + dx * 0.3 + perpX * 0.5
  const cp1y = y1 + dy * 0.3 + perpY * 0.5
  const cp2x = x1 + dx * 0.7 - perpX * 0.3
  const cp2y = y1 + dy * 0.7 - perpY * 0.3
  return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`
}

// ── Filter Boundary (convex hull) ──
const filterBoundaryD = ref('')

function convexHull(pointsList) {
  if (pointsList.length < 3) return pointsList
  const sorted = [...pointsList].sort((a, b) => a.x - b.x || a.y - b.y)
  const cross = (O, A, B) => (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x)
  const lower = []
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop()
    lower.push(p)
  }
  const upper = []
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop()
    upper.push(p)
  }
  upper.pop()
  lower.pop()
  return lower.concat(upper)
}

function computeFilterBoundary() {
  const matchPts = []
  for (const idx of filterMatchIndices) {
    matchPts.push({ x: points[idx].cx, y: points[idx].cy })
  }
  if (matchPts.length < 3) { filterBoundaryD.value = ''; return }
  const hull = convexHull(matchPts)
  if (hull.length < 3) { filterBoundaryD.value = ''; return }

  // Expand hull slightly for padding
  const cx = hull.reduce((s, p) => s + p.x, 0) / hull.length
  const cy = hull.reduce((s, p) => s + p.y, 0) / hull.length
  const expanded = hull.map(p => ({
    x: p.x + (p.x - cx) * 0.15,
    y: p.y + (p.y - cy) * 0.15,
  }))

  // Smooth path using cardinal spline approximation
  const pts = [...expanded, expanded[0], expanded[1]]
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < expanded.length; i++) {
    const p0 = pts[i === 0 ? expanded.length - 1 : i - 1]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  filterBoundaryD.value = d
}

// ── Tab indicator ──
const indicatorStyle = computed(() => {
  const el = tabRefs.value[activeTab.value]
  if (!el) return { left: '0px', width: '0px' }
  return {
    left: el.offsetLeft + 'px',
    width: el.offsetWidth + 'px',
  }
})

const tabRefs = ref([])

// ── Timer Management ──
let timers = []
let cycleTimer = null

function clearTimers() {
  timers.forEach(t => {
    if (typeof t === 'number') clearTimeout(t)
    else if (t?.clear) t.clear()
  })
  timers = []
  if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null }
}

function delay(ms) {
  return new Promise(resolve => {
    const id = setTimeout(resolve, ms)
    timers.push(id)
  })
}

// ── Tab Animations ──

function resetPointsToScattered(instant = false) {
  for (let i = 0; i < POINT_COUNT; i++) {
    points[i].cx = scatteredPos[i].x
    points[i].cy = scatteredPos[i].y
    points[i].r = sizes[i % 3]
    points[i].fill = clusterColors[i % clusters.length]
    points[i].opacity = 0.6
    points[i].glowR = 0
    points[i].glowOpacity = 0
  }
}

function movePointsToClustered() {
  // Create trails for migration effect
  const newTrails = []
  for (let i = 0; i < POINT_COUNT; i++) {
    // Leave a trail at the old position
    newTrails.push({
      x: points[i].cx,
      y: points[i].cy,
      r: points[i].r * 0.6,
      color: points[i].fill,
      opacity: 0.25,
    })
  }
  trails.value = newTrails
  // Fade trails
  setTimeout(() => {
    trails.value = trails.value.map(t => ({ ...t, opacity: 0.08 }))
  }, 500)
  setTimeout(() => {
    trails.value = []
  }, 1400)

  for (let i = 0; i < POINT_COUNT; i++) {
    points[i].cx = clusteredPos[i].x
    points[i].cy = clusteredPos[i].y
    points[i].r = sizes[i % 3]
    points[i].opacity = 0.6
  }
}

function setPointsClustered() {
  for (let i = 0; i < POINT_COUNT; i++) {
    points[i].cx = clusteredPos[i].x
    points[i].cy = clusteredPos[i].y
    points[i].r = sizes[i % 3]
    points[i].fill = clusterColors[i % clusters.length]
    points[i].opacity = 0.6
    points[i].glowR = 0
    points[i].glowOpacity = 0
  }
}

async function animateClusterTab() {
  // Phase A: Points already scattered + visible
  resetPointsToScattered()
  await nextTick()

  // Phase B: Cluster glows fade in
  await delay(500)
  clusterGlowOpacity.value = 1

  // Phase C: Points migrate to clusters
  await delay(300)
  movePointsToClustered()

  // Phase D: Cluster labels
  await delay(1000)
  clusterLabelOpacity.value = 1

  // Stats
  currentStats.value = '1,532 vectors · 5 clusters · 1536 dimensions'
  showStats.value = true
}

async function animateSearchTab() {
  // Phase A: Points in clustered positions
  setPointsClustered()
  clusterGlowOpacity.value = 0.5
  clusterLabelOpacity.value = 0
  await nextTick()

  // Phase B: Search query typewriter
  await delay(300)
  showSearchLabel.value = true
  const fullQuery = '"maritime AI safety"'
  searchLabelText.value = ''
  for (let i = 0; i <= fullQuery.length; i++) {
    await delay(40)
    searchLabelText.value = fullQuery.slice(0, i)
  }

  // Phase C: Search point drops in with ripple
  await delay(100)
  showSearchPoint.value = true
  searchPointOpacity.value = 1

  // Phase D: Bezier curves to 5 nearest
  await delay(400)
  const conns = []
  for (const idx of searchHighlightIndices) {
    const p = points[idx]
    const pathD = computeBezierPath(searchPoint.x, searchPoint.y, p.cx, p.cy)
    const len = 300  // approximate
    conns.push({ d: pathD, dashLen: len, dashOffset: 0, opacity: 0.45 })
  }
  bezierConnectionsRaw.value = conns

  // Phase E: Highlight 5 nearest, dim others
  await delay(200)
  for (let i = 0; i < POINT_COUNT; i++) {
    if (searchHighlightIndices.has(i)) {
      points[i].fill = 'var(--purple)'
      points[i].r = 7
      points[i].opacity = 1
      points[i].glowR = 14
      points[i].glowOpacity = 0.4
    } else {
      points[i].opacity = 0.15
    }
  }

  // Phase F: Results list
  await delay(600)
  showSearchResults.value = true

  // Stats
  currentStats.value = '5 results · cosine similarity · <15ms latency'
  showStats.value = true
}

async function animateFilterTab() {
  // Phase A: Points clustered, full opacity
  setPointsClustered()
  clusterGlowOpacity.value = 0.5
  clusterLabelOpacity.value = 0
  await nextTick()

  // Phase B: Filter pills animate in
  await delay(300)
  showFilterPills.value = true
  for (let i = 0; i < filterPills.length; i++) {
    await delay(250)
    visibleFilterCount.value = i + 1
  }

  // Phase C: Non-matching shrink & dim, matching glow
  await delay(300)
  for (let i = 0; i < POINT_COUNT; i++) {
    if (filterMatchIndices.has(i)) {
      points[i].opacity = 1
      points[i].r = 6
      points[i].glowR = 12
      points[i].glowOpacity = 0.35
      points[i].fill = 'var(--accent)'
    } else {
      points[i].r = 2
      points[i].opacity = 0.1
      points[i].glowR = 0
      points[i].glowOpacity = 0
    }
  }

  // Phase D: Convex boundary
  await delay(500)
  computeFilterBoundary()
  filterBoundaryOpacity.value = 0.6

  // Stats
  currentStats.value = '127 of 1,532 · 3 active filters · 94% confidence'
  showStats.value = true
}

// ── Tab Switching ──

function resetOverlays() {
  clusterGlowOpacity.value = 0
  clusterLabelOpacity.value = 0
  showSearchPoint.value = false
  searchPointOpacity.value = 0
  showSearchLabel.value = false
  searchLabelText.value = ''
  showSearchResults.value = false
  showFilterPills.value = false
  visibleFilterCount.value = 0
  filterBoundaryOpacity.value = 0
  filterBoundaryD.value = ''
  bezierConnectionsRaw.value = []
  trails.value = []
  showStats.value = false
}

async function runTab(tabIndex) {
  clearTimers()
  resetOverlays()

  // Make points visible at current positions first
  for (let i = 0; i < POINT_COUNT; i++) {
    points[i].opacity = 0.6
    points[i].r = sizes[i % 3]
    points[i].fill = clusterColors[i % clusters.length]
    points[i].glowR = 0
    points[i].glowOpacity = 0
  }

  await nextTick()

  switch (tabIndex) {
    case 0: await animateClusterTab(); break
    case 1: await animateSearchTab(); break
    case 2: await animateFilterTab(); break
  }
}

function switchTab(index) {
  activeTab.value = index
  tabCycleKey.value++
  runTab(index)
  startCycleTimer()
}

function startCycleTimer() {
  if (cycleTimer) clearInterval(cycleTimer)
  cycleTimer = setInterval(() => {
    const next = (activeTab.value + 1) % tabs.length
    activeTab.value = next
    tabCycleKey.value++
    runTab(next)
  }, TAB_DURATION)
}

// ── Lifecycle ──

function startAnimation() {
  // Initial: show points scattered
  for (let i = 0; i < POINT_COUNT; i++) {
    points[i].cx = scatteredPos[i].x
    points[i].cy = scatteredPos[i].y
    points[i].opacity = 0
  }
  // Fade in points
  setTimeout(() => {
    for (let i = 0; i < POINT_COUNT; i++) {
      points[i].opacity = 0.6
    }
  }, 200)
  // Start first tab
  setTimeout(() => {
    runTab(0)
    startCycleTimer()
  }, 400)
}

function stopAnimation() {
  clearTimers()
  resetOverlays()
}

watch(() => props.active, (val) => {
  if (val) startAnimation()
  else stopAnimation()
}, { immediate: true })

onUnmounted(() => {
  clearTimers()
})
</script>

<style scoped>
.stage-vector {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* ── Full-width Canvas ── */
.vector-canvas {
  position: relative;
  width: 100%;
  max-width: 740px;
  aspect-ratio: 700 / 460;
  background: var(--bg-faint);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.space-svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── Tab Bar ── */
.tab-bar {
  position: absolute;
  top: 14px;
  left: 16px;
  z-index: 10;
  display: flex;
  gap: 4px;
  padding: 3px;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
}

.tab-pill {
  position: relative;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: color 0.3s ease, background 0.3s ease;
  overflow: hidden;
  font-family: var(--font-sans);
  letter-spacing: 0.2px;
}

.tab-pill:hover {
  color: var(--text-primary);
}

.tab-pill.active {
  color: var(--text-primary);
  background: var(--bg-card-hover);
}

.tab-label {
  position: relative;
  z-index: 1;
}

.tab-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
  opacity: 0.6;
  animation: tabProgressFill linear forwards;
  width: 0%;
}

@keyframes tabProgressFill {
  from { width: 0%; }
  to { width: 100%; }
}

.tab-indicator {
  display: none;
}

/* ── Stats Overlay ── */
.stats-overlay {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 6px 18px;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.stats-overlay.visible {
  opacity: 1;
}

.stats-text {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  letter-spacing: 0.2px;
  white-space: nowrap;
}

/* ── Search Results Overlay ── */
.search-results-overlay {
  position: absolute;
  bottom: 50px;
  right: 16px;
  z-index: 10;
  padding: 10px 14px;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 5px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
}

.search-results-overlay.visible {
  opacity: 1;
  transform: translateY(0);
}

.sr-header {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 2px;
}

.sr-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.search-results-overlay.visible .sr-item {
  opacity: 1;
  transform: translateX(0);
}

.sr-rank {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--purple-dim);
  color: var(--purple);
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sr-name {
  color: var(--text-secondary);
  font-weight: 500;
}

.sr-score {
  color: var(--purple);
  font-family: var(--font-mono);
  font-weight: 600;
  margin-left: auto;
}

/* ── Filter Pills Overlay ── */
.filter-pills-overlay {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 10;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.filter-pills-overlay.visible {
  opacity: 1;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 500;
  color: var(--text-secondary);
  opacity: 0;
  transform: translateY(-6px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.filter-pill.visible {
  opacity: 1;
  transform: translateY(0);
}

.fp-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── SVG Elements ── */
.data-point {
  will-change: cx, cy, r, opacity, fill;
}

.point-glow-ring {
  will-change: cx, cy, r, opacity;
  animation: pulseGlow 2.5s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.15; }
}

.point-trail {
  transition: opacity 0.8s ease;
  pointer-events: none;
}

.cluster-region {
  will-change: opacity;
}

.cluster-ring {
  will-change: opacity;
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.35; }
}

/* Search elements */
.search-dot {
  animation: pulseScale 2s ease infinite;
}

@keyframes pulseScale {
  0%, 100% { r: 6; }
  50% { r: 7; }
}

.search-ring-spin {
  animation: spin 10s linear infinite;
  transform-origin: center;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ripple-ring {
  animation: rippleExpand 2.4s ease-out infinite;
}

@keyframes rippleExpand {
  0% { r: 8; opacity: 0.5; }
  100% { r: 50; opacity: 0; }
}

.search-query-text {
  animation: fadeIn 0.3s ease both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Bezier connections */
.bezier-conn {
  will-change: stroke-dashoffset, opacity;
}

/* Filter boundary */
.filter-boundary {
  stroke-dasharray: 6 4;
  animation: boundaryDash 20s linear infinite;
}

@keyframes boundaryDash {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -200; }
}
</style>
