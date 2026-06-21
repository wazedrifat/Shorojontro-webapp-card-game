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

  constructor(scene: Phaser.Scene) {
    super(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2)
    scene.add.existing(this)

    // Semi-transparent overlay - must be added to container
    this.overlay = scene.add
      .rectangle(0, 0, scene.cameras.main.width * 2, scene.cameras.main.height * 2, 0x000000, 0.7)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.hide())
    this.add(this.overlay)

    // Dialog panel
    this.bg = scene.add
      .rectangle(0, 0, 420, 280, parseInt(COLORS.DARK.replace('#', '0x'), 16))
      .setStrokeStyle(3, parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
    this.add(this.bg)

    // Title
    const title = scene.add
      .text(0, -110, 'Select Action Type', {
        fontSize: '18px',
        color: COLORS.PRIMARY,
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(title)

    // General Action Button
    const generalBtn = scene.add
      .rectangle(0, -40, 320, 50, parseInt(COLORS.INFO.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.onActionSelected?.('general')
        this.hide()
      })
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(generalBtn)

    const generalText = scene.add
      .text(0, -40, 'General Action', {
        fontSize: '15px',
        color: '#000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 2)
    this.add(generalText)

    // Character Action Button
    const characterBtn = scene.add
      .rectangle(0, 40, 320, 50, parseInt(COLORS.INFO.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.onActionSelected?.('character')
        this.hide()
      })
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(characterBtn)

    const characterText = scene.add
      .text(0, 40, 'Character Action', {
        fontSize: '15px',
        color: '#000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 2)
    this.add(characterText)

    // Close button - top right
    this.closeButton = scene.add
      .rectangle(190, -130, 40, 40, parseInt(COLORS.DANGER.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.hide())
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(this.closeButton)

    const closeText = scene.add
      .text(190, -130, '✕', {
        fontSize: '26px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 2)
    this.add(closeText)

    this.setDepth(Z_INDEX.MODAL)
    this.setVisible(false)
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
