<script setup>
import { computed } from 'vue'

const props = defineProps({
  stage: { type: Object, required: true },
  runtime: { type: Object, default: () => ({}) },
  progress: { type: Number, required: true }
})

const progressLabel = computed(() => `${Math.round(props.progress * 100)}%`)

const detailMetrics = computed(() => {
  return props.stage.metrics.map((metric) => {
    const runtimeMetric = props.runtime?.metrics?.[metric.key]
    return {
      ...metric,
      value: runtimeMetric || metric.value
    }
  })
})
</script>

<template>
  <section class="details card-surface z-slide-up">
    <div class="details-head">
      <div>
        <div class="micro-label">Current Step</div>
        <h2 class="details-title">{{ stage.code }} · {{ stage.title }}</h2>
      </div>
      <div class="details-progress-chip">{{ progressLabel }}</div>
    </div>

    <p class="details-narrative">{{ stage.narrative }}</p>

    <div class="details-progress-track">
      <span class="details-progress-bar" :style="{ width: progressLabel }"></span>
    </div>

    <div class="details-grid">
      <div class="details-block">
        <div class="micro-label">Outputs</div>
        <ul class="detail-list">
          <li v-for="item in stage.outputs" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="details-block">
        <div class="micro-label">Live Metrics</div>
        <div class="metric-stack">
          <div v-for="metric in detailMetrics" :key="metric.key" class="metric-row">
            <span class="metric-label">{{ metric.label }}</span>
            <span class="metric-value">{{ metric.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 330px;
}

.details-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.details-title {
  margin: 4px 0 0;
  font-size: 24px;
  line-height: 1.2;
  color: var(--z-text);
}

.details-progress-chip {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 45%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 62%, white 38%);
  color: color-mix(in srgb, var(--z-accent-700) 70%, var(--z-text) 30%);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 620;
  padding: 6px 10px;
}

.details-narrative {
  margin: 0;
  color: var(--z-text-sub);
  font-size: 14px;
  line-height: 1.48;
}

.details-progress-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 45%, transparent);
  overflow: hidden;
}

.details-progress-bar {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--z-accent-600) 85%, transparent),
    color-mix(in srgb, var(--z-accent-300) 85%, white 15%)
  );
  transition: width 120ms linear;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.details-block {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-border) 45%, transparent);
  background: color-mix(in srgb, var(--z-surface) 72%, white 28%);
  padding: 12px;
}

.detail-list {
  margin: 8px 0 0;
  padding-left: 16px;
  display: grid;
  gap: 6px;
  color: var(--z-text-sub);
  font-size: 13px;
}

.metric-stack {
  display: grid;
  margin-top: 8px;
  gap: 8px;
}

.metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid color-mix(in srgb, var(--z-border-sub) 60%, transparent);
  padding-bottom: 6px;
}

.metric-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.metric-label {
  color: var(--z-text-sub);
  font-size: 12px;
}

.metric-value {
  color: color-mix(in srgb, var(--z-accent-700) 60%, var(--z-text) 40%);
  font-size: 12px;
  font-weight: 620;
}
</style>
