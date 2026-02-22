import { tagMock } from '../mock/tag';

export const tagApi = {
  list(): Promise<string[]> {
    return tagMock.list();
  },
};

// Replace with real HTTP calls later; component logic should remain unchanged.
