import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Video, VideoDetail } from '../types'
import { videoApi } from '../api/videoApi'

export const useVideoStore = defineStore('video', () => {
  // State
  const videoList = ref<Video[]>([])
  const currentVideo = ref<VideoDetail | null>(null)
  const loading = ref(false)
  const hasMore = ref(true)
  const page = ref(1)
  const pageSize = 20

  // Getters
  const recommendations = computed(() => 
    videoList.value.filter(v => v.id !== currentVideo.value?.id).slice(0, 10)
  )

  // Actions
  const fetchVideos = async (refresh = false) => {
    if (loading.value) return
    
    loading.value = true
    try {
      if (refresh) {
        page.value = 1
        videoList.value = []
      }
      
      const res = await videoApi.getRecommendVideos(page.value, pageSize)
      
      if (res.data.length < pageSize) {
        hasMore.value = false
      }
      
      videoList.value.push(...res.data)
      page.value++
    } finally {
      loading.value = false
    }
  }

  const fetchVideoDetail = async (id: string) => {
    loading.value = true
    try {
      const res = await videoApi.getVideoDetail(id)
      currentVideo.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  const searchVideos = async (keyword: string) => {
    loading.value = true
    try {
      const res = await videoApi.searchVideos(keyword)
      return res.data
    } finally {
      loading.value = false
    }
  }

  const clearCurrentVideo = () => {
    currentVideo.value = null
  }

  return {
    videoList,
    currentVideo,
    loading,
    hasMore,
    recommendations,
    fetchVideos,
    fetchVideoDetail,
    searchVideos,
    clearCurrentVideo
  }
})