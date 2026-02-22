<template>
  <div class="player-controls" :class="{ 'show-always': !playing || hovering }" @click.stop>
    <!-- 进度条 -->
    <div class="progress-bar" @click="onProgressClick" @mousemove="onProgressHover">
      <div class="progress-bg"></div>
      <div class="progress-buffer" :style="{ width: bufferedPercent + '%' }"></div>
      <div class="progress-current" :style="{ width: progressPercent + '%' }"></div>
      <div class="progress-handle" :style="{ left: progressPercent + '%' }"></div>
      <div v-if="hoverTime" class="progress-tooltip" :style="{ left: hoverPercent + '%' }">
        {{ formatTime(hoverTime) }}
      </div>
    </div>
    
    <div class="controls-row">
      <div class="controls-left">
        <!-- 播放/暂停 -->
        <button class="control-btn" @click="togglePlay">
          <PlayIcon v-if="!playing" :size="24" />
          <PauseIcon v-else :size="24" />
        </button>
        
        <!-- 时间显示 -->
        <span class="time-display">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </span>
      </div>
      
      <div class="controls-right">
        <!-- 弹幕开关 -->
        <button
          class="control-btn"
          :class="{ active: danmakuEnabled }"
          @click="$emit('toggle-danmaku')"
          title="弹幕"
        >
          <MessageSquareIcon :size="20" />
        </button>
        
        <!-- 倍速 -->
        <div class="speed-selector">
          <button class="control-btn speed-btn" @click="showSpeedMenu = !showSpeedMenu">
            {{ playbackRate }}x
          </button>
          <div v-if="showSpeedMenu" class="speed-menu">
            <div
              v-for="rate in speedOptions"
              :key="rate"
              class="speed-option"
              :class="{ active: playbackRate === rate }"
              @click="selectSpeed(rate)"
            >
              {{ rate }}x
            </div>
          </div>
        </div>
        
        <!-- 音量 -->
        <div class="volume-control" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
          <button class="control-btn" @click="$emit('toggle-mute')">
            <Volume2Icon v-if="!muted && volume > 0" :size="20" />
            <VolumeXIcon v-else :size="20" />
          </button>
          <div v-if="showVolume" class="volume-slider">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              :value="volume"
              @input="onVolumeInput"
              orient="vertical"
            />
          </div>
        </div>
        
        <!-- 全屏 -->
        <button class="control-btn" @click="$emit('toggle-fullscreen')">
          <MaximizeIcon v-if="!fullscreen" :size="20" />
          <MinimizeIcon v-else :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PlayIcon,
  PauseIcon,
  MessageSquareIcon,
  Volume2Icon,
  VolumeXIcon,
  MaximizeIcon,
  MinimizeIcon
} from 'lucide-vue-next'

const props = defineProps<{
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  fullscreen: boolean
  danmakuEnabled: boolean
  playbackRate: number
}>()

const emit = defineEmits<{
  play: []
  pause: []
  seek: [time: number]
  'volume-change': [volume: number]
  'toggle-mute': []
  'toggle-fullscreen': []
  'toggle-danmaku': []
  'rate-change': [rate: number]
}>()

// State
const hovering = ref(false)
const hoverTime = ref<number | null>(null)
const hoverPercent = ref(0)
const showVolume = ref(false)
const showSpeedMenu = ref(false)
const bufferedPercent = ref(100)

const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]

// Computed
const progressPercent = computed(() => {
  if (props.duration === 0) return 0
  return (props.currentTime / props.duration) * 100
})

// Methods
const togglePlay = () => {
  if (props.playing) {
    emit('pause')
  } else {
    emit('play')
  }
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const hours = Math.floor(mins / 60)
  
  if (hours > 0) {
    return `${hours}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const onProgressClick = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  const time = percent * props.duration
  emit('seek', time)
}

const onProgressHover = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  hoverPercent.value = percent * 100
  hoverTime.value = percent * props.duration
}

const onVolumeInput = (e: Event) => {
  const value = parseFloat((e.target as HTMLInputElement).value)
  emit('volume-change', value)
}

const selectSpeed = (rate: number) => {
  emit('rate-change', rate)
  showSpeedMenu.value = false
}
</script>

<style scoped>
.player-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 40px 16px 16px;
  opacity: 0;
  transition: opacity 0.3s;
}

.player-controls.show-always,
.video-player:hover .player-controls {
  opacity: 1;
}

.progress-bar {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-bottom: 12px;
  cursor: pointer;
}

.progress-bar:hover {
  height: 6px;
}

.progress-bg,
.progress-buffer,
.progress-current {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: inherit;
}

.progress-bg {
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
}

.progress-buffer {
  background: rgba(255, 255, 255, 0.4);
}

.progress-current {
  background: #fb7299;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #fb7299;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

.progress-tooltip {
  position: absolute;
  bottom: 16px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.control-btn.active {
  color: #fb7299;
}

.time-display {
  color: white;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.volume-control {
  position: relative;
  display: flex;
  align-items: center;
}

.volume-slider {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 8px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
}

.volume-slider input {
  width: 20px;
  height: 80px;
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;
}

.speed-selector {
  position: relative;
}

.speed-btn {
  font-size: 13px;
  min-width: 40px;
}

.speed-menu {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  padding: 8px 0;
  min-width: 80px;
  margin-bottom: 8px;
}

.speed-option {
  padding: 8px 16px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s;
}

.speed-option:hover {
  background: rgba(251, 114, 153, 0.3);
}

.speed-option.active {
  color: #fb7299;
  background: rgba(251, 114, 153, 0.2);
}
</style>
