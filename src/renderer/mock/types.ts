// src/renderer/mock/types.ts

export interface User {
  id: string
  username: string
  avatar: string
}

export interface Comment {
  id: string
  author: User
  content: string
  timestamp: Date
  likes: number
  replies: readonly Comment[]
}

export interface Video {
  id: string
  title: string
  description: string
  author: User
  cover: string
  url: string
  views: number
  likes: number
  duration: number // in seconds
  createdAt: Date
  comments: readonly Comment[]
}
