<template>
  <p class="typewriter">
    <span class="typewriter-text">{{ displayText }}</span>
    <span class="typewriter-cursor" v-if="showCursor">|</span>
  </p>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  speed: { type: Number, default: 25 },
  delay: { type: Number, default: 300 },
})

const displayText = ref('')
const showCursor = ref(true)
let timer = null
let delayTimer = null

function startTyping() {
  displayText.value = ''
  showCursor.value = true
  let i = 0

  clearInterval(timer)
  clearTimeout(delayTimer)

  delayTimer = setTimeout(() => {
    timer = setInterval(() => {
      if (i < props.text.length) {
        displayText.value = props.text.slice(0, i + 1)
        i++
      } else {
        clearInterval(timer)
        setTimeout(() => { showCursor.value = false }, 1000)
      }
    }, props.speed)
  }, props.delay)
}

watch(() => props.text, startTyping, { immediate: true })

onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(delayTimer)
})
</script>

<style scoped>
.typewriter {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  letter-spacing: 0.1px;
  min-height: 2.4em;
}

.typewriter-cursor {
  color: var(--accent);
  font-weight: 300;
  animation: typewriter-cursor 0.8s steps(1) infinite;
  margin-left: 1px;
}
</style>
