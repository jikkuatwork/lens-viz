<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const branches = ['vessel ai', 'cii compliance', 'port ops', 'decarbonization']
const outputs = ['queries', 'reports']
</script>

<template>
  <div class="live" :class="{ active, completed }">
    <div class="hub">taxonomy</div>
    <div class="branch-grid">
      <span
        v-for="(branch, index) in branches"
        :key="branch"
        class="branch"
        :style="{ animationDelay: `${index * 0.16}s` }">
        {{ branch }}
      </span>
    </div>
    <div class="output-row">
      <span v-for="output in outputs" :key="output" class="output">{{ output }}</span>
    </div>
  </div>
</template>

<style scoped>
.live {
  height: 100%;
  padding: 8px;
  display: grid;
  grid-template-rows: 28px 1fr 20px;
  gap: 7px;
}

.hub {
  justify-self: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 40%, transparent);
  background: color-mix(in srgb, var(--z-accent-100) 58%, var(--z-surface-alt) 42%);
  color: color-mix(in srgb, var(--z-accent-700) 65%, var(--z-text) 35%);
}

.branch-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}

.branch {
  border-radius: 7px;
  border: 1px solid color-mix(in srgb, var(--z-border) 55%, transparent);
  background: color-mix(in srgb, var(--z-surface) 78%, white 22%);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--z-text-sub);
  display: grid;
  place-items: center;
  animation: branch-flow 1.6s ease-in-out infinite;
  animation-play-state: paused;
}

.live.active .branch,
.live.completed .branch {
  animation-play-state: running;
}

.output-row {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.output {
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--z-text-sub);
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 58%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 88%, white 12%);
}

@keyframes branch-flow {
  0%,
  100% {
    transform: translateY(0);
    border-color: color-mix(in srgb, var(--z-border) 55%, transparent);
  }
  50% {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--z-accent-500) 50%, transparent);
  }
}
</style>
