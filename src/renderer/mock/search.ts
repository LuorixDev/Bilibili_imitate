import { db } from './db';
import { withLatency } from './utils';

const unique = (list: string[]) => Array.from(new Set(list));

const buildHot = () => {
  const titles = db.videos.map((video) => video.title);
  const tags = db.videos.flatMap((video) => video.tags);
  return unique([...titles.slice(0, 6), ...tags.slice(0, 6)]).slice(0, 10);
};

export const searchMock = {
  getHotKeywords(): Promise<string[]> {
    return withLatency(() => buildHot());
  },
  getSuggestions(keyword: string): Promise<string[]> {
    return withLatency(() => {
      const query = keyword.trim().toLowerCase();
      if (!query) return [];
      const titles = db.videos
        .filter((video) => video.title.toLowerCase().includes(query))
        .map((video) => video.title);
      const tags = db.videos
        .flatMap((video) => video.tags)
        .filter((tag) => tag.toLowerCase().includes(query));
      return unique([...titles, ...tags]).slice(0, 8);
    });
  },
};
