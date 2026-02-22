<template>
  <div class="danmaku-layer">
    <span
      v-for="item in items"
      :key="item.id"
      class="danmaku"
      :style="{
        '--top': `${item.top}px`,
        '--duration': `${item.duration}s`,
        '--color': item.color,
      }"
    >
      {{ item.text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { ActiveDanmaku } from '../../composables/useDanmaku';

interface Props {
  items: ActiveDanmaku[];
}

defineProps<Props>();
</script>

<style scoped>
.danmaku-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.danmaku {
  position: absolute;
  right: -20%;
  top: var(--top);
  color: var(--color);
  font-weight: 600;
  font-size: 16px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  white-space: nowrap;
  animation: fly var(--duration) linear forwards;
}

@keyframes fly {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-140%);
  }
}
</style>
