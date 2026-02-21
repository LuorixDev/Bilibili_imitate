// src/renderer/composables/useVideo.ts
import { useVideoStore } from '@/stores/video'
import { computed, type Ref } from 'vue'
import { storeToRefs } from 'pinia'

/**
 * Composable for fetching a single video by its ID.
 *
 * @param id - The ID of the video to fetch, as a ref.
 */
export function useVideo(id: Ref<string | string[]>) {
  const videoStore = useVideoStore()
  const { videos } = storeToRefs(videoStore)
  const { fetchVideos } = videoStore

  // Ensure videos are loaded
  if (videos.value.length === 0) {
    // In a real app, you might only fetch the specific video
    // but for our mock setup, we fetch them all.
    fetchVideos()
  }

  const video = computed(() => {
    const videoId = Array.isArray(id.value) ? id.value[0] : id.value
    return videos.value.find((v) => v.id === videoId)
  })

  return {
    video,
  }
}
