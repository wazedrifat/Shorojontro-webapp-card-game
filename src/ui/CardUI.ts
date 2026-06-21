/**
 * Card UI Component - Display card with actual images
 */

import Phaser from 'phaser'
import { AnimationManager } from './AnimationManager'
import { getCharacterTexture, getCardBacksideTexture } from '@utils/assetRegistry'

export interface CardUIOptions {
  characterKey: string
  characterName: string
  faceUp: boolean
  isPlayerCard?: boolean
  onClickCallback?: () => void
}

export class CardUI extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Image
  private characterKey: string
  private faceUp: boolean
  private isPlayerCard: boolean

  constructor(scene: Phaser.Scene, options: CardUIOptions, _animationManager: AnimationManager) {
    super(scene, 0, 0)

    this.characterKey = options.characterKey
    this.faceUp = options.faceUp
    this.isPlayerCard = options.isPlayerCard || false

    // Determine if card should be shown face-up
    const shouldShowFaceUp = this.faceUp || this.isPlayerCard

    // Get the appropriate texture key
    const textureKey = shouldShowFaceUp
      ? getCharacterTexture(options.characterKey)
      : getCardBacksideTexture()

    // Create sprite with image
    this.sprite = scene.add
      .image(0, 0, textureKey)
      .setDisplaySize(140, 180)

    // Add border
    const border = scene.add
      .rectangle(0, 0, 140, 180, 0x000000, 0)
      .setStrokeStyle(2, 0xffffff)
    this.add(border)

    this.add(this.sprite)

    // Make interactive if player's own card and face-up
    if (this.isPlayerCard && shouldShowFaceUp) {
      this.sprite.setInteractive({ useHandCursor: true })
      if (options.onClickCallback) {
        this.sprite.on('pointerdown', options.onClickCallback)
      }
    }

    scene.add.existing(this)
  }

  getCharacterKey(): string {
    return this.characterKey
  }

  isFaceUp(): boolean {
    return this.faceUp
  }

  setTextureKey(textureKey: string): void {
    this.sprite.setTexture(textureKey)
  }
}
