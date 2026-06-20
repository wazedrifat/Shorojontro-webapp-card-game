import Phaser from 'phaser'
import { i18n, type Language } from '@localization/i18n'

export class MenuScene extends Phaser.Scene {
  private selectedLanguage: Language = 'en'

  constructor() {
    super('MenuScene')
  }

  create(): void {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background
    this.cameras.main.setBackgroundColor(0x0a0e27)

    // Title
    this.add
      .text(width / 2, height / 4, i18n.t('title', 'ui'), {
        fontSize: '64px',
        color: '#fff',
        fontStyle: 'bold',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, height / 4 + 60, i18n.t('subtitle', 'ui'), {
        fontSize: '24px',
        color: '#aaa',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)

    // Language Selection
    this.add
      .text(width / 2, height / 2 - 100, i18n.t('selectLanguage', 'ui'), {
        fontSize: '20px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)

    // Bangla Button
    const banglaButton = this.add
      .rectangle(width / 2 - 150, height / 2, 120, 50, this.selectedLanguage === 'bd' ? 0x4a9eff : 0x333)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.selectLanguage('bd'))

    this.add
      .text(width / 2 - 150, height / 2, 'বাংলা', {
        fontSize: '18px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setDepth(1)

    // English Button
    const englishButton = this.add
      .rectangle(width / 2 + 150, height / 2, 120, 50, this.selectedLanguage === 'en' ? 0x4a9eff : 0x333)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.selectLanguage('en'))

    this.add
      .text(width / 2 + 150, height / 2, 'English', {
        fontSize: '18px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setDepth(1)

    // Start Button
    const startButton = this.add
      .rectangle(width / 2, height / 2 + 100, 200, 60, 0x2d5a2d)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startGame())

    this.add
      .text(width / 2, height / 2 + 100, i18n.t('start', 'ui'), {
        fontSize: '20px',
        color: '#fff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(1)

    // Add hover effects
    this.addHoverEffect(banglaButton)
    this.addHoverEffect(englishButton)
    this.addHoverEffect(startButton)
  }

  private selectLanguage(lang: Language): void {
    this.selectedLanguage = lang
    i18n.setLanguage(lang)
    this.scene.restart()
  }

  private startGame(): void {
    this.scene.start('GameScene')
  }

  private addHoverEffect(button: Phaser.GameObjects.Rectangle): void {
    button.on('pointerover', () => {
      this.tweens.add({
        targets: button,
        scale: 1.1,
        duration: 100,
      })
    })

    button.on('pointerout', () => {
      this.tweens.add({
        targets: button,
        scale: 1,
        duration: 100,
      })
    })
  }
}
