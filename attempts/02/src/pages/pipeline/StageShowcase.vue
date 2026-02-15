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
</script>

<template>
  <section class="hero card-surface z-slide-up">
    <div class="hero-left">
      <div class="micro-label">Slide {{ stage.code }}</div>
      <h2 class="hero-title">{{ stage.title }}</h2>
      <p class="hero-subtitle">{{ stage.subtitle }}</p>
      <p class="hero-narrative">{{ stage.narrative }}</p>

      <div class="metrics">
        <article v-for="metric in detailMetrics" :key="metric.label" class="metric-chip">
          <span class="metric-label">{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </article>
      </div>

      <div class="outputs">
        <span v-for="output in stage.outputs" :key="output" class="output-pill">{{ output }}</span>
      </div>
    </div>

    <div class="hero-right">
      <div class="visual-wrap">
        <component :is="visualComponent" :active="true" :completed="false" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 0;
  height: 100%;
  padding: 18px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 18px;
}

.hero-left {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero-title {
  margin: 0;
  font-size: 36px;
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--z-text);
}

.hero-subtitle {
  margin: 0;
  color: color-mix(in srgb, var(--z-accent-700) 45%, var(--z-text-sub) 55%);
  font-size: 15px;
  font-weight: 520;
}

.hero-narrative {
  margin: 0;
  font-size: 15px;
  line-height: 1.48;
  color: var(--z-text-sub);
  max-width: 70ch;
}

.metrics {
  margin-top: 4px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.metric-chip {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-border) 48%, transparent);
  background: color-mix(in srgb, var(--z-surface) 80%, white 20%);
  padding: 8px;
  display: grid;
  gap: 4px;
}

.metric-label {
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.metric-chip strong {
  font-size: 15px;
  color: var(--z-text);
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

.hero-right {
  min-width: 0;
}

.visual-wrap {
  height: 100%;
  min-height: 360px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--z-border) 50%, transparent);
  background: color-mix(in srgb, var(--z-surface) 76%, white 24%);
  overflow: hidden;
  padding: 10px;
}

@media (max-width: 1260px) {
  .hero {
    grid-template-columns: 1fr;
    overflow: auto;
  }

  .hero-title {
    font-size: 30px;
  }

  .metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
