<template>
  <div class="stage-structured" :class="{ active }">
    <!-- Schema Visualization -->
    <div class="schema-panel">
      <!-- Schema Header -->
      <div class="panel-header">
        <div class="panel-dot green"></div>
        <div class="panel-dot yellow"></div>
        <div class="panel-dot red"></div>
        <span class="panel-title">structured_output.json</span>
      </div>

      <!-- JSON-like Content -->
      <div class="json-content" ref="jsonRef">
        <div
          v-for="(line, i) in jsonLines"
          :key="i"
          class="json-line"
          :class="{ revealed: i < revealCount }"
        >
          <span class="line-number">{{ line.num }}</span>
          <span
            class="line-content"
            :style="{ paddingLeft: line.indent * 16 + 'px' }"
            v-html="line.html"
          ></span>
        </div>
      </div>
    </div>

    <!-- Quality Metrics Panel -->
    <div class="metrics-panel" :class="{ visible: showMetrics }">
      <h3 class="metrics-title">Quality Metrics</h3>

      <div class="metric-row" v-for="(metric, i) in metrics" :key="metric.label" :style="{ animationDelay: `${i * 0.15}s` }">
        <div class="metric-header">
          <span class="metric-label">{{ metric.label }}</span>
          <span class="metric-value">{{ metric.value }}%</span>
        </div>
        <div class="metric-bar">
          <div
            class="metric-fill"
            :style="{
              '--fill-to': metric.value + '%',
              width: metric.animated ? metric.value + '%' : '0%',
              background: metric.color,
            }"
          ></div>
        </div>
      </div>

      <!-- Schema Stats -->
      <div class="schema-stats">
        <div class="s-stat" v-for="stat in schemaStats" :key="stat.label">
          <span class="s-val">{{ stat.value }}</span>
          <span class="s-label">{{ stat.label }}</span>
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

// JSON lines data
const jsonLines = [
  { num: 1, indent: 0, html: '<span class="j-brace">{</span>' },
  { num: 2, indent: 1, html: '<span class="j-key">"metadata"</span><span class="j-colon">:</span> <span class="j-brace">{</span>' },
  { num: 3, indent: 2, html: '<span class="j-key">"version"</span><span class="j-colon">:</span> <span class="j-string">"1.0.0"</span><span class="j-comma">,</span>' },
  { num: 4, indent: 2, html: '<span class="j-key">"totalCount"</span><span class="j-colon">:</span> <span class="j-number">1532</span><span class="j-comma">,</span>' },
  { num: 5, indent: 2, html: '<span class="j-key">"lastUpdated"</span><span class="j-colon">:</span> <span class="j-string">"2026-02-15T09:00:00Z"</span>' },
  { num: 6, indent: 1, html: '<span class="j-brace">}</span><span class="j-comma">,</span>' },
  { num: 7, indent: 1, html: '<span class="j-key">"startups"</span><span class="j-colon">:</span> <span class="j-bracket">[</span>' },
  { num: 8, indent: 2, html: '<span class="j-brace">{</span>' },
  { num: 9, indent: 3, html: '<span class="j-key">"id"</span><span class="j-colon">:</span> <span class="j-number">1498</span><span class="j-comma">,</span>' },
  { num: 10, indent: 3, html: '<span class="j-key">"name"</span><span class="j-colon">:</span> <span class="j-string">"Sea Machines Robotics"</span><span class="j-comma">,</span>' },
  { num: 11, indent: 3, html: '<span class="j-key">"sector"</span><span class="j-colon">:</span> <span class="j-string">"Maritime Robotics"</span><span class="j-comma">,</span>' },
  { num: 12, indent: 3, html: '<span class="j-key">"enriched"</span><span class="j-colon">:</span> <span class="j-brace">{</span>' },
  { num: 13, indent: 4, html: '<span class="j-key">"confidence"</span><span class="j-colon">:</span> <span class="j-number">0.92</span><span class="j-comma">,</span>' },
  { num: 14, indent: 4, html: '<span class="j-key">"technologies"</span><span class="j-colon">:</span> <span class="j-brace">{</span> <span class="j-key">"ai-ml"</span><span class="j-colon">:</span> <span class="j-number">0.7</span><span class="j-comma">,</span> <span class="j-key">"robotics"</span><span class="j-colon">:</span> <span class="j-number">0.8</span> <span class="j-brace">}</span><span class="j-comma">,</span>' },
  { num: 15, indent: 4, html: '<span class="j-key">"funding_rounds"</span><span class="j-colon">:</span> <span class="j-bracket">[</span>' },
  { num: 16, indent: 5, html: '<span class="j-brace">{</span> <span class="j-key">"stage"</span><span class="j-colon">:</span> <span class="j-string">"series-a"</span><span class="j-comma">,</span> <span class="j-key">"amount"</span><span class="j-colon">:</span> <span class="j-number">30000000</span> <span class="j-brace">}</span>' },
  { num: 17, indent: 4, html: '<span class="j-bracket">]</span>' },
  { num: 18, indent: 3, html: '<span class="j-brace">}</span>' },
  { num: 19, indent: 2, html: '<span class="j-brace">}</span><span class="j-comma">,</span>' },
  { num: 20, indent: 2, html: '<span class="j-comment">// ... 1,531 more startups</span>' },
  { num: 21, indent: 1, html: '<span class="j-bracket">]</span>' },
  { num: 22, indent: 0, html: '<span class="j-brace">}</span>' },
]

