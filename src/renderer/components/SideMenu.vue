<template>
  <aside class="side-menu">
    <div class="menu-top">
      <button class="icon-btn no-app-region" title="返回" @click="goBack">
        <BaseIcon name="back" :size="18" />
      </button>
    </div>
    <nav class="menu-links">
      <RouterLink to="/" class="menu-item no-app-region" active-class="active">
        <BaseIcon name="home" />
        <span>首页</span>
      </RouterLink>
      <RouterLink to="/dynamic" class="menu-item no-app-region" active-class="active">
        <BaseIcon name="fire" />
        <span>动态</span>
      </RouterLink>
      <RouterLink to="/category" class="menu-item no-app-region" active-class="active">
        <BaseIcon name="grid" />
        <span>分类</span>
      </RouterLink>
      <RouterLink to="/live" class="menu-item no-app-region" active-class="active">
        <BaseIcon name="live" />
        <span>直播</span>
      </RouterLink>
      <RouterLink to="/hot" class="menu-item no-app-region" active-class="active">
        <BaseIcon name="fire" />
        <span>热门</span>
      </RouterLink>
      <RouterLink to="/history" class="menu-item no-app-region" active-class="active">
        <BaseIcon name="history" />
        <span>历史</span>
      </RouterLink>
    </nav>
    <div class="menu-bottom">
      <RouterLink to="/user" class="menu-item no-app-region" active-class="active">
        <BaseIcon name="user" />
        <span>我的</span>
      </RouterLink>
      <RouterLink to="/my" class="menu-item no-app-region" active-class="active">
        <BaseIcon name="history" />
        <span>个人</span>
      </RouterLink>
      <RouterLink to="/setting" class="menu-item no-app-region" active-class="active">
        <BaseIcon name="settings" :size="18" />
        <span>设置</span>
      </RouterLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BaseIcon from './BaseIcon.vue';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.side-menu {
  height: 100%;
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 0;
  gap: 12px;
  color: var(--color-text);
}

.menu-top {
  height: 100px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.menu-links {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.menu-item {
  width: 100%;
  height: 54px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text);
  transition: color 0.2s ease;
}

.menu-item.active,
.menu-item:hover {
  color: var(--color-primary);
}

.menu-bottom {
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background: transparent;
  display: grid;
  place-items: center;
  transition: background 0.2s ease;
}

.icon-btn:hover {
  background: var(--color-secondary-bg-for-transparent);
}
</style>
