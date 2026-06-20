import Phaser from 'phaser'
import { i18n } from '@localization/i18n'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene')
  }

  create(): void {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    this.cameras.main.setBackgroundColor(0x0a0e27)

    // Placeholder
    this.add
      .text(width / 2, height / 2, i18n.t('gameOver', 'ui'), {
        fontSize: '48px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
  }
}
