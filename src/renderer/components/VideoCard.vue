<template>
  <div class="video-card" @click="handleClick">
    <div class="video-cover">
      <img :src="video.cover" :alt="video.title" />
      <div class="video-duration">{{ formatDuration(video.duration) }}</div>
      <div class="video-overlay">
        <div class="play-btn">
          <PlayIcon />
        </div>
      </div>
    </div>
    <div class="video-info">
      <h3 class="video-title">{{ video.title }}</h3>
      <div class="video-meta">
        <span class="author">
          <UserIcon class="icon" />
          {{ getAuthorName() }}
        </span>
        <span class="stats">
          <PlayCircleIcon class="icon" />
          {{ formatNumber(video.views) }}
        </span>
      </div>
      <div class="video-stats">
        <span class="time">{{ video.createdAt || video.publishTime }}</span>
        <span v-if="video.category" class="category">{{ video.category }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '@/types'
import { PlayIcon, PlayCircleIcon, UserIcon } from 'lucide-vue-next'

interface VideoWithAuthor extends Video {
  authorName?: string
  authorAvatar?: string
  createdAt?: string
  collects?: number
  coins?: number
}

const props = defineProps<{
  video: VideoWithAuthor
}>()

const emit = defineEmits<{
  click: [video: VideoWithAuthor]
}>()

const handleClick = () => {
  emit('click', props.video)
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + '千'
  }
  return num.toString()
}

// 获取作者名称
const getAuthorName = (): string => {
  if (props.video.authorName) {
    return props.video.authorName
  }
  if (props.video.author && typeof props.video.author === 'object') {
    return props.video.author.name
  }
  return '未知作者'
}
</script>

<style scoped>
.video-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.video-card:hover .video-overlay {
  opacity: 1;
}

.video-cover {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.video-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.video-card:hover .video-cover img {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.play-btn {
  width: 56px;
  height: 56px;
  background: rgba(251, 114, 153, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transform: scale(0.8);
  transition: transform 0.3s;
}

.video-card:hover .play-btn {
  transform: scale(1);
}

.video-info {
  padding: 12px;
}

.video-title {
  font-size: 14px;
  font-weight: 500;
  color: #18191c;
  line-height: 1.5;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 42px;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #9499a0;
  margin-bottom: 6px;
}

.video-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-meta .icon {
  width: 14px;
  height: 14px;
}

.video-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9499a0;
}

.category {
  background: #f1f2f3;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}
</style>
