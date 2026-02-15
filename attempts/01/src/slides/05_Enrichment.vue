<template>
  <div class="stage-enrichment" :class="{ active }">
    <!-- Enrichment Cards -->
    <div class="enrich-grid">
      <div
        v-for="(startup, i) in startups"
        :key="startup.name"
        class="enrich-card"
        :class="{ enriching: startup.enriching, enriched: startup.enriched }"
        :style="{ animationDelay: `${i * 0.15}s` }"
      >
        <!-- Card Header -->
        <div class="e-header">
          <div class="e-avatar" :style="{ background: startup.color }">{{ startup.initials }}</div>
          <div class="e-info">
            <span class="e-name">{{ startup.name }}</span>
            <span class="e-location">{{ startup.location }}</span>
          </div>
          <div class="e-status" :class="startup.statusClass">
            <div class="status-dot"></div>
          </div>
        </div>

        <!-- Enrichment Progress -->
        <div class="e-progress" v-if="startup.enriching || startup.enriched">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: startup.progress + '%' }"></div>
          </div>
          <span class="progress-label">{{ startup.progress }}%</span>
        </div>

        <!-- Data Layers -->
        <div class="e-layers" v-if="startup.layers.length > 0">
          <div
            v-for="(layer, j) in startup.layers"
            :key="layer.label"
            class="data-layer"
            :style="{ animationDelay: `${j * 0.1}s` }"
          >
            <span class="layer-label">{{ layer.label }}</span>
            <div class="layer-bar-track">
              <div class="layer-bar-fill" :style="{ width: layer.confidence + '%', background: layer.barColor }"></div>
            </div>
            <span class="layer-confidence">{{ layer.confidence }}%</span>
          </div>
        </div>

        <!-- Taxonomy Tags -->
        <div class="e-taxonomy" v-if="startup.tags.length > 0">
          <span
            v-for="tag in startup.tags"
            :key="tag"
            class="tax-tag"
          >{{ tag }}</span>
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

const layerTemplates = [
  { label: 'Business Model', barColor: 'var(--accent)' },
  { label: 'Technologies', barColor: 'var(--purple)' },
  { label: 'Funding Data', barColor: 'var(--blue)' },
  { label: 'Market Position', barColor: 'var(--orange)' },
]

const startups = reactive([
  { name: 'Sea Machines', initials: 'SM', location: 'Boston, USA', color: 'rgba(0, 234, 180, 0.2)', enriching: false, enriched: false, progress: 0, statusClass: 'pending', layers: [], tags: [] },
  { name: 'Orca AI', initials: 'OA', location: 'Tel Aviv, IL', color: 'rgba(139, 92, 246, 0.2)', enriching: false, enriched: false, progress: 0, statusClass: 'pending', layers: [], tags: [] },
  { name: 'Bound4Blue', initials: 'B4', location: 'Barcelona, ES', color: 'rgba(59, 130, 246, 0.2)', enriching: false, enriched: false, progress: 0, statusClass: 'pending', layers: [], tags: [] },
  { name: 'Fleetzero', initials: 'FZ', location: 'Austin, USA', color: 'rgba(245, 158, 11, 0.2)', enriching: false, enriched: false, progress: 0, statusClass: 'pending', layers: [], tags: [] },
  { name: 'Portchain', initials: 'PC', location: 'Copenhagen, DK', color: 'rgba(6, 182, 212, 0.2)', enriching: false, enriched: false, progress: 0, statusClass: 'pending', layers: [], tags: [] },
  { name: 'Windward', initials: 'WD', location: 'London, UK', color: 'rgba(244, 63, 94, 0.2)', enriching: false, enriched: false, progress: 0, statusClass: 'pending', layers: [], tags: [] },
])

const tagSets = [
  ['B2B', 'Platform', 'Series A'],
  ['AI/ML', 'Computer Vision', 'Seed'],
  ['CleanTech', 'Hardware', 'Series B'],
  ['Electric', 'Cargo', 'Pre-Seed'],
  ['SaaS', 'Supply Chain', 'Series A'],
  ['Intelligence', 'Risk', 'Series C'],
]

