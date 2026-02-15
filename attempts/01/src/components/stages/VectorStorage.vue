<template>
  <div class="stage-vector" :class="{ active }">
    <!-- Vector Space Visualization -->
    <div class="vector-space">
      <svg class="space-svg" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="clusterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="searchGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="var(--purple)" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="var(--purple)" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Grid Lines -->
        <g opacity="0.05">
          <line v-for="n in 12" :key="'v'+n" :x1="n * 50" y1="0" :x2="n * 50" y2="400" stroke="white" stroke-width="0.5"/>
          <line v-for="n in 8" :key="'h'+n" x1="0" :y1="n * 50" x2="600" :y2="n * 50" stroke="white" stroke-width="0.5"/>
        </g>

        <!-- Cluster regions -->
        <g v-if="showClusters">
          <circle
            v-for="cluster in clusters"
            :key="cluster.id"
            :cx="cluster.x" :cy="cluster.y" :r="cluster.r"
            :fill="cluster.gradient"
            class="cluster-bg"
            :style="{ animationDelay: cluster.delay + 's' }"
          />
        </g>

        <!-- Connection lines (appear during search) -->
        <g v-if="showConnections">
          <line
            v-for="(conn, i) in connections"
            :key="'conn-'+i"
            :x1="conn.x1" :y1="conn.y1"
            :x2="conn.x2" :y2="conn.y2"
            stroke="var(--purple)"
            stroke-width="0.5"
            stroke-dasharray="4 4"
            class="connection-line"
            :style="{ animationDelay: `${i * 0.1}s` }"
            opacity="0.3"
          />
        </g>

        <!-- Data Points -->
        <g v-for="(point, i) in visiblePoints" :key="'p-'+i">
          <circle
            :cx="point.x" :cy="point.y" r="4"
            :fill="point.highlight ? 'var(--purple)' : point.color"
            :opacity="point.highlight ? 1 : 0.6"
            class="data-point"
            :class="{ highlight: point.highlight, scattered: !point.organized, organized: point.organized }"
            :style="{
              animationDelay: `${i * 0.02}s`,
              '--target-x': point.targetX + 'px',
              '--target-y': point.targetY + 'px',
            }"
          />
          <circle
            v-if="point.highlight"
            :cx="point.x" :cy="point.y" r="8"
            fill="none"
            stroke="var(--purple)"
            stroke-width="1"
            opacity="0.4"
            class="highlight-ring"
          />
        </g>

        <!-- Search Query Point -->
        <g v-if="showSearch" class="search-point">
          <circle :cx="searchPoint.x" :cy="searchPoint.y" r="40" fill="url(#searchGlow)"/>
          <circle :cx="searchPoint.x" :cy="searchPoint.y" r="6" fill="var(--purple)" class="search-dot"/>
          <circle :cx="searchPoint.x" :cy="searchPoint.y" r="16" fill="none" stroke="var(--purple)" stroke-width="1" stroke-dasharray="3 3" class="search-ring" opacity="0.4"/>
          <text :x="searchPoint.x" :y="searchPoint.y - 24" text-anchor="middle" fill="var(--purple)" font-size="10" font-weight="500" class="search-label">"maritime AI safety"</text>
        </g>

        <!-- Cluster Labels -->
        <g v-if="showLabels">
          <text
            v-for="cluster in clusters"
            :key="'lbl-'+cluster.id"
            :x="cluster.x" :y="cluster.y + cluster.r + 16"
            text-anchor="middle"
            fill="var(--text-secondary)"
            font-size="10"
            font-weight="500"
            class="cluster-label"
            :style="{ animationDelay: cluster.delay + 's' }"
          >{{ cluster.label }}</text>
        </g>
      </svg>
    </div>

    <!-- Embedding Stats -->
    <div class="embed-panel" :class="{ visible: showPanel }">
      <div class="embed-header">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="4" cy="4" r="2" fill="var(--accent)" opacity="0.6"/>
          <circle cx="12" cy="4" r="2" fill="var(--purple)" opacity="0.6"/>
          <circle cx="8" cy="12" r="2" fill="var(--blue)" opacity="0.6"/>
          <line x1="4" y1="4" x2="12" y2="4" stroke="white" stroke-width="0.5" opacity="0.2"/>
          <line x1="4" y1="4" x2="8" y2="12" stroke="white" stroke-width="0.5" opacity="0.2"/>
          <line x1="12" y1="4" x2="8" y2="12" stroke="white" stroke-width="0.5" opacity="0.2"/>
        </svg>
        <span>Vector Database</span>
      </div>
      <div class="embed-stats">
        <div class="e-stat">
          <span class="e-val">{{ embeddedCount }}</span>
          <span class="e-label">embedded</span>
        </div>
        <div class="e-stat">
          <span class="e-val">1536</span>
          <span class="e-label">dimensions</span>
        </div>
        <div class="e-stat">
          <span class="e-val">{{ clusterCount }}</span>
          <span class="e-label">clusters</span>
        </div>
      </div>
      <div class="embed-search" v-if="showSearch">
        <div class="search-query-box">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke="var(--purple)" stroke-width="1.2"/>
            <path d="M8 8l2.5 2.5" stroke="var(--purple)" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span class="sq-text">"maritime AI safety"</span>
        </div>
        <div class="search-results-mini">
          <div class="sr-item" v-for="r in searchResults" :key="r">
            <div class="sr-dot"></div>
            <span>{{ r }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  active: Boolean,
  stageIndex: Number,
})

