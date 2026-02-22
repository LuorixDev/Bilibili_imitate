<template>
  <div class="page-shell">
    <div class="section-title">搜索结果</div>
    <div v-if="!keyword" class="empty">请输入关键词进行搜索</div>
    <template v-else>
      <div class="search-meta">关键词：{{ keyword }} · 共 {{ videoStore.searchTotal }} 条结果</div>
      <div v-if="!videoStore.searchList.length" class="empty">未找到相关内容</div>
      <template v-else>
        <div class="grid-list">
          <VideoCard v-for="video in videoStore.searchList" :key="video.id" :video="video" />
        </div>
        <div class="load-more">
          <button
            v-if="videoStore.searchList.length < videoStore.searchTotal"
            class="primary"
            :disabled="videoStore.loading"
            @click="loadMore"
          >
            {{ videoStore.loading ? '加载中...' : '加载更多' }}
          </button>
          <span v-else class="end">没有更多了</span>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from '../stores/video';
import VideoCard from '../components/VideoCard.vue';

const route = useRoute();
const videoStore = useVideoStore();
const page = ref(1);

const keyword = computed(() => (route.query.q as string) || '');

const fetchResult = async () => {
  if (!keyword.value) return;
  page.value = 1;
  await videoStore.search(keyword.value, page.value, 12, false);
};

const loadMore = async () => {
  page.value += 1;
  await videoStore.search(keyword.value, page.value, 12, true);
};

onMounted(fetchResult);

watch(keyword, fetchResult);
</script>

<style scoped>
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.search-meta {
  color: var(--color-secondary);
  margin-bottom: 16px;
}

.empty {
  color: var(--color-secondary);
  padding: 40px 0;
  text-align: center;
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
</style>
