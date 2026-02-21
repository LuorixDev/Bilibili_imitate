// src/renderer/composables/useVideos.ts
import { useVideoStore } from '@/stores/video'
import { storeToRefs } from 'pinia'
import { onMounted, readonly, ref } from 'vue'

/**
 * Composable for video-related business logic.
 * It abstracts the data source (Pinia store) and provides
 * a clean, reactive interface for views.
 */
export function useVideos() {
  const videoStore = useVideoStore()
  const { videos } = storeToRefs(videoStore)
  const { fetchVideos } = videoStore

  const isLoading = ref(false)

  // Function to load videos, preventing re-fetching if already loaded.
  const loadVideos = async () => {
    // Avoid re-fetching if we already have videos.
    if (videos.value.length > 0) {
      return
    }

    isLoading.value = true
    try {
      await fetchVideos()
    } finally {
      isLoading.value = false
    }
  }

  // Automatically fetch videos when the composable is used in a component.
  onMounted(loadVideos)

  return {
    // Make the videos list readonly to enforce uni-directional data flow.
    // Components should not be able to mutate the store state directly.
    videos: readonly(videos),
    isLoading: readonly(isLoading),
    // Re-expose the fetch function if a manual refresh is needed.
    fetchVideos: loadVideos,
  }
}
