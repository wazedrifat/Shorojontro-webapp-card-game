/**
 * Simplified Card UI Component
 * Just display the card name and character symbol
 */

import Phaser from 'phaser'
import { AnimationManager } from './AnimationManager'

export interface CardUIOptions {
  characterKey: string
  characterName: string
  faceUp: boolean
  interactive?: boolean
}

const CHARACTER_SYMBOLS: Record<string, string> = {
  veerVikram: '⚔️',
  kaluDakayt: '🗡️',
  petukchandra: '📜',
  jinnerBadshah: '👑',
  mamdoHomdho: '🍖',
  putuulRaj: '🎭',
  bokhdoity: '💀',
  chichkeChhor: '🏃',
  arun: '🔍',
  nantuMiya: '💰',
  betalPrataraj: '👻',
}

export class CardUI extends Phaser.GameObjects.Container {
  private text: Phaser.GameObjects.Text
  private characterKey: string
  private faceUp: boolean

  constructor(scene: Phaser.Scene, options: CardUIOptions, _animationManager: AnimationManager) {
    super(scene, 0, 0)

    this.characterKey = options.characterKey
    this.faceUp = options.faceUp

    // Create simple text display
    const symbol = CHARACTER_SYMBOLS[options.characterKey] || '?'
    const displayText = this.faceUp ? `${symbol}\n${options.characterName.substring(0, 8)}` : '?'

    this.text = scene.add
      .text(0, 0, displayText, {
        fontSize: this.faceUp ? '12px' : '18px',
        color: this.faceUp ? '#4a9eff' : '#888',
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5)

    this.add(this.text)
    scene.add.existing(this)
  }

  getCharacterKey(): string {
    return this.characterKey
  }

  isFaceUp(): boolean {
    return this.faceUp
  }
}
