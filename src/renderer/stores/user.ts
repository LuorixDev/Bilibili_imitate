import { defineStore } from 'pinia';
import type { UserProfile } from '../types';
import { userApi } from '../api/userApi';

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    loading: false,
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.profile),
  },
  actions: {
    async init() {
      this.loading = true;
      try {
        this.profile = await userApi.getCurrent();
      } finally {
        this.loading = false;
      }
    },
    async login(username: string, password: string) {
      this.loading = true;
      try {
        this.profile = await userApi.login(username, password);
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.loading = true;
      try {
        await userApi.logout();
        this.profile = null;
      } finally {
        this.loading = false;
      }
    },
  },
});
