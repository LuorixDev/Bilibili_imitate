<template>
  <div class="hover-video" @mouseenter="play" @mouseleave="stop">
    <slot />
    <video
      v-show="isHovering"
      ref="videoRef"
      :src="src"
      muted
      loop
      playsinline
      preload="metadata"
    ></video>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { src } = defineProps<{
  src: string;
}>();
const videoRef = ref<HTMLVideoElement | null>(null);
const isHovering = ref(false);

const play = async () => {
  isHovering.value = true;
  try {
    await videoRef.value?.play();
  } catch (e) {
    // ignore autoplay block
  }
};

const stop = () => {
  isHovering.value = false;
  videoRef.value?.pause();
  if (videoRef.value) videoRef.value.currentTime = 0;
};
</script>

<style scoped>
.hover-video {
  position: relative;
}

video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

video[style*='display: none'] {
  opacity: 0;
}

video[style*='display: block'],
video[style*='display: inline'],
video[style*='display: inline-block'] {
  opacity: 1;
}
</style>
