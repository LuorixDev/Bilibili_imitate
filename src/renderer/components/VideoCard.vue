<template>
  <router-link :to="{ name: 'video', params: { id: video.id } }" class="video-card-link">
    <div class="video-card">
      <div class="card-image">
        <img :src="video.cover" :alt="video.title" />
        <div class="duration">{{ formatDuration(video.duration) }}</div>
      </div>
      <div class="card-content">
        <h3 class="title">{{ video.title }}</h3>
        <div class="meta">
          <span class="author">{{ video.author.username }}</span>
          <span class="views">{{ formatViews(video.views) }} views</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Video } from '@/mock/types'

defineProps<{
  video: Video
}>()

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const formatViews = (views: number) => {
  if (views > 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views > 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}
</script>

<style scoped>
.video-card-link {
  text-decoration: none;
  color: inherit;
}

.video-card {
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--bg-color-soft, #f9f9f9);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease-in-out;
  max-width: 320px;
}

.dark .video-card {
  background-color: var(--bg-color-mute, #2a2a2a);
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
}

.card-image img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-content {
  padding: 12px;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.4;
  /* Clamp to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #606060;
}

.dark .meta {
  color: #aaa;
}
</style>
