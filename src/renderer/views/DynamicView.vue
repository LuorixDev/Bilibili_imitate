<template>
  <div class="page-shell dynamic">
    <div v-if="!loading" class="feed">
      <VideoCard v-for="item in list" :key="item.id" :video="item" />
    </div>
    <SkeletonGrid v-else />
    <div class="load-more">
      <button v-if="list.length < total" class="primary" :disabled="loading" @click="loadMore">
        {{ loading ? '加载中...' : '加载更多' }}
      </button>
      <span v-else class="end">已经到底啦</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import VideoCard from '../components/VideoCard.vue';
import { useVideoStore } from '../stores/video';
import SkeletonGrid from '../components/SkeletonGrid.vue';

const videoStore = useVideoStore();
const list = ref(videoStore.recommendList);
const page = ref(videoStore.recommendPage || 1);
const total = ref(videoStore.recommendTotal || 0);
const loading = ref(false);

const fetch = async (append: boolean) => {
  loading.value = true;
  await videoStore.fetchRecommend(page.value, 12, append);
  list.value = videoStore.recommendList;
  total.value = videoStore.recommendTotal;
  loading.value = false;
};

const loadMore = async () => {
  page.value += 1;
  await fetch(true);
};

onMounted(async () => {
  if (!videoStore.recommendList.length) {
    await fetch(false);
  }
});
</script>

<style scoped>
.dynamic {
  padding-top: 10px;
}

.feed {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0;
}

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

@media (max-width: 1600px) {
  .feed {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 1300px) {
  .feed {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
