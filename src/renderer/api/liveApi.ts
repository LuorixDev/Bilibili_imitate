import type { LiveChatMessage, LiveStream, Paginated } from '../types';
import { liveMock } from '../mock/live';

export const liveApi = {
  list(page = 1, pageSize = 12): Promise<Paginated<LiveStream>> {
    return liveMock.list(page, pageSize);
  },
  getById(id: string): Promise<LiveStream> {
    return liveMock.getById(id);
  },
  chats(liveId: string, page = 1, pageSize = 30): Promise<Paginated<LiveChatMessage>> {
    return liveMock.chats(liveId, page, pageSize);
  },
  sendChat(liveId: string, content: string, userId: string): Promise<LiveChatMessage> {
    return liveMock.send(liveId, content, userId);
  },
  subscribeChat(liveId: string, cb: (msg: LiveChatMessage) => void) {
    return liveMock.subscribe(liveId, cb);
  },
};
