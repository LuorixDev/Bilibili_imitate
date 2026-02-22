<template>
  <div class="page-shell">
    <SkeletonGrid v-if="liveStore.loading && !liveStore.list.length" />
    <div v-else class="grid-list">
      <LiveCard v-for="item in liveStore.list" :key="item.id" :live="item" />
    </div>
    <div class="load-more">
      <button
        v-if="liveStore.list.length < liveStore.total"
        class="primary"
        :disabled="liveStore.loading"
        @click="loadMore"
      >
        {{ liveStore.loading ? '加载中...' : '加载更多' }}
      </button>
      <span v-else class="end">没有更多了</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useLiveStore } from '../stores/live';
import LiveCard from '../components/LiveCard.vue';
import SkeletonGrid from '../components/SkeletonGrid.vue';

const liveStore = useLiveStore();
const page = ref(1);

const loadMore = async () => {
  page.value += 1;
  await liveStore.fetchList(page.value, 12, true);
};

onMounted(async () => {
  if (!liveStore.list.length) {
    await liveStore.fetchList(1, 12, false);
  }
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
