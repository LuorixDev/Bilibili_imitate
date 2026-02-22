<template>
  <div class="page-shell">
    <div class="section-title">观看历史</div>
    <div v-if="!historyStore.watchHistory.length" class="empty">暂无观看记录</div>
    <div v-else class="history-list">
      <RouterLink
        v-for="item in historyStore.watchHistory"
        :key="item.id"
        class="history-item"
        :to="`/video/${item.id}`"
      >
        <img :src="item.cover" :alt="item.title" />
        <div class="info">
          <div class="title">{{ item.title }}</div>
          <div class="meta">{{ item.authorName }} · {{ formatDateTime(item.watchedAt) }}</div>
        </div>
      </RouterLink>
    </div>

    <div class="section-title">搜索历史</div>
    <div class="search-history">
      <button
        v-for="item in historyStore.searchHistory"
        :key="item"
        class="history-chip"
        @click="goSearch(item)"
      >
        {{ item }}
      </button>
      <span v-if="!historyStore.searchHistory.length" class="empty">暂无搜索记录</span>
    </div>
    <div class="actions">
      <button class="ghost" @click="historyStore.clearWatch">清空观看历史</button>
      <button class="ghost" @click="historyStore.clearSearch">清空搜索历史</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useHistoryStore } from '../stores/history';
import { formatDateTime } from '../utils/format';

const historyStore = useHistoryStore();
const router = useRouter();

const goSearch = (keyword: string) => {
  router.push({ name: 'search', query: { q: keyword } });
};
</script>

<style scoped>
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  gap: 14px;
  padding: 10px;
  border-radius: 10px;
  background: var(--color-secondary-bg);
  transition: transform 0.2s ease;
}

.history-item:hover {
  transform: translateY(-2px);
}

.history-item img {
  width: 160px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  font-weight: 600;
}

.meta {
  font-size: 12px;
  color: var(--color-secondary);
}

.search-history {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 32px;
}

.history-chip {
  padding: 6px 10px;
  border-radius: 6px;
  background: var(--color-secondary-bg);
}

.actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.ghost {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.empty {
  color: var(--color-secondary);
}
</style>
