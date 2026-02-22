import { defineStore } from 'pinia';
import type { VideoSummary } from '../types';
import { storage } from '../utils/storage';

export interface HistoryEntry {
  id: string;
  title: string;
  cover: string;
  authorName: string;
  watchedAt: string;
}

interface HistoryState {
  watchHistory: HistoryEntry[];
  searchHistory: string[];
}

const WATCH_KEY = 'watch_history';
const SEARCH_KEY = 'search_history';

export const useHistoryStore = defineStore('history', {
  state: (): HistoryState => ({
    watchHistory: storage.get<HistoryEntry[]>(WATCH_KEY, []),
    searchHistory: storage.get<string[]>(SEARCH_KEY, []),
  }),
  actions: {
    addWatch(video: VideoSummary) {
      const entry: HistoryEntry = {
        id: video.id,
        title: video.title,
        cover: video.cover,
        authorName: video.author.name,
        watchedAt: new Date().toISOString(),
      };
      this.watchHistory = [
        entry,
        ...this.watchHistory.filter((item) => item.id !== video.id),
      ].slice(0, 50);
      storage.set(WATCH_KEY, this.watchHistory);
    },
    addSearch(keyword: string) {
      const value = keyword.trim();
      if (!value) return;
      this.searchHistory = [value, ...this.searchHistory.filter((item) => item !== value)].slice(
        0,
        20,
      );
      storage.set(SEARCH_KEY, this.searchHistory);
    },
    clearWatch() {
      this.watchHistory = [];
      storage.set(WATCH_KEY, this.watchHistory);
    },
    clearSearch() {
      this.searchHistory = [];
      storage.set(SEARCH_KEY, this.searchHistory);
    },
  },
});
