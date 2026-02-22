<template>
  <header class="app-header app-region">
    <div class="logo-wrapper">
      <div class="logo FlexCenter">
        <div class="logo-mark">B</div>
      </div>
      <nav v-show="!focused" class="menu-wrapper">
        <RouterLink to="/" class="menu-item" active-class="active">推荐</RouterLink>
        <RouterLink to="/category" class="menu-item" active-class="active">分类</RouterLink>
        <RouterLink to="/live" class="menu-item" active-class="active">直播</RouterLink>
        <RouterLink to="/hot" class="menu-item" active-class="active">热门</RouterLink>
      </nav>
    </div>

    <div class="search-wrapper" :class="{ focused }">
      <div class="search-input no-app-region" :class="{ focused }">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索感兴趣的视频"
          @focus="onFocus"
          @blur="onBlur"
          @keyup.enter="onSearch"
        />
        <div class="search-icons">
          <button
            v-show="keyword"
            class="icon-btn"
            type="button"
            @mousedown.prevent
            @click="clearKeyword"
          >
            <BaseIcon name="close" :size="16" />
          </button>
          <button class="icon-btn" type="button" @mousedown.prevent @click="onSearch">
            <BaseIcon name="search" :size="18" />
          </button>
        </div>
        <Transition name="fade">
          <div v-if="focused" class="search-panel" @mousedown.prevent>
            <div v-if="keyword && suggestions.length" class="search-list">
              <div
                v-for="item in suggestions"
                :key="item"
                class="search-item"
                @click="selectSuggestion(item)"
              >
                {{ item }}
              </div>
            </div>
            <div v-else class="search-content">
              <div class="search-title">
                <h4>搜索历史</h4>
                <button type="button" @click="historyStore.clearSearch">清空</button>
              </div>
              <div class="search-history">
                <button
                  v-for="item in historyStore.searchHistory"
                  :key="item"
                  type="button"
                  class="history-item"
                  @click="selectSuggestion(item)"
                >
                  {{ item }}
                </button>
                <span v-if="!historyStore.searchHistory.length" class="empty">暂无记录</span>
              </div>
              <div class="search-title mt-10">
                <h4>热搜</h4>
              </div>
              <div class="hot-list">
                <button
                  v-for="(item, index) in hotKeywords"
                  :key="item"
                  type="button"
                  class="hot-item"
                  @click="selectSuggestion(item)"
                >
                  <span class="rank">{{ index + 1 }}</span>
                  <span class="text">{{ item }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div class="user-panel">
      <template v-if="userStore.isLoggedIn && userStore.profile">
        <img :src="userStore.profile.avatar" alt="avatar" />
        <div class="user-info">
          <div class="name">{{ userStore.profile.name }}</div>
          <div class="meta">Lv.{{ userStore.profile.level }}</div>
        </div>
        <button class="ghost" @click="goProfile">个人中心</button>
        <button class="ghost" @click="userStore.logout">退出</button>
      </template>
      <template v-else>
        <button class="primary" @click="goProfile">登录</button>
      </template>
    </div>

    <div class="window-controls no-app-region">
      <button class="window-btn" title="最小化" @click="minimizeWindow">
        <BaseIcon name="minimize" :size="14" />
      </button>
      <button
        class="window-btn"
        :class="{ active: isMaximized }"
        title="最大化/还原"
        @click="toggleMaximize"
      >
        <BaseIcon name="maximize" :size="14" />
      </button>
      <button class="window-btn close" title="关闭" @click="closeWindow">
        <BaseIcon name="close" :size="14" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BaseIcon from './BaseIcon.vue';
import { useHistoryStore } from '../stores/history';
import { useUserStore } from '../stores/user';
import { searchApi } from '../api/searchApi';
import { useDebounce } from '../composables/useDebounce';

const router = useRouter();
const userStore = useUserStore();
const historyStore = useHistoryStore();

const keyword = ref('');
const focused = ref(false);
const suggestions = ref<string[]>([]);
const hotKeywords = ref<string[]>([]);
const isMaximized = ref(false);

const onSearch = () => {
  const value = keyword.value.trim();
  if (!value) return;
  historyStore.addSearch(value);
  focused.value = false;
  router.push({ name: 'search', query: { q: value } });
};

const selectSuggestion = (value: string) => {
  keyword.value = value;
  onSearch();
};

const clearKeyword = () => {
  keyword.value = '';
  suggestions.value = [];
};

const goProfile = () => {
  router.push({ name: 'user' });
};

const onFocus = () => {
  focused.value = true;
};

const onBlur = () => {
  setTimeout(() => {
    focused.value = false;
  }, 200);
};

const fetchSuggestions = async () => {
  const value = keyword.value.trim();
  if (!value) {
    suggestions.value = [];
    return;
  }
  const result = await searchApi.getSuggestions(value);
  suggestions.value = result;
};

const debouncedFetch = useDebounce(fetchSuggestions, 300);

const syncMaximizeState = async () => {
  isMaximized.value = (await window.electronAPI?.windowIsMaximized?.()) ?? false;
};

const minimizeWindow = () => {
  window.electronAPI?.windowMinimize?.();
};

const toggleMaximize = async () => {
  isMaximized.value = (await window.electronAPI?.windowToggleMaximize?.()) ?? false;
};

const closeWindow = () => {
  window.electronAPI?.windowClose?.();
};

onMounted(async () => {
  userStore.init();
  hotKeywords.value = await searchApi.getHotKeywords();
  await syncMaximizeState();
  window.addEventListener('resize', syncMaximizeState);
});

watch(keyword, () => {
  debouncedFetch();
});

onUnmounted(() => {
  window.removeEventListener('resize', syncMaximizeState);
});
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px 0 0;
  background: var(--color-body-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.app-header button,
.app-header input,
.app-header a,
.app-header .search-panel {
  -webkit-app-region: none;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 24px;
  gap: 24px;
  min-width: 360px;
}

.logo {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
}

.logo-mark {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.menu-wrapper {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-left: 120px;
}

.menu-item {
  position: relative;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  padding: 6px 2px;
  transition: color 0.2s ease;
}

.menu-item.active {
  color: var(--color-primary);
}

.menu-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 52px;
  margin: auto;
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background: var(--color-primary);
}

.search-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  position: relative;
}

.search-wrapper.focused {
  justify-content: center;
}

.search-input {
  position: relative;
  width: 320px;
  height: 40px;
  background: var(--color-secondary-bg);
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 6px 8px 6px 12px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  overflow: visible;
}

.search-input.focused {
  width: 500px;
  background: var(--color-body-bg);
  border-color: var(--color-primary);
}

.search-input input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-icons {
  display: flex;
  gap: 6px;
  align-items: center;
}

.icon-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: grid;
  place-items: center;
}

