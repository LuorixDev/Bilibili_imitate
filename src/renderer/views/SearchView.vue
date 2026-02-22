<template>
  <div class="search-view">
    <div class="search-header">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索视频、UP主..."
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <svg viewBox="0 0 24 24">
            <path
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="search-content">
      <!-- 搜索历史 -->
      <div v-if="!hasSearched" class="search-history">
        <div class="section-header">
          <h3>搜索历史</h3>
          <button class="clear-btn" @click="clearHistory">清空</button>
        </div>
        <div class="history-tags">
          <span
            v-for="item in searchHistory"
            :key="item"
            class="history-tag"
            @click="quickSearch(item)"
          >
            {{ item }}
          </span>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div v-if="!hasSearched" class="hot-search">
        <h3>热门搜索</h3>
        <div class="hot-list">
          <div
            v-for="(item, index) in hotSearchList"
            :key="index"
            class="hot-item"
            :class="{ 'top-three': index < 3 }"
            @click="quickSearch(item)"
          >
            <span class="rank">{{ index + 1 }}</span>
            <span class="keyword">{{ item }}</span>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-else class="search-results">
        <div class="results-header">
          <h3>"{{ searchQuery }}" 的搜索结果</h3>
          <span class="results-count">共 {{ searchResults.length }} 个结果</span>
        </div>
        <div class="results-grid">
          <VideoCard
            v-for="video in searchResults"
            :key="video.id"
            :video="video"
            @click="goToVideo(video.id)"
          />
        </div>
        <div v-if="searchResults.length === 0" class="no-results">
          <svg viewBox="0 0 24 24" class="empty-icon">
            <path
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
          <p>未找到相关视频</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { videoApi } from '../api/videoApi'
import VideoCard from '../components/VideoCard.vue'
import type { Video } from '../types'

const router = useRouter()
const searchQuery = ref('')
const hasSearched = ref(false)
const searchResults = ref<Video[]>([])
const searchHistory = ref<string[]>([])

const hotSearchList = [
  '原神',
  '崩坏：星穹铁道',
  '明日方舟',
  '鬼畜',
  '美食',
  '科技',
  '音乐',
  '电影解说',
  '搞笑',
  '学习'
]

onMounted(() => {
  // 从本地存储加载搜索历史
  const history = localStorage.getItem('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
})

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return

  hasSearched.value = true
  const response = await videoApi.searchVideos(searchQuery.value)
  searchResults.value = response.data

  // 添加到搜索历史
  if (!searchHistory.value.includes(searchQuery.value)) {
    searchHistory.value.unshift(searchQuery.value)
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop()
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }
}

const quickSearch = (keyword: string) => {
  searchQuery.value = keyword
  handleSearch()
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

const goToVideo = (videoId: string) => {
  router.push(`/video/${videoId}`)
}
</script>

<style scoped>
.search-view {
  padding: 20px 40px;
  min-height: 100%;
}

.search-header {
  max-width: 600px;
  margin: 0 auto 40px;
}

.search-input-wrapper {
  display: flex;
  background: #f1f2f3;
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
}

.search-btn {
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fb7299;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #fc8bab;
}

.search-btn svg {
  width: 20px;
  height: 20px;
  fill: white;
}

.search-content {
  max-width: 1200px;
  margin: 0 auto;
}

.search-history,
.hot-search {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3,
.hot-search h3 {
  font-size: 18px;
  font-weight: 600;
  color: #18191c;
}

.clear-btn {
  background: none;
  border: none;
  color: #9499a0;
  font-size: 13px;
  cursor: pointer;
}

.clear-btn:hover {
  color: #fb7299;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.history-tag {
  padding: 8px 16px;
  background: #f6f7f8;
  border-radius: 4px;
  font-size: 13px;
  color: #61666d;
  cursor: pointer;
  transition: all 0.2s;
}

.history-tag:hover {
  background: #fb7299;
  color: white;
}

.hot-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.hot-item:hover {
  background: #f6f7f8;
}

.rank {
  width: 20px;
  text-align: center;
  font-weight: 600;
  color: #9499a0;
}

.top-three .rank {
  color: #fb7299;
}

.keyword {
  font-size: 14px;
  color: #18191c;
}

.search-results {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e3e5e7;
}

.results-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #18191c;
}

.results-count {
  font-size: 13px;
  color: #9499a0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
  color: #9499a0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  fill: #e3e5e7;
  margin-bottom: 16px;
}

.no-results p {
  font-size: 14px;
}
</style>
