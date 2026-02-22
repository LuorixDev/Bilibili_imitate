<template>
  <div class="comment-item" :class="{ 'is-reply': isReply, 'is-top': comment.isTop }">
    <div class="comment-avatar">
      <img :src="comment.author.avatar" :alt="comment.author.name" />
      <div class="level-badge" v-if="!isReply">Lv{{ comment.author.level }}</div>
    </div>
    <div class="comment-content">
      <div class="comment-header">
        <span class="author-name">{{ comment.author.name }}</span>
        <span class="top-tag" v-if="comment.isTop">置顶</span>
        <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
      </div>
      <div class="comment-text">{{ comment.content }}</div>
      <div class="comment-actions">
        <button class="action-btn" @click="handleLike">
          <svg viewBox="0 0 24 24" :class="{ 'is-active': isLiked }">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          <span>{{ formatNumber(comment.likes + (isLiked ? 1 : 0)) }}</span>
        </button>
        <button class="action-btn" @click="showReply = !showReply" v-if="!isReply">
          <svg viewBox="0 0 24 24">
            <path
              d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"
            />
          </svg>
          <span>{{ comment.replies > 0 ? comment.replies : '回复' }}</span>
        </button>
      </div>
      <!-- 回复列表 -->
      <div class="replies-list" v-if="!isReply && comment.children && comment.children.length > 0">
        <CommentItem
          v-for="reply in comment.children"
          :key="reply.id"
          :comment="reply"
          :is-reply="true"
          @reply="$emit('reply', reply)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Comment } from '../types'

interface Props {
  comment: Comment
  isReply?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isReply: false
})

const emit = defineEmits<{
  reply: [comment: Comment]
}>()

const isLiked = ref(false)
const showReply = ref(false)

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

const formatTime = (time: string): string => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes === 0 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 30) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const handleLike = () => {
  isLiked.value = !isLiked.value
}
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #e3e5e7;
}

.comment-item.is-reply {
  padding: 12px 0;
  border-bottom: none;
}

.comment-item.is-top {
  background-color: #fffbf0;
  margin: 0 -12px;
  padding: 16px 12px;
  border-radius: 8px;
}

.comment-avatar {
  position: relative;
  flex-shrink: 0;
}

.comment-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.is-reply .comment-avatar img {
  width: 32px;
  height: 32px;
}

.level-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: linear-gradient(135deg, #00b5e5 0%, #0099cc 100%);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 4px;
  border: 2px solid white;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #fb7299;
}

.top-tag {
  background: #fb7299;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: #18191c;
  word-wrap: break-word;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9499a0;
  font-size: 13px;
  padding: 4px 0;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #fb7299;
}

.action-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.action-btn .is-active {
  fill: #fb7299;
}

.replies-list {
  margin-top: 12px;
  padding: 12px;
  background: #f6f7f8;
  border-radius: 8px;
}
</style>