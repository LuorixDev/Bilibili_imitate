<template>
  <div class="video-detail-view">
    <router-link to="/">< Back to Home</router-link>
    <div v-if="video" class="player-container">
      <video :src="video.url" controls autoplay class="video-player"></video>
      <div class="video-info">
        <h1 class="title">{{ video.title }}</h1>
        <div class="author-info">
          <img :src="video.author.avatar" alt="" class="avatar" />
          <span>{{ video.author.username }}</span>
        </div>
        <p class="description">{{ video.description }}</p>
      </div>
    </div>
    <div v-else class="loading-state">
      <p>Loading video...</p>
    </div>
    <!-- Comments section -->
    <CommentList v-if="video?.comments" :comments="video.comments" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useVideo } from '@/composables/useVideo'
import { toRef } from 'vue'
import CommentList from '@/components/CommentList.vue'

const route = useRoute()
const id = toRef(route.params, 'id')
const { video } = useVideo(id)
</script>

<style scoped>
.video-detail-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
}

.player-container {
  margin-top: 1rem;
}

.video-player {
  width: 100%;
  border-radius: 8px;
  background-color: #000;
}

.video-info {
  margin-top: 1.5rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.description {
  color: #606060;
  line-height: 1.6;
}

.dark .description {
  color: #aaa;
}

.loading-state {
  padding: 4rem;
  text-align: center;
  color: #888;
}
</style>
