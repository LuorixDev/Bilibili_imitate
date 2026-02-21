<template>
  <div class="comment-list">
    <h3>{{ comments.length }} Comments</h3>
    <div v-if="comments && comments.length">
      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
    <div v-else class="no-comments">
      <p>Be the first to comment!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment as CommentType } from '@/mock/types';
import Comment from './Comment.vue';

defineProps<{
  comments: readonly CommentType[];
}>();
</script>

<style scoped>
.comment-list {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.no-comments {
  text-align: center;
  color: #888;
  padding: 2rem;
}
</style>
