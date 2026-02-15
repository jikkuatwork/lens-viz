<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import StageShowcase from './StageShowcase.vue'

import { fallbackRuntime, pipelineStages } from '../../lib/pipeline-data.js'
import { fetchPipelineRuntime } from '../../lib/api.js'

const stages = pipelineStages

const route = useRoute()
const router = useRouter()

const runtimeMap = ref({ ...fallbackRuntime })

function clampIndex(value) {
  return Math.max(0, Math.min(stages.length - 1, value))
}

const slideIndex = computed(() => {
  const parsed = Number(route.params.index || 1) - 1
  if (Number.isNaN(parsed)) return 0
  return clampIndex(parsed)
})

const activeStage = computed(() => stages[slideIndex.value])
const isFirst = computed(() => slideIndex.value === 0)
const isLast = computed(() => slideIndex.value === stages.length - 1)

function toSlide(index) {
  const bounded = clampIndex(index) + 1
  router.push(`/slide/${bounded}`)
}

function nextSlide() {
  if (!isLast.value) toSlide(slideIndex.value + 1)
}

function prevSlide() {
  if (!isFirst.value) toSlide(slideIndex.value - 1)
}

function handleKeydown(event) {
  const target = event.target
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
    return
  }

  if (event.code === 'ArrowRight' || event.code === 'Space') {
    event.preventDefault()
    nextSlide()
  }

  if (event.code === 'ArrowLeft') {
    event.preventDefault()
    prevSlide()
  }
}

async function loadRuntime() {
  const payload = await fetchPipelineRuntime()
  if (!payload || !payload.runtime || typeof payload.runtime !== 'object') {
    return
  }

  runtimeMap.value = {
    ...runtimeMap.value,
    ...payload.runtime
  }
}

watch(
  () => route.params.index,
  (newValue) => {
    const parsed = Number(newValue || 1)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > stages.length) {
      toSlide(0)
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadRuntime()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="pipeline-shell safe-bottom safe-left safe-right">
    <div class="ambient-layer" aria-hidden="true"></div>
    <div class="dot-layer" aria-hidden="true"></div>

    <div class="pipeline-frame">
      <header class="slide-head card-surface z-fade-in">
        <div>
          <div class="micro-label">Agentic Fund Intelligence Pipeline</div>
          <h1 class="title">CX Lens Visual SOP</h1>
        </div>

        <div class="head-right">
          <span class="slide-label">Slide {{ String(slideIndex + 1).padStart(2, '0') }} / {{ String(stages.length).padStart(2, '0') }}</span>
          <div class="buttons">
            <button class="nav-btn" :disabled="isFirst" @click="prevSlide">Previous</button>
            <button class="nav-btn nav-btn-primary" :disabled="isLast" @click="nextSlide">Next</button>
          </div>
        </div>
      </header>

      <section class="hero-region">
        <StageShowcase :stage="activeStage" :runtime="runtimeMap[activeStage.id]" />
      </section>

      <footer class="mini-footer card-surface">
        <span class="micro-label">Current Step</span>
        <strong>{{ activeStage.code }} · {{ activeStage.title }}</strong>
        <span class="footer-sep">•</span>
        <span>{{ runtimeMap[activeStage.id]?.signal || activeStage.metrics[0].value }}</span>
        <span class="footer-sep">•</span>
        <span>{{ runtimeMap[activeStage.id]?.queue || activeStage.outputs[0] }}</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.pipeline-shell {
  position: relative;
  height: 100%;
  background: var(--z-surface);
  overflow: hidden;
}

.ambient-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 9% 18%, color-mix(in srgb, var(--z-accent-200) 40%, transparent), transparent 42%),
    radial-gradient(circle at 84% 74%, color-mix(in srgb, var(--z-accent-100) 35%, transparent), transparent 47%);
  opacity: 0.65;
}

.dot-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, color-mix(in srgb, var(--z-border-sub) 55%, transparent) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.55;
}

.pipeline-frame {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 12px;
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  gap: 10px;
}

.slide-head {
  padding: 11px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title {
  margin: 4px 0 0;
  font-size: 26px;
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.head-right {
  display: grid;
  gap: 8px;
  justify-items: end;
}

.slide-label {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.buttons {
  display: flex;
  gap: 8px;
}

.nav-btn {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-border) 55%, transparent);
  background: var(--z-surface-alt);
  color: var(--z-text);
  font-size: 13px;
  font-weight: 520;
  padding: 7px 14px;
}

.nav-btn:hover:not(:disabled) {
  box-shadow: var(--shadow-md);
}

.nav-btn:disabled {
  opacity: 0.45;
}

.nav-btn-primary {
  background: var(--z-accent-500);
  border-color: color-mix(in srgb, var(--z-accent-600) 60%, transparent);
  color: var(--z-on-accent);
}

.hero-region {
  min-height: 0;
}

.mini-footer {
  min-height: 40px;
  padding: 7px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--z-text-sub);
}

.mini-footer strong {
  color: var(--z-text);
  font-size: 12px;
}

.footer-sep {
  color: var(--z-text-faint);
}

@media (max-width: 1100px) {
  .title {
    font-size: 22px;
  }

  .mini-footer {
    flex-wrap: wrap;
  }
}
</style>
