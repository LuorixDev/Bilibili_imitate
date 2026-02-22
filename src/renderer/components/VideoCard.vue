<template>
  <div class="content-item">
    <button class="link-item no-app-region" type="button" @click="openVideo">
      <HoverVideo :src="video.src">
        <div class="location-wrapper">
          <img
            loading="lazy"
            :src="video.cover"
            :alt="video.title"
            class="pic"
            :class="{ loaded }"
            @load="loaded = true"
          />
          <div class="dart"></div>
          <div class="videoMsg">
            <div class="leftMsg">
              <div class="videoSum">
                <BaseIcon name="play" :size="14" />
                <div>{{ formatCount(video.views) }}</div>
              </div>
              <div class="videoSum">
                <BaseIcon name="comment" :size="14" />
                <div>{{ formatCount(video.likes) }}</div>
              </div>
            </div>
            <div class="duration">{{ formatDuration(video.duration) }}</div>
          </div>
        </div>
      </HoverVideo>
    </button>
    <div class="text-content">
      <div class="content">{{ video.title }}</div>
      <div class="up-icon">
        <span class="up-badge">UP</span>
        <div class="upcontent">{{ video.author.name }} · {{ formatDateTime(video.publishAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatCount, formatDateTime, formatDuration } from '../utils/format';
import type { VideoSummary } from '../types';
import { useRouter } from 'vue-router';
import BaseIcon from './BaseIcon.vue';
import HoverVideo from './HoverVideo.vue';

interface Props {
  video: VideoSummary;
}

const props = defineProps<Props>();

const loaded = ref(false);
const router = useRouter();

const openVideo = async () => {
  const api = window.electronAPI as ElectronAPI | undefined;
  if (api?.openVideoWindow) {
    await api.openVideoWindow(props.video.id);
  } else {
    router.push(`/video/${props.video.id}`);
  }
};
</script>

<style scoped>
.content-item {
  overflow: hidden;
  box-sizing: border-box;
  padding-bottom: 82%;
  height: 0;
  display: inline-block;
  margin-left: 20px;
  margin-top: 10px;
}

.link-item {
  display: block;
  width: 100%;
}

.location-wrapper {
  position: relative;
  color: var(--color-secondary-bg);
  border-radius: 8px;
  background: var(--color-secondary-bg);
  overflow: hidden;
}

.location-wrapper:hover .videoMsg,
.location-wrapper:hover .dart {
  opacity: 0;
}

.pic {
  width: 100%;
  height: 140px;
  transition: opacity 0.3s ease;
  opacity: 0;
  object-fit: cover;
}

.pic.loaded {
  opacity: 1;
}

.dart {
  transition: all 0.3s ease;
  width: 100%;
  opacity: 1;
  position: absolute;
  bottom: 0;
  height: 25px;
  background-image: linear-gradient(180deg, rgba(33, 33, 33, 0), rgba(33, 33, 33, 0.5));
}

.videoMsg {
  background: linear-gradient(180deg, rgba(33, 33, 33, 0), rgba(33, 33, 33, 0.5));
  width: 100%;
  opacity: 1;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding-right: 6px;
  transition: all 0.3s ease;
  font-weight: bold;
  color: #fff;
  font-size: 12px;
}

.leftMsg {
  display: flex;
  align-items: center;
  gap: 10px;
}

.videoSum {
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-content {
  height: 40%;
}

.content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: bold;
  font-size: 100%;
  line-height: 20px;
  height: 40px;
}

.up-icon {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-secondary);
  font-size: 12px;
}

.up-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  border-radius: 4px;
  background: var(--color-primary-bg-for-transparent);
  font-size: 10px;
  color: var(--color-primary);
}

.upcontent {
  line-height: 0;
  margin-left: 4px;
}
</style>
