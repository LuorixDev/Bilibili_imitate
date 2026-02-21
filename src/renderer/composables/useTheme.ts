import { useThemeStore, type Theme } from '@/stores/theme'
import { watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

export function useTheme() {
  const themeStore = useThemeStore()
  const { theme } = storeToRefs(themeStore)

  const applyTheme = (theme: Theme) => {
    const newTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  // Watch for changes in the theme store and apply them
  watchEffect(() => {
    applyTheme(theme.value)
  })

  // Listen for changes in the OS theme
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (theme.value === 'system') {
      applyTheme('system')
    }
  })

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    themeStore.setTheme(themes[nextIndex])
  }

  return {
    theme,
    setTheme: themeStore.setTheme,
    toggleTheme,
  }
}
