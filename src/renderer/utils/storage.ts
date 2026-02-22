const KEY_PREFIX = 'bilibili_desktop_';

export const storage = {
  get<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(`${KEY_PREFIX}${key}`);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(`${KEY_PREFIX}${key}`, JSON.stringify(value));
  },
  remove(key: string) {
    localStorage.removeItem(`${KEY_PREFIX}${key}`);
  },
};
