import type { CommentItem, Paginated } from '../types';
import { db } from './db';
import { clone, createId, paginate, withLatency } from './utils';

export const commentMock = {
  list(videoId: string, page: number, pageSize: number): Promise<Paginated<CommentItem>> {
    return withLatency(() => {
      const list = db.comments
        .filter((item) => item.videoId === videoId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return paginate(clone(list), page, pageSize);
    });
  },
  post(videoId: string, content: string, userId: string): Promise<CommentItem> {
    return withLatency(() => {
      const user = db.users.find((item) => item.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      const comment: CommentItem = {
        id: createId(),
        videoId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      };
      db.comments.unshift(comment);
      return clone(comment);
    });
  },
  reply(commentId: string, content: string, userId: string): Promise<CommentItem> {
    return withLatency(() => {
      const user = db.users.find((item) => item.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      const comment = db.comments.find((item) => item.id === commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }
      comment.replies.unshift({
        id: createId(),
        commentId: comment.id,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content,
        createdAt: new Date().toISOString(),
      });
      return clone(comment);
    });
  },
};