const enrichedCount = ref(0)

let timers = []

function clearTimers() {
  timers.forEach(t => {
    if (typeof t === 'number') clearTimeout(t)
    else if (t?.clear) t.clear()
  })
  timers = []
}

function enrichStartup(startup, index) {
  startup.enriching = true
  startup.statusClass = 'active'

  // Animate progress
  const start = performance.now()
  const duration = 1500
  function step(now) {
    const elapsed = now - start
    startup.progress = Math.min(Math.round((elapsed / duration) * 100), 100)
    if (elapsed < duration) {
      const id = requestAnimationFrame(step)
      timers.push({ clear: () => cancelAnimationFrame(id) })
    } else {
      startup.enriched = true
      startup.enriching = false
      startup.statusClass = 'done'
      enrichedCount.value++
    }
  }
  const id = requestAnimationFrame(step)
  timers.push({ clear: () => cancelAnimationFrame(id) })

  // Add layers progressively
  layerTemplates.forEach((tmpl, j) => {
    timers.push(setTimeout(() => {
      startup.layers.push({
        label: tmpl.label,
        confidence: 60 + Math.floor(Math.random() * 35),
        barColor: tmpl.barColor,
      })
    }, 400 + j * 300))
  })

  // Add tags
  timers.push(setTimeout(() => {
    startup.tags = tagSets[index] || tagSets[0]
  }, 400 + layerTemplates.length * 300 + 200))
}

function runAnimation() {
  clearTimers()
  enrichedCount.value = 0
  startups.forEach(s => {
    s.enriching = false
    s.enriched = false
    s.progress = 0
    s.statusClass = 'pending'
    s.layers = []
    s.tags = []
  })

  // Enrich each startup sequentially with overlap
  startups.forEach((startup, i) => {
    timers.push(setTimeout(() => {
      enrichStartup(startup, i)
    }, 600 + i * 700))
  })

}

watch(() => props.active, (val) => {
  if (val) runAnimation()
  else clearTimers()
}, { immediate: true })

onUnmounted(clearTimers)
</script>

<style scoped>
.stage-enrichment {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 16px 40px;
}

/* ── Grid ── */
.enrich-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 780px;
  width: 100%;
}

.enrich-card {
  padding: 14px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 210px;
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.enrich-card.enriching {
  border-color: var(--purple-dim);
  box-shadow: 0 0 20px var(--purple-dim);
}

.enrich-card.enriched {
  border-color: var(--border-accent);
}

/* ── Header ── */
.e-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.e-avatar {
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
}

.e-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.e-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
}

.e-location {
  font-size: 9px;
  color: var(--text-tertiary);
}

.e-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.status-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.e-status.pending .status-dot { background: var(--text-tertiary); }
.e-status.active .status-dot { background: var(--purple); animation: pulse 1s ease infinite; }
.e-status.done .status-dot { background: var(--accent); }

/* ── Progress ── */
.e-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-track {
  flex: 1;
  height: 3px;
  background: var(--bg-glass);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--purple), var(--accent));
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-tertiary);
  width: 28px;
  text-align: right;
}

/* ── Data Layers ── */
.e-layers {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.data-layer {
  display: flex;
  align-items: center;
  gap: 6px;
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.layer-label {
  font-size: 9px;
  color: var(--text-tertiary);
  width: 72px;
  flex-shrink: 0;
  letter-spacing: 0.2px;
}

.layer-bar-track {
  flex: 1;
  height: 3px;
  background: var(--bg-card);
  border-radius: 2px;
  overflow: hidden;
}

.layer-bar-fill {
  height: 100%;
  border-radius: 2px;
  animation: fillWidth 0.6s ease both;
  --fill-to: 100%;
}

.layer-confidence {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-tertiary);
  width: 24px;
  text-align: right;
}

/* ── Taxonomy Tags ── */
.e-taxonomy {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tax-tag {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  background: var(--accent-subtle);
  color: var(--accent);
  border: 1px solid var(--accent-dim);
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.2px;
}


</style>
