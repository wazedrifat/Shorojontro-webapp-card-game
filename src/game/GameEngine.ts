/**
 * Game Engine
 * Core game logic and turn management
 */

import Phaser from 'phaser'
import { Player } from './Player'
import { AIBot } from './AIBot'

export type GamePhase = 'waiting' | 'playerAction' | 'challenge' | 'block' | 'resolution' | 'gameOver'

export interface GameState {
  activePlayer: Player
  phase: GamePhase
  currentAction?: {
    key: string
    targetPlayerId?: string
  }
  gameWinner?: Player
}

export class GameEngine extends Phaser.Events.EventEmitter {
  private players: Map<string, Player> = new Map()
  private currentPlayerIndex: number = 0
  private phase: GamePhase = 'waiting'
  private deck: string[] = []
  private selectedCharacters: string[] = []
  private _aiBot: AIBot
  private _updateCallback: ((state: GameState) => void) | null = null

  constructor(_scene: Phaser.Scene) {
    super()
    // Initialize bot (for future use)
    this._aiBot = new AIBot('easy')
    // Initialize callback placeholder
    this._updateCallback = null
    this.initializeGame()
  }

  private initializeGame(): void {
    // Create players
    const player1 = new Player('player1', 'You', false)
    const player2 = new Player('ai1', 'AI Opponent', true)

    this.players.set(player1.getId(), player1)
    this.players.set(player2.getId(), player2)

    // Select characters (default selection)
    this.selectedCharacters = [
      'veerVikram',
      'kaluDakayt',
      'petukchandra',
      'bokhdoity',
      'chichkeChhor',
    ]

    // Initialize deck
    this.initializeDeck()

    // Deal cards
    this.dealCards()

    // Start game
    this.phase = 'playerAction'
  }

  private initializeDeck(): void {
    this.deck = []

    // Add 3 copies of each selected character
    for (const charKey of this.selectedCharacters) {
      this.deck.push(charKey, charKey, charKey)
    }

    // Shuffle deck (Fisher-Yates)
    this.shuffleDeck()
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }

  private dealCards(): void {
    // Deal 2 cards to each player
    for (const player of this.players.values()) {
      const cards = [this.deck.pop()!, this.deck.pop()!]
      player.addCards(cards)
      player.addCoins(2) // Starting coins
    }
  }

  // Getters
  getPlayers(): Player[] {
    return Array.from(this.players.values())
  }

  getCurrentPlayer(): Player {
    const playerArray = Array.from(this.players.values())
    return playerArray[this.currentPlayerIndex]
  }

  getPhase(): GamePhase {
    return this.phase
  }

  getDeck(): string[] {
    return [...this.deck]
  }

  getSelectedCharacters(): string[] {
    return [...this.selectedCharacters]
  }

  // Game flow
  update(): void {
    // Update logic per frame (if needed)
  }

  drawCard(): string {
    if (this.deck.length === 0) {
      this.reshuffleDeck()
    }
    return this.deck.pop() || ''
  }

  private reshuffleDeck(): void {
    this.initializeDeck()
  }

  nextTurn(): void {
    const playerArray = Array.from(this.players.values()).filter((p) => !p.getState().isEliminated)

    if (playerArray.length === 1) {
      this.phase = 'gameOver'
      return
    }

    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % playerArray.length
    this.phase = 'playerAction'
  }

  // Action execution stubs
  executeAction(_actionKey: string, _targetPlayerId?: string): void {
    // To be implemented
  }

  challengeAction(_challengerPlayerId: string): void {
    // To be implemented
  }

  blockAction(_blockerPlayerId: string, _blockCharacterKey: string): void {
    // To be implemented
  }

  getWinner(): Player | null {
    const alivePlayers = this.getPlayers().filter((p) => p.isAlive())
    return alivePlayers.length === 1 ? alivePlayers[0] : null
  }
}
