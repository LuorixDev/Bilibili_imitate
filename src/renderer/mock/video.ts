import type { Paginated, VideoSummary } from '../types';
import { db } from './db';
import { clone, paginate, withLatency } from './utils';

export const videoMock = {
  getRecommend(page: number, pageSize: number): Promise<Paginated<VideoSummary>> {
    return withLatency(() => paginate(clone(db.videos), page, pageSize));
  },
  getById(id: string): Promise<VideoSummary> {
    return withLatency(() => {
      const video = db.videos.find((item) => item.id === id);
      if (!video) {
        throw new Error('Video not found');
      }
      return clone(video);
    });
  },
  search(keyword: string, page: number, pageSize: number): Promise<Paginated<VideoSummary>> {
    return withLatency(() => {
      const query = keyword.trim().toLowerCase();
      const list = db.videos.filter((video) => {
        return (
          video.title.toLowerCase().includes(query) ||
          video.author.name.toLowerCase().includes(query) ||
          video.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
      return paginate(clone(list), page, pageSize);
    });
  },
  getRelated(id: string, limit: number): Promise<VideoSummary[]> {
    return withLatency(() => {
      const source = db.videos.find((item) => item.id === id);
      if (!source) return [];
      const list = db.videos
        .filter((item) => item.id !== id)
        .slice(0, limit)
        .map((item) => clone(item));
      return list;
    });
  },
};
