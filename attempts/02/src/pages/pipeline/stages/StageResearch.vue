<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const agents = [
  { name: 'Agent Alpha', focus: 'Market traction' },
  { name: 'Agent Delta', focus: 'Funding signals' },
  { name: 'Agent Sigma', focus: 'Product maturity' },
  { name: 'Agent Nova', focus: 'Regional footprint' }
]

const evidenceSignals = ['Citation validated', 'Revenue proxy found', 'Hiring velocity scored']
</script>

<template>
  <div class="scene" :class="{ active, completed }">
    <section class="agent-grid">
      <article
        v-for="(agent, index) in agents"
        :key="agent.name"
        class="agent-card"
        :style="{ animationDelay: `${index * 0.12}s` }">
        <p class="agent-name">{{ agent.name }}</p>
        <p class="agent-focus">{{ agent.focus }}</p>
        <span class="agent-track">
          <span class="agent-bar" :style="{ animationDelay: `${index * 0.2}s` }"></span>
        </span>
      </article>
    </section>

    <section class="evidence">
      <p class="evidence-label">Evidence Stream</p>
      <ul class="evidence-list">
        <li
          v-for="(signal, index) in evidenceSignals"
          :key="signal"
          :style="{ animationDelay: `${index * 0.2}s` }">
          {{ signal }}
        </li>
      </ul>
      <span class="signal"></span>
    </section>
  </div>
</template>

<style scoped>
.scene {
  height: 100%;
  min-height: 0;
  padding: 8px;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 12px;
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.agent-card {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 70%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 85%, white 15%);
  padding: 10px;
  display: grid;
  gap: 6px;
  animation: card-breathe 2.3s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .agent-card,
.scene.completed .agent-card {
  animation-play-state: running;
}

.agent-name {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--z-text);
}

.agent-focus {
  margin: 0;
  font-size: 12px;
  color: var(--z-text-sub);
  min-height: 2.4em;
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
  animation: agent-run 1.3s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .agent-bar,
.scene.completed .agent-bar {
  animation-play-state: running;
}

.evidence {
  position: relative;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 32%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 52%, var(--z-surface-alt) 48%);
  padding: 12px;
  display: grid;
  align-content: start;
  gap: 10px;
}

.evidence-label {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.evidence-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.evidence-list li {
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 70%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 85%, white 15%);
  padding: 8px 9px;
  color: var(--z-text-sub);
  font-size: 11px;
  animation: signal-breathe 2.1s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .evidence-list li,
.scene.completed .evidence-list li {
  animation-play-state: running;
}

.signal {
  margin-top: auto;
  height: 12px;
  border-radius: 999px;
  background:
    repeating-linear-gradient(
      90deg,
      color-mix(in srgb, var(--z-accent-300) 35%, transparent) 0 5px,
      transparent 5px 9px
    );
  animation: signal-wave 1.2s linear infinite;
  animation-play-state: paused;
}

.scene.active .signal,
.scene.completed .signal {
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

@keyframes card-breathe {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes signal-breathe {
  0%,
  100% {
    border-color: color-mix(in srgb, var(--z-border-sub) 70%, transparent);
  }
  50% {
    border-color: color-mix(in srgb, var(--z-accent-500) 40%, transparent);
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

@media (max-width: 980px) {
  .scene {
    grid-template-columns: 1fr;
  }
}
</style>
