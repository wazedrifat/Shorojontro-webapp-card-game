import Phaser from 'phaser'
import { GameEngine } from '@game/GameEngine'
import { AnimationManager } from '@ui/AnimationManager'
import { AudioManager } from '@ui/AudioManager'
import { BoardUI } from '@ui/BoardUI'
import { ToastNotification } from '@ui/ToastNotification'
import { CardPopup } from '@ui/CardPopup'
import { ActionSelectionPopup } from '@ui/ActionSelectionPopup'
import { ActionCardsPopup } from '@ui/ActionCardsPopup'
import { COLORS, Z_INDEX } from '@utils/constants'
import { getCharacterByKey } from '@game/Card'

export class GameScene extends Phaser.Scene {
  private gameEngine: GameEngine | null = null
  private animationManager: AnimationManager | null = null
  private audioManager: AudioManager | null = null
  private boardUI: BoardUI | null = null
  private toast: ToastNotification | null = null
  private cardPopup: CardPopup | null = null
  private actionSelectionPopup: ActionSelectionPopup | null = null
  private actionCardsPopup: ActionCardsPopup | null = null
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

    // Initialize popups (but keep them hidden)
    this.cardPopup = new CardPopup(this)
    this.cardPopup.setVisible(false)

    this.actionSelectionPopup = new ActionSelectionPopup(this)
    this.actionSelectionPopup.setVisible(false)

    this.actionCardsPopup = new ActionCardsPopup(this)
    this.actionCardsPopup.setVisible(false)

    // Set up action selection popup
    this.actionSelectionPopup.setOnActionSelected((actionType: string) => {
      if (actionType === 'general') {
        this.actionCardsPopup?.showGeneral()
      } else {
        this.actionCardsPopup?.showCharacter()
      }
    })

    // Set up action cards popup
    this.actionCardsPopup?.setOnCardSelected((cardImage: string) => {
      // Extract action from card image path
      let actionName = 'action'
      if (cardImage.includes('general_action_ay')) {
        actionName = 'Income'
        this.gameEngine?.executeAction('income')
      } else if (cardImage.includes('general_action_hotta')) {
        actionName = 'Kill'
        this.gameEngine?.executeAction('kill')
      }

      this.toast?.info(`${actionName} executed!`)
      this.boardUI?.updatePlayerCoins(this.gameEngine?.getCurrentPlayer().getId() || '', this.gameEngine?.getCurrentPlayer().getCoins() || 0)
      this.actionCardsPopup?.hide()
      this.actionSelectionPopup?.hide()
    })

    // Initialize game engine
    this.gameEngine = new GameEngine(this)

    // Create UI
    this.boardUI = new BoardUI(this, this.animationManager)

    // Get players from engine
    const players = this.gameEngine.getPlayers()

    // Create player UI areas
    players.forEach((player, index) => {
      const position = index === 0 ? 'bottom' : 'top'
      const isPlayerCard = index === 0 // First player (human) should see their cards face-up
      this.boardUI?.createPlayerArea(player, position as 'top' | 'bottom', player.getIsAI())

      // Add cards to hand UI
      const playerArea = this.boardUI?.getPlayerArea(player.getId())
      if (playerArea) {
        // Set up card click callback
        playerArea.handUI.setOnCardClickCallback((characterKey: string) => {
          this.cardPopup?.show(characterKey)
        })

        player.getFaceDownCards().forEach((cardKey) => {
          const character = getCharacterByKey(cardKey)
          if (character) {
            playerArea.handUI.addCard(cardKey, character.name, false, isPlayerCard)
          }
        })
      }
    })

    // Create action buttons (middle bottom)
    this.boardUI?.createActionButtonBar(
      () => this.actionSelectionPopup?.show(),
      () => this.toast?.warning('Challenge not yet implemented'),
      () => this.toast?.warning('Block not yet implemented')
    )

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
      .text(this.cameras.main.width / 2, 30, '← Choose an action →', {
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
    if (!this.gameEngine) return

    const currentPlayer = this.gameEngine.getCurrentPlayer()

    // Update instruction
    if (this.instructionText) {
      this.instructionText.setText(`${currentPlayer.getName()}'s turn - Pick an action:`)
    }
  }

  update(): void {
    // Game loop updates here
  }
}
