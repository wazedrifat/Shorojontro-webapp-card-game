/**
 * Board UI Component - Simplified with proper alignment
 */

import Phaser from 'phaser'
import { AnimationManager } from './AnimationManager'
import { Player } from '@game/Player'
import { HandUI } from './HandUI'
import { COLORS, Z_INDEX } from '@utils/constants'

export interface PlayerAreaUI {
  container: Phaser.GameObjects.Container
  nameText: Phaser.GameObjects.Text
  coinsText: Phaser.GameObjects.Text
  influenceDisplay: Phaser.GameObjects.Text
  handUI: HandUI
}

export class BoardUI extends Phaser.GameObjects.Container {
  private playerAreas: Map<string, PlayerAreaUI> = new Map()
  private animationManager: AnimationManager

  constructor(scene: Phaser.Scene, animationManager: AnimationManager) {
    super(scene, 0, 0)
    this.animationManager = animationManager
    scene.add.existing(this)
  }

  createPlayerArea(player: Player, position: 'top' | 'bottom', _isAI: boolean = false): PlayerAreaUI {
    const scene = this.scene
    const width = scene.cameras.main.width
    const height = scene.cameras.main.height

    let x: number, y: number
    if (position === 'top') {
      x = width / 2
      y = 120
    } else {
      x = width / 2
      y = height - 120
    }

    const container = scene.add.container(x, y)

    // Background
    const bgColor = parseInt(COLORS.DARK.replace('#', '0x'), 16)
    const strokeColor = parseInt(COLORS.PRIMARY.replace('#', '0x'), 16)
    const bg = scene.add
      .rectangle(0, 0, width - 40, 100, bgColor)
      .setStrokeStyle(2, strokeColor)
    container.add(bg)

    // Player name (left)
    const nameText = scene.add
      .text(-width / 2 + 20, -30, player.getName(), {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0)
    container.add(nameText)

    // Coins display (left-middle)
    const coinsText = scene.add
      .text(-width / 2 + 20, 0, `💰 Coins: ${player.getCoins()}`, {
        fontSize: 14,
        color: COLORS.SUCCESS,
        fontFamily: 'Arial',
      })
      .setOrigin(0, 0)
    container.add(coinsText)

    // Influence display (left-bottom)
    const faceDownCount = player.getFaceDownCards().length
    const faceUpCount = player.getFaceUpCards().length
    const influenceText = scene.add
      .text(-width / 2 + 20, 25, `Cards: ${faceDownCount}🔒 + ${faceUpCount}👁️`, {
        fontSize: 12,
        color: '#aaa',
        fontFamily: 'Arial',
      })
      .setOrigin(0, 0)
    container.add(influenceText)

    // Hand UI (center-right)
    const handUI = new HandUI(scene, width / 2 - 150, 0, this.animationManager)
    container.add(handUI)

    const playerArea: PlayerAreaUI = {
      container,
      nameText,
      coinsText,
      influenceDisplay: influenceText,
      handUI,
    }

    this.playerAreas.set(player.getId(), playerArea)
    this.add(container)

    return playerArea
  }

  updatePlayerCoins(playerId: string, coins: number): void {
    const area = this.playerAreas.get(playerId)
    if (area) {
      area.coinsText.setText(`💰 Coins: ${coins}`)
      this.animationManager.pulse(area.coinsText, { duration: 200 })
    }
  }

  updatePlayerInfluence(playerId: string, faceDownCount: number, faceUpCount: number): void {
    const area = this.playerAreas.get(playerId)
    if (area) {
      area.influenceDisplay.setText(`Cards: ${faceDownCount}🔒 + ${faceUpCount}👁️`)
    }
  }

  getPlayerArea(playerId: string): PlayerAreaUI | undefined {
    return this.playerAreas.get(playerId)
  }

  showNotification(message: string, x?: number, y?: number): void {
    const posX = x ?? this.scene.cameras.main.width / 2
    const posY = y ?? this.scene.cameras.main.height / 2

    const notif = this.scene.add
      .text(posX, posY, message, {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        backgroundColor: '#333',
        padding: { x: 20, y: 10 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL)

    this.animationManager.scaleFadeIn(notif as any, { duration: 200 })

    this.scene.time.delayedCall(2000, () => {
      this.animationManager.scaleFadeOut(notif as any, {
        duration: 200,
        onComplete: () => notif.destroy(),
      })
    })
  }
}
