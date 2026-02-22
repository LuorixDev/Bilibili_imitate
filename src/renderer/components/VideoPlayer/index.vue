<template>
  <div ref="containerRef" class="player" :class="{ fullscreen: isFullscreen }">
    <video
      ref="videoRef"
      :src="src"
      :poster="poster"
      @play="handlePlay"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoaded"
      @click="togglePlay"
    ></video>
    <DanmakuLayer :items="visibleDanmaku" />
    <div class="controls-wrapper">
      <PlayerControls
        :is-playing="isPlaying"
        :duration="duration"
        :current-time="currentTime"
        :volume="volume"
        :is-muted="isMuted"
        :is-fullscreen="isFullscreen"
        :show-danmaku="showDanmaku"
        @toggle="togglePlay"
        @seek="seekTo"
        @volume="setVolume"
        @mute="toggleMute"
        @fullscreen="toggleFullscreen"
        @toggle-danmaku="toggleDanmaku"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoPlayer } from '../../composables/useVideoPlayer';
import DanmakuLayer from './DanmakuLayer.vue';
import PlayerControls from './PlayerControls.vue';
import type { ActiveDanmaku } from '../../composables/useDanmaku';

interface Props {
  src: string;
  poster?: string;
  danmakuItems?: ActiveDanmaku[];
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  danmakuItems: () => [],
});

const {
  videoRef,
  containerRef,
  isPlaying,
  duration,
  currentTime,
  volume,
  isMuted,
  isFullscreen,
  togglePlay,
  seekTo,
  setVolume,
  toggleMute,
  toggleFullscreen,
  handlePlay,
  handlePause,
  handleTimeUpdate,
  handleLoaded,
} = useVideoPlayer();

const showDanmaku = ref(true);
const danmakuItems = computed(() => props.danmakuItems);
const visibleDanmaku = computed(() => (showDanmaku.value ? danmakuItems.value : []));

const getCurrentTime = () => currentTime.value;

defineExpose({
  getCurrentTime,
  seekTo,
  togglePlay,
});

const toggleDanmaku = () => {
  showDanmaku.value = !showDanmaku.value;
};
</script>

<style scoped>
.player {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  border-radius: 0;
}

.player.fullscreen {
  border-radius: 0;
}

video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: #000;
}

.controls-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