const metrics = reactive([
  { label: 'Schema Compliance', value: 98, color: 'var(--accent)', animated: false },
  { label: 'Data Completeness', value: 94, color: 'var(--blue)', animated: false },
  { label: 'Confidence Score', value: 87, color: 'var(--purple)', animated: false },
  { label: 'Dedup Accuracy', value: 99, color: 'var(--cyan)', animated: false },
])

const schemaStats = reactive([
  { value: '1,532', label: 'Startups' },
  { value: '47', label: 'Fields' },
  { value: '8', label: 'Funds' },
  { value: '1.9 MB', label: 'Dataset' },
])

const revealCount = ref(0)
const showMetrics = ref(false)

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
  showMetrics.value = false
  metrics.forEach(m => m.animated = false)

  // Reveal JSON lines
  jsonLines.forEach((_, i) => {
    timers.push(setTimeout(() => {
      revealCount.value = i + 1
    }, 300 + i * 100))
  })

  // Show metrics
  const metricsDelay = 300 + jsonLines.length * 100 + 200
  timers.push(setTimeout(() => {
    showMetrics.value = true
    metrics.forEach((m, i) => {
      timers.push(setTimeout(() => {
        m.animated = true
      }, i * 200))
    })
  }, metricsDelay))

}

watch(() => props.active, (val) => {
  if (val) runAnimation()
  else clearTimers()
}, { immediate: true })

onUnmounted(clearTimers)
</script>

<style scoped>
.stage-structured {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  position: relative;
  padding: 16px 40px;
}

/* ── Schema Panel ── */
.schema-panel {
  flex: 1;
  max-width: 520px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
}

.panel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.panel-dot.red { background: #FF5F57; }
.panel-dot.yellow { background: #FEBC2E; }
.panel-dot.green { background: #28C840; }

.panel-title {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
  margin-left: 8px;
}

.json-content {
  padding: 12px 0;
  max-height: 360px;
  overflow-y: auto;
  scrollbar-width: none;
}

.json-content::-webkit-scrollbar { display: none; }

.json-line {
  display: flex;
  align-items: baseline;
  padding: 1px 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.7;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.json-line.revealed {
  opacity: 1;
}

.line-number {
  width: 28px;
  text-align: right;
  color: var(--text-tertiary);
  font-size: 10px;
  margin-right: 12px;
  flex-shrink: 0;
  user-select: none;
}

.line-content {
  white-space: nowrap;
}

/* JSON syntax colors */
:deep(.j-key) { color: var(--json-key); }
:deep(.j-string) { color: var(--json-string); }
:deep(.j-number) { color: var(--json-number); }
:deep(.j-brace), :deep(.j-bracket) { color: var(--text-secondary); }
:deep(.j-colon) { color: var(--text-tertiary); margin: 0 4px; }
:deep(.j-comma) { color: var(--text-tertiary); }
:deep(.j-comment) { color: var(--text-tertiary); font-style: italic; }

/* ── Metrics Panel ── */
.metrics-panel {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  opacity: 0;
  pointer-events: none;
  transform: translateX(20px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.metrics-panel.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
}

.metrics-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.metric-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.metric-value {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-bar {
  height: 4px;
  background: var(--bg-glass);
  border-radius: 2px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ── Schema Stats ── */
.schema-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.s-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.s-val {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
}

.s-label {
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.3px;
}

</style>
