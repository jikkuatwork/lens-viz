<template>
  <div class="stage-query-expansion" :class="{ active }">
    <!-- Centered Container for brain + branches + labels -->
    <div class="center-anchor">
      <!-- Central Brain Node -->
      <div class="brain-node" :class="{ pulsing: brainActive }">
        <div class="brain-outer-ring"></div>
        <div class="brain-inner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="var(--accent)" stroke-width="1" opacity="0.4"/>
            <path d="M12 6v12M6 12h12" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="3" fill="var(--accent)" opacity="0.3"/>
            <circle cx="12" cy="12" r="1.5" fill="var(--accent)"/>
          </svg>
        </div>
        <span class="brain-label">Fund<br/>Analysis</span>
      </div>

      <!-- Query Branches (SVG centered at 0,0) -->
      <svg class="branches-svg" :viewBox="`${-svgHalf} ${-svgHalf} ${svgSize} ${svgSize}`" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="branchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.1"/>
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g v-for="query in visibleQueries" :key="query.id">
          <path
            :d="query.path"
            fill="none"
            stroke="url(#branchGrad)"
            stroke-width="1.5"
            :style="{ animationDelay: `${query.delay}s` }"
            class="branch-line"
            :class="{ drawn: query.visible }"
            filter="url(#glowFilter)"
          />
          <g :style="{ animationDelay: `${query.delay + 0.3}s` }" class="query-node" :class="{ visible: query.visible }">
            <circle :cx="query.x" :cy="query.y" r="20" fill="var(--bg-primary)" stroke="var(--accent)" stroke-width="1" opacity="0.3"/>
            <circle :cx="query.x" :cy="query.y" r="4" fill="var(--accent)" opacity="0.8"/>
          </g>
        </g>
      </svg>

      <!-- Query Labels (HTML overlay, positioned relative to center-anchor) -->
      <div
        v-for="query in visibleQueries"
        :key="'label-' + query.id"
        class="query-label"
        :class="{ visible: query.visible }"
        :style="{
          left: query.labelX + 'px',
          top: query.labelY + 'px',
          animationDelay: `${query.delay + 0.5}s`,
        }"
      >
        <span class="query-text">{{ query.label }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  active: Boolean,
  stageIndex: Number,
})

// Evenly distribute 10 queries around 360°
const queries = [
  { id: 1, label: 'Maritime Tech' },
  { id: 2, label: 'Clean Energy' },
  { id: 3, label: 'Supply Chain AI' },
  { id: 4, label: 'Logistics SaaS' },
  { id: 5, label: 'ESG Compliance' },
  { id: 6, label: 'Autonomous Vessels' },
  { id: 7, label: 'Port Optimization' },
  { id: 8, label: 'Carbon Tracking' },
  { id: 9, label: 'Crew Management' },
  { id: 10, label: 'Offshore Services' },
].map((q, i) => ({
  ...q,
  angle: -90 + i * 36, // Even 36° spacing, starting from top
}))

const radius = 160
const labelRadius = 200
const svgSize = 500
const svgHalf = svgSize / 2

const brainActive = ref(false)
const revealedCount = ref(0)

const visibleQueries = computed(() => {
  return queries.slice(0, revealedCount.value).map((q, i) => {
    const angleRad = (q.angle * Math.PI) / 180
    const x = Math.cos(angleRad) * radius
    const y = Math.sin(angleRad) * radius

    const cp1x = x * 0.3
    const cp1y = y * 0.1
    const cp2x = x * 0.7
    const cp2y = y * 0.9

    return {
      ...q,
      x,
      y,
      labelX: Math.cos(angleRad) * labelRadius,
      labelY: Math.sin(angleRad) * labelRadius,
      path: `M 0 0 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`,
      delay: i * 0.3,
      visible: true,
    }
  })
})

let timers = []

function clearTimers() {
  timers.forEach(t => clearTimeout(t))
  timers = []
}

function runAnimation() {
  clearTimers()
  brainActive.value = false
  revealedCount.value = 0

  timers.push(setTimeout(() => {
    brainActive.value = true
  }, 300))

  queries.forEach((_, i) => {
    timers.push(setTimeout(() => {
      revealedCount.value = i + 1
    }, 800 + i * 350))
  })

}

watch(() => props.active, (val) => {
  if (val) runAnimation()
  else clearTimers()
}, { immediate: true })

onUnmounted(clearTimers)
</script>

<style scoped>
.stage-query-expansion {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* ── Shared center anchor ── */
.center-anchor {
  position: relative;
  width: 0;
  height: 0;
}

/* ── Brain Node ── */
.brain-node {
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
}

.brain-outer-ring {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 1px solid var(--accent-dim);
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.6s ease;
}

.brain-node.pulsing .brain-outer-ring {
  animation: ripple 2s ease-out infinite;
  border-color: var(--accent);
}

.brain-inner {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent-dim);
  border: 1.5px solid var(--border-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.6s ease;
}

.brain-node.pulsing .brain-inner {
  box-shadow: 0 0 24px var(--accent-glow);
}

.brain-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.3;
  letter-spacing: 0.3px;
}

/* ── Branches SVG ── */
.branches-svg {
  position: absolute;
  width: 500px;
  height: 500px;
  left: -250px;
  top: -250px;
  overflow: visible;
  pointer-events: none;
}

.branch-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  transition: none;
}

.branch-line.drawn {
  animation: drawLine 0.6s ease forwards;
  animation-delay: inherit;
}

.query-node {
  opacity: 0;
  transform-origin: center;
}

.query-node.visible {
  animation: nodeAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: inherit;
}

/* ── Query Labels ── */
.query-label {
  position: absolute;
  transform: translate(-50%, -50%);
  opacity: 0;
  white-space: nowrap;
  pointer-events: none;
}

.query-label.visible {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: inherit;
}

.query-text {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 4px 10px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  backdrop-filter: blur(10px);
  letter-spacing: 0.2px;
}

</style>
