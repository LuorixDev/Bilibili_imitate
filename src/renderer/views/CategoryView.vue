<template>
  <div class="page-shell">
    <TabMenu v-model="activeTag" :items="state.tags" />
    <SkeletonGrid v-if="state.loading && !state.list.length" />
    <div v-else class="grid-list">
      <VideoCard v-for="video in state.list" :key="video.id" :video="video" />
    </div>
    <div class="load-more">
      <button
        v-if="state.list.length < state.total"
        class="primary"
        :disabled="state.loading"
        @click="loadMore"
      >
        {{ state.loading ? '加载中...' : '加载更多' }}
      </button>
      <span v-else class="end">没有更多了</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import TabMenu from '../components/TabMenu.vue';
import VideoCard from '../components/VideoCard.vue';
import SkeletonGrid from '../components/SkeletonGrid.vue';
import { useExploreStore } from '../stores/explore';

const exploreStore = useExploreStore();
const section = 'category';

const state = computed(() => exploreStore.sections[section]);
const activeTag = computed({
  get: () => state.value.activeTag,
  set: (value: string) => {
    exploreStore.setActiveTag(section, value);
  },
});

const loadMore = () => exploreStore.loadMore(section);

onMounted(() => {
  exploreStore.init(section);
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