const clusters = [
  { id: 1, x: 150, y: 130, r: 60, label: 'Maritime Tech', gradient: 'url(#clusterGlow)', delay: 0 },
  { id: 2, x: 350, y: 100, r: 50, label: 'Clean Energy', gradient: 'url(#clusterGlow)', delay: 0.2 },
  { id: 3, x: 450, y: 260, r: 55, label: 'Logistics AI', gradient: 'url(#clusterGlow)', delay: 0.4 },
  { id: 4, x: 180, y: 300, r: 45, label: 'Safety & Risk', gradient: 'url(#clusterGlow)', delay: 0.6 },
  { id: 5, x: 500, y: 130, r: 40, label: 'Offshore', gradient: 'url(#clusterGlow)', delay: 0.8 },
]

// Generate random points
function generatePoints() {
  const pts = []
  const colors = ['var(--accent)', 'var(--blue)', 'var(--purple)', 'var(--cyan)', 'var(--orange)']
  for (let i = 0; i < 60; i++) {
    const clusterIdx = i % clusters.length
    const cluster = clusters[clusterIdx]
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * cluster.r * 0.8
    pts.push({
      x: 50 + Math.random() * 500,
      y: 50 + Math.random() * 300,
      targetX: cluster.x + Math.cos(angle) * dist,
      targetY: cluster.y + Math.sin(angle) * dist,
      color: colors[clusterIdx],
      organized: false,
      highlight: false,
    })
  }
  return pts
}

const allPoints = reactive(generatePoints())
const visibleCount = ref(0)
const showClusters = ref(false)
const showLabels = ref(false)
const showPanel = ref(false)
const showSearch = ref(false)
const showConnections = ref(false)
const embeddedCount = ref(0)
const clusterCount = ref(0)

const searchPoint = { x: 200, y: 180 }
const searchResults = ['Orca AI (0.94)', 'Windward (0.89)', 'Sea Machines (0.87)']

const visiblePoints = computed(() => allPoints.slice(0, visibleCount.value))

const connections = computed(() => {
  if (!showSearch.value) return []
  return allPoints
    .filter(p => p.highlight)
    .map(p => ({
      x1: searchPoint.x,
      y1: searchPoint.y,
      x2: p.organized ? p.targetX : p.x,
      y2: p.organized ? p.targetY : p.y,
    }))
})

let timers = []

function clearTimers() {
  timers.forEach(t => {
    if (typeof t === 'number') clearTimeout(t)
    else if (t?.clear) t.clear()
  })
  timers = []
}

