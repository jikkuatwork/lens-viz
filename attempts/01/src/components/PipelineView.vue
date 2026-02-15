<template>
  <div class="pipeline" @keydown="handleKeydown" tabindex="0" ref="pipelineRef">
    <!-- Header -->
    <header class="pipeline-header">
      <div class="header-left">
        <div class="logo">
          <svg class="logo-svg" width="24" height="24" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="56" stroke="var(--accent)" stroke-width="2.5" opacity="0.3"/>
            <circle cx="60" cy="60" r="36" stroke="var(--accent)" stroke-width="2" opacity="0.5"/>
            <circle cx="60" cy="60" r="16" fill="var(--accent)" opacity="0.8"/>
            <line x1="60" y1="4" x2="60" y2="28" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
            <line x1="60" y1="92" x2="60" y2="116" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
            <line x1="4" y1="60" x2="28" y2="60" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
            <line x1="92" y1="60" x2="116" y2="60" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
          </svg>
          <span class="logo-text">Lens</span>
        </div>
      </div>
      <div class="header-right">
        <div class="nav-hint">
          <span class="hint-key">Space</span> play/pause
          <span class="hint-sep">&middot;</span>
          <span class="hint-key">&larr;</span> <span class="hint-key">&rarr;</span> navigate
        </div>
        <button class="control-btn" @click="handleReset" title="Reset">
          <RotateCcw :size="15" stroke-width="1.5" />
        </button>
        <button class="control-btn play-btn" :class="{ playing }" @click="handleTogglePlay" :title="playing ? 'Pause' : 'Play'">
          <Play v-if="!playing" :size="15" stroke-width="1.5" />
          <Pause v-else :size="15" stroke-width="1.5" />
        </button>

        <!-- User Avatar Dropdown -->
        <div class="user-menu" ref="userMenuRef">
          <button class="avatar-btn" @click="toggleUserMenu" title="Account">
            <span class="avatar-initials">{{ userInitials }}</span>
          </button>
          <Transition name="dropdown">
            <div v-if="userMenuOpen" class="dropdown-menu">
              <div class="dropdown-user">
                <span class="dropdown-name">{{ userName }}</span>
                <span class="dropdown-email">{{ userEmail }}</span>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="handleThemeToggle">
                <Sun v-if="lightMode" :size="14" stroke-width="1.5" />
                <Moon v-else :size="14" stroke-width="1.5" />
                <span>{{ lightMode ? 'Dark mode' : 'Light mode' }}</span>
              </button>
              <button class="dropdown-item" @click="handleSignOut">
                <LogOut :size="14" stroke-width="1.5" />
                <span>Sign out</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <!-- Progress Tracker -->
    <ProgressTracker
      :stages="stages"
      :current="currentStage"
      :completed="completedStages"
      :transitioning="transitioning"
      @select="goToStage"
    />

    <!-- Stage Display -->
    <div class="stage-viewport">
      <Transition name="stage" mode="out-in">
        <div class="stage-wrapper" :key="currentStage">
          <component
            :is="stageComponents[currentStage]"
            :active="stageActive"
            :stage-index="currentStage"
          />
        </div>
      </Transition>
    </div>

    <!-- Stage Info -->
    <div class="stage-info">
      <div class="stage-info-left">
        <div class="stage-info-inner">
          <div class="stage-number-badge">
            <span class="stage-number">{{ String(currentStage + 1).padStart(2, '0') }}</span>
          </div>
          <div class="stage-text">
            <h2 class="stage-title">{{ stages[currentStage].title }}</h2>
            <p class="stage-description" :key="currentStage">{{ stages[currentStage].description }}</p>
          </div>
        </div>
      </div>
      <div class="stage-info-right">
        <Transition name="stats" mode="out-in">
          <FooterStats :key="currentStage" :stage-index="currentStage" :active="stageActive" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted, onUnmounted, shallowRef, markRaw } from 'vue'
