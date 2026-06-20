/**
 * AI Bot Class
 * Simple static strategy bot for single-player mode
 */

import { Player } from './Player'
// Note: CHARACTERS imported for future use in bot strategy decisions

export type BotDifficulty = 'easy' | 'medium' | 'hard'

export interface BotAction {
  type: 'general' | 'character'
  key: string
  targetPlayerId?: string
}

export class AIBot {
  private difficulty: BotDifficulty

  constructor(difficulty: BotDifficulty = 'easy') {
    this.difficulty = difficulty
  }

  /**
   * Decides the bot's next action
   */
  decideAction(botPlayer: Player, otherPlayers: Player[]): BotAction {
    const coins = botPlayer.getCoins()

    // Mandatory kill rule: if >= 10 coins, must kill
    if (coins >= 10) {
      const target = this.selectKillTarget(botPlayer, otherPlayers)
      return {
        type: 'general',
        key: 'kill',
        targetPlayerId: target.getId(),
      }
    }

    // Strategy based on coin level
    const rand = Math.random()

    if (coins >= 7) {
      // Can kill - 40% kill, 60% other
      if (rand < 0.4) {
        const target = this.selectKillTarget(botPlayer, otherPlayers)
        return {
          type: 'general',
          key: 'kill',
          targetPlayerId: target.getId(),
        }
      }
    }

    if (coins >= 3 && rand < 0.3) {
      // Try special actions
      return this.selectCharacterAction(botPlayer, otherPlayers)
    }

    // Default: income
    return {
      type: 'general',
      key: 'income',
    }
  }

  /**
   * Decides whether to challenge an action
   */
  shouldChallenge(_actionKey: string, _claimedCharacter: string, _botPlayer: Player, _activePlayer: Player): boolean {
    // Easy: Never challenge
    if (this.difficulty === 'easy') {
      return false
    }

    // Medium: 30% challenge on suspicious claims
    if (this.difficulty === 'medium') {
      return Math.random() < 0.3
    }

    // Hard: Strategic challenge
    return Math.random() < 0.5
  }

  /**
   * Decides whether to block an action
   */
  shouldBlock(actionKey: string, botPlayer: Player, _activePlayer: Player): boolean {
    // Only block if action targets bot and would cause damage
    if (actionKey === 'neckStrike' || actionKey === 'theft') {
      // Easy: Never block
      if (this.difficulty === 'easy') {
        return false
      }

      // Medium/Hard: Block if at risk
      return botPlayer.getInfluence() <= 2
    }

    return false
  }

  private selectKillTarget(_botPlayer: Player, otherPlayers: Player[]): Player {
    // Kill player with least influence (weakest)
    return otherPlayers.reduce((weakest, current) => {
      return current.getInfluence() < weakest.getInfluence() ? current : weakest
    })
  }

  private selectCharacterAction(_botPlayer: Player, otherPlayers: Player[]): BotAction {
    const actions = [
      { type: 'character' as const, key: 'warriorStipend' },
      { type: 'character' as const, key: 'robbery', targetId: otherPlayers[0]?.getId() },
      { type: 'character' as const, key: 'theft' },
    ]

    return actions[Math.floor(Math.random() * actions.length)] || {
      type: 'general',
      key: 'income',
    }
  }
}
