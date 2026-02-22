<template>
  <div class="page-shell setting">
    <div class="card">
      <div class="card-title">通用</div>
      <div class="row">
        <div class="label">主题</div>
        <div class="control">
          <button :class="{ active: theme === 'light' }" @click="(event) => setTheme('light', event)">
            浅色
          </button>
          <button :class="{ active: theme === 'dark' }" @click="(event) => setTheme('dark', event)">
            深色
          </button>
        </div>
      </div>
      <div class="row">
        <div class="label">自动播放</div>
        <label class="switch">
          <input v-model="autoplay" type="checkbox" />
          <span class="slider"></span>
        </label>
      </div>
      <div class="row">
        <div class="label">弹幕默认开启</div>
        <label class="switch">
          <input v-model="danmakuOn" type="checkbox" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div class="card">
      <div class="card-title">播放</div>
      <div class="row">
        <div class="label">默认清晰度</div>
        <select v-model="quality">
          <option value="auto">自动</option>
          <option value="1080p">1080P</option>
          <option value="720p">720P</option>
        </select>
      </div>
      <div class="row">
        <div class="label">倍速</div>
        <select v-model="speed">
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>
    </div>

    <div class="card">
      <div class="card-title">缓存</div>
      <div class="row">
        <div class="label">缓存位置</div>
        <div class="control">
          <span>{{ cachePath }}</span>
          <button class="ghost">更改</button>
        </div>
      </div>
      <div class="row">
        <div class="label">缓存大小</div>
        <div class="control">{{ cacheSize }}</div>
      </div>
      <div class="row">
        <button class="primary" @click="clearCache">清理缓存</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">关于</div>
      <div class="row about">
        <div>
          <div class="title">Bilibili Desktop Demo</div>
          <div class="meta">当前版本：{{ version }}</div>
        </div>
        <button class="ghost" @click="openGithub">查看项目</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { loadTheme, setTheme as applyTheme, type ThemeMode } from '../utils/theme';
import { storage } from '../utils/storage';

const theme = ref<ThemeMode>('light');
const autoplay = ref(storage.get('autoplay', true));
const danmakuOn = ref(storage.get('danmaku_on', true));
const quality = ref(storage.get('quality', 'auto'));
const speed = ref(storage.get('speed', '1'));
const cachePath = ref('~/Library/Caches/bilibili-desktop');
const cacheSize = ref('230 MB');
const version = ref('0.1.0');

const setTheme = (value: ThemeMode, event?: MouseEvent) => {
  theme.value = value;
  if (event) {
    applyTheme(value, { origin: { x: event.clientX, y: event.clientY } });
    return;
  }
  applyTheme(value);
};

const clearCache = () => {
  cacheSize.value = '0 MB';
};

const openGithub = () => {
  window.electronAPI?.openExternal?.('https://github.com');
};

onMounted(async () => {
  const info = await window.electronAPI?.getAppInfo?.();
  if (info?.version) {
    version.value = info.version;
  }
  theme.value = loadTheme();
});

watch(autoplay, (v) => storage.set('autoplay', v));
watch(danmakuOn, (v) => storage.set('danmaku_on', v));
watch(quality, (v) => storage.set('quality', v));
watch(speed, (v) => storage.set('speed', v));
</script>

<style scoped>
.setting {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 0 30px;
}

.card {
  background: var(--color-secondary-bg);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  gap: 12px;
  flex-wrap: wrap;
}

.label {
  min-width: 100px;
  font-weight: 600;
}

.control {
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

button.active {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--color-body-bg);
}

.primary {
  padding: 8px 16px;
  background: var(--color-primary);
  color: #fff;
  border: none;
}

.ghost {
  background: transparent;
}

.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.2s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: var(--color-primary);
}

.switch input:checked + .slider:before {
  transform: translateX(22px);
}

.about {
  align-items: center;
}
</style>
