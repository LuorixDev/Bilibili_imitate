import { defineStore } from 'pinia';
import type { VideoSummary } from '../types';
import { tagApi } from '../api/tagApi';
import { videoApi } from '../api/videoApi';

export type ExploreSection = 'category' | 'hot' | 'live';

interface SectionState {
  tags: string[];
  activeTag: string;
  list: VideoSummary[];
  page: number;
  total: number;
  loading: boolean;
}

const createSectionState = (): SectionState => ({
  tags: [],
  activeTag: '',
  list: [],
  page: 1,
  total: 0,
  loading: false,
});

export const useExploreStore = defineStore('explore', {
  state: () => ({
    sections: {
      category: createSectionState(),
      hot: createSectionState(),
      live: createSectionState(),
    } as Record<ExploreSection, SectionState>,
  }),
  actions: {
    async init(section: ExploreSection) {
      const current = this.sections[section];
      if (!current.tags.length) {
        current.tags = await tagApi.list();
      }
      if (!current.activeTag) {
        current.activeTag = current.tags[0] || '';
      }
      current.page = 1;
      await this.fetch(section, false);
    },
    async setActiveTag(section: ExploreSection, tag: string) {
      const current = this.sections[section];
      current.activeTag = tag;
      current.page = 1;
      await this.fetch(section, false);
    },
    async loadMore(section: ExploreSection) {
      const current = this.sections[section];
      current.page += 1;
      await this.fetch(section, true);
    },
    async fetch(section: ExploreSection, append: boolean) {
      const current = this.sections[section];
      if (!current.activeTag) return;
      current.loading = true;
      try {
        const result = await videoApi.search(current.activeTag, current.page, 12);
        current.total = result.total;
        current.list = append ? [...current.list, ...result.list] : result.list;
      } finally {
        current.loading = false;
      }
    },
  },
});
