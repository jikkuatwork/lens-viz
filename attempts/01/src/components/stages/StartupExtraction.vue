<template>
  <div class="stage-extraction" :class="{ active }">
    <!-- Data Stream (Left) -->
    <div class="data-stream" :class="{ visible: streamActive }">
      <div class="stream-container">
        <div
          v-for="n in 8"
          :key="n"
          class="stream-line"
          :style="{ animationDelay: `${n * 0.2}s` }"
        >
          <div class="stream-fill"></div>
        </div>
      </div>
      <div class="stream-label">Raw Discovery Data</div>
    </div>

    <!-- Extraction Funnel -->
    <div class="funnel" :class="{ visible: funnelActive }">
      <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
        <path d="M5 10 L75 10 L55 60 L55 110 L25 110 L25 60 Z" stroke="var(--accent)" stroke-width="1" fill="var(--accent-dim)" opacity="0.3"/>
        <path d="M20 30 L60 30" stroke="var(--accent)" stroke-width="0.5" opacity="0.3" stroke-dasharray="4 4"/>
        <path d="M28 50 L52 50" stroke="var(--accent)" stroke-width="0.5" opacity="0.3" stroke-dasharray="4 4"/>
        <path d="M30 70 L50 70" stroke="var(--accent)" stroke-width="0.5" opacity="0.3" stroke-dasharray="4 4"/>
      </svg>
      <div class="funnel-particles">
        <div v-for="n in 6" :key="n" class="f-particle" :style="{ animationDelay: `${n * 0.3}s` }"></div>
      </div>
    </div>

    <!-- Startup Cards Grid (Right) — all 12 slots always rendered -->
    <div class="cards-grid">
      <div
        v-for="(startup, i) in allStartups"
        :key="startup.id"
        class="startup-card"
        :class="{ revealed: i < revealCount, skeleton: i >= revealCount }"
      >
        <template v-if="i < revealCount">
          <div class="card-header">
            <div class="card-avatar" :style="{ background: startup.color }">
              {{ startup.initials }}
            </div>
            <div class="card-info">
              <span class="card-name">{{ startup.name }}</span>
              <span class="card-location">{{ startup.location }}</span>
            </div>
            <span class="card-id">#{{ startup.id }}</span>
          </div>
          <div class="card-tags">
            <span class="card-tag" v-for="tag in startup.tags" :key="tag">{{ tag }}</span>
          </div>
        </template>
        <template v-else>
          <div class="skel-header">
            <div class="skel-avatar"></div>
            <div class="skel-lines">
              <div class="skel-line w70"></div>
              <div class="skel-line w40"></div>
            </div>
          </div>
          <div class="skel-tags">
            <div class="skel-tag"></div>
            <div class="skel-tag short"></div>
          </div>
        </template>
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

const allStartups = [
  { id: 1498, name: 'Sea Machines', initials: 'SM', location: 'Boston, USA', tags: ['Maritime', 'Robotics'], color: 'rgba(0, 234, 180, 0.2)' },
  { id: 1499, name: 'Orca AI', initials: 'OA', location: 'Tel Aviv, IL', tags: ['AI/ML', 'Navigation'], color: 'rgba(139, 92, 246, 0.2)' },
  { id: 1500, name: 'Bound4Blue', initials: 'B4', location: 'Barcelona, ES', tags: ['Clean Tech', 'Wind'], color: 'rgba(59, 130, 246, 0.2)' },
  { id: 1501, name: 'Fleetzero', initials: 'FZ', location: 'Austin, USA', tags: ['Electric', 'Cargo'], color: 'rgba(245, 158, 11, 0.2)' },
  { id: 1502, name: 'Portchain', initials: 'PC', location: 'Copenhagen, DK', tags: ['Logistics', 'SaaS'], color: 'rgba(6, 182, 212, 0.2)' },
  { id: 1503, name: 'Windward', initials: 'WD', location: 'London, UK', tags: ['Risk', 'Intelligence'], color: 'rgba(244, 63, 94, 0.2)' },
  { id: 1504, name: 'Shone', initials: 'SH', location: 'Paris, FR', tags: ['Autonomy', 'Vision'], color: 'rgba(0, 234, 180, 0.2)' },
  { id: 1505, name: 'Seaborg', initials: 'SB', location: 'Copenhagen, DK', tags: ['Nuclear', 'Energy'], color: 'rgba(139, 92, 246, 0.2)' },
  { id: 1506, name: 'Dualog', initials: 'DL', location: 'Tromsø, NO', tags: ['IoT', 'Comms'], color: 'rgba(59, 130, 246, 0.2)' },
  { id: 1507, name: 'Danelec', initials: 'DN', location: 'Birkerød, DK', tags: ['VDR', 'Safety'], color: 'rgba(245, 158, 11, 0.2)' },
  { id: 1508, name: 'ZeroNorth', initials: 'ZN', location: 'Copenhagen, DK', tags: ['Optimization', 'AI'], color: 'rgba(6, 182, 212, 0.2)' },
  { id: 1509, name: 'Bearing AI', initials: 'BA', location: 'Boston, USA', tags: ['Routing', 'ML'], color: 'rgba(244, 63, 94, 0.2)' },
]

