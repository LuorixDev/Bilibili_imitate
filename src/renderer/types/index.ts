export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  level: number;
  followers: number;
  following: number;
  likes: number;
}

export interface VideoAuthor {
  id: string;
  name: string;
  avatar: string;
}

export interface VideoSummary {
  id: string;
  title: string;
  cover: string;
  duration: number;
  views: number;
  likes: number;
  author: VideoAuthor;
  publishAt: string;
  tags: string[];
  description: string;
  src: string;
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: CommentReply[];
}

export interface DanmakuItem {
  id: string;
  videoId: string;
  userId: string;
  text: string;
  time: number;
  color: string;
  createdAt: string;
}

export interface Paginated<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}

export * from './live';
