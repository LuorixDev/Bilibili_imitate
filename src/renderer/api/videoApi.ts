import type { Video, VideoDetail, ApiResponse } from '../types'
import * as mock from './mock'

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const videoApi = {
  // 获取视频详情
  async getVideoDetail(id: string): Promise<ApiResponse<VideoDetail>> {
    await delay(500)
    const detail = mock.getVideoDetail(id)
    return {
      code: 0,
      message: 'success',
      data: detail
    }
  },

  // 获取推荐视频列表
  async getRecommendVideos(page = 1, pageSize = 20): Promise<ApiResponse<Video[]>> {
    await delay(800)
    const videos = mock.getRecommendVideos(page, pageSize)
    return {
      code: 0,
      message: 'success',
      data: videos
    }
  },

  // 搜索视频
  async searchVideos(keyword: string): Promise<ApiResponse<Video[]>> {
    await delay(600)
    const videos = mock.searchVideos(keyword)
    return {
      code: 0,
      message: 'success',
      data: videos
    }
  },

  // 获取相关视频
  async getRelatedVideos(videoId: string): Promise<ApiResponse<Video[]>> {
    await delay(400)
    const detail = mock.getVideoDetail(videoId)
    return {
      code: 0,
      message: 'success',
      data: detail.relatedVideos
    }
  },

  // 点赞视频
  async likeVideo(_videoId: string): Promise<ApiResponse<void>> {
    await delay(300)
    return {
      code: 0,
      message: '点赞成功',
      data: undefined
    }
  },

  // 收藏视频
  async collectVideo(_videoId: string): Promise<ApiResponse<void>> {
    await delay(300)
    return {
      code: 0,
      message: '收藏成功',
      data: undefined
    }
  },

  // 投币
  async coinVideo(_videoId: string, count: number): Promise<ApiResponse<void>> {
    await delay(300)
    return {
      code: 0,
      message: `投币成功，投了${count}个硬币`,
      data: undefined
    }
  }
}