const revealCount = ref(0)
const streamActive = ref(false)
const funnelActive = ref(false)

// revealCount is used directly in the template

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
  revealCount.value = 0
  streamActive.value = false
  funnelActive.value = false

  timers.push(setTimeout(() => { streamActive.value = true }, 200))
  timers.push(setTimeout(() => { funnelActive.value = true }, 600))

  // Reveal cards one by one
  allStartups.forEach((_, i) => {
    timers.push(setTimeout(() => {
      revealCount.value = i + 1
    }, 1000 + i * 250))
  })

}

watch(() => props.active, (val) => {
  if (val) runAnimation()
  else clearTimers()
}, { immediate: true })

onUnmounted(clearTimers)
</script>

<style scoped>
.stage-extraction {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  position: relative;
  padding: 16px 40px;
}

/* ── Data Stream ── */
.data-stream {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.data-stream.visible {
  opacity: 1;
}

.stream-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 120px;
}

.stream-line {
  height: 3px;
  background: var(--bg-card);
  border-radius: 2px;
  overflow: hidden;
}

.stream-fill {
  height: 100%;
  width: 60%;
  background: linear-gradient(90deg, var(--accent-dim), var(--accent), var(--accent-dim));
  border-radius: 2px;
  animation: dataStream 1.5s ease-in-out infinite;
}

.stream-label {
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.3px;
  margin-top: 4px;
}

/* ── Funnel ── */
.funnel {
  flex-shrink: 0;
  position: relative;
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.funnel.visible {
  opacity: 1;
}

.funnel-particles {
  position: absolute;
  top: 0;
  left: 50%;
  width: 40px;
  height: 120px;
  transform: translateX(-50%);
  pointer-events: none;
}

.f-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  left: 50%;
  animation: funnelDrop 1.5s ease-in infinite;
  opacity: 0.6;
}

@keyframes funnelDrop {
  0% { top: 0; left: calc(50% + var(--offset, 0px)); opacity: 0; transform: scale(1.5); }
  20% { opacity: 0.8; }
  100% { top: 100%; left: 50%; opacity: 0; transform: scale(0.5); }
}

.f-particle:nth-child(1) { --offset: -15px; }
.f-particle:nth-child(2) { --offset: 12px; }
.f-particle:nth-child(3) { --offset: -8px; }
.f-particle:nth-child(4) { --offset: 18px; }
.f-particle:nth-child(5) { --offset: -20px; }
.f-particle:nth-child(6) { --offset: 6px; }

/* ── Cards Grid ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 560px;
  flex: 1;
}

.startup-card {
  padding: 12px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: border-color 0.2s ease;
}

.startup-card:hover {
  border-color: var(--border-accent);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.card-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-location {
  font-size: 9px;
  color: var(--text-tertiary);
}

.card-id {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  background: var(--bg-glass);
  color: var(--text-secondary);
  border: 1px solid var(--border-faint);
  letter-spacing: 0.2px;
}

/* ── Skeleton Card ── */
.startup-card.skeleton {
  opacity: 0.4;
}

.skel-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skel-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: var(--bg-glass);
  flex-shrink: 0;
}

.skel-lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.skel-line {
  height: 8px;
  border-radius: 4px;
  background: var(--bg-glass);
}

.skel-line.w70 { width: 70%; }
.skel-line.w40 { width: 40%; }

.skel-tags {
  display: flex;
  gap: 4px;
}

.skel-tag {
  height: 18px;
  width: 48px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
}

.skel-tag.short { width: 36px; }

.startup-card.revealed {
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

</style>
