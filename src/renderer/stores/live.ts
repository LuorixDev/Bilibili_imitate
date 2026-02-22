import { defineStore } from 'pinia';
import type { LiveChatMessage, LiveStream } from '../types';
import { liveApi } from '../api/liveApi';

interface LiveState {
  list: LiveStream[];
  page: number;
  total: number;
  loading: boolean;
  current: LiveStream | null;
  chats: LiveChatMessage[];
  chatPage: number;
  chatTotal: number;
  chatLoading: boolean;
  unsubscribe: (() => void) | null;
}

export const useLiveStore = defineStore('live', {
  state: (): LiveState => ({
    list: [],
    page: 1,
    total: 0,
    loading: false,
    current: null,
    chats: [],
    chatPage: 1,
    chatTotal: 0,
    chatLoading: false,
    unsubscribe: null,
  }),
  actions: {
    async fetchList(page = 1, pageSize = 12, append = false) {
      this.loading = true;
      try {
        const res = await liveApi.list(page, pageSize);
        this.page = res.page;
        this.total = res.total;
        this.list = append ? [...this.list, ...res.list] : res.list;
      } finally {
        this.loading = false;
      }
    },
    async fetchCurrent(id: string) {
      this.current = await liveApi.getById(id);
    },
    async fetchChats(liveId: string, page = 1, pageSize = 30, append = false) {
      this.chatLoading = true;
      try {
        const res = await liveApi.chats(liveId, page, pageSize);
        this.chatPage = res.page;
        this.chatTotal = res.total;
        this.chats = append ? [...this.chats, ...res.list] : res.list;
      } finally {
        this.chatLoading = false;
      }
    },
    async sendChat(liveId: string, content: string, userId: string) {
      const msg = await liveApi.sendChat(liveId, content, userId);
      this.chats = [msg, ...this.chats];
      this.chatTotal += 1;
    },
    subscribeChat(liveId: string) {
      this.unsubscribe?.();
      this.unsubscribe = liveApi.subscribeChat(liveId, (msg) => {
        this.chats = [msg, ...this.chats].slice(0, 200);
      });
    },
    clearChat() {
      this.unsubscribe?.();
      this.unsubscribe = null;
      this.chats = [];
    },
  },
});
