<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      v-for="(path, index) in resolved"
      :key="index"
      :d="path"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name:
    | 'home'
    | 'grid'
    | 'fire'
    | 'live'
    | 'history'
    | 'user'
    | 'settings'
    | 'back'
    | 'close'
    | 'minimize'
    | 'maximize'
    | 'up'
    | 'clock'
    | 'search'
    | 'comment'
    | 'play';
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
});

const paths: Record<string, string[]> = {
  home: ['M4 10.5L12 4l8 6.5', 'M6 9.8V20h12V9.8'],
  grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  fire: [
    'M12 3c2 3-1 4-1 6 0 2 2 2 2 4 0 2-1 4-3 4s-3-2-3-4c0-3 3-4 5-10z',
    'M14 9c1 1 2 2 2 4 0 3-2 6-6 6',
  ],
  live: ['M4 6h16v12H4z', 'M9 11l3 2 3-2'],
  history: ['M4 12a8 8 0 1 0 2.3-5.7', 'M4 4v4h4', 'M12 7v5l3 2'],
  user: ['M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z', 'M5 20c1.5-3 4-5 7-5s5.5 2 7 5'],
  settings: [
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    'M3 12h2',
    'M19 12h2',
    'M12 3v2',
    'M12 19v2',
    'M5.5 5.5l1.4 1.4',
    'M17.1 17.1l1.4 1.4',
    'M18.5 5.5l-1.4 1.4',
    'M6.9 17.1l-1.4 1.4',
  ],
  back: ['M15 6l-6 6 6 6', 'M9 12h10'],
  close: ['M6 6l12 12', 'M18 6l-12 12'],
  minimize: ['M5 12h14'],
  maximize: ['M6 6h12v12H6z'],
  up: ['M6 14l6-6 6 6'],
  clock: ['M12 7v5l3 2', 'M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16'],
  search: ['M11 19a8 8 0 1 0-5.7-2.3', 'M21 21l-4.3-4.3'],
  comment: ['M4 6h16v9H8l-4 4z'],
  play: ['M8 6l10 6-10 6z'],
};

const resolved = computed(() => paths[props.name] || []);
</script>
