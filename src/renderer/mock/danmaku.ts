import type { DanmakuItem } from '../types';
import { db } from './db';
import { clone, createId, pick, withLatency } from './utils';

const autoPool = ['又学到了', '这段太美了', '注意细节', '信息量爆炸', '梦回青春'];

type Listener = (item: DanmakuItem) => void;
const listeners = new Map<string, Set<Listener>>();
const timers = new Map<string, ReturnType<typeof setInterval>>();

const emit = (videoId: string, item: DanmakuItem) => {
  const current = listeners.get(videoId);
  if (!current) return;
  current.forEach((handler) => handler(clone(item)));
};

const ensureTimer = (videoId: string) => {
  if (timers.has(videoId)) return;
  const timer = setInterval(() => {
    const user = pick(db.users);
    const item: DanmakuItem = {
      id: createId(),
      videoId,
      userId: user.id,
      text: pick(autoPool),
      time: Math.floor(Math.random() * 120),
      color: Math.random() > 0.5 ? '#ffffff' : '#6bd6ff',
      createdAt: new Date().toISOString(),
    };
    db.danmaku.push(item);
    emit(videoId, item);
  }, 3200);
  timers.set(videoId, timer);
};

const cleanupTimer = (videoId: string) => {
  const set = listeners.get(videoId);
  if (set && set.size > 0) return;
  const timer = timers.get(videoId);
  if (timer) {
    clearInterval(timer);
    timers.delete(videoId);
  }
};

export const danmakuMock = {
  list(videoId: string): Promise<DanmakuItem[]> {
    return withLatency(() => clone(db.danmaku.filter((item) => item.videoId === videoId)));
  },
  send(videoId: string, text: string, userId: string, time: number): Promise<DanmakuItem> {
    return withLatency(() => {
      const item: DanmakuItem = {
        id: createId(),
        videoId,
        userId,
        text,
        time,
        color: '#ff6aa3',
        createdAt: new Date().toISOString(),
      };
      db.danmaku.push(item);
      emit(videoId, item);
      return clone(item);
    });
  },
  subscribe(videoId: string, onMessage: (item: DanmakuItem) => void) {
    const set = listeners.get(videoId) ?? new Set();
    set.add(onMessage);
    listeners.set(videoId, set);
    ensureTimer(videoId);

    return () => {
      const current = listeners.get(videoId);
      if (!current) return;
      current.delete(onMessage);
      cleanupTimer(videoId);
    };
  },
};
