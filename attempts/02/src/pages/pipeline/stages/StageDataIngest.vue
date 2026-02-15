<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const formats = ['pdf', 'ppt', 'docx', 'md', 'xlsx', 'email']
</script>

<template>
  <div class="live" :class="{ active, completed }">
    <div class="stream">
      <span
        v-for="(format, index) in formats"
        :key="format"
        class="token"
        :style="{ animationDelay: `${index * 0.18}s` }">
        {{ format }}
      </span>
    </div>
    <div class="collector">
      <span class="collector-slot"></span>
      <span class="collector-scan"></span>
    </div>
  </div>
</template>

<style scoped>
.live {
  position: relative;
  height: 100%;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stream {
  position: relative;
  border-radius: 8px;
  border: 1px dashed color-mix(in srgb, var(--z-border) 55%, transparent);
  overflow: hidden;
}

.token {
  position: absolute;
  left: 6px;
  top: -16px;
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--z-text-sub);
  border-radius: 999px;
  padding: 2px 6px;
  background: color-mix(in srgb, var(--z-surface-alt) 82%, white 18%);
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 65%, transparent);
  animation: drop 1.45s linear infinite;
  animation-play-state: paused;
}

.live.active .token,
.live.completed .token {
  animation-play-state: running;
}

.collector {
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 34%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 42%, var(--z-surface-alt) 58%);
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
}

.collector-slot {
  width: 76%;
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 70%, transparent);
}

.collector-scan {
  position: absolute;
  left: 7px;
  right: 7px;
  height: 16px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 40%, transparent);
  background: color-mix(in srgb, var(--z-accent-200) 25%, transparent);
  animation: scan 1.6s ease-in-out infinite;
  animation-play-state: paused;
}

.live.active .collector-scan,
.live.completed .collector-scan {
  animation-play-state: running;
}

@keyframes drop {
  0% {
    transform: translateY(-16px);
    opacity: 0;
  }
  22% {
    opacity: 1;
  }
  100% {
    transform: translateY(90px);
    opacity: 0;
  }
}

@keyframes scan {
  0% {
    top: 10px;
  }
  50% {
    top: calc(100% - 26px);
  }
  100% {
    top: 10px;
  }
}
</style>
