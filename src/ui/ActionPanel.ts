/**
 * Action Panel UI Component - Simplified
 */

import Phaser from 'phaser'
import { AnimationManager } from './AnimationManager'
import { i18n } from '@localization/i18n'
import { COLORS, Z_INDEX } from '@utils/constants'

export interface ActionOption {
  key: string
  label: string
  cost?: number
  requiresTarget: boolean
}

export class ActionPanel extends Phaser.GameObjects.Container {
  private animationManager: AnimationManager
  private buttons: Map<string, Phaser.GameObjects.Rectangle> = new Map()
  private onActionSelected: ((action: string, target?: string) => void) | null = null

  constructor(scene: Phaser.Scene, animationManager: AnimationManager) {
    super(scene, scene.cameras.main.width / 2, scene.cameras.main.height - 60)
    this.animationManager = animationManager
    scene.add.existing(this)
    this.setDepth(Z_INDEX.UI_OVERLAY)
  }

  showActionSelection(actions: ActionOption[]): void {
    this.clearPanel()

    const startX = -(actions.length - 1) * 110
    actions.forEach((action, index) => {
      const x = startX + index * 220
      const button = this.createButton(x, 0, action.label, action.cost ? `${action.cost}💰` : '', () => {
        if (this.onActionSelected) {
          this.onActionSelected(action.key)
        }
      })
    })
  }

  private createButton(
    x: number,
    y: number,
    label: string,
    subtitle: string,
    onClick: () => void
  ): Phaser.GameObjects.Rectangle {
    const button = this.scene.add
      .rectangle(x, y, 100, 40, parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
      .setStrokeStyle(2, parseInt(COLORS.SECONDARY.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.animationManager.squash(button, { duration: 100 })
        onClick()
      })
      .on('pointerover', () => {
        button.setFillStyle(0x6aa8ff)
      })
      .on('pointerout', () => {
        button.setFillStyle(parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
      })

    this.add(button)
    this.buttons.set(label, button)

    const text = this.scene.add
      .text(x, y - 8, label, {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(1)

    this.add(text)

    if (subtitle) {
      const subtext = this.scene.add
        .text(x, y + 8, subtitle, {
          fontSize: 10,
          color: '#000',
          fontFamily: 'Arial',
        })
        .setOrigin(0.5)
        .setDepth(1)

      this.add(subtext)
    }

    return button
  }

  setOnActionSelected(callback: (action: string, target?: string) => void): void {
    this.onActionSelected = callback
  }

  clearPanel(): void {
    this.removeAll(true)
    this.buttons.clear()
  }

  hide(): void {
    this.clearPanel()
  }
}
