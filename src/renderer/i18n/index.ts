// src/renderer/i18n/index.ts

import { createI18n, useI18n as baseUseI18n } from 'vue-i18n'
import logger from '@/core/logger'

// --- Load all locales from the locales directory ---
// This uses Vite's glob import feature to automatically load all .json files.
// This is more scalable than importing each file manually.
const messages = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: any }>('./locales/*.json', { eager: true })).map(
    ([key, value]) => {
      // The key is the file path, e.g., './locales/en.json'
      // We extract the locale name 'en' from the file path.
      const locale = key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
      return [locale, value.default]
    },
  ),
)

const supportedLocales = Object.keys(messages)
logger.info(`[i18n] Supported locales: ${supportedLocales.join(', ')}`)

const I18N_STORAGE_KEY = 'bilibili-client-locale'

/**
 * Gets the default locale for the application.
 * It follows this priority:
 * 1. Locale saved in localStorage.
 * 2. Browser's language setting, if supported.
 * 3. Fallback to 'en'.
 */
function getDefaultLocale(): string {
  const savedLocale = localStorage.getItem(I18N_STORAGE_KEY)
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale
  }

  const browserLanguage = navigator.language
  if (supportedLocales.includes(browserLanguage)) {
    return browserLanguage
  }
  // Handle cases like 'zh-TW', 'zh-HK' by defaulting them to 'zh-CN'
  if (browserLanguage.startsWith('zh')) {
    return 'zh-CN'
  }

  return 'en' // Default fallback
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: getDefaultLocale(),
  fallbackLocale: 'en', // Fallback locale if the current one is missing translations
  messages,
  // silentTranslationWarn: true, // Optionally suppress warnings for missing translations
})

/**
 * A custom Composable for using i18n in components.
 * This wrapper provides the global `t` function and a method to change the language,
 * while also handling persistence.
 */
export function useI18n() {
  const { t, locale } = baseUseI18n()

  /**
   * Changes the application's language.
   * @param newLocale The new locale to set (e.g., 'en', 'zh-CN').
   */
  const changeLanguage = (newLocale: string) => {
    if (supportedLocales.includes(newLocale)) {
      locale.value = newLocale
      localStorage.setItem(I18N_STORAGE_KEY, newLocale)
      logger.info(`[i18n] Language changed to: ${newLocale}`)
    }
    else {
      logger.warn(`[i18n] Attempted to switch to unsupported locale: '${newLocale}'`)
    }
  }

  return {
    t,
    changeLanguage,
    currentLocale: locale,
  }
}

export default i18n
