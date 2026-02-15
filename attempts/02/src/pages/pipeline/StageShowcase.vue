<script setup>
import { computed } from 'vue'

import StageDataIngest from './stages/StageDataIngest.vue'
import StageDiscovery from './stages/StageDiscovery.vue'
import StageExtract from './stages/StageExtract.vue'
import StageResearch from './stages/StageResearch.vue'
import StageEnrich from './stages/StageEnrich.vue'
import StageDocument from './stages/StageDocument.vue'
import StageVector from './stages/StageVector.vue'

const props = defineProps({
  stage: { type: Object, required: true },
  runtime: { type: Object, default: () => ({}) }
})

const stageVisuals = {
  ingest: StageDataIngest,
  discovery: StageDiscovery,
  extract: StageExtract,
  research: StageResearch,
  enrich: StageEnrich,
  document: StageDocument,
  vector: StageVector
}

const visualComponent = computed(() => stageVisuals[props.stage.id] || StageDataIngest)

const detailMetrics = computed(() => {
  return props.stage.metrics.map((metric) => {
    const runtimeValue = props.runtime?.metrics?.[metric.key]
    return {
      label: metric.label,
      value: runtimeValue || metric.value
    }
  })
})

const stageFlowBeats = {
  ingest: [
    'Collect heterogeneous source documents from multiple channels.',
    'Normalize content into machine-readable chunks with fingerprints.',
    'Publish validated intake payloads for downstream orchestration.'
  ],
  discovery: [
    'Interpret thesis context and sector boundaries.',
    'Expand into targeted query clusters and analyst prompts.',
    'Emit ranked research tracks with evidence intent.'
  ],
  extract: [
    'Scan discovery outputs for startup-level entity mentions.',
    'Collapse duplicates into canonical company identities.',
    'Write deterministic rows for research handoff.'
  ],
  research: [
    'Launch parallel deep-research agents per startup.',
    'Gather citations, traction proofs, and market signals.',
    'Score confidence before enrichment mapping.'
  ],
  enrich: [
    'Convert raw findings into schema-backed entities.',
    'Align tags to taxonomy, stage, and strategic relevance.',
    'Run consistency checks and conflict resolution.'
  ],
  document: [
    'Compose analyst-grade markdown narratives.',
    'Generate final shortlists with concise comparables.',
    'Export presentation and decision-ready packets.'
  ],
  vector: [
    'Embed final entities into semantic vector space.',
    'Index neighbors and retrieval metadata for fast recall.',
    'Expose search-ready endpoints for downstream agents.'
  ]
}

const stageBeats = computed(() => stageFlowBeats[props.stage.id] || [])
const stageSignal = computed(() => props.runtime?.signal || props.stage.metrics[0].value)
const stageQueue = computed(() => props.runtime?.queue || props.stage.outputs[0])
</script>

<template>
  <section class="showcase card-surface z-slide-up">
    <aside class="showcase-story">
      <header class="story-head">
        <span class="stage-pill">Step {{ stage.code }}</span>
        <p class="story-kicker">{{ stage.subtitle }}</p>
        <h2 class="story-title">{{ stage.title }}</h2>
      </header>

      <p class="story-narrative">{{ stage.narrative }}</p>

      <div class="story-metrics">
        <article v-for="metric in detailMetrics" :key="metric.label" class="metric-chip">
          <span class="metric-label">{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </article>
      </div>

      <div class="story-flow">
        <p class="micro-label">Operational Flow</p>
        <ol class="flow-list">
          <li v-for="beat in stageBeats" :key="beat">{{ beat }}</li>
        </ol>
      </div>

      <div class="outputs">
        <span v-for="output in stage.outputs" :key="output" class="output-pill">{{ output }}</span>
      </div>
    </aside>

    <section class="showcase-ops">
      <header class="ops-head">
        <article class="ops-chip">
          <span class="ops-label">Live Signal</span>
          <strong>{{ stageSignal }}</strong>
        </article>
        <article class="ops-chip">
          <span class="ops-label">Queue</span>
          <strong>{{ stageQueue }}</strong>
        </article>
      </header>

      <div class="ops-canvas">
        <component :is="visualComponent" :active="true" :completed="false" />
      </div>
    </section>
  </section>
</template>

<style scoped>
.showcase {
  min-height: 100%;
  padding: 20px;
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.25fr);
  gap: 18px;
}

.showcase-story {
  min-width: 0;
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  gap: 14px;
}

.story-head {
  display: grid;
  gap: 8px;
}

.stage-pill {
  width: fit-content;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 40%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 55%, var(--z-surface-alt) 45%);
  color: color-mix(in srgb, var(--z-accent-700) 60%, var(--z-text) 40%);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 640;
  padding: 5px 11px;
}

.story-kicker {
  margin: 0;
  color: var(--z-text-sub);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.story-title {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
  color: var(--z-text);
}

.story-narrative {
  margin: 0;
  color: var(--z-text-sub);
  font-size: 15px;
  line-height: 1.65;
}

.story-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.metric-chip {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-border) 48%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 75%, white 25%);
  padding: 9px 10px;
  display: grid;
  gap: 3px;
}

.metric-label {
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.metric-chip strong {
  font-size: 14px;
  color: var(--z-text);
}

.story-flow {
  min-width: 0;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 72%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 82%, white 18%);
  padding: 12px;
}

.flow-list {
  margin: 9px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 9px;
  color: var(--z-text-sub);
  font-size: 13px;
  line-height: 1.5;
}

.outputs {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.output-pill {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 38%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 55%, var(--z-surface-alt) 45%);
  color: color-mix(in srgb, var(--z-accent-700) 60%, var(--z-text) 40%);
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 5px 10px;
}

.showcase-ops {
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;
}

.ops-head {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.ops-chip {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 72%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 80%, white 20%);
  padding: 10px;
  display: grid;
  gap: 3px;
}

.ops-label {
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.ops-chip strong {
  font-size: 13px;
  color: var(--z-text);
}

.ops-canvas {
  min-height: 420px;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--z-border) 55%, transparent);
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--z-surface-alt) 78%, white 22%), color-mix(in srgb, var(--z-surface) 78%, white 22%));
  overflow: hidden;
  padding: 14px;
}

@media (max-width: 1260px) {
  .showcase {
    grid-template-columns: 1fr;
    overflow: auto;
    padding: 14px;
  }

  .story-title {
    font-size: 32px;
  }

  .story-metrics,
  .ops-head {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ops-canvas {
    min-height: 330px;
  }
}
</style>
