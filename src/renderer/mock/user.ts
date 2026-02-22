import type { UserProfile } from '../types';
import { db } from './db';
import { clone, createId, withLatency } from './utils';

const buildUser = (name: string): UserProfile => ({
  id: `user_custom_${createId()}`,
  name,
  avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`,
  bio: '刚刚加入，期待在这里记录生活。',
  level: 1,
  followers: 0,
  following: 0,
  likes: 0,
});

export const userMock = {
  login(username: string): Promise<UserProfile> {
    return withLatency(() => {
      const existing = db.users.find((item) => item.name === username);
      if (existing) {
        db.currentUserId = existing.id;
        return clone(existing);
      }
      const created = buildUser(username || '匿名用户');
      db.users.unshift(created);
      db.currentUserId = created.id;
      return clone(created);
    });
  },
  logout(): Promise<boolean> {
    return withLatency(() => {
      db.currentUserId = null;
      return true;
    });
  },
  getProfile(userId: string): Promise<UserProfile> {
    return withLatency(() => {
      const user = db.users.find((item) => item.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      return clone(user);
    });
  },
  getCurrent(): Promise<UserProfile | null> {
    return withLatency(() => {
      if (!db.currentUserId) return null;
      const user = db.users.find((item) => item.id === db.currentUserId) || null;
      return user ? clone(user) : null;
    });
  },
};
