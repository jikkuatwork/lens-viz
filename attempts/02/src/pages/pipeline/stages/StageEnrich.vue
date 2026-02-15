<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const tags = ['sector-fit', 'traction', 'funding']
</script>

<template>
  <div class="live" :class="{ active, completed }">
    <div class="profile">
      <span class="avatar"></span>
      <div class="lines">
        <span class="line line-main"></span>
        <span class="line"></span>
        <span class="line"></span>
      </div>
    </div>
    <div class="tag-row">
      <span v-for="(tag, index) in tags" :key="tag" class="tag" :style="{ animationDelay: `${index * 0.2}s` }">{{ tag }}</span>
    </div>
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

.profile {
  border-radius: 9px;
  border: 1px solid color-mix(in srgb, var(--z-border) 58%, transparent);
  background: color-mix(in srgb, var(--z-surface) 74%, white 26%);
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 8px;
  padding: 8px;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-accent-300) 65%, white 35%);
}

.lines {
  display: grid;
  gap: 4px;
}

.line {
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 75%, transparent);
}

.line-main {
  width: 85%;
  animation: fill-line 1.6s ease-in-out infinite;
  animation-play-state: paused;
}

.live.active .line-main,
.live.completed .line-main {
  animation-play-state: running;
}

.tag-row {
  display: grid;
  gap: 5px;
}

.tag {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 35%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 50%, var(--z-surface-alt) 50%);
  color: color-mix(in srgb, var(--z-accent-700) 55%, var(--z-text) 45%);
  font-size: 9px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: center;
  padding: 2px 6px;
  animation: tag-pulse 1.8s ease-in-out infinite;
  animation-play-state: paused;
}

.live.active .tag,
.live.completed .tag {
  animation-play-state: running;
}

@keyframes fill-line {
  0%,
  100% {
    width: 45%;
  }
  50% {
    width: 92%;
  }
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
</style>
