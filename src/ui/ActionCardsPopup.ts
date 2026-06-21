/**
 * Action Cards Selection Popup
 */

import Phaser from 'phaser'
import { Z_INDEX, COLORS } from '@utils/constants'

export class ActionCardsPopup extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle
  private overlay: Phaser.GameObjects.Rectangle
  private title: Phaser.GameObjects.Text
  private cardContainer: Phaser.GameObjects.Container
  private onCardSelected: ((cardImage: string) => void) | null = null
  private actionType: 'general' | 'character' = 'general'
  private closeBtn: Phaser.GameObjects.Rectangle
  private closeText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    super(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2)
    scene.add.existing(this)

    // Semi-transparent overlay
    this.overlay = scene.add
      .rectangle(0, 0, scene.cameras.main.width * 2, scene.cameras.main.height * 2, 0x000000, 0.7)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.hide())
    this.add(this.overlay)

    // Main panel
    this.bg = scene.add
      .rectangle(0, 0, 900, 500, parseInt(COLORS.DARK.replace('#', '0x'), 16))
      .setStrokeStyle(3, parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
    this.add(this.bg)

    // Title
    this.title = scene.add
      .text(0, -220, 'Select Action', {
        fontSize: '20px',
        color: COLORS.PRIMARY,
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(this.title)

    // Cards container
    this.cardContainer = scene.add.container(0, 50)
    this.add(this.cardContainer)

    // Close button
    this.closeBtn = scene.add
      .rectangle(430, -220, 40, 40, parseInt(COLORS.DANGER.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.hide())
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(this.closeBtn)

    this.closeText = scene.add
      .text(430, -220, '✕', {
        fontSize: '28px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 2)
    this.add(this.closeText)

    this.setDepth(Z_INDEX.MODAL)
    this.setVisible(false)
  }

  showGeneral(): void {
    this.actionType = 'general'
    this.title.setText('Select General Action')
    this.cardContainer.removeAll(true)

    // Load general action cards
    const generalActions = ['general_action_ay.jpg']

    this.displayCards(generalActions, 'generalActionCards')
    this.setVisible(true)
  }

  showCharacter(): void {
    this.actionType = 'character'
    this.title.setText('Select Character Action')
    this.cardContainer.removeAll(true)

    // Load character action cards
    const characterActions = [
      'action_arun.jpg',
      'action_bir_bikrom.jpg',
      'action_brokho_doitto.jpg',
      'action_ciske_chor.jpg',
      'action_jiner_badsha.jpg',
      'action_kalu_dakat.jpg',
      'action_mamdo_hamdo.jpg',
      'action_nantu_mia.jpg',
      'action_petukcondro.jpg',
      'action_pretraj.jpg',
      'action_putul_raj.jpg',
    ]

    this.displayCards(characterActions, 'characterActionCards')
    this.setVisible(true)
  }

  private displayCards(cards: string[], folder: string): void {
    const cardWidth = 120
    const cardHeight = 160
    const spacing = 140
    const cardsPerRow = 6
    const startX = -350

    cards.forEach((cardFile, index) => {
      const row = Math.floor(index / cardsPerRow)
      const col = index % cardsPerRow
      const x = startX + col * spacing
      const y = row * (cardHeight + 40)

      // Card image
      const cardImg = this.scene.add
        .image(x, y, `action_${folder}_${index}`)
        .setDisplaySize(cardWidth, cardHeight)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.onCardSelected?.(`/assets/cards/${folder}/${cardFile}`)
          this.hide()
        })
        .setDepth(Z_INDEX.MODAL + 1)

      this.cardContainer.add(cardImg)
    })
  }

  setOnCardSelected(callback: (cardImage: string) => void): void {
    this.onCardSelected = callback
  }

  hide(): void {
    this.setVisible(false)
    this.cardContainer.removeAll(true)
  }
}
