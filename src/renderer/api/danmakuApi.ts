import type { Danmaku, ApiResponse } from '../types'
import * as mock from './mock'

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const danmakuApi = {
  // 获取弹幕列表
  async getDanmaku(videoId: string): Promise<ApiResponse<Danmaku[]>> {
    await delay(400)
    const danmaku = mock.getDanmaku(videoId)
    return {
      code: 0,
      message: 'success',
      data: danmaku
    }
  },

  // 发送弹幕
  async sendDanmaku(
    _videoId: string, 
    text: string, 
    time: number,
    type: 'scroll' | 'top' | 'bottom' = 'scroll',
    color: string = '#ffffff',
    fontSize: 'small' | 'normal' | 'large' = 'normal'
  ): Promise<ApiResponse<Danmaku>> {
    await delay(300)
    const newDanmaku: Danmaku = {
      id: `d-${Date.now()}`,
      text,
      time,
      type,
      color,
      fontSize,
      author: 'current-user'
    }
    return {
      code: 0,
      message: '弹幕发送成功',
      data: newDanmaku
    }
  },

  // 屏蔽弹幕
  async blockDanmaku(_danmakuId: string): Promise<ApiResponse<void>> {
    await delay(200)
    return {
      code: 0,
      message: '已屏蔽',
      data: undefined
    }
  },

  // 举报弹幕
  async reportDanmaku(_danmakuId: string, _reason: string): Promise<ApiResponse<void>> {
    await delay(200)
    return {
      code: 0,
      message: '举报成功',
      data: undefined
    }
  }
}
