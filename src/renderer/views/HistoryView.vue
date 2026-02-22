<template>
  <div class="history-view">
    <div class="history-header">
      <h1>观看历史</h1>
      <div class="header-actions">
        <button class="action-btn clear" @click="clearHistory" v-if="historyStore.historyList.length > 0">
          <svg viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
          清空历史
        </button>
      </div>
    </div>

    <div class="history-content" v-if="historyStore.historyList.length > 0">
      <div class="history-timeline">
        <div
          v-for="(group, groupIndex) in groupedHistory"
          :key="groupIndex"
          class="timeline-group"
        >
          <div class="timeline-date">{{ group.date }}</div>
          <div class="timeline-videos">
            <div
              v-for="historyItem in group.videos"
              :key="historyItem.video.id"
              class="history-item"
              @click="goToVideo(historyItem.video.id)"
            >
              <div class="video-cover">
                <img :src="historyItem.video.cover" :alt="historyItem.video.title" />
                <div class="progress-bar" v-if="historyItem.progress > 0">
                  <div class="progress-fill" :style="{ width: `${historyItem.progress}%` }"></div>
                </div>
                <div class="duration">{{ formatDuration(historyItem.video.duration) }}</div>
              </div>
              <div class="video-info">
                <h3 class="video-title">{{ historyItem.video.title }}</h3>
                <p class="video-author">{{ historyItem.video.author.name }}</p>
                <div class="video-meta">
                  <span class="watch-progress" v-if="historyItem.progress > 0">
                    观看到 {{ formatDuration(Math.floor(historyItem.video.duration * historyItem.progress / 100)) }}
                  </span>
                  <span class="watch-time">{{ formatTime(historyItem.watchedAt) }}</span>
                </div>
              </div>
              <button class="delete-btn" @click.stop="removeFromHistory(historyItem.video.id)">
                <svg viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <svg viewBox="0 0 24 24" class="empty-icon">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
      </svg>
      <h3>暂无观看记录</h3>
      <p>去首页发现精彩内容吧</p>
      <button class="go-home-btn" @click="goHome">去首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '../stores/history'

const router = useRouter()
const historyStore = useHistoryStore()

// 按日期分组
const groupedHistory = computed(() => {
  const groups: { [key: string]: typeof historyStore.historyList } = {}
  
  historyStore.historyList.forEach(item => {
    const date = new Date(item.watchedAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
  })

  return Object.entries(groups).map(([date, videos]) => ({
    date,
    videos
  }))
})

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatTime = (time: number): string => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) {
    return '刚刚'
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const goToVideo = (videoId: string) => {
  router.push(`/video/${videoId}`)
}

const goHome = () => {
  router.push('/')
}

const removeFromHistory = (videoId: string) => {
  historyStore.removeFromHistory(videoId)
}

const clearHistory = () => {
  if (confirm('确定要清空所有观看历史吗？')) {
    historyStore.clearHistory()
  }
}
</script>

<style scoped>
.history-view {
  padding: 20px 40px;
  min-height: 100%;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e3e5e7;
}

.history-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #18191c;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f6f7f8;
  border: 1px solid #e3e5e7;
  color: #61666d;
}

.action-btn:hover {
  background: #fb7299;
  border-color: #fb7299;
  color: white;
}

.action-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.history-content {
  max-width: 900px;
}

.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.timeline-group {
  position: relative;
}

.timeline-date {
  font-size: 14px;
  font-weight: 600;
  color: #18191c;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid #fb7299;
}

.timeline-videos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.history-item:hover {
  background: #f6f7f8;
  border-color: #e3e5e7;
}

.video-cover {
  position: relative;
  width: 180px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.video-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.3);
}

.progress-fill {
  height: 100%;
  background: #fb7299;
}

.duration {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
}

.video-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.video-title {
  font-size: 15px;
  font-weight: 500;
  color: #18191c;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-author {
  font-size: 13px;
  color: #9499a0;
  margin-bottom: 8px;
}

.video-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9499a0;
}

.watch-progress {
  color: #fb7299;
}

.delete-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  align-self: center;
}

.history-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #f6f7f8;
}

.delete-btn svg {
  width: 18px;
  height: 18px;
  fill: #9499a0;
}

.delete-btn:hover svg {
  fill: #fb7299;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #9499a0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  fill: #e3e5e7;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #18191c;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  margin-bottom: 24px;
}

.go-home-btn {
  padding: 10px 24px;
  background: #fb7299;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.go-home-btn:hover {
  background: #fc8bab;
}
</style>
