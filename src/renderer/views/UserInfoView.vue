<template>
  <div v-if="profile" class="page-shell user-info">
    <div class="header">
      <img :src="profile.avatar" alt="avatar" />
      <div>
        <div class="name">{{ profile.name }}</div>
        <div class="bio">{{ profile.bio }}</div>
      </div>
    </div>
    <div class="stats">
      <div>
        <span class="num">{{ profile.followers }}</span>
        <span>粉丝</span>
      </div>
      <div>
        <span class="num">{{ profile.following }}</span>
        <span>关注</span>
      </div>
      <div>
        <span class="num">{{ profile.likes }}</span>
        <span>获赞</span>
      </div>
    </div>
    <div class="section">
      <div class="title">TA的视频</div>
      <div class="grid-list">
        <VideoCard v-for="item in userVideos" :key="item.id" :video="item" />
      </div>
    </div>
  </div>
  <div v-else class="page-shell">暂无用户信息</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { userApi } from '../api/userApi';
import { videoApi } from '../api/videoApi';
import type { UserProfile, VideoSummary } from '../types';
import VideoCard from '../components/VideoCard.vue';

const route = useRoute();
const profile = ref<UserProfile | null>(null);
const userVideos = ref<VideoSummary[]>([]);

onMounted(async () => {
  const id = (route.params.id as string) || '';
  if (id) {
    profile.value = await userApi.getProfile(id);
    // 简化：使用推荐列表过滤作者同名的视频
    const rec = await videoApi.getRecommend(1, 50);
    userVideos.value = rec.list.filter(
      (v) => v.author.id === id || v.author.name === profile.value?.name,
    );
  }
});
</script>

<style scoped>
.user-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.header img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
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

.grid-list {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0;
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
