// 视频类型定义
export interface Video {
  id: string
  title: string
  cover: string
  duration: number
  author: {
    id: string
    name: string
    avatar: string
  }
  views: number
  likes: number
  comments: number
  publishTime: string
  category: string
  tags: string[]
  // 以下字段用于详情页
  videoUrl?: string
  description?: string
  collects?: number
  coins?: number
  authorDesc?: string
}

export interface VideoDetail extends Video {
  description: string
  videoUrl: string
  relatedVideos: Video[]
  collects: number
  coins: number
  authorDesc: string
}

// 评论类型定义
export interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    level: number
  }
  likes: number
  replies: number
  createTime: string
  isTop: boolean
  parentId?: string
  children?: Comment[]
}

// 弹幕类型定义
export interface Danmaku {
  id: string
  text: string
  time: number
  type: 'scroll' | 'top' | 'bottom'
  color: string
  fontSize: 'small' | 'normal' | 'large'
  author: string
}

export interface DanmakuItem extends Danmaku {
  element?: HTMLElement
  rendered?: boolean
}

// API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 搜索类型
export interface SearchResult {
  videos: Video[]
  total: number
}

// 用户类型
export interface UserStats {
  views: number
  likes: number
  videos: number
}
