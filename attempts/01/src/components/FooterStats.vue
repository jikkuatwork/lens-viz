<template>
  <div class="footer-stats">
    <div class="stats-card" v-if="showStats">
      <!-- Stage 0: Data Ingestion — Single metric -->
      <template v-if="stageIndex === 0">
        <span class="stat-num">{{ fileCount.toLocaleString() }}</span>
        <span class="stat-text">documents loaded</span>
      </template>

      <!-- Stage 1: Query Expansion — Single metric -->
      <template v-else-if="stageIndex === 1">
        <span class="stat-num">{{ queryCount }}</span>
        <span class="stat-text">research queries</span>
      </template>

      <!-- Stage 2: Deep Research — Single metric -->
      <template v-else-if="stageIndex === 2">
        <span class="stat-num">{{ companiesCount }}</span>
        <span class="stat-text">companies discovered</span>
      </template>

      <!-- Stage 3: Startup Extraction — Triple metric -->
      <template v-else-if="stageIndex === 3">
        <div class="stat-group">
          <span class="stat-num">{{ extractedCount }}</span>
          <span class="stat-label">extracted</span>
        </div>
        <span class="stat-dot">&middot;</span>
        <div class="stat-group">
          <span class="stat-num">{{ dedupedCount }}</span>
          <span class="stat-label">deduped</span>
        </div>
        <span class="stat-dot">&middot;</span>
        <div class="stat-group">
          <span class="stat-num">{{ sectorsCount }}</span>
          <span class="stat-label">sectors</span>
        </div>
      </template>

      <!-- Stage 4: Enrichment — Triple metric -->
      <template v-else-if="stageIndex === 4">
        <div class="stat-group">
          <span class="stat-num">{{ enrichedCount }}/{{ enrichTotal }}</span>
          <span class="stat-label">enriched</span>
        </div>
        <span class="stat-dot">&middot;</span>
        <div class="stat-group">
          <span class="stat-num">{{ confidence }}%</span>
          <span class="stat-label">confidence</span>
        </div>
        <span class="stat-dot">&middot;</span>
        <div class="stat-group">
          <span class="stat-num">{{ dataPoints.toLocaleString() }}</span>
          <span class="stat-label">data points</span>
        </div>
      </template>

      <!-- Stage 5: Structured Output — Badge + metrics -->
      <template v-else-if="stageIndex === 5">
        <CircleCheck :size="14" stroke-width="1.5" class="badge-icon" />
        <span class="stat-text">Dataset validated</span>
        <span class="stat-dot">&middot;</span>
        <span class="stat-num">{{ startupCount.toLocaleString() }}</span>
        <span class="stat-text">startups</span>
        <span class="stat-dot">&middot;</span>
        <span class="stat-num">{{ fieldCount }}</span>
        <span class="stat-text">fields</span>
      </template>

      <!-- Stage 6: Vector Storage — Badge -->
      <template v-else-if="stageIndex === 6">
        <CircleCheck :size="14" stroke-width="1.5" class="badge-icon" />
        <span class="stat-text">Pipeline Complete</span>
        <span class="stat-dot">&middot;</span>
        <span class="stat-text">Ready for semantic search</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { CircleCheck } from 'lucide-vue-next'

const props = defineProps({
  stageIndex: Number,
  active: Boolean,
})

// Delays (ms) matching when original floating badges appeared in each stage
const stageDelays = [5500, 4500, 5700, 4300, 6400, 3700, 5200]

const showStats = ref(false)

// Stage 0 refs
const fileCount = ref(0)
// Stage 1 refs
const queryCount = ref(0)
// Stage 2 refs
const companiesCount = ref(0)
// Stage 3 refs
const extractedCount = ref(0)
const dedupedCount = ref(0)
const sectorsCount = ref(0)
// Stage 4 refs
const enrichedCount = ref(0)
const enrichTotal = ref(35)
const confidence = ref(0)
const dataPoints = ref(0)
// Stage 5 refs
const startupCount = ref(0)
const fieldCount = ref(0)

let timers = []

function clearTimers() {
  timers.forEach(t => {
    if (typeof t === 'number') clearTimeout(t)
    else if (t?.clear) t.clear()
  })
  timers = []
}

function animateCounter(refVal, target, step, interval) {
  let count = 0
  const id = setInterval(() => {
    count = Math.min(count + step, target)
    refVal.value = count
    if (count >= target) clearInterval(id)
  }, interval)
  timers.push({ clear: () => clearInterval(id) })
}

function startStats() {
  clearTimers()
  showStats.value = false

  const delay = stageDelays[props.stageIndex] ?? 4000

  timers.push(setTimeout(() => {
    showStats.value = true

    switch (props.stageIndex) {
      case 0:
        animateCounter(fileCount, 847, 29, 30)
        break
      case 1:
        animateCounter(queryCount, 23, 1, 60)
        break
      case 2:
        animateCounter(companiesCount, 142, 6, 30)
        break
      case 3:
        animateCounter(extractedCount, 142, 6, 30)
        animateCounter(dedupedCount, 35, 2, 50)
        animateCounter(sectorsCount, 23, 1, 60)
        break
      case 4:
        animateCounter(enrichedCount, 6, 1, 150)
        animateCounter(confidence, 87, 3, 30)
        animateCounter(dataPoints, 1247, 50, 25)
        break
      case 5:
        animateCounter(startupCount, 1532, 62, 30)
        animateCounter(fieldCount, 47, 2, 30)
        break
      // Stage 6: no counters needed, just the badge text
    }
  }, delay))
}

watch(() => props.active, (val) => {
  if (val) startStats()
  else clearTimers()
}, { immediate: true })

onUnmounted(clearTimers)
</script>

<style scoped>
.footer-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.stats-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  animation: statsFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.stat-num {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 13px;
  color: var(--accent);
}

.stat-text {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.2px;
}

.stat-dot {
  color: var(--text-tertiary);
  font-size: 14px;
  margin: 0 2px;
}

.stat-group {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-tertiary);
  letter-spacing: 0.2px;
}

.badge-icon {
  color: var(--accent);
  flex-shrink: 0;
}

@keyframes statsFadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
