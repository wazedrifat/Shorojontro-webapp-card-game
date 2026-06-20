/**
 * Game Rules & Validation
 * Enforces game rules and validates actions
 */

import { Player } from './Player'
import { getCharacterByKey } from './Card'

export interface ActionValidation {
  isValid: boolean
  reason?: string
}

export class GameRules {
  /**
   * Validates if a player can perform an action
   */
  static validateAction(
    player: Player,
    actionKey: string,
    characterKey?: string,
    targetPlayer?: Player
  ): ActionValidation {
    // Check if player is alive
    if (!player.isAlive()) {
      return { isValid: false, reason: 'Player is eliminated' }
    }

    // General actions
    if (actionKey === 'income') {
      return { isValid: true }
    }

    if (actionKey === 'kill') {
      if (player.getCoins() < 7) {
        return { isValid: false, reason: 'Not enough coins to kill (need 7)' }
      }
      if (!targetPlayer) {
        return { isValid: false, reason: 'Kill action requires target' }
      }
      if (!targetPlayer.isAlive()) {
        return { isValid: false, reason: 'Target is eliminated' }
      }
      return { isValid: true }
    }

    // Character actions
    if (characterKey) {
      const character = getCharacterByKey(characterKey)
      if (!character) {
        return { isValid: false, reason: 'Character does not exist' }
      }

      // Check if action exists
      const ability = character.abilities.find((a) => a.key === actionKey)
      if (!ability) {
        return { isValid: false, reason: 'Character does not have this action' }
      }

      // Check coins for action cost
      if (player.getCoins() < ability.cost) {
        return { isValid: false, reason: `Not enough coins for ${actionKey} (cost: ${ability.cost})` }
      }

      // Check if target is required
      if (ability.requiresTarget && !targetPlayer) {
        return { isValid: false, reason: `${actionKey} requires a target` }
      }

      return { isValid: true }
    }

    return { isValid: false, reason: 'Invalid action' }
  }

  /**
   * Validates if a challenge is valid
   */
  static validateChallenge(challenger: Player, targetPlayer: Player, _claimedCharacter: string): ActionValidation {
    if (!challenger.isAlive()) {
      return { isValid: false, reason: 'Challenger is eliminated' }
    }

    if (!targetPlayer.isAlive()) {
      return { isValid: false, reason: 'Target player is eliminated' }
    }

    if (challenger.getId() === targetPlayer.getId()) {
      return { isValid: false, reason: 'Cannot challenge yourself' }
    }

    return { isValid: true }
  }

  /**
   * Validates if a block is possible
   */
  static validateBlock(blocker: Player, targetAction: string, blockCharacter: string): ActionValidation {
    if (!blocker.isAlive()) {
      return { isValid: false, reason: 'Blocker is eliminated' }
    }

    const character = getCharacterByKey(blockCharacter)
    if (!character) {
      return { isValid: false, reason: 'Character does not exist' }
    }

    if (!character.canBlock(targetAction)) {
      return { isValid: false, reason: `${character.name} cannot block ${targetAction}` }
    }

    return { isValid: true }
  }

  /**
   * Checks if a player must kill (has 10+ coins at turn start)
   */
  static mustKill(player: Player): boolean {
    return player.getCoins() >= 10
  }

  /**
   * Checks if a player is targeted by jinn protection
   */
  static hasJinnProtection(player: Player): boolean {
    return player.getJinnTokenStatus()
  }

  /**
   * Checks if two players are puppet-linked
   */
  static arePuppetLinked(player1: Player, player2: Player): boolean {
    return player1.getPuppetLink() === player2.getId() || player2.getPuppetLink() === player1.getId()
  }
}
