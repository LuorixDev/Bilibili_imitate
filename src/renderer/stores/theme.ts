// src/renderer/stores/theme.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'bilibili-client-theme'

export const useThemeStore = defineStore('theme', () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  const theme = ref<Theme>(savedTheme || 'system')

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  return {
    theme,
    setTheme,
  }
})
