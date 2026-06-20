/**
 * Board UI Component
 * Main game board layout with player areas
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
  influenceDisplay: Phaser.GameObjects.Container
  handUI: HandUI
}

export class BoardUI extends Phaser.GameObjects.Container {
  private playerAreas: Map<string, PlayerAreaUI> = new Map()
  private animationManager: AnimationManager

  constructor(scene: Phaser.Scene, animationManager: AnimationManager) {
    super(scene, 0, 0)
    this.animationManager = animationManager
    // Center display will be created when needed
    scene.add.existing(this)
  }

  createPlayerArea(player: Player, position: 'top' | 'bottom', _isAI: boolean = false): PlayerAreaUI {
    const scene = this.scene
    const width = scene.cameras.main.width
    const height = scene.cameras.main.height

    let x: number, y: number
    if (position === 'top') {
      x = width / 2
      y = 80
    } else {
      x = width / 2
      y = height - 100
    }

    const container = scene.add.container(x, y)

    // Background
    const bgColor = parseInt(COLORS.DARK.replace('#', '0x'), 16)
    const strokeColor = parseInt(COLORS.PRIMARY.replace('#', '0x'), 16)
    const bg = scene.add
      .rectangle(0, 0, 400, 120, bgColor)
      .setStrokeStyle(2, strokeColor)
    container.add(bg)

    // Player name
    const nameText = scene.add
      .text(-150, -40, player.getName(), {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5)
    container.add(nameText)

    // Coins display
    const coinsIcon = scene.add
      .text(-150, 0, `💰 ${player.getCoins()}`, {
        fontSize: 16,
        color: COLORS.SUCCESS,
        fontFamily: 'Arial',
      })
      .setOrigin(0, 0.5)
    container.add(coinsIcon)

    const coinsText = coinsIcon

    // Influence display (cards)
    const influenceContainer = scene.add.container(-150, 40)
    const faceDownCount = player.getFaceDownCards().length
    const faceUpCount = player.getFaceUpCards().length

    // Face down cards
    for (let i = 0; i < faceDownCount; i++) {
      const card = scene.add.rectangle(i * 60, 0, 50, 75, 0x4a4a4a).setStrokeStyle(1, 0x666)
      influenceContainer.add(card)
    }

    // Face up cards
    for (let i = 0; i < faceUpCount; i++) {
      const card = scene.add.rectangle((faceDownCount + i) * 60, 0, 50, 75, 0x1a3a52).setStrokeStyle(1, 0x4a9eff)
      influenceContainer.add(card)
    }

    container.add(influenceContainer)

    // Hand UI (bottom player only)
    const handUI =
      position === 'bottom'
        ? new HandUI(scene, 0, 0, this.animationManager)
        : new HandUI(scene, 0, 0, this.animationManager)

    container.add(handUI)

    const playerArea: PlayerAreaUI = {
      container,
      nameText,
      coinsText,
      influenceDisplay: influenceContainer,
      handUI,
    }

    this.playerAreas.set(player.getId(), playerArea)
    this.add(container)

    return playerArea
  }

  updatePlayerCoins(playerId: string, coins: number): void {
    const area = this.playerAreas.get(playerId)
    if (area) {
      area.coinsText.setText(`💰 ${coins}`)
      this.animationManager.pulse(area.coinsText, { duration: 200 })
    }
  }

  updatePlayerInfluence(playerId: string, faceDownCount: number, faceUpCount: number): void {
    const area = this.playerAreas.get(playerId)
    if (area) {
      area.influenceDisplay.removeAll(true)

      for (let i = 0; i < faceDownCount; i++) {
        const card = this.scene.add.rectangle(i * 60, 0, 50, 75, 0x4a4a4a).setStrokeStyle(1, 0x666)
        area.influenceDisplay.add(card)
      }

      for (let i = 0; i < faceUpCount; i++) {
        const card = this.scene.add.rectangle((faceDownCount + i) * 60, 0, 50, 75, 0x1a3a52).setStrokeStyle(1, 0x4a9eff)
        area.influenceDisplay.add(card)
      }
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
        fontSize: '24px',
        color: '#fff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        backgroundColor: '#333',
        padding: { x: 20, y: 10 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL)

    this.animationManager.scaleFadeIn(notif, { duration: 200 })

    this.scene.time.delayedCall(2000, () => {
      this.animationManager.scaleFadeOut(notif, {
        duration: 200,
        onComplete: () => notif.destroy(),
      })
    })
  }
}
