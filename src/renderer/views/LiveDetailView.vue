<template>
  <div v-if="live" class="live-shell">
    <div class="live-header app-region">
      <button class="gohome no-app-region" @click="goBack">
        <BaseIcon name="back" :size="16" />
        <span>返回</span>
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
    <div class="live-page" :class="{ compact: !chatVisible }">
      <section class="player-pane">
        <VideoPlayer
          ref="playerRef"
          :src="live.src"
          :poster="live.cover"
          :danmaku-items="danmakuItems"
        />
        <div class="danmaku-bar">
          <input v-model="chatText" type="text" placeholder="发送弹幕/聊天" />
          <button class="primary" @click="sendChat">发送</button>
        </div>
        <button
          class="right-close"
          @click="toggleChat"
        >
          <span
            class="right-close-icon"
            :style="{ transform: chatVisible ? 'rotate(180deg)' : 'rotate(0deg)' }"
          >
            <BaseIcon name="back" :size="16" />
          </span>
        </button>
      </section>
      <aside class="chat-pane" :class="{ collapsed: !chatVisible }">
        <div class="chat-header">直播间聊天</div>
        <div ref="chatListRef" class="chat-list">
          <div v-for="msg in chats" :key="msg.id" class="chat-item">
            <img :src="msg.userAvatar" alt="avatar" />
            <div>
              <div class="name">{{ msg.userName }}</div>
              <div class="content">{{ msg.content }}</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
  <div v-else class="page-shell">直播不存在</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import VideoPlayer from '../components/VideoPlayer/index.vue';
import { useLiveStore } from '../stores/live';
import { useUserStore } from '../stores/user';
import { useDanmaku } from '../composables/useDanmaku';
import BaseIcon from '../components/BaseIcon.vue';

const route = useRoute();
const liveStore = useLiveStore();
const userStore = useUserStore();
const playerRef = ref<{ getCurrentTime: () => number } | null>(null);
const chatText = ref('');
const chatListRef = ref<HTMLDivElement | null>(null);
const danmaku = useDanmaku();
const chatVisible = ref(true);

const liveId = computed(() => route.params.id as string);
const live = computed(() => liveStore.current);
const chats = computed(() => liveStore.chats);
const danmakuItems = computed(() => [...danmaku.active.value]);

const scrollToTop = async () => {
  await nextTick();
  if (chatListRef.value) chatListRef.value.scrollTop = 0;
};

const sendChat = async () => {
  const value = chatText.value.trim();
  if (!value || !live.value) return;
  await liveStore.sendChat(live.value.id, value, userStore.profile?.id || 'guest');
  danmaku.push({
    id: `${Date.now()}`,
    videoId: live.value.id,
    userId: userStore.profile?.id || 'guest',
    text: value,
    time: playerRef.value?.getCurrentTime?.() ?? 0,
    color: '#ff6aa3',
    createdAt: new Date().toISOString(),
  });
  chatText.value = '';
  scrollToTop();
};

const toggleChat = () => {
  chatVisible.value = !chatVisible.value;
};

const goBack = () => {
  if (window.electronAPI?.windowClose) {
    window.electronAPI.windowClose();
  } else {
    window.history.back();
  }
};

const minimizeWindow = () => window.electronAPI?.windowMinimize?.();
const toggleMaximize = () => window.electronAPI?.windowToggleMaximize?.();
const closeWindow = () => window.electronAPI?.windowClose?.();

const init = async () => {
  if (!liveId.value) return;
  await liveStore.fetchCurrent(liveId.value);
  await liveStore.fetchChats(liveId.value, 1, 30, false);
  liveStore.subscribeChat(liveId.value);
  danmaku.clear();
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  liveStore.clearChat();
});

watch(liveId, init);
watch(chats, scrollToTop);
</script>

<style scoped>
.live-shell {
  width: 100vw;
  height: 100vh;
  background: var(--color-body-bg);
  color: var(--color-text);
  display: flex;
  flex-direction: column;
}

.live-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: var(--color-navbar-bg);
}

.gohome {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  color: var(--color-text);
  background: var(--color-secondary-bg);
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.window-controls button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: var(--color-text);
  background: transparent;
  transition: background 0.2s ease;
}

.window-controls button:hover {
  background: rgba(255, 255, 255, 0.08);
}

.window-controls .close:hover {
  background: rgba(255, 99, 99, 0.9);
}

.live-page {
  flex: 1;
  display: flex;
  gap: 12px;
  width: 100%;
  height: calc(100% - 48px);
  background: var(--color-body-bg);
  color: var(--color-text);
  padding: 10px;
  box-sizing: border-box;
  min-height: 0;
}

.live-page.compact {
  gap: 0;
}

.player-pane {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.danmaku-bar {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 6px 8px;
  border-radius: 6px;
}

.danmaku-bar input {
  flex: 1;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.primary {
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.chat-pane {
  flex: 0 0 360px;
  background: var(--color-secondary-bg);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    flex 0.2s ease,
    opacity 0.2s ease;
}

.chat-pane.collapsed {
  flex-basis: 0;
  padding: 0;
  opacity: 0;
  pointer-events: none;
}

.chat-header {
  padding: 12px;
  font-weight: 700;
  border-bottom: 1px solid var(--border-color);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.chat-item img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.chat-item .name {
  font-weight: 600;
}

.chat-item .content {
  color: var(--color-secondary);
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
  transition: background 0.2s ease;
}

.right-close-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.right-close:hover {
  background: rgba(0, 0, 0, 0.5);
}

@media (max-width: 1024px) {
  .live-page {
    padding: 0;
    gap: 0;
  }

  .player-pane {
    border-radius: 0;
  }

  .chat-pane,
  .right-close {
    display: none;
  }
}
</style>
