<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const columns = [28, 36, 22, 44, 30, 38, 52, 34]
const neighbors = ['HarborGrid AI', 'MarineFlow Systems', 'BlueDock Intelligence']
</script>

<template>
  <div class="scene" :class="{ active, completed }">
    <section class="embedding">
      <p class="panel-label">Embedding Field</p>
      <div class="vector-grid">
        <span
          v-for="(height, index) in columns"
          :key="height + '-' + index"
          class="column"
          :style="{ height: `${height}%`, animationDelay: `${index * 0.1}s` }"></span>
      </div>
    </section>

    <section class="retrieval">
      <p class="panel-label">Semantic Retrieval</p>
      <div class="query-box">query: logistics decarbonization platforms</div>
      <ul class="neighbor-list">
        <li
          v-for="(neighbor, index) in neighbors"
          :key="neighbor"
          :style="{ animationDelay: `${index * 0.15}s` }">
          {{ neighbor }}
        </li>
      </ul>
      <div class="query-pill">Top-K nearest neighbors</div>
    </section>
  </div>
</template>

<style scoped>
.scene {
  height: 100%;
  min-height: 0;
  padding: 8px;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 12px;
}

.embedding,
.retrieval {
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 72%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 82%, white 18%);
  padding: 12px;
  display: grid;
  align-content: start;
  gap: 10px;
}

.panel-label {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.vector-grid {
  height: 190px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-border) 56%, transparent);
  background: color-mix(in srgb, var(--z-surface) 75%, white 25%);
  display: flex;
  align-items: end;
  gap: 6px;
  padding: 10px;
}

.column {
  flex: 1;
  border-radius: 6px 6px 3px 3px;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--z-accent-600) 85%, transparent),
    color-mix(in srgb, var(--z-accent-200) 75%, white 25%)
  );
  animation: vector-wave 1.1s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .column,
.scene.completed .column {
  animation-play-state: running;
}

.query-box {
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--z-border) 58%, transparent);
  background: color-mix(in srgb, var(--z-surface) 78%, white 22%);
  color: var(--z-text-sub);
  font-size: 11px;
  line-height: 1.45;
  padding: 8px 10px;
}

.neighbor-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.neighbor-list li {
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 34%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 56%, var(--z-surface-alt) 44%);
  color: color-mix(in srgb, var(--z-accent-700) 55%, var(--z-text) 45%);
  font-size: 11px;
  padding: 7px 9px;
  animation: row-pulse 1.8s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .neighbor-list li,
.scene.completed .neighbor-list li {
  animation-play-state: running;
}

.query-pill {
  justify-self: center;
  border-radius: 999px;
  padding: 5px 11px;
  font-size: 10px;
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

@keyframes row-pulse {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.82;
  }
  50% {
    transform: translateX(3px);
    opacity: 1;
  }
}

@media (max-width: 980px) {
  .scene {
    grid-template-columns: 1fr;
  }

  .vector-grid {
    height: 120px;
  }
}
</style>
