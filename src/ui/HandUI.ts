/**
 * Hand UI Component - Simplified
 */

import Phaser from 'phaser'
import { CardUI } from './CardUI'
import { AnimationManager } from './AnimationManager'

export class HandUI extends Phaser.GameObjects.Container {
  private cards: CardUI[] = []
  private animationManager: AnimationManager
  private onCardClickCallback: ((characterKey: string) => void) | null = null

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    animationManager: AnimationManager
  ) {
    super(scene, x, y)
    this.animationManager = animationManager
    scene.add.existing(this)
  }

  setOnCardClickCallback(callback: (characterKey: string) => void): void {
    this.onCardClickCallback = callback
  }

  addCard(characterKey: string, characterName: string, faceUp: boolean = false, isPlayerCard: boolean = false): CardUI {
    const card = new CardUI(
      this.scene,
      {
        characterKey,
        characterName,
        faceUp,
        isPlayerCard,
        onClickCallback: isPlayerCard ? () => this.onCardClickCallback?.(characterKey) : undefined,
      },
      this.animationManager
    )

    this.cards.push(card)
    this.add(card)
    this.rearrangeCards()

    return card
  }

  private rearrangeCards(): void {
    const totalCards = this.cards.length
    const spacing = 70
    const startX = -(totalCards - 1) * spacing * 0.5

    this.cards.forEach((card, index) => {
      card.setPosition(startX + index * spacing, 0)
    })
  }

  getCards(): CardUI[] {
    return [...this.cards]
  }

  removeCard(card: CardUI): void {
    const index = this.cards.indexOf(card)
    if (index > -1) {
      this.cards.splice(index, 1)
      card.destroy()
      this.rearrangeCards()
    }
  }

  clear(): void {
    this.cards.forEach((card) => card.destroy())
    this.cards = []
  }
}

