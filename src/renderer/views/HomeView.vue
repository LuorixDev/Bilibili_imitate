<template>
  <div class="home-view">
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.description') }}</p>

    <div class="controls">
      <!-- Theme switcher -->
      <button @click="toggleTheme">{{ t('home.toggle_theme') }}: {{ theme }}</button>

      <!-- Language switcher -->
      <div class="language-switcher">
        <span>{{ t('home.change_language') }}:</span>
        <button @click="setLanguage('en')" :class="{ active: locale === 'en' }">EN</button>
        <button @click="setLanguage('zh-CN')" :class="{ active: locale === 'zh-CN' }">中</button>
      </div>
    </div>

    <div class="video-list">
      <div v-if="isLoading" class="loading-state">
        <p>Loading videos...</p>
      </div>
      <div v-else-if="videos.length" class="video-grid">
        <VideoCard v-for="video in videos" :key="video.id" :video="video" />
      </div>
      <div v-else class="empty-state">
        <p>No videos found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { useI18n } from 'vue-i18n'
import { useVideos } from '@/composables/useVideos'
import VideoCard from '@/components/VideoCard.vue'

// --- i18n ---
const { t, locale } = useI18n()
const setLanguage = (lang: string) => {
  locale.value = lang
}

// --- Theme ---
const { theme, toggleTheme } = useTheme()

// --- Videos ---
const { videos, isLoading } = useVideos()
</script>

<style scoped>
.home-view {
  padding: 2rem;
  text-align: center;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.language-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-switcher button.active {
  border-color: #646cff;
  font-weight: bold;
}

.video-list {
  margin-top: 2rem;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem;
  justify-content: center;
}

.loading-state,
.empty-state {
  margin-top: 4rem;
  color: #888;
}
</style>
