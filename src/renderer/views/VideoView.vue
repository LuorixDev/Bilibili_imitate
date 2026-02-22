<template>
  <div class="video-player">
    <div class="video-header app-region">
      <button class="gohome no-app-region" :style="{ marginLeft: goHomeMargin }" @click="goHome">
        <BaseIcon name="home" :size="18" />
        <span>回到主界面</span>
      </button>
      <div class="window-controls no-app-region">
        <button title="最小化" @click="minimizeWindow">
          <BaseIcon name="minimize" :size="12" />
        </button>
        <button title="最大化" @click="toggleMaximize">
          <BaseIcon name="maximize" :size="12" />
        </button>
        <button class="close" title="关闭" @click="closeWindow">
          <BaseIcon name="close" :size="12" />
        </button>
      </div>
    </div>

    <div class="video-layout">
      <section class="video">
        <div class="player-shell">
          <VideoPlayer
            v-if="video"
            :key="video.id"
            ref="playerRef"
            :src="video.src"
            :poster="video.cover"
            :danmaku-items="danmakuItems"
          />
          <div v-else class="player-placeholder">
            <div class="placeholder-inner">
              <div class="placeholder-title">视频加载中...</div>
              <div class="placeholder-subtitle">如果长时间无响应，请检查网络或稍后重试</div>
            </div>
          </div>
          <div class="danmaku-bar" :class="{ disabled: !video }">
            <input v-model="danmakuText" type="text" placeholder="发送一条弹幕" :disabled="!video" />
            <button class="primary" :disabled="!video" @click="sendDanmaku">发送</button>
          </div>
        </div>
        <button
          class="right-close"
          :style="{
            right: infoVisible ? '-12px' : '0',
          }"
          @click="toggleInfo"
        >
          <span
            class="right-close-icon"
            :style="{ transform: infoVisible ? 'rotate(180deg)' : 'rotate(0deg)' }"
          >
            <BaseIcon name="back" :size="16" />
          </span>
        </button>
      </section>

      <aside class="video-info" :class="{ collapsed: !infoVisible }" :style="infoStyle">
        <div class="video-info-tab">
          <button :class="{ active: tab === 'info' }" @click="tab = 'info'">简介</button>
          <button :class="{ active: tab === 'comment' }" @click="tab = 'comment'">
            评论{{ commentTotal ? ` · ${commentTotal}` : '' }}
          </button>
        </div>

        <div class="video-info-body">
          <div v-if="tab === 'info'" class="video-content">
            <div class="player-logo">
              <div class="player-img">
                <img v-if="video" :src="video.author.avatar" alt="avatar" />
              </div>
              <div class="usernames">
                <div class="user">{{ video?.author.name }}</div>
                <div class="content">{{ publishTime }}</div>
              </div>
              <button class="follow-btn no-app-region" type="button">关注</button>
            </div>
            <div class="player-context">
              <div class="context">
                <div>{{ video?.title }}</div>
              </div>
            </div>
            <div class="video-text">
              <div class="icon-wrapper">
                <BaseIcon name="play" :size="14" />
                <span>{{ formatCount(video?.views || 0) }}</span>
              </div>
              <div class="icon-wrapper">
                <BaseIcon name="comment" :size="14" />
                <span>{{ formatCount(video?.likes || 0) }}</span>
              </div>
              <div class="icon-wrapper">
                <BaseIcon name="clock" :size="14" />
                <span>{{ formatDuration(video?.duration || 0) }}</span>
              </div>
            </div>
            <div class="btn-group">
              <button class="hoverbtn">点赞</button>
              <button class="hoverbtn">收藏</button>
              <button class="hoverbtn">投币</button>
              <button class="hoverbtn">分享</button>
            </div>
            <div class="info-panel">
              <p v-if="video?.description" class="intro">{{ video?.description }}</p>
              <p v-else class="intro muted">UP主还没有填写简介~</p>
              <div v-if="video?.tags?.length" class="tags">
                <span v-for="tag in video.tags" :key="tag" class="tag">#{{ tag }}</span>
              </div>
            </div>
            <div class="recomand-video">
              <RouterLink
                v-for="item in videoStore.related"
                :key="item.id"
                :to="`/video/${item.id}`"
                class="videoList"
              >
                <div class="wrapper">
                  <img :src="item.cover" class="imgs" :alt="item.title" />
                  <div class="videoTime">
                    <div>{{ formatDuration(item.duration) }}</div>
                  </div>
                </div>
                <div class="content">
                  <div class="videoName">{{ item.title }}</div>
                  <div class="upNames">
                    <div class="top">
                      <span class="up-badge">UP</span>
                      <span>{{ item.author.name }}</span>
                    </div>
                    <div class="bottom">
                      <div>
                        <BaseIcon name="play" :size="12" />
                        <span>{{ formatCount(item.views) }}</span>
                      </div>
                      <div>
                        <BaseIcon name="comment" :size="12" />
                        <span>{{ formatCount(item.likes) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>

          <div v-else class="comment-section">
            <div class="comment-input">
              <textarea v-model="commentText" placeholder="写下你的评论"></textarea>
              <button class="primary" :disabled="!canPost" @click="postComment">发布评论</button>
              <span v-if="!canPost" class="hint">登录后可评论</span>
            </div>
            <CommentItem v-for="item in comments" :key="item.id" :comment="item" @reply="onReply" />
            <div class="comment-more">
              <button
                v-if="comments.length < commentTotal"
                class="ghost"
                :disabled="commentLoading"
                @click="loadMoreComments"
              >
                {{ commentLoading ? '加载中...' : '加载更多评论' }}
              </button>
              <span v-else class="end">没有更多评论</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import VideoPlayer from '../components/VideoPlayer/index.vue';
import CommentItem from '../components/CommentItem.vue';
import BaseIcon from '../components/BaseIcon.vue';
import { useVideoStore } from '../stores/video';
import { useHistoryStore } from '../stores/history';
import { useUserStore } from '../stores/user';
import { commentApi } from '../api/commentApi';
import { danmakuApi } from '../api/danmakuApi';
import { useDanmaku } from '../composables/useDanmaku';
import type { CommentItem as CommentType } from '../types';
import { formatCount, formatDateTime, formatDuration } from '../utils/format';

const route = useRoute();
const videoStore = useVideoStore();
const historyStore = useHistoryStore();
const userStore = useUserStore();

const videoId = computed(() => route.params.id as string);
const tab = ref<'info' | 'comment'>('info');
const infoVisible = ref(true);
const platform = ref('win32');

const comments = ref<CommentType[]>([]);
const commentText = ref('');
const commentPage = ref(1);
const commentTotal = ref(0);
const commentLoading = ref(false);

const danmaku = useDanmaku();
const danmakuText = ref('');
const playerRef = ref<{ getCurrentTime: () => number } | null>(null);
let unsubscribe: (() => void) | null = null;
const danmakuItems = computed(() => [...danmaku.active.value]);

const canPost = computed(() => userStore.isLoggedIn && userStore.profile);

const fetchComments = async (append = false) => {
  if (!videoId.value) return;
  commentLoading.value = true;
  try {
    const result = await commentApi.list(videoId.value, commentPage.value, 6);
    commentTotal.value = result.total;
    comments.value = append ? [...comments.value, ...result.list] : result.list;
  } finally {
    commentLoading.value = false;
  }
};

const loadMoreComments = async () => {
  commentPage.value += 1;
  await fetchComments(true);
};

const postComment = async () => {
  if (!canPost.value || !videoId.value || !userStore.profile) return;
  const value = commentText.value.trim();
  if (!value) return;
  const comment = await commentApi.post(videoId.value, value, userStore.profile.id);
  comments.value = [comment, ...comments.value];
  commentText.value = '';
  commentTotal.value += 1;
};

const onReply = async ({ commentId, content }: { commentId: string; content: string }) => {
  if (!canPost.value || !userStore.profile) return;
  const updated = await commentApi.reply(commentId, content, userStore.profile.id);
  comments.value = comments.value.map((item) => (item.id === updated.id ? updated : item));
};

const initDanmaku = async () => {
  danmaku.clear();
  if (!videoId.value) return;
  const list = await danmakuApi.list(videoId.value);
  list.slice(0, 12).forEach((item, index) => {
    setTimeout(() => danmaku.push(item), index * 300);
  });
  unsubscribe?.();
  unsubscribe = danmakuApi.subscribe(videoId.value, (item) => danmaku.push(item));
};

const sendDanmaku = async () => {
  if (!videoId.value) return;
  const value = danmakuText.value.trim();
  if (!value) return;
  const time = playerRef.value?.getCurrentTime?.() ?? 0;
  await danmakuApi.send(videoId.value, value, userStore.profile?.id || 'guest', time);
  danmakuText.value = '';
};

const init = async () => {
  if (!videoId.value) return;
  tab.value = 'info';
  infoVisible.value = true;
  await videoStore.fetchVideo(videoId.value);
  if (videoStore.current) {
    historyStore.addWatch(videoStore.current);
  }
  commentPage.value = 1;
  await fetchComments(false);
  await initDanmaku();
};

onMounted(async () => {
  await init();
  const info = await window.electronAPI?.getAppInfo?.();
  if (info?.platform) {
    platform.value = info.platform;
  }
});

watch(videoId, init);

onUnmounted(() => {
  unsubscribe?.();
});

const video = computed(() => videoStore.current);
const publishTime = computed(() => (video.value ? formatDateTime(video.value.publishAt) : ''));
const infoStyle = computed(() => ({
  flex: infoVisible.value ? '0 0 360px' : '0 0 0',
}));
const goHomeMargin = computed(() => (platform.value === 'win32' ? '10px' : '100px'));

const toggleInfo = () => {
  infoVisible.value = !infoVisible.value;
};

const goHome = () => {
  if (window.electronAPI?.windowClose) {
    window.electronAPI.windowClose();
  } else {
    window.history.back();
  }
};

const minimizeWindow = () => window.electronAPI?.windowMinimize?.();
const toggleMaximize = () => window.electronAPI?.windowToggleMaximize?.();
const closeWindow = () => window.electronAPI?.windowClose?.();
</script>

<style scoped>
.video-player {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--color-body-bg);
  color: var(--color-text);
  display: flex;
  flex-direction: column;
}

.video-header {
  width: 100%;
  height: 52px;
  background: var(--color-navbar-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
}

.gohome {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-secondary-bg);
}

.gohome:hover {
  background: var(--color-secondary-bg-for-transparent);
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.window-controls button {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: var(--color-text);
  background: transparent;
  transition: background var(--transition);
}

.window-controls button:hover {
  background: var(--color-secondary-bg);
}

.window-controls .close:hover {
  background: rgba(255, 99, 99, 0.18);
}

.video-layout {
  display: flex;
  width: 100%;
  height: calc(100% - 52px);
  min-height: 0;
  background: var(--color-body-bg);
}
.video {
  flex: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
  background: transparent;
  overflow: visible;
  border-radius: var(--radius-md);
  margin: 16px 12px 16px 16px;
  box-shadow: var(--shadow);
}

.player-shell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: #000;
}

.danmaku-bar {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(15, 15, 17, 0.7);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
}

.danmaku-bar.disabled {
  opacity: 0.6;
}

.danmaku-bar input {
  flex: 1;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.right-close {
  position: absolute;
  width: 40px;
  height: 60px;
  color: #fff;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px 0 0 12px;
  transition: background var(--transition);
}

.right-close-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition);
}

