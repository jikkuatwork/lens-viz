<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const sections = ['Executive summary', 'Company snapshots', 'Comparative matrix', 'Decision notes']
</script>

<template>
  <div class="scene" :class="{ active, completed }">
    <section class="composer">
      <p class="panel-label">Composer</p>
      <div class="md-sheet">
        <span class="line long"></span>
        <span class="line mid"></span>
        <span class="line short"></span>
        <span class="line mid"></span>
      </div>

      <ul class="section-list">
        <li
          v-for="(section, index) in sections"
          :key="section"
          :style="{ animationDelay: `${index * 0.15}s` }">
          {{ section }}
        </li>
      </ul>
    </section>

    <section class="final-pack">
      <p class="panel-label">Final Delivery</p>
      <div class="pdf-card">
        <span class="pdf-top">pdf pack</span>
        <span class="pdf-page"></span>
      </div>
      <div class="list-card">
        <span class="list-row"></span>
        <span class="list-row"></span>
        <span class="list-row short"></span>
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
  grid-template-columns: 1.2fr 1fr;
  gap: 12px;
}

.composer,
.final-pack {
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

.md-sheet {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-border) 58%, transparent);
  background: color-mix(in srgb, var(--z-surface) 76%, white 24%);
  padding: 10px;
  display: grid;
  align-content: center;
  gap: 6px;
}

.line {
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 72%, transparent);
  animation: typing 1.8s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .line,
.scene.completed .line {
  animation-play-state: running;
}

.long { width: 90%; }
.mid { width: 70%; animation-delay: 0.14s; }
.short { width: 56%; animation-delay: 0.28s; }

.section-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 7px;
}

.section-list li {
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 70%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 86%, white 14%);
  color: var(--z-text-sub);
  font-size: 11px;
  padding: 7px 9px;
  animation: section-shift 1.9s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .section-list li,
.scene.completed .section-list li {
  animation-play-state: running;
}

.pdf-card {
  position: relative;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-border) 58%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 84%, white 16%);
  padding: 9px;
  position: relative;
  overflow: hidden;
  min-height: 150px;
}

.pdf-top {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--z-text-faint);
}

.pdf-page {
  position: absolute;
  inset: 28px 9px 9px 9px;
  border-radius: 8px;
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--z-surface-deep) 70%, white 30%),
    color-mix(in srgb, var(--z-surface) 85%, white 15%)
  );
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 60%, transparent);
  animation: flip 2.3s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .pdf-page,
.scene.completed .pdf-page {
  animation-play-state: running;
}

.list-card {
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 36%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 54%, var(--z-surface-alt) 46%);
  padding: 10px;
  display: grid;
  gap: 8px;
}

.list-row {
  display: block;
  height: 6px;
  width: 100%;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-accent-300) 45%, var(--z-border) 55%);
}

.list-row.short {
  width: 72%;
}

@keyframes typing {
  0%,
  100% {
    transform: scaleX(0.45);
    transform-origin: left;
  }
  50% {
    transform: scaleX(1);
    transform-origin: left;
  }
}

@keyframes flip {
  0%,
  100% {
    transform: perspective(140px) rotateY(0deg);
  }
  50% {
    transform: perspective(140px) rotateY(-20deg);
  }
}

@keyframes section-shift {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(3px);
  }
}

@media (max-width: 980px) {
  .scene {
    grid-template-columns: 1fr;
  }
}
</style>
