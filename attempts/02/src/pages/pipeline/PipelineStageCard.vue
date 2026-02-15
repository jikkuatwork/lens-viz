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
  runtime: { type: Object, default: () => ({}) },
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  progress: { type: Number, default: 0 }
})

const emit = defineEmits(['select'])

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

const statusLabel = computed(() => {
  if (props.active) return 'Running'
  if (props.completed) return 'Done'
  return 'Queued'
})

const runtimeSignal = computed(() => props.runtime?.signal || props.stage.metrics[0].value)

const cardClass = computed(() => ({
  'stage-card-active': props.active,
  'stage-card-complete': props.completed,
  'stage-card-pending': !props.active && !props.completed
}))

const barWidth = computed(() => `${Math.round(Math.min(1, Math.max(0, props.progress)) * 100)}%`)
</script>

<template>
  <button class="stage-card" :class="cardClass" @click="emit('select')">
    <div class="stage-top">
      <span class="stage-code">{{ stage.code }}</span>
      <span class="stage-status">{{ statusLabel }}</span>
    </div>

    <h3 class="stage-title">{{ stage.title }}</h3>
    <p class="stage-subtitle">{{ stage.subtitle }}</p>

    <div class="stage-meta">
      <div class="stage-metric" v-for="metric in stage.metrics.slice(0, 2)" :key="metric.key">
        <span>{{ metric.label }}</span>
        <strong>{{ runtime?.metrics?.[metric.key] || metric.value }}</strong>
      </div>
    </div>

    <div class="stage-visual">
      <component
        :is="visualComponent"
        :active="active"
        :completed="completed" />
    </div>

    <div class="stage-runtime micro-label">{{ runtimeSignal }}</div>
    <div class="stage-outputs">
      <span v-for="item in stage.outputs.slice(0, 2)" :key="item">{{ item }}</span>
    </div>

    <div class="stage-progress-track">
      <span class="stage-progress-bar" :style="{ width: barWidth }"></span>
    </div>
  </button>
</template>

<style scoped>
.stage-card {
  width: 250px;
  min-height: 362px;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--z-border) 50%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 92%, white 8%);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  gap: 6px;
  transition: all 150ms ease;
}

.stage-card:hover {
  box-shadow: var(--shadow-md);
}

.stage-card-active {
  border-color: color-mix(in srgb, var(--z-accent-500) 55%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--z-accent-500) 24%, transparent);
}

.stage-card-complete {
  border-color: color-mix(in srgb, var(--z-accent-500) 40%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 40%, var(--z-surface-alt) 60%);
}

.stage-card-pending {
  opacity: 0.86;
}

.stage-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stage-code {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.stage-status {
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--z-accent-600) 55%, var(--z-text-sub) 45%);
}

.stage-title {
  margin: 0;
  font-size: 15px;
  line-height: 1.2;
  color: var(--z-text);
}

.stage-subtitle {
  margin: 0;
  min-height: 34px;
  font-size: 12px;
  line-height: 1.25;
  color: var(--z-text-sub);
}

.stage-meta {
  display: grid;
  gap: 4px;
}

.stage-metric {
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 55%, transparent);
  background: color-mix(in srgb, var(--z-surface) 76%, white 24%);
  padding: 5px 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.stage-metric span {
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.stage-metric strong {
  font-size: 11px;
  color: var(--z-text);
}

.stage-visual {
  height: 116px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--z-border) 45%, transparent);
  background: color-mix(in srgb, var(--z-surface) 80%, white 20%);
  overflow: hidden;
}

.stage-runtime {
  margin-top: auto;
}

.stage-outputs {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.stage-outputs span {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 34%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 48%, var(--z-surface-alt) 52%);
  color: color-mix(in srgb, var(--z-accent-700) 50%, var(--z-text) 50%);
  padding: 2px 7px;
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stage-progress-track {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 45%, transparent);
  overflow: hidden;
}

.stage-progress-bar {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--z-accent-600) 80%, transparent),
    color-mix(in srgb, var(--z-accent-300) 85%, white 15%)
  );
  transition: width 150ms linear;
}
</style>