.right-close:hover {
  background: rgba(0, 0, 0, 0.5);
}

.player-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  background: radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.08), transparent 55%);
  padding: 20px;
}

.placeholder-inner {
  max-width: 280px;
}

.placeholder-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.placeholder-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
}

.primary {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  transition: filter var(--transition);
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary:not(:disabled):hover {
  filter: brightness(1.05);
}

.video-info {
  flex: 0 0 380px;
  background: var(--color-secondary-bg);
  color: var(--color-text);
  overflow: hidden;
  transition:
    flex 0.2s ease,
    opacity 0.2s ease;
  padding: 16px;
  border-left: 1px solid var(--border-color);
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.video-info.collapsed {
  flex-basis: 0;
  padding: 0;
  opacity: 0;
  pointer-events: none;
  border-left: none;
}

.video-info-tab {
  width: 100%;
  height: 40px;
  padding: 0 0 12px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: 12px;
}

.video-info-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.video-info-tab button {
  color: var(--color-text);
  font-weight: 600;
}

.video-info-tab button.active {
  color: var(--color-primary);
}

.video-content,
.comment-section {
  width: 100%;
  color: var(--color-text);
  padding: 16px 0;
  --color-secondary: var(--color-secondary);
  --border-color: var(--border-color);
}

.player-logo {
  width: 100%;
  display: flex;
  align-items: center;
  height: 50px;
  gap: 10px;
}

.player-img img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.usernames {
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.user {
  font-size: 15px;
  font-weight: bold;
}

.content {
  color: var(--color-secondary);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-btn {
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-bg-for-transparent);
  font-weight: 700;
}

.player-context {
  display: flex;
  width: 100%;
  margin-top: 10px;
  overflow: hidden;
}

.context > div:first-child {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;
  -webkit-line-clamp: 2;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.video-text {
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--color-secondary);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-group {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}

.hoverbtn {
  width: 60px;
  padding: 5px;
  border-radius: 5px;
  color: var(--color-text);
}

.hoverbtn:hover {
  background: var(--color-secondary-bg-for-transparent);
}

.info-panel {
  padding: 12px 0 0;
  border-top: 1px solid var(--border-color);
  margin-top: 10px;
}

.intro {
  line-height: 1.7;
  font-size: 14px;
  white-space: pre-wrap;
}

.intro.muted {
  color: var(--color-secondary);
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.tag {
  padding: 6px 10px;
  background: var(--color-secondary-bg);
  border-radius: var(--radius-sm);
  font-size: 12px;
}

.recomand-video {
  width: 100%;
  border-top: 1px solid var(--border-color);
  margin-top: 14px;
}

.videoList {
  border-radius: 6px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  padding: 5px;
  height: 100px;
  width: 100%;
  margin: 10px 0;
  display: flex;
  gap: 10px;
  color: var(--color-text);
}

.videoList:hover {
  background: var(--color-secondary-bg-for-transparent);
}

.wrapper {
  flex: 0 0 150px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.imgs {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.videoTime {
  position: absolute;
  right: 4px;
  bottom: 4px;
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.videoName {
  font-weight: 600;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 6px;
}

.upNames {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

.top {
  display: flex;
  align-items: center;
  gap: 6px;
}

.up-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: var(--color-primary-bg-for-transparent);
  color: var(--color-primary);
  padding: 2px 4px;
  border-radius: 4px;
}

.bottom {
  display: flex;
  gap: 10px;
  color: var(--color-secondary);
}

.bottom div {
  display: flex;
  align-items: center;
  gap: 4px;
}

.comment-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-input textarea {
  min-height: 80px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--color-body-bg);
  color: var(--color-text);
}

.hint {
  font-size: 12px;
  color: var(--color-secondary);
}

.comment-more {
  display: flex;
  justify-content: center;
  margin: 16px 0 0;
}

.ghost {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  color: var(--color-text);
  background: transparent;
}

.end {
  font-size: 12px;
  color: var(--color-secondary);
}

@media (max-width: 1024px) {
  .video-layout {
    flex-direction: column;
  }

  .video {
    margin: 0;
    border-radius: 0;
  }

  .player-shell {
    border-radius: 0;
  }

  .video-info {
    display: none;
  }

  .right-close {
    display: none;
  }
}
</style>
