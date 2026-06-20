/**
 * Player Class
 * Represents a single player with their cards, coins, and state
 */

export interface PlayerState {
  id: string
  name: string
  coins: number
  isAI: boolean
  faceDownCards: string[] // Character keys
  faceUpCards: string[] // Revealed characters
  isEliminated: boolean
  hasJinnToken: boolean
  puppetLink?: string // ID of linked player
}

export class Player {
  private state: PlayerState

  constructor(id: string, name: string, isAI: boolean = false) {
    this.state = {
      id,
      name,
      coins: 2,
      isAI,
      faceDownCards: [],
      faceUpCards: [],
      isEliminated: false,
      hasJinnToken: false,
    }
  }

  // Getters
  getId(): string {
    return this.state.id
  }

  getName(): string {
    return this.state.name
  }

  getCoins(): number {
    return this.state.coins
  }

  getFaceDownCards(): string[] {
    return [...this.state.faceDownCards]
  }

  getFaceUpCards(): string[] {
    return [...this.state.faceUpCards]
  }

  getInfluence(): number {
    return this.state.faceDownCards.length
  }

  getTotalInfluence(): number {
    return this.state.faceDownCards.length + this.state.faceUpCards.length
  }

  isAlive(): boolean {
    return !this.state.isEliminated && this.state.faceDownCards.length > 0
  }

  getIsAI(): boolean {
    return this.state.isAI
  }

  getJinnTokenStatus(): boolean {
    return this.state.hasJinnToken
  }

  getPuppetLink(): string | undefined {
    return this.state.puppetLink
  }

  // Setters & Modifiers
  addCoins(amount: number): number {
    this.state.coins = Math.max(0, this.state.coins + amount)
    return this.state.coins
  }

  removeCoins(amount: number): number {
    return this.addCoins(-amount)
  }

  addCards(cards: string[]): void {
    this.state.faceDownCards.push(...cards)
  }

  revealCard(cardIndex: number): string {
    if (cardIndex < 0 || cardIndex >= this.state.faceDownCards.length) {
      throw new Error('Invalid card index')
    }

    const card = this.state.faceDownCards.splice(cardIndex, 1)[0]
    this.state.faceUpCards.push(card)
    return card
  }

  setJinnToken(hasToken: boolean): void {
    this.state.hasJinnToken = hasToken
  }

  setPuppetLink(playerId: string | undefined): void {
    this.state.puppetLink = playerId
  }

  eliminate(): void {
    this.state.isEliminated = true
  }

  getState(): PlayerState {
    return { ...this.state }
  }

  reset(): void {
    this.state.coins = 2
    this.state.faceDownCards = []
    this.state.faceUpCards = []
    this.state.isEliminated = false
    this.state.hasJinnToken = false
    this.state.puppetLink = undefined
  }
}
