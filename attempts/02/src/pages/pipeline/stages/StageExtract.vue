<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const rawRows = ['hydrogen tug', 'fleet ai', 'berth routing', 'emissions stack']
const normalizedRows = ['entity_id', 'company_name', 'taxonomy_tag', 'confidence']
</script>

<template>
  <div class="scene" :class="{ active, completed }">
    <section class="panel panel-raw">
      <p class="panel-label">Raw Mentions</p>
      <div class="rows">
        <div
          v-for="(row, index) in rawRows"
          :key="row"
          class="row"
          :style="{ animationDelay: `${index * 0.15}s` }">
          <span>{{ row }}</span>
          <span class="dot"></span>
        </div>
      </div>
    </section>

    <div class="bridge" aria-hidden="true">
      <span class="bridge-line"></span>
      <span class="bridge-pulse"></span>
    </div>

    <section class="panel panel-structured">
      <p class="panel-label">Structured Schema</p>
      <div class="rows">
        <div v-for="row in normalizedRows" :key="row" class="row row-final">
          <span>{{ row }}</span>
          <span class="row-value">mapped</span>
        </div>
      </div>
      <span class="scanner"></span>
    </section>
  </div>
</template>

<style scoped>
.scene {
  height: 100%;
  min-height: 0;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: stretch;
}

.panel {
  position: relative;
  height: 100%;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 72%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 82%, white 18%);
  padding: 12px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;
}

.panel-label {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.rows {
  display: grid;
  gap: 7px;
  align-content: start;
}

.row {
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 55%, transparent);
  padding: 7px 9px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--z-text-sub);
  background: color-mix(in srgb, var(--z-surface-alt) 85%, white 15%);
  animation: raw-shift 1.9s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .row,
.scene.completed .row {
  animation-play-state: running;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-accent-500) 72%, white 28%);
}

.row-final {
  animation: none;
}

.row-value {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--z-accent-700) 62%, var(--z-text) 38%);
}

.scanner {
  position: absolute;
  left: 10px;
  right: 10px;
  top: 34px;
  height: 22px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 42%, transparent);
  background: color-mix(in srgb, var(--z-accent-200) 20%, transparent);
  animation: extract-scan 1.7s linear infinite;
  animation-play-state: paused;
}

.scene.active .scanner,
.scene.completed .scanner {
  animation-play-state: running;
}

.bridge {
  width: 74px;
  display: grid;
  place-items: center;
  position: relative;
}

.bridge-line {
  width: 100%;
  height: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 65%, transparent);
}

.bridge-pulse {
  position: absolute;
  width: 11px;
  height: 11px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 44%, transparent);
  background: color-mix(in srgb, var(--z-accent-300) 60%, white 40%);
  left: 0;
  animation: bridge-travel 1.7s linear infinite;
  animation-play-state: paused;
}

.scene.active .bridge-pulse,
.scene.completed .bridge-pulse {
  animation-play-state: running;
}

@keyframes raw-shift {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(3px);
  }
}

@keyframes extract-scan {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(118px);
  }
}

@keyframes bridge-travel {
  from {
    left: 0;
  }
  to {
    left: calc(100% - 10px);
  }
}

@media (max-width: 980px) {
  .scene {
    grid-template-columns: 1fr;
  }

  .bridge {
    width: 100%;
    height: 24px;
  }

  .bridge-line {
    width: 70%;
  }
}
</style>
