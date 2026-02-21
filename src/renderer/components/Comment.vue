<template>
  <div class="comment-item">
    <img :src="comment.author.avatar" alt="" class="avatar" />
    <div class="comment-body">
      <div class="author-info">
        <span class="author-name">{{ comment.author.username }}</span>
        <span class="timestamp">{{ timeAgo(comment.timestamp) }}</span>
      </div>
      <p class="content">{{ comment.content }}</p>
      <div class="actions">
        <span>Like ({{ comment.likes }})</span>
        <span>Reply</span>
      </div>
      <div v-if="comment.replies && comment.replies.length" class="replies">
        <Comment
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '@/mock/types'

// This component can be used recursively.
// The name "Comment" inside the <template> will refer to this component itself.
defineProps<{
  comment: Comment
}>()

const timeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) return `${Math.floor(interval)} years ago`
  interval = seconds / 2592000
  if (interval > 1) return `${Math.floor(interval)} months ago`
  interval = seconds / 86400
  if (interval > 1) return `${Math.floor(interval)} days ago`
  interval = seconds / 3600
  if (interval > 1) return `${Math.floor(interval)} hours ago`
  interval = seconds / 60
  if (interval > 1) return `${Math.floor(interval)} minutes ago`
  return `${Math.floor(seconds)} seconds ago`
}
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-top: 4px;
}

.comment-body {
  flex: 1;
  text-align: left;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-name {
  font-weight: 600;
}

.timestamp {
  font-size: 0.8rem;
  color: #888;
}

.content {
  margin: 0.5rem 0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.actions {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #888;
  cursor: pointer;
}

.replies {
  margin-top: 1rem;
}
</style>