.search-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 100%;
  background: var(--color-body-bg);
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  padding: 0 10px 14px;
  z-index: 20;
}

.search-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 14px;
}

.search-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-title button {
  font-size: 12px;
  color: var(--color-secondary);
}

.search-history {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-item {
  background: var(--color-secondary-bg-for-transparent);
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.empty {
  font-size: 12px;
  color: var(--color-secondary);
}

.hot-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.hot-item:hover {
  background: var(--color-secondary-bg-for-transparent);
}

.rank {
  width: 18px;
  font-weight: 600;
  color: var(--color-primary);
}

.text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-list {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
}

.search-item {
  padding: 8px 10px;
  border-radius: 6px;
}

.search-item:hover {
  background: var(--color-secondary-bg-for-transparent);
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 16px;
}

.user-panel img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-info .name {
  font-weight: 600;
}

.user-info .meta {
  font-size: 12px;
  color: var(--color-secondary);
}

.primary {
  padding: 6px 16px;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
}

.ghost {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  font-size: 12px;
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 6px;
}

.window-btn {
  width: 36px;
  height: 28px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: var(--color-text);
  transition: background 0.2s ease;
}

.window-btn:hover {
  background: var(--color-secondary-bg-for-transparent);
}

.window-btn.active {
  background: var(--color-secondary-bg-for-transparent);
}

.window-btn.close:hover {
  background: #f46d75;
  color: white;
}

.mt-10 {
  margin-top: 10px;
}

@media (max-width: 1100px) {
  .menu-wrapper {
    display: none;
  }

  .search-input,
  .search-input.focused {
    width: 280px;
  }

  .search-panel {
    width: 360px;
  }
}
</style>
