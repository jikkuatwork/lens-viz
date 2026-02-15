<script setup>
import PipelineStageCard from './PipelineStageCard.vue'

const props = defineProps({
  stages: { type: Array, required: true },
  activeIndex: { type: Number, required: true },
  runtimeMap: { type: Object, required: true },
  stageProgress: { type: Number, required: true }
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="rail-shell card-surface z-slide-up">
    <div class="rail-scroll z-scroll-hide">
      <ol class="rail-track">
        <li v-for="(stage, index) in stages" :key="stage.id" class="rail-node">
          <PipelineStageCard
            :stage="stage"
            :runtime="runtimeMap[stage.id]"
            :active="index === activeIndex"
            :completed="index < activeIndex"
            :progress="index === activeIndex ? stageProgress : (index < activeIndex ? 1 : 0)"
            @select="emit('select', index)" />

          <div v-if="index < stages.length - 1" class="rail-link" aria-hidden="true">
            <span class="rail-line"></span>
            <span
              class="rail-pulse"
              :class="{
                'rail-pulse-active': index === activeIndex,
                'rail-pulse-complete': index < activeIndex
              }"></span>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.rail-shell {
  padding: 14px;
}

.rail-scroll {
  width: 100%;
}

.rail-track {
  list-style: none;
  margin: 0;
  padding: 0;
  display: inline-flex;
  gap: 0;
  min-width: 100%;
}

.rail-node {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.rail-link {
  width: 36px;
  height: 8px;
  position: relative;
  display: grid;
  place-items: center;
}

.rail-line {
  width: 100%;
  height: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-border) 60%, transparent);
}

.rail-pulse {
  position: absolute;
  left: -5px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--z-accent-500) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--z-accent-500) 40%, transparent);
}

.rail-pulse-active {
  animation: link-travel 1.2s linear infinite;
}

.rail-pulse-complete {
  left: calc(100% - 4px);
  background: color-mix(in srgb, var(--z-accent-500) 70%, white 30%);
  border-color: color-mix(in srgb, var(--z-accent-600) 55%, transparent);
}

@keyframes link-travel {
  0% {
    left: -5px;
    opacity: 0.35;
  }
  30% {
    opacity: 1;
  }
  100% {
    left: calc(100% - 5px);
    opacity: 0.35;
  }
}
</style>
