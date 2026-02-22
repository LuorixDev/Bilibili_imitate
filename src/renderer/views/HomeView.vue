<template>
  <div class="page-shell">
    <SkeletonGrid v-if="videoStore.loading && !videoStore.recommendList.length" />
    <div v-else class="grid-list">
      <VideoCard v-for="video in videoStore.recommendList" :key="video.id" :video="video" />
    </div>
    <div class="load-more">
      <button
        v-if="videoStore.recommendList.length < videoStore.recommendTotal"
        class="primary"
        :disabled="videoStore.loading"
        @click="loadMore"
      >
        {{ videoStore.loading ? '加载中...' : '加载更多' }}
      </button>
      <span v-else class="end">没有更多了</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVideoStore } from '../stores/video';
import VideoCard from '../components/VideoCard.vue';
import SkeletonGrid from '../components/SkeletonGrid.vue';

const videoStore = useVideoStore();
const page = ref(1);

const loadMore = async () => {
  page.value += 1;
  await videoStore.fetchRecommend(page.value, 12, true);
};

onMounted(async () => {
  page.value = 1;
  await videoStore.fetchRecommend(page.value, 12, false);
});
</script>

<style scoped>
.load-more {
  margin: 24px 0 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.primary {
  padding: 8px 20px;
  border-radius: 6px;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
}

.end {
  color: var(--color-secondary);
  font-size: 13px;
}
</style>
