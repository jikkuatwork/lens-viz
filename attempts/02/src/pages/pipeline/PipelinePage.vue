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
const deckProgress = computed(() => ((slideIndex.value + 1) / stages.length) * 100)
const deckProgressLabel = computed(() => `${Math.round(deckProgress.value)}%`)

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
    <div class="ambient-layer ambient-layer-left" aria-hidden="true"></div>
    <div class="ambient-layer ambient-layer-right" aria-hidden="true"></div>
    <div class="grain-layer" aria-hidden="true"></div>

    <div class="pipeline-frame">
      <header class="deck-head card-surface z-fade-in">
        <div class="deck-title-block">
          <div class="micro-label">Agentic Fund Intelligence Pipeline</div>
          <h1 class="title">CX Lens Visual SOP Deck</h1>
          <p class="subtitle">Narrative-first presentation flow from intake to semantic retrieval.</p>
        </div>

        <div class="deck-controls">
          <span class="slide-label">Slide {{ String(slideIndex + 1).padStart(2, '0') }} / {{ String(stages.length).padStart(2, '0') }}</span>
          <div class="deck-progress">
            <span class="deck-progress-bar" :style="{ width: `${deckProgress}%` }"></span>
          </div>
          <div class="deck-meta">{{ deckProgressLabel }} complete</div>
          <div class="buttons">
            <button class="nav-btn" :disabled="isFirst" @click="prevSlide">Previous</button>
            <button class="nav-btn nav-btn-primary" :disabled="isLast" @click="nextSlide">Next</button>
          </div>
        </div>
      </header>

      <nav class="stage-strip card-surface z-slide-up">
        <button
          v-for="(stage, index) in stages"
          :key="stage.id"
          class="stage-tab"
          :class="{
            'stage-tab-active': index === slideIndex,
            'stage-tab-complete': index < slideIndex
          }"
          @click="toSlide(index)">
          <span class="stage-tab-code">{{ stage.code }}</span>
          <span class="stage-tab-title">{{ stage.title }}</span>
        </button>
      </nav>

      <section class="hero-region">
        <StageShowcase :stage="activeStage" :runtime="runtimeMap[activeStage.id]" />
      </section>

      <footer class="deck-footer card-surface">
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
  background: color-mix(in srgb, var(--z-surface) 84%, #e9eef3 16%);
  overflow: hidden;
}

.ambient-layer {
  position: absolute;
  width: 560px;
  height: 560px;
  border-radius: 999px;
  filter: blur(90px);
  pointer-events: none;
  opacity: 0.42;
}

.ambient-layer-left {
  left: -210px;
  top: -210px;
  background: color-mix(in srgb, var(--z-accent-300) 58%, transparent);
}

.ambient-layer-right {
  right: -200px;
  bottom: -200px;
  background: color-mix(in srgb, #5bc3ff 54%, transparent);
}

.grain-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(120deg, color-mix(in srgb, var(--z-surface) 90%, transparent), color-mix(in srgb, var(--z-surface-alt) 86%, transparent)),
    radial-gradient(circle at 20% 25%, color-mix(in srgb, var(--z-border-sub) 25%, transparent), transparent 42%);
  opacity: 0.88;
}

.pipeline-frame {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 16px;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 12px;
}

.deck-head {
  padding: 14px 18px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.deck-title-block {
  display: grid;
  gap: 6px;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--z-text-sub);
  max-width: 66ch;
}

.title {
  margin: 0;
  font-size: clamp(1.8rem, 2.8vw, 2.6rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
}

.deck-controls {
  display: grid;
  gap: 7px;
  justify-items: end;
  min-width: 220px;
}

.slide-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.deck-progress {
  width: min(320px, 36vw);
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 42%, transparent);
  overflow: hidden;
}

.deck-progress-bar {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--z-accent-600) 88%, transparent),
    color-mix(in srgb, #46b6ff 68%, var(--z-accent-500) 32%)
  );
  transition: width 260ms ease;
}

.deck-meta {
  font-size: 12px;
  color: var(--z-text-sub);
}

.buttons {
  display: flex;
  gap: 8px;
}

.nav-btn {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--z-border) 55%, transparent);
  background: color-mix(in srgb, var(--z-surface-alt) 85%, white 15%);
  color: var(--z-text);
  font-size: 12px;
  font-weight: 620;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 8px 16px;
}

.nav-btn:hover:not(:disabled) {
  box-shadow: 0 8px 18px rgba(10, 18, 28, 0.12);
}

.nav-btn:disabled {
  opacity: 0.45;
}

.nav-btn-primary {
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--z-accent-500) 82%, transparent),
    color-mix(in srgb, #45c1ff 68%, var(--z-accent-500) 32%)
  );
  border-color: color-mix(in srgb, var(--z-accent-600) 60%, transparent);
  color: var(--z-on-accent);
}

.stage-strip {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(132px, 1fr);
  gap: 8px;
  padding: 8px;
  overflow: auto;
}

.stage-tab {
  border: 1px solid color-mix(in srgb, var(--z-border-sub) 72%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--z-surface-alt) 82%, white 18%);
  text-align: left;
  padding: 8px 10px;
  display: grid;
  gap: 3px;
  min-width: 126px;
}

.stage-tab-code {
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--z-text-faint);
}

.stage-tab-title {
  font-size: 12px;
  color: var(--z-text-sub);
  line-height: 1.3;
}

.stage-tab-active {
  border-color: color-mix(in srgb, var(--z-accent-500) 55%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--z-accent-500) 35%, transparent);
}

.stage-tab-active .stage-tab-title {
  color: var(--z-text);
  font-weight: 630;
}

.stage-tab-complete {
  background: color-mix(in srgb, var(--z-accent-50) 45%, var(--z-surface-alt) 55%);
}

.hero-region {
  min-height: 0;
}

.deck-footer {
  min-height: 42px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: var(--z-text-sub);
}

.deck-footer strong {
  color: var(--z-text);
  font-size: 13px;
}

.footer-sep {
  color: var(--z-text-faint);
}

@media (max-width: 1100px) {
  .pipeline-frame {
    padding: 10px;
    gap: 10px;
  }

  .deck-head {
    flex-direction: column;
  }

  .title {
    font-size: 28px;
  }

  .deck-controls {
    width: 100%;
    justify-items: start;
  }
}
</style>
