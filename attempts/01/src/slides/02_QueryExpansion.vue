<template>
  <div class="stage-query-expansion" :class="{ active }">
    <div class="diagram">
      <!-- SVG branch lines from center to each node -->
      <svg class="branches-svg" :viewBox="`0 0 ${svgSize} ${svgSize}`">
        <!-- Subtle ambient ring -->
        <circle
          :cx="svgCenter" :cy="svgCenter"
          :r="branchRadius + 40"
          fill="none"
          stroke="var(--border)"
          stroke-width="0.5"
          stroke-dasharray="4 6"
          opacity="0.3"
        />
        <!-- Branch curves (bezier noodles) -->
        <path
          v-for="(node, i) in nodes"
          :key="'branch-' + i"
          :d="node.pathD"
          class="branch-line"
          :style="{ '--i': i }"
          fill="none"
          stroke="var(--accent)"
          stroke-width="1.5"
          stroke-linecap="round"
          opacity="0.35"
        />
      </svg>

      <!-- Center hub: circle with plus icon on top -->
      <div class="center-hub">
        <div class="center-glow"></div>
        <div class="center-ring"></div>
        <div class="center-circle">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line x1="11" y1="4" x2="11" y2="18" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="4" y1="11" x2="18" y2="11" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="center-label">Fund<br/>Analysis</span>
      </div>

      <!-- Query nodes at branch endpoints -->
      <div
        v-for="(node, i) in nodes"
        :key="node.id"
        class="query-node"
        :style="{
          left: node.pctX + '%',
          top: node.pctY + '%',
          '--i': i,
        }"
      >
        <span class="query-text">{{ node.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  active: Boolean,
  stageIndex: Number,
})

const svgSize = 500
const svgCenter = svgSize / 2
const branchRadius = 180
const startAngle = -Math.PI / 2

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
]

const nodes = computed(() => {
  const count = queries.length
  return queries.map((q, i) => {
    const angle = startAngle + (i * 2 * Math.PI) / count
    const svgX = svgCenter + branchRadius * Math.cos(angle)
    const svgY = svgCenter + branchRadius * Math.sin(angle)

    // Bezier noodle: depart straight from center, gentle curve near the node
    // CP1: along the direct radial line (straight departure)
    const cp1x = svgCenter + branchRadius * 0.45 * Math.cos(angle)
    const cp1y = svgCenter + branchRadius * 0.45 * Math.sin(angle)
    // CP2: near node, offset tangentially (consistent clockwise direction)
    const perpX = -Math.sin(angle)
    const perpY = Math.cos(angle)
    const curveAmount = 30
    const cp2x = svgX - branchRadius * 0.2 * Math.cos(angle) + perpX * curveAmount
    const cp2y = svgY - branchRadius * 0.2 * Math.sin(angle) + perpY * curveAmount

    const pathD = `M ${svgCenter} ${svgCenter} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${svgX} ${svgY}`

    return {
      ...q,
      svgX,
      svgY,
      pathD,
      pctX: (svgX / svgSize) * 100,
      pctY: (svgY / svgSize) * 100,
    }
  })
})
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

.diagram {
  position: relative;
  width: 500px;
  height: 500px;
}

/* ── SVG Branches ── */
.branches-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.branch-line {
  stroke-dasharray: 250;
  stroke-dashoffset: 250;
}

.active .branch-line {
  animation: drawBranch 0.6s ease-out forwards;
  animation-delay: calc(0.4s + var(--i) * 0.1s);
}

@keyframes drawBranch {
  to { stroke-dashoffset: 0; }
}

/* ── Center Hub ── */
/* Zero-dimension anchor at exact diagram center.
   All children position themselves relative to this point,
   so circle, glow, ring, and SVG branch origin are coincident. */
.center-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
}

.center-glow {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  filter: blur(24px);
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
}

.active .center-glow {
  animation: glowIn 0.8s ease-out 0.1s forwards;
}

@keyframes glowIn {
  to { opacity: 0.1; }
}

.center-ring {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 1px solid var(--accent-dim);
  opacity: 0;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
}

.active .center-ring {
  animation: ringIn 0.6s ease-out 0.15s forwards;
}

@keyframes ringIn {
  to { opacity: 0.4; }
}

.center-circle {
  position: absolute;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent-dim);
  border: 1.5px solid var(--border-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px var(--accent-glow);
  top: 0;
  left: 0;
  transform: translate(-50%, -50%) scale(0.5);
  opacity: 0;
}

.active .center-circle {
  animation: centerIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
}

@keyframes centerIn {
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.center-label {
  position: absolute;
  top: 34px;
  left: 0;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.3;
  letter-spacing: 0.3px;
  white-space: nowrap;
  opacity: 0;
}

.active .center-label {
  animation: fadeIn 0.4s ease 0.4s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

/* ── Query Nodes ── */
.query-node {
  position: absolute;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
}

.active .query-node {
  animation: nodeAppear 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(0.7s + var(--i) * 0.1s);
}

@keyframes nodeAppear {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.query-text {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 5px 12px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  letter-spacing: 0.2px;
  white-space: nowrap;
}
</style>
