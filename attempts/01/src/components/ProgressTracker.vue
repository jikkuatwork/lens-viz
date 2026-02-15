<template>
  <div class="tracker">
    <div class="tracker-inner">
      <template v-for="(stage, i) in stages" :key="i">
        <!-- Connector Line -->
        <div
          v-if="i > 0"
          class="connector"
          :class="{
            filled: completed.has(i - 1),
            active: i === current && !completed.has(i - 1)
          }"
        >
          <div class="connector-fill"></div>
          <div v-if="i === current && !completed.has(i - 1) && transitioning" class="connector-particle"></div>
        </div>

        <!-- Stage Node -->
        <button
          class="node"
          :class="{
            active: i === current,
            completed: completed.has(i),
            upcoming: i > current
          }"
          @click="$emit('select', i)"
        >
          <div class="node-ring">
            <div class="node-dot"></div>
          </div>
          <span class="node-label">{{ stage.title }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stages: Array,
  current: Number,
  completed: Set,
  transitioning: Boolean,
})

defineEmits(['select'])
</script>

<style scoped>
.tracker {
  flex-shrink: 0;
  padding: 0 32px;
  overflow-x: auto;
  scrollbar-width: none;
}

.tracker::-webkit-scrollbar { display: none; }

.tracker-inner {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  padding: 12px 0;
}

/* ── Connector ── */
.connector {
  width: 64px;
  height: 2px;
  background: var(--border);
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 1px;
  margin-top: 17px;
}

.connector-fill {
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 1px;
}

.connector.filled .connector-fill {
  transform: scaleX(1);
}

.connector.active .connector-fill {
  transform: scaleX(1);
  background: linear-gradient(90deg, var(--accent), var(--accent-dim));
}

.connector-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
  top: -2px;
  animation: particleTravel 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes particleTravel {
  from { left: 0; opacity: 1; }
  to { left: 100%; opacity: 0; }
}

/* ── Node ── */
.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  position: relative;
  transition: all 0.3s ease;
}

.node:hover .node-ring {
  border-color: var(--accent);
}

.node-ring {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.node-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-tertiary);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.node.active .node-ring {
  border-color: var(--accent);
  box-shadow: 0 0 16px var(--accent-glow);
}

.node.active .node-dot {
  background: var(--accent);
  width: 10px;
  height: 10px;
  box-shadow: 0 0 8px var(--accent-glow);
}

.node.completed .node-ring {
  border-color: var(--accent);
  background: var(--accent-dim);
}

.node.completed .node-dot {
  background: var(--accent);
  width: 10px;
  height: 10px;
}

.node.upcoming .node-dot {
  background: var(--text-tertiary);
  opacity: 0.4;
}

.node.upcoming .node-ring {
  border-color: var(--border-faint);
}

.node-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-tertiary);
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
  max-width: 90px;
  text-align: center;
  line-height: 1.35;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.node.active .node-label {
  color: var(--accent);
}

.node.completed .node-label {
  color: var(--text-secondary);
}

</style>
