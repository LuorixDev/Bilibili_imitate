import type { Comment, ApiResponse } from '../types'
import * as mock from './mock'

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const commentApi = {
  // 获取评论列表
  async getComments(_videoId: string, _page = 1, _pageSize = 20): Promise<ApiResponse<Comment[]>> {
    await delay(600)
    const comments = mock.getComments(_videoId)
    return {
      code: 0,
      message: 'success',
      data: comments
    }
  },

  // 发表评论
  async postComment(
    _videoId: string, 
    content: string, 
    parentId?: string
  ): Promise<ApiResponse<Comment>> {
    await delay(500)
    const newComment: Comment = {
      id: `new-${Date.now()}`,
      content,
      author: {
        id: 'current-user',
        name: '当前用户',
        avatar: 'https://picsum.photos/100/100?random=999',
        level: 5
      },
      likes: 0,
      replies: 0,
      createTime: new Date().toISOString(),
      isTop: false,
      parentId
    }
    return {
      code: 0,
      message: '评论成功',
      data: newComment
    }
  },

  // 点赞评论
  async likeComment(_commentId: string): Promise<ApiResponse<void>> {
    await delay(300)
    return {
      code: 0,
      message: '点赞成功',
      data: undefined
    }
  },

  // 删除评论
  async deleteComment(_commentId: string): Promise<ApiResponse<void>> {
    await delay(300)
    return {
      code: 0,
      message: '删除成功',
      data: undefined
    }
  }
}
