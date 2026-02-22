import type { UserProfile } from '../types';
import { userMock } from '../mock/user';

export const userApi = {
  login(username: string, password: string): Promise<UserProfile> {
    return userMock.login(username, password);
  },
  logout(): Promise<boolean> {
    return userMock.logout();
  },
  getProfile(userId: string): Promise<UserProfile> {
    return userMock.getProfile(userId);
  },
  getCurrent(): Promise<UserProfile | null> {
    return userMock.getCurrent();
  },
};

// Replace with real HTTP calls later; component logic should remain unchanged.
