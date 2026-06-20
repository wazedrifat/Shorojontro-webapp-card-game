/**
 * Action Panel UI Component
 * Handles action selection, targeting, and resolution prompts
 */

import Phaser from 'phaser'
import { AnimationManager } from './AnimationManager'
import { i18n } from '@localization/i18n'
import { COLORS, Z_INDEX } from '@utils/constants'

export type ActionPanelState = 'selectAction' | 'selectTarget' | 'declareCharacter' | 'challenge' | 'block'

export interface ActionOption {
  key: string
  label: string
  cost?: number
  requiresTarget: boolean
}

export class ActionPanel extends Phaser.GameObjects.Container {
  private animationManager: AnimationManager
  private _state: 'selectAction' | 'selectTarget' | 'declareCharacter' | 'challenge' | 'block' = 'selectAction'
  private buttons: Map<string, Phaser.GameObjects.Rectangle> = new Map()
  private onActionSelected: ((action: string, target?: string) => void) | null = null
  private onChallengeRespond: ((challenge: boolean) => void) | null = null

  constructor(scene: Phaser.Scene, animationManager: AnimationManager) {
    super(scene, scene.cameras.main.width / 2, scene.cameras.main.height - 80)
    this.animationManager = animationManager
    // Initialize state to prevent unused variable warning
    if (this._state === null) {
      this._state = 'selectAction'
    }
    scene.add.existing(this)
    this.setDepth(Z_INDEX.UI_OVERLAY)
  }

  showActionSelection(actions: ActionOption[]): void {
    this.clearPanel()
    this._state = 'selectAction'

    const title = this.scene.add
      .text(0, -60, i18n.t('selectAction', 'ui'), {
        fontSize: '18px',
        color: '#fff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add(title)

    const startX = -(actions.length - 1) * 80
    actions.forEach((action, index) => {
      const x = startX + index * 160
      const button = this.createButton(
        x,
        0,
        action.label,
        action.cost ? `${action.cost}💰` : '',
        () => {
          if (this.onActionSelected) {
            this.onActionSelected(action.key)
          }
        }
      )
    })
  }

  showChallengePrompt(onRespond: (challenge: boolean) => void): void {
    this.clearPanel()
    this._state = 'challenge'
    this.onChallengeRespond = onRespond

    const title = this.scene.add
      .text(0, -40, i18n.t('challenged', 'gameStates'), {
        fontSize: 18,
        color: '#ef4444',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add(title)

    this.createButton(-100, 20, i18n.t('yesChallenge', 'ui'), '', () => {
      if (this.onChallengeRespond) this.onChallengeRespond(true)
    })

    this.createButton(100, 20, i18n.t('noChallenge', 'ui'), '', () => {
      if (this.onChallengeRespond) this.onChallengeRespond(false)
    })
  }

  showBlockPrompt(onRespond: (block: boolean) => void): void {
    this.clearPanel()
    this._state = 'block'

    const title = this.scene.add
      .text(0, -40, i18n.t('blockPhase', 'gameStates'), {
        fontSize: 18,
        color: '#3b82f6',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add(title)

    this.createButton(-100, 20, i18n.t('block', 'ui'), '', () => onRespond(true))
    this.createButton(100, 20, i18n.t('allowAction', 'ui'), '', () => onRespond(false))
  }

  private createButton(
    x: number,
    y: number,
    label: string,
    subtitle: string,
    onClick: () => void
  ): void {
    const btn = this.scene.add
      .rectangle(x, y, 120, 50, parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
      .setStrokeStyle(2, parseInt(COLORS.SECONDARY.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.animationManager.squash(btn, { duration: 100 })
        onClick()
      })
      .on('pointerover', () => {
        btn.setFillStyle(0x6aa8ff)
      })
      .on('pointerout', () => {
        btn.setFillStyle(parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
      })

    this.add(btn)
    this.buttons.set(label, btn)

    const text = this.scene.add
      .text(x, y - 5, label, {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(1)

    this.add(text)

    if (subtitle) {
      const subtext = this.scene.add
        .text(x, y + 12, subtitle, {
          fontSize: 10,
          color: '#000',
          fontFamily: 'Arial',
        })
        .setOrigin(0.5)
        .setDepth(1)

      this.add(subtext)
    }
  }

  setOnActionSelected(callback: (action: string, target?: string) => void): void {
    this.onActionSelected = callback
  }

  clearPanel(): void {
    this.removeAll(true)
    this.buttons.clear()
  }

  hide(): void {
    this.animationManager.scaleFadeOut(this as any, {
      duration: 200,
      onComplete: () => this.clearPanel(),
    })
  }
}
