<script setup>
const props = defineProps({
  playing: { type: Boolean, required: true },
  speed: { type: Number, required: true },
  atStart: { type: Boolean, required: true },
  atEnd: { type: Boolean, required: true }
})

const emit = defineEmits(['prev', 'next', 'toggle', 'reset', 'setSpeed'])

const speeds = [
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1 },
  { label: '1.5x', value: 1.5 }
]

function pickSpeed(value) {
  emit('setSpeed', value)
}
</script>

<template>
  <div class="controls card-surface">
    <div class="control-row">
      <button class="control-btn" :disabled="atStart" @click="emit('prev')">Prev</button>
      <button class="control-btn control-btn-accent" @click="emit('toggle')">
        {{ playing ? 'Pause' : 'Play' }}
      </button>
      <button class="control-btn" :disabled="atEnd" @click="emit('next')">Next</button>
      <button class="control-btn" @click="emit('reset')">Reset</button>
    </div>
    <div class="speed-row">
      <span class="micro-label">Playback</span>
      <div class="speed-group">
        <button
          v-for="entry in speeds"
          :key="entry.value"
          class="speed-btn"
          :class="{ 'speed-btn-active': entry.value === speed }"
          @click="pickSpeed(entry.value)">
          {{ entry.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  border: 1px solid color-mix(in srgb, var(--z-border) 50%, transparent);
  background: var(--z-surface-alt);
  color: var(--z-text);
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 520;
}

.control-btn:hover:not(:disabled) {
  box-shadow: var(--shadow-md);
}

.control-btn:disabled {
  opacity: 0.45;
}

.control-btn-accent {
  background: var(--z-accent-500);
  border-color: color-mix(in srgb, var(--z-accent-600) 60%, transparent);
  color: var(--z-on-accent);
}

.speed-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.speed-group {
  display: inline-flex;
  border-radius: 999px;
  padding: 2px;
  border: 1px solid color-mix(in srgb, var(--z-border) 50%, transparent);
  background: var(--z-surface);
}

.speed-btn {
  border: 0;
  background: transparent;
  color: var(--z-text-sub);
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 520;
}

.speed-btn-active {
  background: var(--z-surface-alt);
  color: var(--z-text);
  box-shadow: var(--shadow-sm);
}
</style>
