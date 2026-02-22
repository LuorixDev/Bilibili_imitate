import { defineStore } from 'pinia';
import type { VideoSummary } from '../types';
import { videoApi } from '../api/videoApi';

interface VideoState {
  recommendList: VideoSummary[];
  recommendPage: number;
  recommendTotal: number;
  current: VideoSummary | null;
  related: VideoSummary[];
  searchList: VideoSummary[];
  searchPage: number;
  searchTotal: number;
  loading: boolean;
}

export const useVideoStore = defineStore('video', {
  state: (): VideoState => ({
    recommendList: [],
    recommendPage: 1,
    recommendTotal: 0,
    current: null,
    related: [],
    searchList: [],
    searchPage: 1,
    searchTotal: 0,
    loading: false,
  }),
  actions: {
    async fetchRecommend(page = 1, pageSize = 12, append = false) {
      this.loading = true;
      try {
        const result = await videoApi.getRecommend(page, pageSize);
        this.recommendPage = result.page;
        this.recommendTotal = result.total;
        this.recommendList = append ? [...this.recommendList, ...result.list] : result.list;
      } finally {
        this.loading = false;
      }
    },
    async fetchVideo(id: string) {
      this.loading = true;
      try {
        this.current = await videoApi.getById(id);
        this.related = await videoApi.getRelated(id, 6);
      } finally {
        this.loading = false;
      }
    },
    async search(keyword: string, page = 1, pageSize = 12, append = false) {
      this.loading = true;
      try {
        const result = await videoApi.search(keyword, page, pageSize);
        this.searchPage = result.page;
        this.searchTotal = result.total;
        this.searchList = append ? [...this.searchList, ...result.list] : result.list;
      } finally {
        this.loading = false;
      }
    },
  },
});
