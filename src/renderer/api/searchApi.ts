import { searchMock } from '../mock/search';

export const searchApi = {
  getHotKeywords(): Promise<string[]> {
    return searchMock.getHotKeywords();
  },
  getSuggestions(keyword: string): Promise<string[]> {
    return searchMock.getSuggestions(keyword);
  },
};

// Replace with real HTTP calls later; component logic should remain unchanged.
