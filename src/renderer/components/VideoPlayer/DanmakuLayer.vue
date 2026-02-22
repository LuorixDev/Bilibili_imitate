<template>
  <div class="danmaku-layer" ref="layerRef">
    <div
      v-for="danmaku in visibleDanmaku"
      :key="danmaku.id"
      class="danmaku-item"
      :style="getDanmakuStyle(danmaku)"
    >
      {{ danmaku.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { Danmaku } from '@/types'

const props = defineProps<{
  danmakuList: Danmaku[]
  currentTime: number
  playing: boolean
  danmakuEnabled: boolean
}>()

const layerRef = ref<HTMLDivElement>()

// Track danmaku that are currently visible on screen
const activeDanmaku = ref<Map<string, { danmaku: Danmaku; startTime: number; track: number }>>(new Map())

// Available tracks for danmaku (vertical positions)
const trackCount = 10
const trackHeight = 30

// Get danmaku that should be sent at current time
const newDanmaku = computed(() => {
  if (!props.danmakuEnabled) return []
  
  const timeWindow = 0.5 // Send danmaku within 0.5s window
  return props.danmakuList.filter(d => {
    const timeDiff = Math.abs(d.time - props.currentTime)
    return timeDiff < timeWindow && !activeDanmaku.value.has(d.id)
  })
})

// Get visible danmaku with their positions
const visibleDanmaku = computed(() => {
  if (!props.danmakuEnabled) return []
  
  const now = Date.now()
  const result: (Danmaku & { left: number; track: number; opacity: number })[] = []
  
  activeDanmaku.value.forEach((item, id) => {
    const elapsed = (now - item.startTime) / 1000 // seconds
    const duration = 8 // danmaku travel time in seconds
    const progress = elapsed / duration
    
    if (progress >= 1) {
      activeDanmaku.value.delete(id)
    } else {
      result.push({
        ...item.danmaku,
        left: (1 - progress) * 100,
        track: item.track,
        opacity: progress < 0.1 ? progress / 0.1 : progress > 0.9 ? (1 - progress) / 0.1 : 1
      })
    }
  })
  
  return result
})

// Find an available track
const findAvailableTrack = (): number => {
  const usedTracks = new Set<number>()
  
  activeDanmaku.value.forEach(item => {
    // Check if danmaku is still in the right portion of screen
    const elapsed = (Date.now() - item.startTime) / 1000
    if (elapsed < 6) { // Still has significant presence
      usedTracks.add(item.track)
    }
  })
  
  for (let i = 0; i < trackCount; i++) {
    if (!usedTracks.has(i)) {
      return i
    }
  }
  
  // All tracks occupied, pick random
  return Math.floor(Math.random() * trackCount)
}

// Watch for new danmaku to add
watch(() => props.currentTime, () => {
  const toAdd = newDanmaku.value
  toAdd.forEach(danmaku => {
    activeDanmaku.value.set(danmaku.id, {
      danmaku,
      startTime: Date.now(),
      track: findAvailableTrack()
    })
  })
})

// Clear when paused for too long
let pauseTimeout: ReturnType<typeof setTimeout>
watch(() => props.playing, (playing) => {
  if (!playing) {
    pauseTimeout = setTimeout(() => {
      activeDanmaku.value.clear()
    }, 5000)
  } else {
    clearTimeout(pauseTimeout)
  }
})

// Get style for a danmaku
const getDanmakuStyle = (danmaku: Danmaku & { left: number; track: number; opacity: number }) => {
  const colors: Record<string, string> = {
    white: '#ffffff',
    red: '#ff6b6b',
    blue: '#4dabf7',
    green: '#51cf66',
    yellow: '#ffd43b',
    pink: '#ff8787',
    cyan: '#22b8cf'
  }
  
  return {
    left: `${danmaku.left}%`,
    top: `${danmaku.track * trackHeight + 10}px`,
    color: colors[danmaku.color || 'white'] || colors.white,
    opacity: danmaku.opacity,
    fontSize: danmaku.type === 'top' || danmaku.type === 'bottom' ? '18px' : '16px',
    border: danmaku.type === 'top' || danmaku.type === 'bottom' ? '1px solid currentColor' : 'none',
    padding: danmaku.type === 'top' || danmaku.type === 'bottom' ? '2px 8px' : '0',
    borderRadius: danmaku.type === 'top' || danmaku.type === 'bottom' ? '4px' : '0'
  }
}

onUnmounted(() => {
  clearTimeout(pauseTimeout)
  activeDanmaku.value.clear()
})
</script>

<style scoped>
.danmaku-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 10;
}

.danmaku-item {
  position: absolute;
  white-space: nowrap;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  will-change: left;
}
</style>
