import Phaser from 'phaser'
import { GameEngine } from '@game/GameEngine'
import { i18n } from '@localization/i18n'

export class GameScene extends Phaser.Scene {
  private gameEngine: GameEngine | null = null

  constructor() {
    super('GameScene')
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x0a0e27)

    // Initialize game engine
    this.gameEngine = new GameEngine(this)

    // Add temporary UI
    this.add
      .text(this.cameras.main.width / 2, 50, 'Game Scene - Under Development', {
        fontSize: '32px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)

    // Back to menu button
    this.add
      .rectangle(50, 50, 100, 40, 0x333)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('MenuScene')
      })

    this.add
      .text(50, 50, i18n.t('back', 'ui'), {
        fontSize: '16px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setDepth(1)
  }

  update(): void {
    if (this.gameEngine) {
      this.gameEngine.update()
    }
  }
}
