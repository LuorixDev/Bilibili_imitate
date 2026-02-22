import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface UserInfo {
  id: string
  username: string
  avatar: string
  level: number
  signature: string
  following: number
  followers: number
  coins: number
  vipStatus: number
}

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)
  const isLogin = computed(() => !!token.value && !!userInfo.value)

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken
    window.electronAPI?.storage.setItem('auth_token', newToken)
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  const login = async (username: string, _password: string) => {
    // Mock login
    const mockToken = `mock_token_${Date.now()}`
    const mockUser: UserInfo = {
      id: `user_${Date.now()}`,
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      level: Math.floor(Math.random() * 6) + 1,
      signature: '这个人很懒，什么都没有写~',
      following: Math.floor(Math.random() * 500),
      followers: Math.floor(Math.random() * 1000),
      coins: Math.floor(Math.random() * 1000),
      vipStatus: 0
    }
    
    setToken(mockToken)
    setUserInfo(mockUser)
    return { success: true }
  }

  const logout = () => {
    token.value = null
    userInfo.value = null
    window.electronAPI?.storage.removeItem('auth_token')
  }

  const initFromStorage = async () => {
    const savedToken = await window.electronAPI?.storage.getItem('auth_token')
    if (savedToken) {
      token.value = savedToken
      // Mock restore user info
      userInfo.value = {
        id: 'user_123',
        username: '测试用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
        level: 5,
        signature: '这个人很懒，什么都没有写~',
        following: 128,
        followers: 256,
        coins: 520,
        vipStatus: 1
      }
    }
  }

  return {
    token,
    userInfo,
    isLogin,
    setToken,
    setUserInfo,
    login,
    logout,
    initFromStorage
  }
})