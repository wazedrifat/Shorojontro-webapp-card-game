/**
 * Action Selection Popup Modal
 */

import Phaser from 'phaser'
import { Z_INDEX, COLORS } from '@utils/constants'

export class ActionSelectionPopup extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle
  private overlay: Phaser.GameObjects.Rectangle
  private closeButton: Phaser.GameObjects.Rectangle
  private onActionSelected: ((actionType: string) => void) | null = null
  private buttons: Phaser.GameObjects.Rectangle[] = []

  constructor(scene: Phaser.Scene) {
    super(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2)
    scene.add.existing(this)

    // Semi-transparent overlay
    this.overlay = scene.add
      .rectangle(0, 0, scene.cameras.main.width * 2, scene.cameras.main.height * 2, 0x000000, 0.7)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.hide())
    this.add(this.overlay)

    // Dialog panel
    this.bg = scene.add
      .rectangle(0, 0, 400, 300, parseInt(COLORS.DARK.replace('#', '0x'), 16))
      .setStrokeStyle(3, parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
    this.add(this.bg)

    // Title
    const title = scene.add
      .text(0, -120, 'Select Action Type', {
        fontSize: '20px',
        color: COLORS.PRIMARY,
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(title)

    // General Action Button
    this.createButton('General Action', -100, () => {
      this.onActionSelected?.('general')
      this.hide()
    })

    // Character Action Button
    this.createButton('Character Action', 50, () => {
      this.onActionSelected?.('character')
      this.hide()
    })

    // Close button
    this.closeButton = scene.add
      .rectangle(180, -140, 40, 40, parseInt(COLORS.DANGER.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.hide())
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(this.closeButton)

    const closeText = scene.add
      .text(180, -140, '✕', {
        fontSize: '28px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 2)
    this.add(closeText)

    this.setDepth(Z_INDEX.MODAL)
    this.setVisible(false)
  }

  private createButton(label: string, y: number, callback: () => void): void {
    const btn = this.scene.add
      .rectangle(0, y, 300, 50, parseInt(COLORS.INFO.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', callback)
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(btn)
    this.buttons.push(btn)

    const btnText = this.scene.add
      .text(0, y, label, {
        fontSize: '16px',
        color: '#000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 2)
    this.add(btnText)
  }

  setOnActionSelected(callback: (actionType: string) => void): void {
    this.onActionSelected = callback
  }

  show(): void {
    this.setVisible(true)
  }

  hide(): void {
    this.setVisible(false)
  }
}
