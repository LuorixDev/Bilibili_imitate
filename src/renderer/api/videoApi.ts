import type { Paginated, VideoSummary } from '../types';
import { videoMock } from '../mock/video';

export const videoApi = {
  getRecommend(page = 1, pageSize = 12): Promise<Paginated<VideoSummary>> {
    return videoMock.getRecommend(page, pageSize);
  },
  getById(id: string): Promise<VideoSummary> {
    return videoMock.getById(id);
  },
  search(keyword: string, page = 1, pageSize = 12): Promise<Paginated<VideoSummary>> {
    return videoMock.search(keyword, page, pageSize);
  },
  getRelated(id: string, limit = 6): Promise<VideoSummary[]> {
    return videoMock.getRelated(id, limit);
  },
};

// Replace with real HTTP calls later; component logic should remain unchanged.
