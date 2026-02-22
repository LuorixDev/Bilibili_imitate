<template>
  <div class="controls">
    <button
      class="play-button"
      :class="{ play: !isPlaying, pause: isPlaying }"
      @click="emit('toggle')"
    >
      {{ isPlaying ? '暂停' : '播放' }}
    </button>
    <div class="control-bar">
      <div class="left">
        <span class="time">{{ formatDuration(currentTime) }}</span>
        <span class="split">/</span>
        <span class="total-duration">{{ formatDuration(duration) }}</span>
      </div>
      <div class="center">
        <div class="progress-wrapper">
          <input
            type="range"
            min="0"
            :max="duration"
            step="0.1"
            :value="currentTime"
            :style="{ background: progressBackground }"
            @input="onSeek"
          />
        </div>
      </div>
      <div class="right">
        <button class="barrage" :class="showDanmaku ? 'on' : 'off'" @click="emit('toggleDanmaku')">
          弹幕
        </button>
        <div class="volume">
          <button class="volume-btn" @click="emit('mute')">
            {{ isMuted ? '静音' : '音量' }}
          </button>
          <input type="range" min="0" max="1" step="0.05" :value="volume" @input="onVolume" />
        </div>
        <button class="fullscreen" @click="emit('fullscreen')">全屏</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDuration } from '../../utils/format';

interface Props {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  showDanmaku: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'toggle'): void;
  (e: 'seek', value: number): void;
  (e: 'volume', value: number): void;
  (e: 'mute'): void;
  (e: 'fullscreen'): void;
  (e: 'toggleDanmaku'): void;
}>();

const onSeek = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('seek', Number(target.value));
};

const onVolume = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('volume', Number(target.value));
};

const progressBackground = computed(() => {
  const percent = props.duration ? (props.currentTime / props.duration) * 100 : 0;
  return `linear-gradient(90deg, #de698c ${percent}%, #4c4c4c ${percent}%)`;
});
</script>

<style scoped>
.controls {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.play-button {
  position: absolute;
  right: 12px;
  bottom: 56px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  opacity: 0.85;
}

.control-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 44px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
}

.left {
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: 12px;
  margin-left: 12px;
  gap: 4px;
}

.time,
.total-duration {
  width: 50px;
}

.time {
  text-align: right;
}

.split {
  width: 10px;
  text-align: center;
}

.total-duration {
  text-align: left;
}

.center {
  position: absolute;
  left: 108px;
  right: 108px;
  height: 10px;
}

.progress-wrapper {
  position: relative;
  height: 100%;
}

.progress-wrapper input[type='range'] {
  width: 100%;
  height: 100%;
  appearance: none;
  background: #4c4c4c;
  border-radius: 999px;
  cursor: pointer;
}

.progress-wrapper input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}

.progress-wrapper input[type='range']::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: none;
}

.right {
  margin-left: auto;
  margin-right: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.barrage,
.fullscreen {
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.12);
}

.barrage.off {
  opacity: 0.6;
}

.volume {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-btn {
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.12);
}

.volume input[type='range'] {
  width: 70px;
  height: 4px;
  appearance: none;
  border-radius: 999px;
  background: #4c4c4c;
}

.volume input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
}
</style>
