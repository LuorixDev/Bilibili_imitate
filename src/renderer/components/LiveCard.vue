<template>
  <div class="content-item" @click="openLive">
    <div class="location-wrapper">
      <img :src="live.cover" :alt="live.title" class="pic" />
      <div class="dart"></div>
      <div class="videoMsg">
        <div class="leftMsg">
          <div class="videoSum">
            <BaseIcon name="live" :size="14" />
            <div>{{ live.author.name }}</div>
          </div>
        </div>
        <div class="duration">{{ formatCount(live.viewers) }} 人气</div>
      </div>
    </div>
    <div class="text-content">
      <div class="content">{{ live.title }}</div>
      <div class="up-icon">
        <span class="up-badge">LIVE</span>
        <div class="upcontent">{{ live.tags.join(' / ') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BaseIcon from './BaseIcon.vue';
import type { LiveStream } from '../types';
import { formatCount } from '../utils/format';

interface Props {
  live: LiveStream;
}

const props = defineProps<Props>();
const router = useRouter();

const openLive = () => {
  if (window.electronAPI?.openLiveWindow) {
    window.electronAPI.openLiveWindow(props.live.id);
  } else {
    router.push(`/live/${props.live.id}`);
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
  cursor: pointer;
}

.location-wrapper {
  position: relative;
  color: var(--color-secondary-bg);
  border-radius: 8px;
  background: var(--color-secondary-bg);
  overflow: hidden;
}

.pic {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.dart {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 25px;
  background-image: linear-gradient(180deg, rgba(33, 33, 33, 0), rgba(33, 33, 33, 0.5));
}

.videoMsg {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
}

.leftMsg {
  display: flex;
  align-items: center;
}

.videoSum {
  display: flex;
  align-items: center;
  gap: 6px;
}

.duration {
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.text-content {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.content {
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.up-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-secondary);
  font-size: 12px;
}

.up-badge {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--color-primary-bg-for-transparent);
  color: var(--color-primary);
  font-size: 10px;
}
</style>
