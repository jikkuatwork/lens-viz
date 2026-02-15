<script setup>
defineProps({
  active: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
})

const formats = ['pdf', 'ppt', 'docx', 'md', 'xlsx', 'email']
const packets = ['Text chunks', 'Source fingerprints', 'Entity hints']
</script>

<template>
  <div class="scene" :class="{ active, completed }">
    <section class="lane lane-input">
      <p class="lane-title">Incoming Sources</p>
      <span
        v-for="(format, index) in formats"
        :key="format"
        class="token"
        :style="{ animationDelay: `${index * 0.18}s` }">
        {{ format }}
      </span>
    </section>

    <section class="core">
      <span class="ring ring-a"></span>
      <span class="ring ring-b"></span>
      <div class="core-box">
        <p>Parser + OCR</p>
        <strong>Normalizer</strong>
      </div>
      <span class="beam beam-in"></span>
      <span class="beam beam-out"></span>
    </section>

    <section class="lane lane-output">
      <p class="lane-title">Normalized Payloads</p>
      <div class="packet-stack">
        <article
          v-for="(packet, index) in packets"
          :key="packet"
          class="packet"
          :style="{ animationDelay: `${index * 0.15}s` }">
          <span>{{ packet }}</span>
          <span class="dot"></span>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  height: 100%;
  min-height: 0;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: stretch;
}

.lane {
  position: relative;
  border-radius: 14px;
  background: color-mix(in srgb, var(--z-surface-alt) 78%, white 22%);
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 70%, transparent);
  padding: 12px;
}

.lane-input {
  border-style: dashed;
}

.lane-title {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.token {
  position: absolute;
  left: 12px;
  right: 12px;
  top: 32px;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--z-text-sub);
  border-radius: 999px;
  padding: 4px 10px;
  background: color-mix(in srgb, var(--z-surface-alt) 86%, white 14%);
  border: 1px dashed color-mix(in srgb, var(--z-border) 55%, transparent);
  animation: ingest-drop 2.4s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .token,
.scene.completed .token {
  animation-play-state: running;
}

.core {
  position: relative;
  width: clamp(160px, 18vw, 220px);
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 44%, transparent);
  background: color-mix(in srgb, var(--z-accent-50) 60%, var(--z-surface-alt) 40%);
  display: grid;
  place-items: center;
  overflow: hidden;
}

.ring {
  position: absolute;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 40%, transparent);
  animation: core-pulse 2.2s ease-out infinite;
  animation-play-state: paused;
}

.ring-a {
  width: 56%;
  height: 56%;
}

.ring-b {
  width: 78%;
  height: 78%;
  animation-delay: 0.45s;
}

.scene.active .ring,
.scene.completed .ring {
  animation-play-state: running;
}

.core-box {
  position: relative;
  z-index: 3;
  width: 75%;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 48%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 88%, white 12%);
  text-align: center;
  padding: 10px 8px;
}

.core-box p {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.core-box strong {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  color: var(--z-text);
}

.beam {
  position: absolute;
  top: 50%;
  width: 70px;
  height: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-accent-500) 46%, transparent);
  overflow: hidden;
}

.beam::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, #6ad6ff 62%, var(--z-accent-300) 38%),
    transparent
  );
  animation: beam-run 1.8s linear infinite;
  animation-play-state: paused;
}

.beam-in {
  left: -60px;
}

.beam-out {
  right: -60px;
}

.scene.active .beam::after,
.scene.completed .beam::after {
  animation-play-state: running;
}

.packet-stack {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}

.packet {
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--z-border) 55%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 84%, white 16%);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--z-text-sub);
  font-size: 11px;
  letter-spacing: 0.03em;
  animation: packet-rise 1.9s ease-in-out infinite;
  animation-play-state: paused;
}

.scene.active .packet,
.scene.completed .packet {
  animation-play-state: running;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-accent-500) 75%, white 25%);
}

@keyframes ingest-drop {
  0%,
  100% {
    transform: translateY(-2px);
    opacity: 0.45;
  }
  50% {
    transform: translateY(102px);
    opacity: 1;
  }
}

@keyframes core-pulse {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes beam-run {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}

@keyframes packet-rise {
  0%,
  100% {
    transform: translateX(0);
    border-color: color-mix(in srgb, var(--z-border) 55%, transparent);
  }
  50% {
    transform: translateX(4px);
    border-color: color-mix(in srgb, var(--z-accent-500) 44%, transparent);
  }
}

@media (max-width: 980px) {
  .scene {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .core {
    width: 100%;
    min-height: 142px;
  }
}
</style>
