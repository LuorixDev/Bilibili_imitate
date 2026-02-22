import type { UserStats, Video, ApiResponse } from '../types'
import * as mock from './mock'

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export interface UserInfo {
  id: string
  name: string
  avatar: string
  level: number
  signature: string
  followers: number
  following: number
}

export const userApi = {
  // 获取用户信息
  async getUserInfo(): Promise<ApiResponse<UserInfo>> {
    await delay(500)
    return {
      code: 0,
      message: 'success',
      data: {
        id: 'u-current',
        name: '测试用户',
        avatar: 'https://picsum.photos/100/100?random=999',
        level: 5,
        signature: '这个人很懒，什么都没有留下~',
        followers: 12580,
        following: 256
      }
    }
  },

  // 获取用户统计
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    await delay(400)
    const stats = mock.getUserStats()
    return {
      code: 0,
      message: 'success',
      data: stats
    }
  },

  // 获取用户发布的视频
  async getUserVideos(_page = 1, _pageSize = 20): Promise<ApiResponse<Video[]>> {
    await delay(600)
    const videos = mock.getUserVideos()
    return {
      code: 0,
      message: 'success',
      data: videos
    }
  },

  // 登录
  async login(username: string, _password: string): Promise<ApiResponse<{ token: string; userInfo: UserInfo }>> {
    await delay(800)
    return {
      code: 0,
      message: '登录成功',
      data: {
        token: 'mock-token-' + Date.now(),
        userInfo: {
          id: 'u-' + Date.now(),
          name: username,
          avatar: 'https://picsum.photos/100/100?random=888',
          level: 3,
          signature: '新晋UP主',
          followers: 0,
          following: 10
        }
      }
    }
  },

  // 登出
  async logout(): Promise<ApiResponse<void>> {
    await delay(300)
    return {
      code: 0,
      message: '登出成功',
      data: undefined
    }
  },

  // 更新用户信息
  async updateUserInfo(data: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
    await delay(500)
    return {
      code: 0,
      message: '更新成功',
      data: {
        id: 'u-current',
        name: data.name || '测试用户',
        avatar: data.avatar || 'https://picsum.photos/100/100?random=999',
        level: 5,
        signature: data.signature || '这个人很懒，什么都没有留下~',
        followers: 12580,
        following: 256
      }
    }
  }
}
