<template>
  <div class="user-view">
    <!-- 用户信息头部 -->
    <div class="user-header">
      <div class="user-info-card">
        <div class="user-avatar">
          <img :src="userInfo?.avatar" :alt="userInfo?.name" />
        </div>
        <div class="user-meta">
          <h1 class="user-name">{{ userInfo?.name }}</h1>
          <p class="user-signature">{{ userInfo?.signature }}</p>
          <div class="user-level">Lv{{ userInfo?.level }}</div>
        </div>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ formatNumber(userInfo?.followers || 0) }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatNumber(userInfo?.following || 0) }}</span>
            <span class="stat-label">关注</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatNumber(stats?.views || 0) }}</span>
            <span class="stat-label">获赞</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容标签页 -->
    <div class="user-content">
      <div class="content-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 视频列表 -->
      <div v-if="activeTab === 'videos'" class="content-section">
        <div class="section-header">
          <h3>我的作品 <span class="count">({{ userVideos.length }})</span></h3>
        </div>
        <div class="video-grid">
          <VideoCard
            v-for="video in userVideos"
            :key="video.id"
            :video="video"
            @click="goToVideo(video.id)"
          />
        </div>
        <div v-if="userVideos.length === 0" class="empty-state">
          <p>还没有发布过视频</p>
        </div>
      </div>

      <!-- 收藏列表 -->
      <div v-else-if="activeTab === 'favorites'" class="content-section">
        <div class="section-header">
          <h3>我的收藏 <span class="count">({{ favoriteVideos.length }})</span></h3>
        </div>
        <div class="video-grid">
          <VideoCard
            v-for="video in favoriteVideos"
            :key="video.id"
            :video="video"
            @click="goToVideo(video.id)"
          />
        </div>
        <div v-if="favoriteVideos.length === 0" class="empty-state">
          <p>还没有收藏视频</p>
        </div>
      </div>

      <!-- 点赞列表 -->
      <div v-else-if="activeTab === 'likes'" class="content-section">
        <div class="section-header">
          <h3>最近点赞 <span class="count">({{ likedVideos.length }})</span></h3>
        </div>
        <div class="video-grid">
          <VideoCard
            v-for="video in likedVideos"
            :key="video.id"
            :video="video"
            @click="goToVideo(video.id)"
          />
        </div>
        <div v-if="likedVideos.length === 0" class="empty-state">
          <p>还没有点赞过视频</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, type UserInfo } from '../api/userApi'
import { videoApi } from '../api/videoApi'
import VideoCard from '../components/VideoCard.vue'
import type { Video, UserStats } from '../types'

const router = useRouter()

const userInfo = ref<UserInfo | null>(null)
const stats = ref<UserStats | null>(null)
const userVideos = ref<Video[]>([])
const favoriteVideos = ref<Video[]>([])
const likedVideos = ref<Video[]>([])
const activeTab = ref('videos')

const tabs = [
  { key: 'videos', label: '作品' },
  { key: 'favorites', label: '收藏' },
  { key: 'likes', label: '点赞' }
]

onMounted(async () => {
  // 获取用户信息
  const userRes = await userApi.getUserInfo()
  userInfo.value = userRes.data

  // 获取用户统计
  const statsRes = await userApi.getUserStats()
  stats.value = statsRes.data

  // 获取用户视频
  const videosRes = await userApi.getUserVideos()
  userVideos.value = videosRes.data

  // 获取收藏和点赞（模拟数据）
  const recommendRes = await videoApi.getRecommendVideos(1, 8)
  favoriteVideos.value = recommendRes.data.slice(0, 4)
  likedVideos.value = recommendRes.data.slice(4, 8)
})

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

const goToVideo = (videoId: string) => {
  router.push(`/video/${videoId}`)
}
</script>

<style scoped>
.user-view {
  min-height: 100%;
}

.user-header {
  background: linear-gradient(135deg, #fb7299 0%, #ff9eb5 100%);
  padding: 40px;
}

.user-info-card {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
  background: rgba(255, 255, 255, 0.95);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.user-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-meta {
  flex: 1;
}

.user-name {
  font-size: 24px;
  font-weight: 600;
  color: #18191c;
  margin-bottom: 8px;
}

.user-signature {
  font-size: 14px;
  color: #61666d;
  margin-bottom: 12px;
}

.user-level {
  display: inline-block;
  background: linear-gradient(135deg, #00b5e5 0%, #0099cc 100%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 12px;
}

.user-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #18191c;
}

.stat-label {
  font-size: 13px;
  color: #9499a0;
}

.user-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 40px;
}

.content-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e3e5e7;
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 15px;
  color: #61666d;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-btn:hover {
  color: #fb7299;
}

.tab-btn.active {
  color: #fb7299;
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #fb7299;
}

.content-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #18191c;
}

.section-header .count {
  font-size: 14px;
  color: #9499a0;
  font-weight: normal;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #9499a0;
}

.empty-state p {
  font-size: 14px;
}
</style>