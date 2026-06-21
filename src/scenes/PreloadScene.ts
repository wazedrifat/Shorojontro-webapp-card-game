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

    // Load character card images
    const characterImages = [
      { key: 'veerVikram', file: '/assets/cards/characterCards/character_bir_bikrom.jpg' },
      { key: 'kaluDakayt', file: '/assets/cards/characterCards/character_kalu-dakat.jpg' },
      { key: 'petukchandra', file: '/assets/cards/characterCards/character_petukcondro.jpg' },
      { key: 'jinnerBadshah', file: '/assets/cards/characterCards/character_jiner-badsha.jpg' },
      { key: 'mamdoHomdho', file: '/assets/cards/characterCards/character_mamdo_hamdo.jpg' },
      { key: 'putuulRaj', file: '/assets/cards/characterCards/character_putul_raja.jpg' },
      { key: 'bokhdoity', file: '/assets/cards/characterCards/character_brokho-doitto.jpg' },
      { key: 'chichkeChhor', file: '/assets/cards/characterCards/character_ciske_chor.jpg' },
      { key: 'arun', file: '/assets/cards/characterCards/character_arun.jpg' },
      { key: 'nantuMiya', file: '/assets/cards/characterCards/character_nantu_mia.jpg' },
      { key: 'betalPrataraj', file: '/assets/cards/characterCards/character_hamdo-vut.jpg' },
    ]

    characterImages.forEach(({ key, file }) => {
      this.load.image(`char_${key}`, file)
    })

    // Load card backside
    this.load.image('card_backside', '/assets/cards/card_backside.jpg')

    // Load coin images
    this.load.image('coin_regular', '/assets/cards/coins/coin.png')
    this.load.image('coin_jin', '/assets/cards/coins/coin_jin.png')
    this.load.image('coin_khajna', '/assets/cards/coins/coin_khajna.png')
    this.load.image('coin_puppet', '/assets/cards/coins/coin_puppet.png')

    // Load general action cards
    this.load.image('action_generalActionCards_0', '/assets/cards/generalActionCards/general_action_ay.jpg')
    this.load.image('action_generalActionCards_1', '/assets/cards/generalActionCards/general_action_hotta.jpg')

    // Load character action cards
    const characterActions = [
      'action_arun.jpg',
      'action_bir_bikrom.jpg',
      'action_brokho_doitto.jpg',
      'action_ciske_chor.jpg',
      'action_jiner_badsha.jpg',
      'action_kalu_dakat.jpg',
      'action_mamdo_hamdo.jpg',
      'action_nantu_mia.jpg',
      'action_petukcondro.jpg',
      'action_pretraj.jpg',
      'action_putul_raj.jpg',
    ]

    characterActions.forEach((file, index) => {
      this.load.image(`action_characterActionCards_${index}`, `/assets/cards/characterActionCards/${file}`)
    })

    console.log('[PreloadScene] All images queued for loading')
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
