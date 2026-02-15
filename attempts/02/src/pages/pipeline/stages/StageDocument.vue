<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})
</script>

<template>
  <div class="live" :class="{ active, completed }">
    <div class="md-sheet">
      <span class="line long"></span>
      <span class="line mid"></span>
      <span class="line short"></span>
    </div>
    <div class="pdf-card">
      <span class="pdf-top">pdf</span>
      <span class="pdf-page"></span>
    </div>
  </div>
</template>

<style scoped>
.live {
  height: 100%;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.md-sheet,
.pdf-card {
  border-radius: 9px;
  border: 1px solid color-mix(in srgb, var(--z-border) 58%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 84%, white 16%);
  padding: 7px;
}

.md-sheet {
  display: grid;
  align-content: center;
  gap: 5px;
}

.line {
  height: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 78%, transparent);
  animation: typing 1.8s ease-in-out infinite;
  animation-play-state: paused;
}

.live.active .line,
.live.completed .line {
  animation-play-state: running;
}

.long { width: 90%; }
.mid { width: 70%; animation-delay: 0.14s; }
.short { width: 56%; animation-delay: 0.28s; }

.pdf-card {
  position: relative;
  overflow: hidden;
}

.pdf-top {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--z-text-faint);
}

.pdf-page {
  position: absolute;
  inset: 22px 6px 6px 6px;
  border-radius: 5px;
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--z-surface-deep) 70%, white 30%),
    color-mix(in srgb, var(--z-surface) 85%, white 15%)
  );
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 60%, transparent);
  animation: flip 2.2s ease-in-out infinite;
  animation-play-state: paused;
}

.live.active .pdf-page,
.live.completed .pdf-page {
  animation-play-state: running;
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
</style>
