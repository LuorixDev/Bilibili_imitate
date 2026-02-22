<template>
  <div class="player">
    <div ref="playerRef" class="dplayer-host"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import DPlayer from 'dplayer';
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

const playerRef = ref<HTMLDivElement | null>(null);
let player: DPlayer | null = null;
const danmakuItems = computed(() => props.danmakuItems);
const drawnIds = new Set<string>();
const pendingQueue: ActiveDanmaku[] = [];

const createPlayer = () => {
  if (!playerRef.value || !props.src) return;
  player?.destroy?.();
  player = new DPlayer({
    container: playerRef.value,
    autoplay: false,
    theme: '#fb7299',
    loop: false,
    hotkey: true,
    volume: 0.6,
    danmaku: {
      id: 'local',
      api: 'local://danmaku/',
      addition: [],
    },
    apiBackend: {
      read({ success }: { url: string; success: (items: unknown[]) => void }) {
        success([]);
      },
      send({
        success,
      }: {
        url: string;
        data: Record<string, unknown>;
        success: () => void;
      }) {
        success();
      },
    },
    video: {
      url: props.src,
      pic: props.poster || '',
    },
  });
  flushDanmaku();
};

const getCurrentTime = () => player?.video?.currentTime ?? 0;

defineExpose({
  getCurrentTime,
});

const drawDanmaku = (items: ActiveDanmaku[]) => {
  if (!items.length) return;
  if (!player?.danmaku?.draw) {
    pendingQueue.push(...items);
    return;
  }
  items.forEach((item) => {
    if (drawnIds.has(item.id)) return;
    drawnIds.add(item.id);
    player?.danmaku?.draw({
      text: item.text,
      color: item.color,
      type: 0,
    });
  });
};

const flushDanmaku = () => {
  if (!pendingQueue.length) return;
  const items = pendingQueue.splice(0, pendingQueue.length);
  drawDanmaku(items);
};

const updateVideo = () => {
  if (!player) {
    createPlayer();
    return;
  }
  if (player.switchVideo) {
    player.switchVideo(
      {
        url: props.src,
        pic: props.poster || '',
      },
      undefined
    );
  } else {
    createPlayer();
  }
  drawnIds.clear();
  player?.danmaku?.clear?.();
};

onMounted(() => {
  createPlayer();
});

onUnmounted(() => {
  player?.destroy?.();
  player = null;
});

watch(
  () => [props.src, props.poster],
  ([nextSrc, nextPoster], [prevSrc, prevPoster]) => {
    if (nextSrc !== prevSrc || nextPoster !== prevPoster) {
      updateVideo();
    }
  }
);

watch(
  () => danmakuItems.value,
  (items) => {
    drawDanmaku(items);
  },
  { deep: true }
);
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

.dplayer-host {
  width: 100%;
  height: 100%;
}

:deep(.dplayer-video) {
  object-fit: contain;
}

:deep(.dplayer-controller) {
  z-index: 5;
}
</style>
