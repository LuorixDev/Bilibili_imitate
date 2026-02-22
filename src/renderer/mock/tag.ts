import { db } from './db';
import { withLatency } from './utils';

const unique = (list: string[]) => Array.from(new Set(list));

export const tagMock = {
  list(): Promise<string[]> {
    return withLatency(() => unique(db.videos.flatMap((video) => video.tags)));
  },
};
