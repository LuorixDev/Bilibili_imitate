<template>
  <div class="home-view">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <h1>发现精彩视频</h1>
        <p>探索无限可能的世界</p>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        class="tab-btn"
        :class="{ active: currentCategory === cat }"
        @click="currentCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 视频网格 -->
    <div class="video-grid">
      <VideoCard
        v-for="video in filteredVideos"
        :key="video.id"
        :video="video"
        @click="goToVideo(video)"
      />
    </div>

    <!-- 加载更多 -->
    <div class="load-more">
      <button v-if="videoStore.hasMore" class="load-btn" @click="loadMore">
        {{ videoStore.loading ? '加载中...' : '加载更多' }}
      </button>
      <span v-else class="no-more">没有更多了</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoStore } from '../stores/video'
import type { Video } from '../types'
import VideoCard from '../components/VideoCard.vue'

const router = useRouter()
const videoStore = useVideoStore()

const categories = ['推荐', '动画', '音乐', '舞蹈', '游戏', '科技', '生活', '娱乐']
const currentCategory = ref('推荐')

const filteredVideos = computed(() => {
  if (currentCategory.value === '推荐') {
    return videoStore.videoList
  }
  return videoStore.videoList.filter(v => v.category === currentCategory.value)
})

const goToVideo = (video: Video) => {
  router.push(`/video/${video.id}`)
}

const loadMore = () => {
  videoStore.fetchVideos()
}

onMounted(() => {
  videoStore.fetchVideos(true)
})
</script>

<style scoped>
.home-view {
  padding: 20px;
}

.banner {
  background: linear-gradient(135deg, #FB7299 0%, #FF8F9F 100%);
  border-radius: 16px;
  padding: 48px;
  margin-bottom: 24px;
  color: #fff;
}

.banner-content h1 {
  font-size: 32px;
  margin-bottom: 12px;
}

.banner-content p {
  font-size: 16px;
  opacity: 0.9;
}

.category-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  background: #f1f2f3;
  color: #61666d;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover,
.tab-btn.active {
  background: #FB7299;
  color: #fff;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.load-more {
  text-align: center;
  padding: 40px;
}

.load-btn {
  padding: 12px 48px;
  border: 1px solid #e3e5e7;
  border-radius: 8px;
  background: #fff;
  color: #61666d;
  font-size: 14px;
  cursor: pointer;
}

.load-btn:hover {
  border-color: #FB7299;
  color: #FB7299;
}

.no-more {
  color: #9499a0;
  font-size: 14px;
}
</style>
