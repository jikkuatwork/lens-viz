<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const rows = ['raw mention', 'entity parse', 'dedupe key', 'schema row']
</script>

<template>
  <div class="live" :class="{ active, completed }">
    <div class="table">
      <div v-for="row in rows" :key="row" class="row">
        <span>{{ row }}</span>
        <span class="dot"></span>
      </div>
      <span class="scanner"></span>
    </div>
  </div>
</template>

<style scoped>
.live {
  height: 100%;
  padding: 8px;
}

.table {
  position: relative;
  height: 100%;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--z-border) 55%, transparent);
  background: color-mix(in srgb, var(--z-surface) 76%, white 24%);
  padding: 6px;
  display: grid;
  gap: 4px;
  overflow: hidden;
}

.row {
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 55%, transparent);
  padding: 2px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--z-text-sub);
  background: color-mix(in srgb, var(--z-surface-alt) 85%, white 15%);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 80%, transparent);
}

.scanner {
  position: absolute;
  left: 6px;
  right: 6px;
  top: 6px;
  height: 16px;
  border-radius: 5px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 42%, transparent);
  background: color-mix(in srgb, var(--z-accent-200) 20%, transparent);
  animation: extract-scan 1.4s linear infinite;
  animation-play-state: paused;
}

.live.active .scanner,
.live.completed .scanner {
  animation-play-state: running;
}

@keyframes extract-scan {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(72px);
  }
}
</style>
