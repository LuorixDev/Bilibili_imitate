import type { LiveChatMessage, LiveStream, Paginated } from '../types';
import { db } from './db';
import { clone, createId, paginate, pick, withLatency } from './utils';

const livePool: LiveStream[] = db.videos.slice(0, 8).map((video, idx) => ({
  id: `live_${idx + 1}`,
  title: `直播：${video.title}`,
  cover: video.cover,
  author: video.author,
  viewers: 1200 + idx * 320,
  tags: video.tags,
  src: video.src,
  startedAt: new Date(Date.now() - idx * 3600000).toISOString(),
}));

const chatMessages: LiveChatMessage[] = Array.from({ length: 40 }).map((_, i) => {
  const user = pick(db.users);
  return {
    id: createId(),
    liveId: pick(livePool).id,
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    content: '欢迎来到直播间 ' + (i + 1),
    createdAt: new Date(Date.now() - i * 30000).toISOString(),
  };
});

type ChatListener = (msg: LiveChatMessage) => void;
const chatListeners = new Map<string, Set<ChatListener>>();
const chatTimers = new Map<string, ReturnType<typeof setInterval>>();

const ensureChatTimer = (liveId: string) => {
  if (chatTimers.has(liveId)) return;
  const timer = setInterval(() => {
    const user = pick(db.users);
    const msg: LiveChatMessage = {
      id: createId(),
      liveId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: pick(['666', '好看', '冲鸭', '上车', '太强了', '笑死我了']),
      createdAt: new Date().toISOString(),
    };
    chatMessages.push(msg);
    const set = chatListeners.get(liveId);
    set?.forEach((fn) => fn(clone(msg)));
  }, 2500);
  chatTimers.set(liveId, timer);
};

const cleanupChatTimer = (liveId: string) => {
  const set = chatListeners.get(liveId);
  if (set && set.size > 0) return;
  const timer = chatTimers.get(liveId);
  if (timer) {
    clearInterval(timer);
    chatTimers.delete(liveId);
  }
};

export const liveMock = {
  list(page = 1, pageSize = 12): Promise<Paginated<LiveStream>> {
    return withLatency(() => paginate(clone(livePool), page, pageSize));
  },
  getById(id: string): Promise<LiveStream> {
    return withLatency(() => {
      const live = livePool.find((item) => item.id === id);
      if (!live) throw new Error('Live not found');
      return clone(live);
    });
  },
  chats(liveId: string, page = 1, pageSize = 30): Promise<Paginated<LiveChatMessage>> {
    return withLatency(() => {
      const list = chatMessages
        .filter((m) => m.liveId === liveId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return paginate(clone(list), page, pageSize);
    }, 200);
  },
  send(liveId: string, content: string, userId: string): Promise<LiveChatMessage> {
    return withLatency(() => {
      const user = db.users.find((u) => u.id === userId) ?? pick(db.users);
      const msg: LiveChatMessage = {
        id: createId(),
        liveId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content,
        createdAt: new Date().toISOString(),
      };
      chatMessages.push(msg);
      const set = chatListeners.get(liveId);
      set?.forEach((fn) => fn(clone(msg)));
      return clone(msg);
    });
  },
  subscribe(liveId: string, cb: ChatListener) {
    const set = chatListeners.get(liveId) ?? new Set<ChatListener>();
    set.add(cb);
    chatListeners.set(liveId, set);
    ensureChatTimer(liveId);
    return () => {
      const current = chatListeners.get(liveId);
      if (!current) return;
      current.delete(cb);
      cleanupChatTimer(liveId);
    };
  },
};
