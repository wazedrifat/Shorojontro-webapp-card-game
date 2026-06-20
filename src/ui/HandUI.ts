/**
 * Hand UI Component
 * Displays and manages player's hand of cards
 */

import Phaser from 'phaser'
import { CardUI } from './CardUI'
import { AnimationManager } from './AnimationManager'

export class HandUI extends Phaser.GameObjects.Container {
  private cards: CardUI[] = []
  private animationManager: AnimationManager

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

  addCard(characterKey: string, faceUp: boolean = false): CardUI {
    const card = new CardUI(
      this.scene,
      {
        x: 0,
        y: 0,
        characterKey,
        faceUp,
        interactive: true,
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
    const spacing = 100
    const startX = -(totalCards - 1) * spacing * 0.5

    this.cards.forEach((card, index) => {
      const targetX = startX + index * spacing
      const curve = Math.sin((index / (totalCards - 1)) * Math.PI) * 30

      this.animationManager.moveTo(card, { x: targetX, y: curve }, { duration: 200 })
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
