import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Video } from '../types'

export interface HistoryItem {
  video: Video
  progress: number
  watchedAt: number
}

export const useHistoryStore = defineStore('history', () => {
  // State
  const historyList = ref<HistoryItem[]>([])
  const favorites = ref<Video[]>([])

  // Getters
  const recentHistory = computed(() => 
    historyList.value.slice(0, 50)
  )

  const isFavorited = (videoId: string) => 
    favorites.value.some(v => v.id === videoId)

  // Actions
  const addToHistory = async (video: Video, progress: number = 0) => {
    const existingIndex = historyList.value.findIndex(h => h.video.id === video.id)
    
    if (existingIndex > -1) {
      historyList.value.splice(existingIndex, 1)
    }
    
    historyList.value.unshift({
      video,
      progress,
      watchedAt: Date.now()
    })
    
    await saveToStorage()
  }

  const addToFavorites = async (video: Video) => {
    if (!isFavorited(video.id)) {
      favorites.value.unshift(video)
      await saveToStorage()
    }
  }

  const removeFromFavorites = async (videoId: string) => {
    const index = favorites.value.findIndex(v => v.id === videoId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      await saveToStorage()
    }
  }

  const removeFromHistory = async (videoId: string) => {
    const index = historyList.value.findIndex(h => h.video.id === videoId)
    if (index > -1) {
      historyList.value.splice(index, 1)
      await saveToStorage()
    }
  }

  const clearHistory = async () => {
    historyList.value = []
    await saveToStorage()
  }

  const saveToStorage = async () => {
    await window.electronAPI?.storage.setItem('watch_history', JSON.stringify(historyList.value.slice(0, 100)))
    await window.electronAPI?.storage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const initFromStorage = async () => {
    const historyData = await window.electronAPI?.storage.getItem('watch_history')
    const favoritesData = await window.electronAPI?.storage.getItem('favorites')
    
    if (historyData) {
      try {
        historyList.value = JSON.parse(historyData)
      } catch {}
    }
    
    if (favoritesData) {
      try {
        favorites.value = JSON.parse(favoritesData)
      } catch {}
    }
  }

  return {
    historyList,
    favorites,
    recentHistory,
    isFavorited,
    addToHistory,
    addToFavorites,
    removeFromFavorites,
    removeFromHistory,
    clearHistory,
    initFromStorage
  }
})
 
