import type { CommentItem, Paginated } from '../types';
import { commentMock } from '../mock/comment';

export const commentApi = {
  list(videoId: string, page = 1, pageSize = 8): Promise<Paginated<CommentItem>> {
    return commentMock.list(videoId, page, pageSize);
  },
  post(videoId: string, content: string, userId: string): Promise<CommentItem> {
    return commentMock.post(videoId, content, userId);
  },
  reply(commentId: string, content: string, userId: string): Promise<CommentItem> {
    return commentMock.reply(commentId, content, userId);
  },
};

// Replace with real HTTP calls later; component logic should remain unchanged.
