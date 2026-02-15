<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const agents = ['agent-a', 'agent-b', 'agent-c']
</script>

<template>
  <div class="live" :class="{ active, completed }">
    <div v-for="(agent, index) in agents" :key="agent" class="agent-row">
      <span class="agent-name">{{ agent }}</span>
      <span class="agent-track">
        <span class="agent-bar" :style="{ animationDelay: `${index * 0.2}s` }"></span>
      </span>
    </div>
    <div class="signal"></div>
  </div>
</template>

<style scoped>
.live {
  height: 100%;
  padding: 8px;
  display: grid;
  gap: 7px;
  align-content: center;
}

.agent-row {
  display: grid;
  grid-template-columns: 48px 1fr;
  align-items: center;
  gap: 5px;
}

.agent-name {
  font-size: 9px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--z-text-sub);
}

.agent-track {
  height: 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-border) 60%, transparent);
  background: color-mix(in srgb, var(--z-surface) 72%, white 28%);
  overflow: hidden;
}

.agent-bar {
  display: block;
  width: 38%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--z-accent-500) 85%, transparent),
    color-mix(in srgb, var(--z-accent-200) 80%, white 20%)
  );
  animation: agent-run 1.1s ease-in-out infinite;
  animation-play-state: paused;
}

.live.active .agent-bar,
.live.completed .agent-bar {
  animation-play-state: running;
}

.signal {
  margin-top: 4px;
  height: 12px;
  border-radius: 999px;
  background:
    repeating-linear-gradient(
      90deg,
      color-mix(in srgb, var(--z-accent-300) 30%, transparent) 0 4px,
      transparent 4px 8px
    );
  animation: signal-wave 1.2s linear infinite;
  animation-play-state: paused;
}

.live.active .signal,
.live.completed .signal {
  animation-play-state: running;
}

@keyframes agent-run {
  0% {
    transform: translateX(-30%);
  }
  100% {
    transform: translateX(175%);
  }
}

@keyframes signal-wave {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 40px 0;
  }
}
</style>
