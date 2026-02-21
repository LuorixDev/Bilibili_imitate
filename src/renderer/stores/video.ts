// src/renderer/stores/video.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Video } from '@/mock/types'
import { createMockDB } from '@/mock'
import logger from '@/core/logger'

export const useVideoStore = defineStore('video', () => {
  const videos = ref<Video[]>([])

  async function fetchVideos() {
    try {
      logger.info('Fetching videos from mock DB...')
      // In a real app, this would be an API call.
      // We simulate a network delay.
      await new Promise((resolve) => setTimeout(resolve, 500))

      const db = createMockDB(25)
      videos.value = db.videos

      logger.info(`Successfully fetched ${db.videos.length} videos.`)
    } catch (error) {
      logger.error('Failed to fetch videos:', error)
      // Here you could set an error state
    }
  }

  return {
    videos,
    fetchVideos,
  }
})
