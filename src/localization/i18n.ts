/**
 * Localization Manager
 * Handles language switching and translation loading
 */

export type Language = 'bd' | 'en'

export interface Translations {
  characters: {
    [key: string]: {
      name: string
      ability?: string
      description?: string
      blockDescription?: string
    }
  }
  actions: {
    [key: string]: string
  }
  ui: {
    [key: string]: string
  }
  gameStates: {
    [key: string]: string
  }
}

class I18nManager {
  private currentLanguage: Language = 'en'
  private translations: Map<Language, Translations> = new Map()

  async loadTranslations(language: Language): Promise<Translations> {
    console.log(`[i18n] Starting to load ${language} translations`)
    try {
      // Use dynamic import for JSON files - works with Vite
      console.log(`[i18n] Importing ${language} JSON`)
      const translations = language === 'bd'
        ? (await import('@localization/translations/bd.json')).default
        : (await import('@localization/translations/en.json')).default

      console.log(`[i18n] ${language} JSON imported successfully`, Object.keys(translations))
      this.translations.set(language, translations)
      console.log(`[i18n] ${language} translations stored in map`)
      return translations
    } catch (error) {
      console.error(`[i18n] Failed to load ${language} translations:`, error)
      // Return empty translations to allow game to proceed
      const empty = { characters: {}, actions: {}, ui: {}, gameStates: {} }
      console.log(`[i18n] Returning empty translations for ${language}`)
      return empty
    }
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language
    localStorage.setItem('shorojontro-language', language)
  }

  getLanguage(): Language {
    return this.currentLanguage
  }

  t(key: string, context: 'characters' | 'actions' | 'ui' | 'gameStates' = 'ui'): string {
    const translations = this.translations.get(this.currentLanguage)
    if (!translations) {
      return key
    }

    const keys = key.split('.')
    let value: any = (translations as any)[context]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  character(characterKey: string, field: 'name' | 'ability' | 'description' | 'blockDescription' = 'name'): string {
    const translations = this.translations.get(this.currentLanguage)
    if (!translations?.characters[characterKey]) {
      return characterKey
    }

    const char = translations.characters[characterKey]
    return (char as any)[field] || characterKey
  }

  getTranslations(language: Language): Translations | undefined {
    return this.translations.get(language)
  }
}

export const i18n = new I18nManager()
