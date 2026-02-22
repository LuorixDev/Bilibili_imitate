<template>
  <div class="page-shell my">
    <div v-if="userStore.profile" class="profile">
      <img :src="userStore.profile.avatar" alt="avatar" />
      <div class="info">
        <div class="name">{{ userStore.profile.name }}</div>
        <div class="bio">{{ userStore.profile.bio }}</div>
        <div class="stats">
          <div>
            <span class="num">{{ userStore.profile.followers }}</span>
            <span>粉丝</span>
          </div>
          <div>
            <span class="num">{{ userStore.profile.following }}</span>
            <span>关注</span>
          </div>
          <div>
            <span class="num">{{ userStore.profile.likes }}</span>
            <span>获赞</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty">请先登录</div>

    <div class="section">
      <div class="title">最近观看</div>
      <div v-if="historyStore.watchHistory.length" class="history">
        <RouterLink
          v-for="item in historyStore.watchHistory.slice(0, 8)"
          :key="item.id"
          class="history-item"
          :to="`/video/${item.id}`"
        >
          <img :src="item.cover" alt="cover" />
          <div class="meta">
            <div class="t">{{ item.title }}</div>
            <div class="s">{{ item.authorName }}</div>
          </div>
        </RouterLink>
      </div>
      <div v-else class="empty">暂无记录</div>
    </div>

    <div class="section">
      <div class="title">猜你想看</div>
      <div class="grid-list">
        <VideoCard v-for="item in videoStore.recommendList" :key="item.id" :video="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { useHistoryStore } from '../stores/history';
import { useVideoStore } from '../stores/video';
import VideoCard from '../components/VideoCard.vue';

const userStore = useUserStore();
const historyStore = useHistoryStore();
const videoStore = useVideoStore();

onMounted(async () => {
  if (!userStore.profile) await userStore.init();
  if (!videoStore.recommendList.length) await videoStore.fetchRecommend(1, 6, false);
});
</script>

<style scoped>
.my {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: var(--color-secondary-bg);
  border: 1px solid var(--border-color);
}

.profile img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.name {
  font-size: 18px;
  font-weight: 700;
}

.bio {
  color: var(--color-secondary);
}

.stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.stats .num {
  display: block;
  font-size: 16px;
  font-weight: 700;
}

.section {
  background: var(--color-secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
}

.title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}

.history {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.history-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: var(--color-body-bg);
  border: 1px solid var(--border-color);
}

.history-item img {
  width: 120px;
  height: 68px;
  border-radius: 8px;
  object-fit: cover;
}

.meta .t {
  font-weight: 600;
}

.meta .s {
  font-size: 12px;
  color: var(--color-secondary);
}

.grid-list {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0;
}

.empty {
  color: var(--color-secondary);
  padding: 8px 0;
}

@media (max-width: 1600px) {
  .grid-list {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 1300px) {
  .grid-list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
