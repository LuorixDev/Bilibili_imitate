<template>
  <div class="comment">
    <img :src="comment.userAvatar" class="avatar" alt="avatar" />
    <div class="content">
      <div class="header">
        <span class="name">{{ comment.userName }}</span>
        <span class="time">{{ formatDateTime(comment.createdAt) }}</span>
      </div>
      <div class="text">{{ comment.content }}</div>
      <div class="actions">
        <span>👍 {{ comment.likes }}</span>
        <button class="reply-btn" type="button" @click="toggleReply">回复</button>
      </div>
      <div v-if="showReply" class="reply-box">
        <input v-model="replyText" type="text" placeholder="写下你的回复" />
        <button type="button" @click="submitReply">发送</button>
      </div>
      <div v-if="comment.replies.length" class="replies">
        <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
          <img :src="reply.userAvatar" alt="avatar" />
          <div>
            <div class="reply-header">
              <span class="name">{{ reply.userName }}</span>
              <span class="time">{{ formatDateTime(reply.createdAt) }}</span>
            </div>
            <div class="reply-text">{{ reply.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CommentItem } from '../types';
import { formatDateTime } from '../utils/format';

interface Props {
  comment: CommentItem;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'reply', payload: { commentId: string; content: string }): void;
}>();

const showReply = ref(false);
const replyText = ref('');

const toggleReply = () => {
  showReply.value = !showReply.value;
};

const submitReply = () => {
  const value = replyText.value.trim();
  if (!value) return;
  emit('reply', { commentId: props.comment.id, content: value });
  replyText.value = '';
  showReply.value = false;
};
</script>

<style scoped>
.comment {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.content {
  flex: 1;
}

.header {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 13px;
}

.name {
  font-weight: 600;
}

.time {
  color: var(--color-secondary);
}

.text {
  margin-top: 6px;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-secondary);
}

.reply-btn {
  color: var(--color-primary);
}

.reply-box {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.reply-box input {
  flex: 1;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 6px 8px;
}

.reply-box button {
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--color-primary);
  color: white;
}

.replies {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--color-secondary-bg);
  border-radius: 8px;
  padding: 10px;
}

.reply-item {
  display: flex;
  gap: 8px;
}

.reply-item img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.reply-header {
  display: flex;
  gap: 10px;
  font-size: 12px;
}

.reply-text {
  margin-top: 4px;
  font-size: 13px;
}
</style>
