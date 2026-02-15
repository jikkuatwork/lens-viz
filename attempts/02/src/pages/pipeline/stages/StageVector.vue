<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const columns = [28, 36, 22, 44, 30, 38]
</script>

<template>
  <div class="live" :class="{ active, completed }">
    <div class="vector-grid">
      <span v-for="(height, index) in columns" :key="height + '-' + index" class="column" :style="{ height: `${height}%`, animationDelay: `${index * 0.12}s` }"></span>
    </div>
    <div class="query-pill">semantic search</div>
  </div>
</template>

<style scoped>
.live {
  height: 100%;
  padding: 8px;
  display: grid;
  align-content: center;
  gap: 10px;
}

.vector-grid {
  height: 62px;
  border-radius: 9px;
  border: 1px solid color-mix(in srgb, var(--z-border) 56%, transparent);
  background: color-mix(in srgb, var(--z-surface) 75%, white 25%);
  display: flex;
  align-items: end;
  gap: 4px;
  padding: 7px;
}

.column {
  flex: 1;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--z-accent-600) 85%, transparent),
    color-mix(in srgb, var(--z-accent-200) 75%, white 25%)
  );
  animation: vector-wave 1.1s ease-in-out infinite;
  animation-play-state: paused;
}

.live.active .column,
.live.completed .column {
  animation-play-state: running;
}

.query-pill {
  justify-self: center;
  border-radius: 999px;
  padding: 3px 9px;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 42%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 58%, var(--z-surface-alt) 42%);
  color: color-mix(in srgb, var(--z-accent-700) 70%, var(--z-text) 30%);
}

@keyframes vector-wave {
  0%,
  100% {
    transform: scaleY(0.65);
    transform-origin: bottom;
  }
  50% {
    transform: scaleY(1);
    transform-origin: bottom;
  }
}
</style>
