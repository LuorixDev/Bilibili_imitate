<template>
  <div class="video-player" ref="playerRef">
    <video
      ref="videoRef"
      class="video-element"
      :src="src"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @click="togglePlay"
    ></video>
    
    <!-- 弹幕层 -->
    <DanmakuLayer
      v-if="showDanmaku"
      :danmaku-list="danmakuList || []"
      :current-time="currentTime"
      :playing="playing"
      :danmaku-enabled="danmakuEnabled"
    />
    
    <!-- 播放控制栏 -->
    <PlayerControls
      :playing="playing"
      :current-time="currentTime"
      :duration="duration"
      :volume="volume"
      :muted="muted"
      :fullscreen="isFullscreen"
      :danmaku-enabled="danmakuEnabled"
      :playback-rate="playbackRate"
      @play="play"
      @pause="pause"
      @seek="seek"
      @volume-change="setVolume"
      @toggle-mute="toggleMute"
      @toggle-fullscreen="toggleFullscreen"
      @toggle-danmaku="toggleDanmaku"
      @rate-change="setPlaybackRate"
    />
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    
    <!-- 大播放按钮 -->
    <div
      v-if="!playing && !loading"
      class="big-play-btn"
      @click="play"
    >
      <PlayIcon :size="64" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Danmaku } from '@/types'
import { PlayIcon } from 'lucide-vue-next'
import DanmakuLayer from './DanmakuLayer.vue'
import PlayerControls from './PlayerControls.vue'

const props = defineProps<{
  src: string
  danmakuList?: Danmaku[]
  showDanmaku?: boolean
  autoPlay?: boolean
}>()

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeupdate: [time: number]
}>()

// Refs
const playerRef = ref<HTMLDivElement>()
const videoRef = ref<HTMLVideoElement>()

// State
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const muted = ref(false)
const isFullscreen = ref(false)
const danmakuEnabled = ref(true)
const loading = ref(false)
const playbackRate = ref(1)

// Methods
const play = async () => {
  try {
    await videoRef.value?.play()
  } catch (e) {
    console.error('播放失败:', e)
  }
}

const pause = () => {
  videoRef.value?.pause()
}

const togglePlay = () => {
  if (playing.value) {
    pause()
  } else {
    play()
  }
}

const seek = (time: number) => {
  if (videoRef.value) {
    videoRef.value.currentTime = time
  }
}

const setVolume = (vol: number) => {
  if (videoRef.value) {
    videoRef.value.volume = vol
    volume.value = vol
  }
}

const toggleMute = () => {
  if (videoRef.value) {
    videoRef.value.muted = !muted.value
    muted.value = !muted.value
  }
}

const toggleFullscreen = async () => {
  if (!playerRef.value) return
  
  try {
    if (!document.fullscreenElement) {
      await playerRef.value.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (e) {
    console.error('全屏切换失败:', e)
  }
}

const toggleDanmaku = () => {
  danmakuEnabled.value = !danmakuEnabled.value
}

const setPlaybackRate = (rate: number) => {
  if (videoRef.value) {
    videoRef.value.playbackRate = rate
    playbackRate.value = rate
  }
}

// Event handlers
const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
    emit('timeupdate', currentTime.value)
  }
}

const onLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
  }
}

const onPlay = () => {
  playing.value = true
  emit('play')
}

const onPause = () => {
  playing.value = false
  emit('pause')
}

const onEnded = () => {
  playing.value = false
  emit('ended')
}

// Watch for src changes
watch(() => props.src, () => {
  if (props.autoPlay) {
    play()
  }
})

// Fullscreen change listener
const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  if (props.autoPlay) {
    play()
  }
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})

// Expose methods for parent component
defineExpose({
  play,
  pause,
  seek,
  setVolume,
  toggleFullscreen
})
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  gap: 16px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fb7299;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.big-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(251, 114, 153, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: transform 0.3s, background 0.3s;
}

.big-play-btn:hover {
  transform: translate(-50%, -50%) scale(1.1);
  background: rgba(251, 114, 153, 1);
}
</style>
