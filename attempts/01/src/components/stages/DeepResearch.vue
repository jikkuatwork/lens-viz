<template>
  <div class="stage-deep-research" :class="{ active }">
    <!-- Research Agents — all 4 always rendered as skeletons -->
    <div class="agents-grid">
      <div
        v-for="(agent, i) in agents"
        :key="agent.id"
        class="agent-lane"
        :class="{ active: agent.active, done: agent.done }"
      >
        <!-- Agent Header -->
        <div class="agent-header">
          <div class="agent-avatar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="8" cy="6" r="2" fill="currentColor" opacity="0.5"/>
              <path d="M4 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="agent-name">Agent {{ agent.id }}</span>
          <span class="agent-status" :class="agent.statusClass">{{ agent.statusText }}</span>
        </div>

        <!-- Agent Query -->
        <div class="agent-query">
          <span class="query-label">{{ agent.query }}</span>
        </div>

        <!-- Search Animation -->
        <div class="agent-search" v-if="agent.active && !agent.done">
          <div class="search-bar">
            <div class="search-progress" :style="{ width: agent.progress + '%' }"></div>
          </div>
          <div class="search-wave">
            <div v-for="n in 5" :key="n" class="wave-bar" :style="{ animationDelay: `${n * 0.1}s` }"></div>
          </div>
        </div>

        <!-- Skeleton results (before agent starts) -->
        <div class="agent-results-skeleton" v-if="!agent.active && !agent.done">
          <div class="skeleton-line" v-for="n in 3" :key="n"></div>
        </div>

        <!-- Results -->
        <div class="agent-results" v-if="agent.results.length > 0">
          <div
            v-for="(result, j) in agent.results"
            :key="j"
            class="result-card"
            :style="{ animationDelay: `${j * 0.15}s` }"
          >
            <div class="result-dot"></div>
            <span class="result-name">{{ result }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue'

const props = defineProps({
  active: Boolean,
  stageIndex: Number,
})

const agents = reactive([
  {
    id: 1,
    query: 'Autonomy & Robotics',
    active: false,
    done: false,
    progress: 0,
    statusText: 'Idle',
    statusClass: 'idle',
    results: [],
    resultData: ['Sea Machines', 'Orca AI', 'Shone'],
  },
  {
    id: 2,
    query: 'Clean Shipping & Emissions',
    active: false,
    done: false,
    progress: 0,
    statusText: 'Idle',
    statusClass: 'idle',
    results: [],
    resultData: ['Bound4Blue', 'Seaborg', 'Fleetzero'],
  },
  {
    id: 3,
    query: 'Port & Logistics Intelligence',
    active: false,
    done: false,
    progress: 0,
    statusText: 'Idle',
    statusClass: 'idle',
    results: [],
    resultData: ['Portchain', 'Voyager Portal', 'TradeLens'],
  },
  {
    id: 4,
    query: 'Offshore Services & Safety',
    active: false,
    done: false,
    progress: 0,
    statusText: 'Idle',
    statusClass: 'idle',
    results: [],
    resultData: ['Windward', 'Dualog', 'MODS'],
  },
])


let timers = []

function clearTimers() {
  timers.forEach(t => {
    if (typeof t === 'number') clearTimeout(t)
    else if (t?.clear) t.clear()
  })
  timers = []
}

function animateProgress(agent, duration, callback) {
  const start = performance.now()
  function step(now) {
    const elapsed = now - start
    agent.progress = Math.min((elapsed / duration) * 100, 100)
    if (elapsed < duration) {
      const id = requestAnimationFrame(step)
      timers.push({ clear: () => cancelAnimationFrame(id) })
    } else {
      callback?.()
    }
  }
  const id = requestAnimationFrame(step)
  timers.push({ clear: () => cancelAnimationFrame(id) })
}

function runAnimation() {
  clearTimers()
  agents.forEach(a => {
    a.active = false
    a.done = false
    a.progress = 0
    a.statusText = 'Idle'
    a.statusClass = 'idle'
    a.results = []
  })

  agents.forEach((agent, i) => {
    timers.push(setTimeout(() => {
      agent.active = true
      agent.statusText = 'Searching...'
      agent.statusClass = 'searching'

      animateProgress(agent, 2000 + i * 400, () => {
        agent.statusText = 'Extracting'
        agent.statusClass = 'extracting'

        agent.resultData.forEach((result, j) => {
          timers.push(setTimeout(() => {
            agent.results.push(result)
          }, 200 + j * 200))
        })

        timers.push(setTimeout(() => {
          agent.done = true
          agent.statusText = 'Complete'
          agent.statusClass = 'complete'
        }, 200 + agent.resultData.length * 200 + 100))
      })
    }, 500 + i * 600))
  })

}

watch(() => props.active, (val) => {
  if (val) runAnimation()
  else clearTimers()
}, { immediate: true })

onUnmounted(clearTimers)
</script>

<style scoped>
.stage-deep-research {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 16px 40px;
}

/* ── Agents Grid ── */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 900px;
  z-index: 2;
}

.agent-lane {
  padding: 16px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 220px;
}

.agent-lane.active {
  border-color: var(--border-accent);
  box-shadow: 0 0 20px var(--accent-subtle);
}

.agent-lane.done {
  border-color: rgba(0, 234, 180, 0.2);
}

/* ── Agent Header ── */
.agent-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  flex-shrink: 0;
}

.agent-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
}

.agent-status {
  margin-left: auto;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.agent-status.idle {
  color: var(--text-tertiary);
  background: var(--bg-card);
}

.agent-status.searching {
  color: var(--accent);
  background: var(--accent-dim);
  animation: pulse 1.5s ease infinite;
}

.agent-status.extracting {
  color: var(--purple);
  background: var(--purple-dim);
}

.agent-status.complete {
  color: var(--accent);
  background: var(--accent-dim);
}

/* ── Agent Query ── */
.agent-query {
  padding: 8px 10px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  border: 1px solid var(--bg-card);
}

.query-label {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* ── Search Animation ── */
.agent-search {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-bar {
  height: 3px;
  background: var(--bg-glass);
  border-radius: 2px;
  overflow: hidden;
}

.search-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--purple));
  border-radius: 2px;
  transition: width 0.1s linear;
}

.search-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 20px;
}

.wave-bar {
  width: 3px;
  height: 4px;
  background: var(--accent);
  border-radius: 2px;
  animation: waveform 0.8s ease-in-out infinite;
}

/* ── Skeleton Results ── */
.agent-results-skeleton {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.skeleton-line {
  height: 28px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  border: 1px solid var(--bg-subtle);
}

/* ── Results ── */
.agent-results {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: var(--accent-subtle);
  border-radius: var(--radius-sm);
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.result-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.result-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.2px;
}

</style>
