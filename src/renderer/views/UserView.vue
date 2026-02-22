<template>
  <div class="page-shell user-page">
    <div class="section-title">个人中心</div>
    <div v-if="!userStore.isLoggedIn" class="login-card">
      <h3>欢迎回来</h3>
      <p>使用任意用户名登录体验。</p>
      <input v-model="username" type="text" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button class="primary" :disabled="userStore.loading" @click="onLogin">
        {{ userStore.loading ? '登录中...' : '登录' }}
      </button>
    </div>
    <div v-else-if="userStore.profile" class="profile-card">
      <div class="profile-header">
        <img :src="userStore.profile.avatar" alt="avatar" />
        <div>
          <div class="name">{{ userStore.profile.name }}</div>
          <div class="meta">Lv.{{ userStore.profile.level }}</div>
          <RouterLink class="link" :to="`/userinfo/${userStore.profile.id}`">查看主页</RouterLink>
        </div>
      </div>
      <p class="bio">{{ userStore.profile.bio }}</p>
      <div class="stats">
        <div>
          <span class="num">{{ userStore.profile.followers }}</span>
          <span>粉丝</span>
        </div>
        <div>
          <span class="num">{{ userStore.profile.following }}</span>
          <span>关注</span>
        </div>
        <div>
          <span class="num">{{ userStore.profile.likes }}</span>
          <span>获赞</span>
        </div>
      </div>
      <button class="ghost" @click="userStore.logout">退出登录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const username = ref('');
const password = ref('');

const onLogin = async () => {
  if (!username.value.trim()) return;
  await userStore.login(username.value, password.value);
  username.value = '';
  password.value = '';
};
</script>

<style scoped>
.user-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
}

.login-card,
.profile-card {
  max-width: 420px;
  background: var(--color-secondary-bg);
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-card input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.primary {
  padding: 8px 18px;
  border-radius: 6px;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
}

.profile-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.profile-header img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.name {
  font-size: 18px;
  font-weight: 600;
}

.meta {
  color: var(--color-secondary);
  font-size: 12px;
}

.bio {
  color: var(--color-secondary);
}

.stats {
  display: flex;
  gap: 20px;
}

.stats div {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: var(--color-secondary);
}

.num {
  font-size: 16px;
  color: var(--color-text);
  font-weight: 600;
}

.ghost {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}
</style>
