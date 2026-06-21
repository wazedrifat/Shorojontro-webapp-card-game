/**
 * Board UI Component - with card images, coin display, and action buttons
 */

import Phaser from 'phaser'
import { AnimationManager } from './AnimationManager'
import { Player } from '@game/Player'
import { HandUI } from './HandUI'
import { COIN_TEXTURES } from '@utils/assetRegistry'
import { COLORS, Z_INDEX } from '@utils/constants'

export interface PlayerAreaUI {
  container: Phaser.GameObjects.Container
  nameText: Phaser.GameObjects.Text
  coinsContainer: Phaser.GameObjects.Container
  influenceDisplay: Phaser.GameObjects.Text
  handUI: HandUI
}

export class BoardUI extends Phaser.GameObjects.Container {
  private playerAreas: Map<string, PlayerAreaUI> = new Map()
  private animationManager: AnimationManager
  private centerPlayArea: Phaser.GameObjects.Container
  private centerBankDisplay: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, animationManager: AnimationManager) {
    super(scene, 0, 0)
    this.animationManager = animationManager
    
    // Create center play area
    this.centerPlayArea = scene.add.container(scene.cameras.main.width / 2, scene.cameras.main.height / 2)
    scene.add.existing(this)

    // Create center bank display with overlapping coins and cards
    this.centerBankDisplay = scene.add.container(scene.cameras.main.width / 2, scene.cameras.main.height / 2)
    this.createBankDisplay()
  }

  private createBankDisplay(): void {
    const scene = this.scene

    // Bank label
    const bankLabel = scene.add
      .text(0, -100, '🏦 BANK', {
        fontSize: '18px',
        color: COLORS.SUCCESS,
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
    this.centerBankDisplay.add(bankLabel)

    // Draw 5-8 overlapping face-down cards (backside)
    for (let i = 0; i < 6; i++) {
      const offsetX = i * 8 - 20
      const offsetY = i * 5
      const card = scene.add
        .image(offsetX, offsetY, 'card_backside')
        .setDisplaySize(70, 90)
        .setDepth(i)
      this.centerBankDisplay.add(card)
    }

    // Draw overlapping coins (mix of types)
    const coinTypes = [COIN_TEXTURES.coin, COIN_TEXTURES.coinJin, COIN_TEXTURES.coinKhajna, COIN_TEXTURES.coinPuppet]
    let coinIndex = 0
    for (let i = 0; i < 12; i++) {
      const offsetX = (i % 4) * 12 - 18
      const offsetY = Math.floor(i / 4) * 12 + 50
      const coinType = coinTypes[coinIndex % coinTypes.length]
      const coin = scene.add
        .image(offsetX, offsetY, coinType)
        .setDisplaySize(50, 50)
        .setDepth(i + 10)
      this.centerBankDisplay.add(coin)
      coinIndex++
    }

    this.add(this.centerBankDisplay)
  }

  createPlayerArea(player: Player, position: 'top' | 'bottom', isAI: boolean = false): PlayerAreaUI {
    const scene = this.scene
    const width = scene.cameras.main.width
    const height = scene.cameras.main.height

    let x: number, y: number, isBottomPlayer: boolean
    if (position === 'top') {
      x = width / 2
      y = 80
      isBottomPlayer = false
    } else {
      x = width / 2
      y = height - 130
      isBottomPlayer = true
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
      .text(-width / 2 + 15, -30, `${player.getName()}${isAI ? ' 🤖' : ' 👤'}`, {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5)
    container.add(nameText)

    // Coins display - show actual coin images
    const coinsContainer = scene.add.container(-width / 2 + 100, 0)
    
    // Add individual coins for this player
    const coinCount = Math.max(player.getCoins(), 2) // Start with at least 2 coins
    for (let i = 0; i < Math.min(coinCount, 10); i++) {
      const coinX = i * 15
      const coinImg = scene.add
        .image(coinX, 0, COIN_TEXTURES.coin)
        .setDisplaySize(25, 25)
      coinsContainer.add(coinImg)
    }

    // Add coin count text if more than 10
    if (coinCount > 10) {
      const coinText = scene.add
        .text(160, 0, `+${coinCount - 10}`, {
          fontSize: 12,
          color: COLORS.SUCCESS,
          fontFamily: 'Arial',
          fontStyle: 'bold',
        })
        .setOrigin(0, 0.5)
      coinsContainer.add(coinText)
    }

    container.add(coinsContainer)

    // Influence display (left-bottom)
    const faceDownCount = player.getFaceDownCards().length
    const faceUpCount = player.getFaceUpCards().length
    const influenceText = scene.add
      .text(-width / 2 + 15, 30, `🔒${faceDownCount} 👁️${faceUpCount}`, {
        fontSize: 12,
        color: '#aaa',
        fontFamily: 'Arial',
      })
      .setOrigin(0, 0.5)
    container.add(influenceText)

    // Hand UI - show all cards for your player, hidden for opponent
    const handUI = new HandUI(scene, 0, 40, this.animationManager)
    container.add(handUI)

    const playerArea: PlayerAreaUI = {
      container,
      nameText,
      coinsContainer,
      influenceDisplay: influenceText,
      handUI,
    }

    this.playerAreas.set(player.getId(), playerArea)
    this.add(container)

    return playerArea
  }

  createActionButtonBar(onAction: () => void, onChallenge: () => void, onBlock: () => void): void {
    const scene = this.scene
    const width = scene.cameras.main.width
    const height = scene.cameras.main.height
    const buttonY = height / 2 + 180 // Position below bank but above bottom player area

    // Action Button (left)
    this.createButton(width / 2 - 150, buttonY, 'Action', onAction)

    // Challenge Button (center)
    this.createButton(width / 2, buttonY, 'Challenge', onChallenge)

    // Block Button (right)
    this.createButton(width / 2 + 150, buttonY, 'Block', onBlock)
  }

  private createButton(x: number, y: number, label: string, callback: () => void): void {
    const btn = this.scene.add
      .rectangle(x, y, 130, 50, parseInt(COLORS.INFO.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', callback)
      .setStrokeStyle(2, '#fff')
      .setDepth(Z_INDEX.UI_OVERLAY)

    this.scene.add
      .text(x, y, label, {
        fontSize: '14px',
        color: '#000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.UI_OVERLAY + 1)

    this.add(btn)
  }

  updatePlayerCoins(playerId: string, coins: number): void {
    const area = this.playerAreas.get(playerId)
    if (area) {
      // Clear and rebuild coins display
      area.coinsContainer.removeAll(true)

      const displayCoins = Math.max(coins, 2)
      for (let i = 0; i < Math.min(displayCoins, 10); i++) {
        const coinX = i * 15
        const coinImg = this.scene.add
          .image(coinX, 0, COIN_TEXTURES.coin)
          .setDisplaySize(25, 25)
        area.coinsContainer.add(coinImg)
      }

      if (displayCoins > 10) {
        const coinText = this.scene.add
          .text(160, 0, `+${displayCoins - 10}`, {
            fontSize: 12,
            color: COLORS.SUCCESS,
            fontFamily: 'Arial',
            fontStyle: 'bold',
          })
          .setOrigin(0, 0.5)
        area.coinsContainer.add(coinText)
      }

      this.animationManager.pulse(area.coinsContainer as any, { duration: 200 })
    }
  }

  updatePlayerInfluence(playerId: string, faceDownCount: number, faceUpCount: number): void {
    const area = this.playerAreas.get(playerId)
    if (area) {
      area.influenceDisplay.setText(`🔒${faceDownCount} 👁️${faceUpCount}`)
    }
  }

  getPlayerArea(playerId: string): PlayerAreaUI | undefined {
    return this.playerAreas.get(playerId)
  }

  getCenterPlayArea(): Phaser.GameObjects.Container {
    return this.centerPlayArea
  }

  showNotification(message: string, x?: number, y?: number): void {
    const posX = x ?? this.scene.cameras.main.width / 2
    const posY = y ?? this.scene.cameras.main.height / 2

    const notif = this.scene.add
      .text(posX, posY, message, {
        fontSize: 20,
        color: '#FFD700',
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