function runAnimation() {
  clearTimers()
  const pts = generatePoints()
  allPoints.splice(0, allPoints.length, ...pts)
  visibleCount.value = 0
  showClusters.value = false
  showLabels.value = false
  showPanel.value = false
  showSearch.value = false
  showConnections.value = false
  embeddedCount.value = 0
  clusterCount.value = 0

  // Phase 1: Scatter points
  timers.push(setTimeout(() => {
    visibleCount.value = allPoints.length
  }, 300))

  // Phase 2: Show panel and start embedding counter
  timers.push(setTimeout(() => {
    showPanel.value = true
    let count = 0
    const target = 1532
    const counter = setInterval(() => {
      count = Math.min(count + 65, target)
      embeddedCount.value = count
      if (count >= target) clearInterval(counter)
    }, 25)
    timers.push({ clear: () => clearInterval(counter) })
  }, 800))

  // Phase 3: Organize into clusters
  timers.push(setTimeout(() => {
    showClusters.value = true
    allPoints.forEach((p, i) => {
      timers.push(setTimeout(() => {
        p.x = p.targetX
        p.y = p.targetY
        p.organized = true
      }, i * 15))
    })
  }, 1800))

  // Phase 4: Show labels and cluster count
  timers.push(setTimeout(() => {
    showLabels.value = true
    let cc = 0
    const counter = setInterval(() => {
      cc++
      clusterCount.value = cc
      if (cc >= clusters.length) clearInterval(counter)
    }, 150)
    timers.push({ clear: () => clearInterval(counter) })
  }, 2800))

  // Phase 5: Search demonstration
  timers.push(setTimeout(() => {
    showSearch.value = true
    // Highlight nearby points
    const searchX = searchPoint.x
    const searchY = searchPoint.y
    allPoints
      .sort((a, b) => {
        const da = Math.hypot(a.targetX - searchX, a.targetY - searchY)
        const db = Math.hypot(b.targetX - searchX, b.targetY - searchY)
        return da - db
      })
    allPoints.slice(0, 5).forEach((p, i) => {
      timers.push(setTimeout(() => {
        p.highlight = true
      }, i * 200))
    })
    timers.push(setTimeout(() => {
      showConnections.value = true
    }, 1200))
  }, 3500))

}

watch(() => props.active, (val) => {
  if (val) runAnimation()
  else clearTimers()
}, { immediate: true })

onUnmounted(clearTimers)
</script>

<style scoped>
.stage-vector {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  padding: 16px 40px;
}

/* ── Vector Space ── */
.vector-space {
  flex: 1;
  max-width: 600px;
  height: 400px;
  position: relative;
  background: var(--bg-faint);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.space-svg {
  width: 100%;
  height: 100%;
}

.data-point {
  transition: cx 1s cubic-bezier(0.16, 1, 0.3, 1), cy 1s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.data-point.highlight {
  filter: drop-shadow(0 0 4px var(--purple));
}

.highlight-ring {
  animation: ripple 2s ease infinite;
}

.cluster-bg {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.cluster-label {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  font-family: var(--font-sans);
}

.connection-line {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.search-point {
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-dot {
  animation: pulseScale 2s ease infinite;
}

.search-ring {
  animation: spin 8s linear infinite;
}

.search-label {
  font-family: var(--font-mono);
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

/* ── Embed Panel ── */
.embed-panel {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  opacity: 0;
  pointer-events: none;
  transform: translateX(20px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.embed-panel.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
}

.embed-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
}

.embed-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.e-stat {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.e-val {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
}

.e-label {
  font-size: 10px;
  color: var(--text-tertiary);
}

/* ── Search Query Box ── */
.embed-search {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-query-box {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: var(--purple-dim);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-sm);
}

.sq-text {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--purple);
}

.search-results-mini {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sr-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--text-secondary);
  padding: 4px 8px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.sr-item:nth-child(1) { animation-delay: 0s; }
.sr-item:nth-child(2) { animation-delay: 0.1s; }
.sr-item:nth-child(3) { animation-delay: 0.2s; }

.sr-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--purple);
  flex-shrink: 0;
}

</style>