import { RotateCcw, Play, Pause, Sun, Moon, LogOut } from 'lucide-vue-next'
import ProgressTracker from './ProgressTracker.vue'
import FooterStats from './FooterStats.vue'
import DataIngestion from './stages/DataIngestion.vue'
import QueryExpansion from './stages/QueryExpansion.vue'
import DeepResearch from './stages/DeepResearch.vue'
import StartupExtraction from './stages/StartupExtraction.vue'
import Enrichment from './stages/Enrichment.vue'
import StructuredOutput from './stages/StructuredOutput.vue'
import VectorStorage from './stages/VectorStorage.vue'

const lightMode = inject('lightMode')
const toggleTheme = inject('toggleTheme')
const user = inject('user')
const logout = inject('logout')
const track = inject('track')

const stages = [
  {
    title: 'Data Ingestion',
    description: 'Fund documents — PDFs, presentations, spreadsheets, memos — are loaded and analyzed. Our AI understands the investment thesis, focus areas, and strategic priorities.',
  },
  {
    title: 'Query Expansion',
    description: 'The fund\'s interests are decomposed into targeted research queries — each representing a sector, technology, or market segment to explore across the startup ecosystem.',
  },
  {
    title: 'Deep Research',
    description: 'AI research agents work in parallel, scanning databases, news, and market intelligence to discover matching companies for each expanded query vector.',
  },
  {
    title: 'Startup Extraction',
    description: 'Discovered companies are extracted and deduplicated into a structured list with key identifiers — name, location, sector, and discovery context.',
  },
  {
    title: 'Enrichment',
    description: 'A second wave of agents enriches each startup — mapping business models, technologies, funding history, and market positioning with confidence scores.',
  },
  {
    title: 'Structured Output',
    description: 'Enriched data is validated against our schema and combined into a unified dataset. Quality checks and cross-referencing ensure the highest accuracy.',
  },
  {
    title: 'Vector Storage',
    description: 'The enriched dataset is embedded into a vector database, enabling semantic search. Investors query by natural language — finding companies by concept.',
  },
]

const stageComponents = [
  markRaw(DataIngestion),
  markRaw(QueryExpansion),
  markRaw(DeepResearch),
  markRaw(StartupExtraction),
  markRaw(Enrichment),
  markRaw(StructuredOutput),
  markRaw(VectorStorage),
]

const pipelineRef = ref(null)
const currentStage = ref(0)
const completedStages = ref(new Set())
const playing = ref(false)
const stageActive = ref(false)
const transitioning = ref(false)

// User menu
const userMenuOpen = ref(false)
const userMenuRef = ref(null)

const userInitials = computed(() => {
  const name = user.value?.name || 'Guest'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

const userName = computed(() => user.value?.name || 'Guest')
const userEmail = computed(() => user.value?.email || 'Guest session')

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
}

function handleClickOutside(e) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    userMenuOpen.value = false
  }
}

function handleThemeToggle() {
  toggleTheme()
  userMenuOpen.value = false
}

function handleSignOut() {
  track('sign_out')
  userMenuOpen.value = false
  logout()
}

const stageDurations = [7000, 7000, 8000, 7000, 7000, 7000, 6000]
let autoTimer = null
let activateTimer = null

function activateStage() {
  stageActive.value = false
  clearTimeout(activateTimer)
  activateTimer = setTimeout(() => {
    stageActive.value = true
  }, 600)
}

function advanceStage() {
  if (currentStage.value < stages.length - 1) {
    completedStages.value.add(currentStage.value)
    transitioning.value = true
    currentStage.value++
    activateStage()
    track('stage_navigate', { stage: currentStage.value, method: 'autoplay' })
    setTimeout(() => { transitioning.value = false }, 600)
    scheduleNext()
  } else {
    completedStages.value.add(currentStage.value)
    playing.value = false
    clearTimeout(autoTimer)
  }
}

