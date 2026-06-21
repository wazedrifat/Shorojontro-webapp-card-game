import Phaser from 'phaser'
import { GameEngine } from '@game/GameEngine'
import { i18n } from '@localization/i18n'
import { AnimationManager } from '@ui/AnimationManager'
import { AudioManager } from '@ui/AudioManager'
import { BoardUI } from '@ui/BoardUI'
import { ActionPanel } from '@ui/ActionPanel'
import { ToastNotification } from '@ui/ToastNotification'
import { COLORS, Z_INDEX } from '@utils/constants'
import { getCharacterByKey } from '@game/Card'

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
    console.log('[GameScene] Starting...')
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
        const character = getCharacterByKey(cardKey)
        const playerArea = this.boardUI?.getPlayerArea(player.getId())
        if (playerArea && character) {
          playerArea.handUI.addCard(cardKey, character.name, false)
        }
      })
    })

    // Top status bar
    const topPanel = this.add.rectangle(this.cameras.main.width / 2, 30, this.cameras.main.width, 50, parseInt(COLORS.DARK.replace('#', '0x'), 16))
    topPanel.setStrokeStyle(1, parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))

    // Turn indicator
    this.gameStateText = this.add
      .text(20, 30, '', {
        fontSize: 18,
        color: COLORS.INFO,
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5)
      .setDepth(Z_INDEX.UI_OVERLAY)

    // Instruction text (center top)
    this.instructionText = this.add
      .text(this.cameras.main.width / 2, 30, '← Select an action button below →', {
        fontSize: 14,
        color: '#FFD700',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.UI_OVERLAY)

    // Back to menu button (top right)
    this.add
      .rectangle(this.cameras.main.width - 50, 30, 80, 40, parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('MenuScene')
      })
      .setDepth(Z_INDEX.UI_OVERLAY)

    this.add
      .text(this.cameras.main.width - 50, 30, 'Menu', {
        fontSize: 12,
        color: '#000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.UI_OVERLAY + 1)

    this.updateGameState()

    // Set up action panel callback
    if (this.actionPanel) {
      this.actionPanel.setOnActionSelected((action: string) => {
        this.handleActionSelected(action)
      })
    }

    // Simulate a turn (demo mode)
    this.time.delayedCall(1500, () => {
      this.simulatePlayerTurn()
    })
  }

  private updateGameState(): void {
    if (!this.gameEngine || !this.gameStateText) return

    const currentPlayer = this.gameEngine.getCurrentPlayer()
    const coinsText = `${currentPlayer.getName()} | 💰 ${currentPlayer.getCoins()}`

    this.gameStateText.setText(coinsText)
  }

  private simulatePlayerTurn(): void {
    if (!this.gameEngine || !this.actionPanel) return

    const currentPlayer = this.gameEngine.getCurrentPlayer()

    // Update instruction
    if (this.instructionText) {
      this.instructionText.setText(`${currentPlayer.getName()}'s turn - Pick an action:`)
    }

    // Show action options
    const actions = [
      { key: 'income', label: 'Income', requiresTarget: false, cost: 0 },
      { key: 'characterAbility', label: 'Character', requiresTarget: false, cost: 0 },
    ]

    // Only show kill if has 7+ coins
    if (currentPlayer.getCoins() >= 7) {
      actions.push({ key: 'kill', label: 'Kill (7💰)', requiresTarget: true, cost: 7 })
    }

    this.actionPanel.showActionSelection(actions)
  }

  private handleActionSelected(action: string): void {
    if (!this.gameEngine || !this.toast) return

    this.actionPanel?.hide()

    const currentPlayer = this.gameEngine.getCurrentPlayer()
    let actionText = action
    if (action === 'income') actionText = 'Income +1💰'
    if (action === 'kill') actionText = 'Kill -7💰'

    this.toast?.info(`${currentPlayer.getName()} → ${actionText}`)

    // Simulate action resolution
    this.time.delayedCall(1200, () => {
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

      this.time.delayedCall(800, () => this.simulatePlayerTurn())
    })
  }

  update(): void {
    // Game loop updates here
  }
}
