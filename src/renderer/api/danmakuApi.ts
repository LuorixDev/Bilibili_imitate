import type { DanmakuItem } from '../types';
import { danmakuMock } from '../mock/danmaku';

export const danmakuApi = {
  list(videoId: string): Promise<DanmakuItem[]> {
    return danmakuMock.list(videoId);
  },
  send(videoId: string, text: string, userId: string, time: number): Promise<DanmakuItem> {
    return danmakuMock.send(videoId, text, userId, time);
  },
  subscribe(videoId: string, onMessage: (item: DanmakuItem) => void) {
    return danmakuMock.subscribe(videoId, onMessage);
  },
};

// Replace with real HTTP calls later; component logic should remain unchanged.
