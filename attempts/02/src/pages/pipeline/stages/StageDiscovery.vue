<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const branches = [
  'Decarbonization infra',
  'Port optimization',
  'Regulatory compliance',
  'Maritime analytics'
]

const outputs = ['Query clusters', 'Analyst briefs']
</script>

<template>
  <div class="scene" :class="{ active, completed }">
    <header class="hub">
      <span class="hub-dot"></span>
      <div>
        <p class="hub-label">Thesis Engine</p>
        <strong>Query Expansion</strong>
      </div>
    </header>

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
      <span
        v-for="(output, index) in outputs"
        :key="output"
        class="output"
        :style="{ animationDelay: `${index * 0.2}s` }">
        {{ output }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  height: 100%;
  min-height: 0;
  padding: 10px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  background:
    radial-gradient(circle at 50% 24%, color-mix(in srgb, var(--z-accent-100) 38%, transparent), transparent 52%);
}

.hub {
  justify-self: center;
  width: min(310px, 100%);
  border-radius: 14px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 44%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 84%, white 16%);
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 9px;
}

.hub-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-accent-500) 78%, white 22%);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--z-accent-500) 18%, transparent);
}

.hub-label {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.hub strong {
  display: block;
  margin-top: 2px;
  font-size: 15px;
  color: var(--z-text);
  letter-spacing: -0.01em;
}

.branch-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  position: relative;
}

.branch-grid::before {
  content: '';
  position: absolute;
  top: -15px;
  left: 50%;
  width: 1px;
  height: 15px;
  background: color-mix(in srgb, var(--z-accent-500) 42%, transparent);
}

.branch-grid::after {
  content: '';
  position: absolute;
  top: -15px;
  left: 25%;
  width: 50%;
  height: 1px;
  background: color-mix(in srgb, var(--z-accent-500) 42%, transparent);
}

.branch {
  border-radius: 11px;
  border: 1px solid color-mix(in srgb, var(--z-border) 54%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 84%, white 16%);
  font-size: 11px;
  line-height: 1.25;
  letter-spacing: 0.02em;
  color: var(--z-text-sub);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
  animation: branch-flow 1.6s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .branch,
.scene.completed .branch {
  animation-play-state: running;
}

.output-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.output {
  border-radius: 999px;
  padding: 5px 11px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--z-accent-700) 58%, var(--z-text) 42%);
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 45%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 58%, var(--z-surface-alt) 42%);
  animation: output-pop 1.8s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .output,
.scene.completed .output {
  animation-play-state: running;
}

@keyframes branch-flow {
  0%,
  100% {
    transform: translateY(0);
    border-color: color-mix(in srgb, var(--z-border) 55%, transparent);
  }
  50% {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--z-accent-500) 50%, transparent);
  }
}

@keyframes output-pop {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.78;
  }
  50% {
    transform: translateY(-2px);
    opacity: 1;
  }
}
</style>
