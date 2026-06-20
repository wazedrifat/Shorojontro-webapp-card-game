import Phaser from 'phaser'
import { GameEngine } from '@game/GameEngine'
import { i18n } from '@localization/i18n'
import { AnimationManager } from '@ui/AnimationManager'
import { AudioManager } from '@ui/AudioManager'
import { BoardUI } from '@ui/BoardUI'
import { ActionPanel } from '@ui/ActionPanel'
import { ToastNotification } from '@ui/ToastNotification'
import { COLORS, Z_INDEX } from '@utils/constants'

export class GameScene extends Phaser.Scene {
  private gameEngine: GameEngine | null = null
  private animationManager: AnimationManager | null = null
  private audioManager: AudioManager | null = null
  private boardUI: BoardUI | null = null
  private actionPanel: ActionPanel | null = null
  private toast: ToastNotification | null = null
  private gameStateText: Phaser.GameObjects.Text | null = null
  private instructionText: Phaser.GameObjects.Text | null = null

  constructor() {
    super('GameScene')
  }

  create(): void {
    console.log('[GameScene] create() starting')
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND)

    // Initialize managers
    this.animationManager = new AnimationManager(this)
    this.audioManager = new AudioManager()
    this.toast = new ToastNotification(this, this.animationManager)

    // Initialize game engine
    this.gameEngine = new GameEngine(this)

    // Create UI
    this.boardUI = new BoardUI(this, this.animationManager)
    this.actionPanel = new ActionPanel(this, this.animationManager)

    // Get players from engine
    const players = this.gameEngine.getPlayers()

    // Create player UI areas
    players.forEach((player, index) => {
      const position = index === 0 ? 'bottom' : 'top'
      this.boardUI?.createPlayerArea(player, position as 'top' | 'bottom', player.getIsAI())

      // Add cards to hand UI
      player.getFaceDownCards().forEach((cardKey) => {
        const playerArea = this.boardUI?.getPlayerArea(player.getId())
        if (playerArea) {
          playerArea.handUI.addCard(cardKey, false)
        }
      })
    })

    // Show game start notification
    this.toast?.success('Game Started!')

    // Add turn indicator
    this.gameStateText = this.add
      .text(this.cameras.main.width / 2, 20, '', {
        fontSize: 16,
        color: COLORS.INFO,
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.UI_OVERLAY)

    // Add instruction text
    this.instructionText = this.add
      .text(this.cameras.main.width / 2, 60, 'DEMO: Coins increase each turn automatically. Click action buttons below to play.', {
        fontSize: 12,
        color: '#FFD700',
        fontFamily: 'Arial',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.UI_OVERLAY)

    this.updateGameState()

    // Back to menu button
    this.add
      .rectangle(50, 50, 100, 40, parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('MenuScene')
      })
      .setDepth(Z_INDEX.UI_OVERLAY)

    this.add
      .text(50, 50, i18n.t('back', 'ui'), {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.UI_OVERLAY + 1)

    // Set up action panel callback
    if (this.actionPanel) {
      this.actionPanel.setOnActionSelected((action: string) => {
        this.handleActionSelected(action)
      })
    }

    // Simulate a turn (demo mode)
    this.time.delayedCall(2000, () => {
      this.simulatePlayerTurn()
    })
  }

  private updateGameState(): void {
    if (!this.gameEngine || !this.gameStateText) return

    const currentPlayer = this.gameEngine.getCurrentPlayer()
    const phase = this.gameEngine.getPhase()

    this.gameStateText.setText(
      `${currentPlayer.getName()} - ${phase.toUpperCase()}`
    )
  }

  private simulatePlayerTurn(): void {
    if (!this.gameEngine || !this.actionPanel) return

    const currentPlayer = this.gameEngine.getCurrentPlayer()

    // Show action options
    const actions = [
      { key: 'income', label: 'Income (+1 coin)', requiresTarget: false, cost: 0 },
      { key: 'characterAbility', label: 'Use Ability', requiresTarget: true, cost: 0 },
    ]

    // Only show kill if has 7+ coins
    if (currentPlayer.getCoins() >= 7) {
      actions.push({ key: 'kill', label: 'Kill (-7 coins)', requiresTarget: true, cost: 7 })
    }

    this.actionPanel?.showActionSelection(actions)
  }

  private handleActionSelected(action: string): void {
    if (!this.gameEngine || !this.toast) return

    this.actionPanel?.hide()

    const currentPlayer = this.gameEngine.getCurrentPlayer()
    const actionName = action === 'income' ? 'Income' : action

    this.toast?.info(`${currentPlayer.getName()} → ${actionName}`)

    // Simulate action resolution
    this.time.delayedCall(1500, () => {
      if (action === 'income') {
        currentPlayer.addCoins(1)
        const playerArea = this.boardUI?.getPlayerArea(currentPlayer.getId())
        if (playerArea) {
          this.boardUI?.updatePlayerCoins(currentPlayer.getId(), currentPlayer.getCoins())
          this.audioManager?.play('coin')
        }
      }

      // Move to next turn
      this.gameEngine?.nextTurn()
      this.updateGameState()
      this.time.delayedCall(1000, () => this.simulatePlayerTurn())
    })
  }

  update(): void {
    if (this.gameEngine) {
      // Game loop updates here
    }
  }
}
