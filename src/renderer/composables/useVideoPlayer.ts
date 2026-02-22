import { onMounted, onUnmounted, ref } from 'vue';

export const useVideoPlayer = () => {
  const videoRef = ref<HTMLVideoElement | null>(null);
  const containerRef = ref<HTMLElement | null>(null);
  const isPlaying = ref(false);
  const duration = ref(0);
  const currentTime = ref(0);
  const volume = ref(0.6);
  const isMuted = ref(false);
  const isFullscreen = ref(false);

  const syncFromVideo = () => {
    if (!videoRef.value) return;
    duration.value = videoRef.value.duration || 0;
    currentTime.value = videoRef.value.currentTime || 0;
  };

  const togglePlay = async () => {
    const video = videoRef.value;
    if (!video) return;
    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

  const seekTo = (time: number) => {
    if (!videoRef.value) return;
    videoRef.value.currentTime = time;
  };

  const setVolume = (value: number) => {
    if (!videoRef.value) return;
    volume.value = value;
    videoRef.value.volume = value;
    if (value === 0) {
      isMuted.value = true;
      videoRef.value.muted = true;
    } else if (isMuted.value) {
      isMuted.value = false;
      videoRef.value.muted = false;
    }
  };

  const toggleMute = () => {
    if (!videoRef.value) return;
    isMuted.value = !isMuted.value;
    videoRef.value.muted = isMuted.value;
  };

  const toggleFullscreen = async () => {
    const container = containerRef.value;
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const handlePlay = () => {
    isPlaying.value = true;
  };

  const handlePause = () => {
    isPlaying.value = false;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.value) return;
    currentTime.value = videoRef.value.currentTime || 0;
  };

  const handleLoaded = () => {
    syncFromVideo();
    if (videoRef.value) {
      videoRef.value.volume = volume.value;
    }
  };

  const handleFullscreenChange = () => {
    isFullscreen.value = Boolean(document.fullscreenElement);
  };

  onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  });

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });

  return {
    videoRef,
    containerRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isFullscreen,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    toggleFullscreen,
    handlePlay,
    handlePause,
    handleTimeUpdate,
    handleLoaded,
  };
};
