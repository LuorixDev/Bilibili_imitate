<template>
  <header class="header-bar">
    <div class="header-left">
      <div class="logo" @click="$router.push('/')">
        <svg viewBox="0 0 24 24" fill="#FB7299" class="logo-icon">
          <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.023a1.22 1.22 0 0 1 .853-.344c.355 0 .657.124.906.373l2.573 2.56h5.909l2.573-2.56a1.218 1.218 0 0 1 .853-.344c.356 0 .658.124.907.373.375.348.563.769.563 1.264 0 .495-.188.916-.563 1.264l-1.147 1.093zm-4.147 8.64c.267-.467.669-.701 1.206-.701.537 0 .906.247 1.106.741.12.28.18.618.18 1.013s-.06.73-.18 1.007c-.2.467-.569.701-1.106.701s-.939-.234-1.206-.701a2. asymmetric 2. asymmetric 0 0 1-.18-1.007c0-.395.06-.732.18-1.013zM7.598 12.59c0-.395.06-.733.18-1.013.2-.494.569-.741 1.106-.741s.939.234 1.206.701c.12.28.18.618.18 1.013s-.06.73-.18 1.007c-.267.467-.669.701-1.206.701s-.906-.234-1.106-.701a2.193 2.193 0 0 1-.18-1.007z"/>
        </svg>
        <span class="logo-text">Bilibili</span>
      </div>
    </div>

    <div class="header-center">
      <div class="search-box">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索视频、番剧、up主..."
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
      </div>
    </div>

    <div class="header-right">
      <template v-if="userStore.isLogin">
        <div class="user-info" @click="$router.push('/user')">
          <img :src="userStore.userInfo?.avatar" class="avatar" />
          <span class="username">{{ userStore.userInfo?.username }}</span>
        </div>
        <button class="btn-logout" @click="handleLogout">退出</button>
      </template>
      <button v-else class="btn-login" @click="showLogin = true">登录</button>
    </div>

    <!-- 登录弹窗 -->
    <div v-if="showLogin" class="login-modal" @click="showLogin = false">
      <div class="login-box" @click.stop>
        <h3>用户登录</h3>
        <input v-model="loginForm.username" placeholder="用户名" />
        <input v-model="loginForm.password" type="password" placeholder="密码" />
        <button @click="handleLogin">登录</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')
const showLogin = ref(false)
const loginForm = reactive({
  username: '',
  password: ''
})

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value }
    })
  }
}

const handleLogin = async () => {
  await userStore.login(loginForm.username, loginForm.password)
  showLogin.value = false
  loginForm.username = ''
  loginForm.password = ''
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e3e5e7;
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 1000;
}

.header-left {
  width: 200px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #FB7299;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search-box {
  display: flex;
  width: 500px;
  max-width: 100%;
}

.search-box input {
  flex: 1;
  height: 40px;
  padding: 0 16px;
  border: 2px solid #e3e5e7;
  border-right: none;
  border-radius: 8px 0 0 8px;
  outline: none;
  font-size: 14px;
}

.search-box input:focus {
  border-color: #FB7299;
}

.search-btn {
  width: 48px;
  height: 40px;
  background: #FB7299;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn svg {
  width: 20px;
  height: 20px;
  color: #fff;
}

.header-right {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.username {
  font-size: 14px;
  color: #18191c;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-login, .btn-logout {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #FB7299;
}

.btn-login {
  background: #FB7299;
  color: #fff;
}

.btn-logout {
  background: #fff;
  color: #FB7299;
}

.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.login-box {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  width: 360px;
}

.login-box h3 {
  text-align: center;
  margin-bottom: 24px;
  color: #18191c;
}

.login-box input {
  width: 100%;
  height: 44px;
  margin-bottom: 16px;
  padding: 0 12px;
  border: 1px solid #e3e5e7;
  border-radius: 8px;
  font-size: 14px;
}

.login-box button {
  width: 100%;
  height: 44px;
  background: #FB7299;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>