function scheduleNext() {
  clearTimeout(autoTimer)
  if (playing.value) {
    autoTimer = setTimeout(advanceStage, stageDurations[currentStage.value])
  }
}

function togglePlay() {
  playing.value = !playing.value
  if (playing.value) {
    if (currentStage.value >= stages.length - 1 && completedStages.value.has(stages.length - 1)) {
      reset()
    }
    scheduleNext()
  } else {
    clearTimeout(autoTimer)
  }
}

function handleTogglePlay() {
  togglePlay()
  track(playing.value ? 'play' : 'pause')
}

function reset() {
  playing.value = false
  clearTimeout(autoTimer)
  currentStage.value = 0
  completedStages.value = new Set()
  stageActive.value = false
  activateStage()
}

function handleReset() {
  reset()
  track('reset')
}

function goToStage(index) {
  if (index === currentStage.value) return
  playing.value = false
  clearTimeout(autoTimer)
  if (index < currentStage.value) {
    completedStages.value = new Set([...completedStages.value].filter(s => s < index))
  }
  transitioning.value = true
  currentStage.value = index
  activateStage()
  track('stage_navigate', { stage: index, method: 'click' })
  setTimeout(() => { transitioning.value = false }, 600)
}

function handleKeydown(e) {
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault()
    handleTogglePlay()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (currentStage.value < stages.length - 1) {
      const next = currentStage.value + 1
      goToStage(next)
      track('stage_navigate', { stage: next, method: 'keyboard' })
    }
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (currentStage.value > 0) {
      const prev = currentStage.value - 1
      goToStage(prev)
      track('stage_navigate', { stage: prev, method: 'keyboard' })
    }
  }
}

onMounted(() => {
  pipelineRef.value?.focus()
  activateStage()
  track('stage_view', { stage: 0 })
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  clearTimeout(autoTimer)
  clearTimeout(activateTimer)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.pipeline {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  outline: none;
}

/* ── Header ── */
.pipeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 24px;
  flex-shrink: 0;
  background: var(--bg-glass);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-svg {
  flex-shrink: 0;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-glass);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  border-color: var(--border-accent);
  color: var(--accent);
  background: var(--accent-subtle);
}

.play-btn {
  width: 40px;
  height: 32px;
}

.play-btn.playing {
  border-color: var(--border-accent);
  color: var(--accent);
  background: var(--accent-subtle);
}

/* ── User Menu ── */
.user-menu {
  position: relative;
}

.avatar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--accent-dim);
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-btn:hover {
  border-color: var(--border-accent);
  box-shadow: 0 0 12px var(--accent-glow);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  padding: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-card);
  z-index: 50;
}

.dropdown-user {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.dropdown-email {
  font-size: 11px;
  color: var(--text-tertiary);
}

.dropdown-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

/* ── Dropdown Transition ── */
.dropdown-enter-active {
  transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

/* ── Stage Viewport ── */
.stage-viewport {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.stage-wrapper {
  width: 100%;
  height: 100%;
}

/* ── Stage Info ── */
.stage-info {
  flex-shrink: 0;
  height: 100px;
  padding: 16px 32px 20px;
  display: flex;
  align-items: stretch;
  gap: 24px;
}

.stage-info-left {
  flex: 3;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stage-info-right {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-info-inner {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.stage-number-badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--accent-dim);
  border: 1px solid var(--border-accent);
}

.stage-number {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
}

.stage-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stage-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.stage-description {
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-secondary);
  letter-spacing: 0.1px;
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-right: 12px;
}

.hint-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 5px;
  border-radius: 4px;
  background: var(--bg-glass);
  border: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
}

.hint-sep {
  margin: 0 2px;
}

/* ── Stats Transition ── */
.stats-enter-active,
.stats-leave-active {
  transition: opacity 0.3s ease;
}
.stats-enter-from,
.stats-leave-to {
  opacity: 0;
}
</style>
