import Phaser from 'phaser'
import { i18n } from '@localization/i18n'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload(): void {
    // Load translations
    this.load.json('translations-bd', '/src/localization/translations/bd.json')
    this.load.json('translations-en', '/src/localization/translations/en.json')
  }

  create(): void {
    // Initialize i18n with loaded translations
    i18n.loadTranslations('en').then(() => {
      i18n.loadTranslations('bd').then(() => {
        this.scene.start('MenuScene')
      })
    })
  }
}
