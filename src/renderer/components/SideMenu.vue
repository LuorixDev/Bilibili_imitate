<template>
  <aside class="side-menu">
    <nav class="menu-list">
      <router-link to="/" class="menu-item" :class="{ active: $route.path === '/' }">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        <span>首页</span>
      </router-link>
      
      <router-link to="/history" class="menu-item" :class="{ active: $route.path === '/history' }">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
        <span>历史记录</span>
      </router-link>

      <div class="divider"></div>
      
      <div class="menu-section">
        <span class="section-title">我的</span>
        <router-link v-if="userStore.isLogin" :to="`/user/${userStore.userInfo?.id}`" class="menu-item">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span>个人中心</span>
        </router-link>
        <a class="menu-item" @click="handleFavorites">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span>我的收藏</span>
        </a>
      </div>

      <div class="divider"></div>

      <div class="menu-section">
        <span class="section-title">热门</span>
        <a v-for="cat in categories" :key="cat" class="menu-item" @click="handleCategory(cat)">
          <span class="category-dot"></span>
          <span>{{ cat }}</span>
        </a>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const categories = ['动画', '音乐', '舞蹈', '知识', '科技', '游戏', '娱乐']

const handleFavorites = () => {
  if (!userStore.isLogin) {
    alert('请先登录')
    return
  }
  router.push('/user')
}

const handleCategory = (cat: string) => {
  router.push({
    path: '/search',
    query: { category: cat }
  })
}
</script>

<style scoped>
.side-menu {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 200px;
  background: #fff;
  border-right: 1px solid #e3e5e7;
  padding: 16px 0;
  overflow-y: auto;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #61666d;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-item:hover,
.menu-item.active {
  color: #FB7299;
  background: #fff0f3;
}

.menu-item svg {
  width: 20px;
  height: 20px;
}

.divider {
  height: 1px;
  background: #e3e5e7;
  margin: 12px 16px;
}

.menu-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  padding: 8px 24px;
  font-size: 12px;
  color: #9499a0;
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FB7299;
}
</style>