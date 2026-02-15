<template>
  <div class="stage-data-ingestion" :class="{ active }">
    <!-- Central Processing Core -->
    <div class="core">
      <div class="core-outer">
        <div class="core-ring ring-1"></div>
        <div class="core-ring ring-2"></div>
        <div class="core-ring ring-3"></div>
      </div>
      <div class="core-center">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z" stroke="var(--accent)" stroke-width="1.5" opacity="0.6"/>
          <path d="M14 8L19 10.75V16.25L14 19L9 16.25V10.75L14 8Z" fill="var(--accent)" opacity="0.3"/>
          <circle cx="14" cy="14" r="2" fill="var(--accent)"/>
        </svg>
      </div>
      <div class="scan-line" v-if="active"></div>
    </div>

    <!-- Document Icons orbiting -->
    <div class="orbit-container">
      <div
        v-for="(doc, i) in documents"
        :key="doc.type"
        class="doc-item"
        :class="{ absorbed: doc.absorbed }"
        :style="{
          '--delay': `${i * 0.4}s`,
          '--angle': `${i * (360 / documents.length)}deg`,
          '--orbit-radius': '140px',
          '--color': doc.color,
        }"
      >
        <div class="doc-icon">
          <div class="doc-shape">
            <div class="doc-fold"></div>
            <span class="doc-ext">{{ doc.ext }}</span>
          </div>
          <div class="doc-glow"></div>
        </div>
        <span class="doc-label">{{ doc.label }}</span>
      </div>
    </div>

    <!-- Data Particles (emitted after absorption) -->
    <div class="particles" v-if="showParticles">
      <div
        v-for="n in 24"
        :key="n"
        class="particle"
        :style="{
          '--px': `${Math.cos(n * 0.8) * (40 + Math.random() * 60)}px`,
          '--py': `${Math.sin(n * 0.8) * (40 + Math.random() * 60)}px`,
          '--delay': `${n * 0.08}s`,
          '--size': `${2 + Math.random() * 3}px`,
        }"
      ></div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue'

const props = defineProps({
  active: Boolean,
  stageIndex: Number,
})

const documents = reactive([
  { type: 'pdf', ext: 'PDF', label: 'Research PDFs', color: '#F43F5E', absorbed: false },
  { type: 'ppt', ext: 'PPT', label: 'Presentations', color: '#F59E0B', absorbed: false },
  { type: 'doc', ext: 'DOC', label: 'Fund Briefs', color: '#3B82F6', absorbed: false },
  { type: 'xlsx', ext: 'XLS', label: 'Data Sheets', color: '#10B981', absorbed: false },
  { type: 'md', ext: 'MD', label: 'Strategy Memos', color: '#8B5CF6', absorbed: false },
  { type: 'wav', ext: 'WAV', label: 'Call Records', color: '#06B6D4', absorbed: false },
])

const showParticles = ref(false)

let timers = []

function clearTimers() {
  timers.forEach(t => clearTimeout(t))
  timers = []
}

function runAnimation() {
  clearTimers()
  showParticles.value = false
  documents.forEach(d => d.absorbed = false)

  // Absorb documents one by one
  documents.forEach((doc, i) => {
    timers.push(setTimeout(() => {
      doc.absorbed = true
    }, 2000 + i * 500))
  })

  // Show particles after all absorbed
  timers.push(setTimeout(() => {
    showParticles.value = true
  }, 2000 + documents.length * 500))

}

watch(() => props.active, (val) => {
  if (val) runAnimation()
  else clearTimers()
}, { immediate: true })

onUnmounted(clearTimers)
</script>

<style scoped>
.stage-data-ingestion {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* ── Core ── */
.core {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.core-outer {
  position: absolute;
  width: 100px;
  height: 100px;
}

.core-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid var(--accent-dim);
}

.ring-1 {
  animation: spin 8s linear infinite;
  border-style: dashed;
  border-color: var(--accent-dim);
}

.ring-2 {
  inset: -20px;
  animation: spin 12s linear infinite reverse;
  border-color: rgba(139, 92, 246, 0.1);
}

.ring-3 {
  inset: -40px;
  animation: spin 16s linear infinite;
  border-color: rgba(59, 130, 246, 0.06);
  border-style: dashed;
}

.core-center {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-dim);
  border: 1px solid var(--border-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  animation: pulseScale 3s ease-in-out infinite;
  box-shadow: 0 0 30px var(--accent-glow);
}

.scan-line {
  position: absolute;
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  animation: scanLine 2s ease-in-out infinite;
  z-index: 3;
  opacity: 0.6;
}

/* ── Orbit Documents ── */
.orbit-container {
  position: absolute;
  width: 320px;
  height: 320px;
}

.doc-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: rotate(var(--angle)) translateX(var(--orbit-radius)) rotate(calc(-1 * var(--angle)));
  margin: -24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) both;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.doc-item.absorbed {
  transform: rotate(var(--angle)) translateX(0px) rotate(calc(-1 * var(--angle))) scale(0);
  opacity: 0;
}

.doc-icon {
  position: relative;
  transition: transform 0.3s ease;
}

.doc-item:not(.absorbed) .doc-icon {
  animation: float 3s ease-in-out infinite;
  animation-delay: var(--delay);
}

.doc-shape {
  width: 40px;
  height: 48px;
  background: var(--bg-glass);
  border: 1px solid var(--color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.doc-fold {
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: var(--bg-primary);
  border-left: 1px solid var(--color);
  border-bottom: 1px solid var(--color);
  border-radius: 0 0 0 4px;
}

.doc-ext {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  color: var(--color);
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.doc-glow {
  position: absolute;
  inset: -4px;
  border-radius: 10px;
  background: var(--color);
  opacity: 0.1;
  filter: blur(8px);
}

.doc-label {
  font-size: 9px;
  font-weight: 500;
  color: var(--text-tertiary);
  white-space: nowrap;
  letter-spacing: 0.3px;
}

/* ── Particles ── */
.particles {
  position: absolute;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent-glow);
  animation: particleBurst 1.5s ease-out var(--delay) both;
}

@keyframes particleBurst {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; }
}

</style>
