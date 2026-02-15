<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const tags = ['Sector fit', 'Traction score', 'Funding stage', 'Geo signal']
const schemaFields = ['taxonomy_sector', 'market_signal', 'fit_score', 'source_confidence']
</script>

<template>
  <div class="scene" :class="{ active, completed }">
    <section class="entity-cloud">
      <p class="panel-label">Entity Traits</p>
      <span
        v-for="(tag, index) in tags"
        :key="tag"
        class="tag"
        :style="{ animationDelay: `${index * 0.2}s` }">
        {{ tag }}
      </span>
    </section>

    <section class="mapper">
      <p class="panel-label">Schema Mapper</p>
      <div class="bridge">
        <span class="bridge-line line-1"></span>
        <span class="bridge-line line-2"></span>
        <span class="bridge-line line-3"></span>
      </div>
    </section>

    <section class="schema">
      <p class="panel-label">Schema Entity</p>
      <div class="schema-list">
        <div v-for="field in schemaFields" :key="field" class="schema-row">
          <span>{{ field }}</span>
          <span class="state">mapped</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scene {
  height: 100%;
  min-height: 0;
  padding: 8px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 12px;
}

.panel-label {
  margin: 0 0 10px;
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.entity-cloud,
.schema {
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 72%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 82%, white 18%);
  padding: 12px;
}

.entity-cloud {
  display: grid;
  align-content: start;
  gap: 8px;
}

.tag {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 35%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 50%, var(--z-surface-alt) 50%);
  color: color-mix(in srgb, var(--z-accent-700) 55%, var(--z-text) 45%);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: center;
  padding: 6px 8px;
  animation: tag-pulse 1.8s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .tag,
.scene.completed .tag {
  animation-play-state: running;
}

.mapper {
  width: clamp(110px, 12vw, 150px);
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 35%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 55%, var(--z-surface-alt) 45%);
  padding: 12px;
}

.bridge {
  position: relative;
  margin-top: 16px;
  height: 70%;
}

.bridge-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-accent-500) 40%, transparent);
  overflow: hidden;
}

.bridge-line::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, #6ad6ff 62%, var(--z-accent-300) 38%),
    transparent
  );
  animation: bridge-move 1.4s linear infinite;
  animation-play-state: paused;
}

.line-1 {
  top: 14%;
}

.line-2 {
  top: 48%;
}

.line-2::after {
  animation-delay: 0.25s;
}

.line-3 {
  top: 82%;
}

.line-3::after {
  animation-delay: 0.45s;
}

.scene.active .bridge-line::after,
.scene.completed .bridge-line::after {
  animation-play-state: running;
}

.schema {
  display: grid;
  grid-template-rows: auto 1fr;
}

.schema-list {
  display: grid;
  gap: 8px;
  align-content: start;
}

.schema-row {
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 72%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 84%, white 16%);
  display: flex;
  justify-content: space-between;
  gap: 9px;
  align-items: center;
  padding: 8px 9px;
  color: var(--z-text-sub);
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.state {
  color: color-mix(in srgb, var(--z-accent-700) 62%, var(--z-text) 38%);
  font-size: 10px;
}

@keyframes tag-pulse {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.75;
  }
  50% {
    transform: translateX(2px);
    opacity: 1;
  }
}

@keyframes bridge-move {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}

@media (max-width: 980px) {
  .scene {
    grid-template-columns: 1fr;
  }

  .mapper {
    width: 100%;
  }

  .bridge {
    height: 72px;
  }
}
</style>
