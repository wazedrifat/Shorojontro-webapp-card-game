import Phaser from 'phaser'
import { i18n } from '@localization/i18n'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload(): void {
    console.log('[PreloadScene] preload() starting')
    // Show loading text
    const loadingText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Loading...', {
      fontSize: '24px',
      color: '#fff',
    })
    loadingText.setOrigin(0.5)
    console.log('[PreloadScene] Loading text displayed')
  }

  create(): void {
    console.log('[PreloadScene] create() starting')
    
    // Load translations via fetch
    console.log('[PreloadScene] Starting translation loading...')
    
    Promise.all([
      i18n.loadTranslations('en').then(() => {
        console.log('[PreloadScene] English translations loaded')
      }),
      i18n.loadTranslations('bd').then(() => {
        console.log('[PreloadScene] Bangla translations loaded')
      }),
    ]).then(() => {
      console.log('[PreloadScene] All translations loaded, setting default language')
      // Set default language
      i18n.setLanguage('en')
      console.log('[PreloadScene] Starting MenuScene')
      // Transition to menu
      this.scene.start('MenuScene')
    }).catch((error) => {
      console.error('[PreloadScene] Error loading translations:', error)
      // Still proceed to menu even if translations fail
      console.log('[PreloadScene] Proceeding to MenuScene despite error')
      this.scene.start('MenuScene')
    })
  }
}
