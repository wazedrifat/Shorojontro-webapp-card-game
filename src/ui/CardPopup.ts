/**
 * Card Detail Popup Modal
 */

import Phaser from 'phaser'
import { getCharacterByKey } from '@game/Card'
import { getCharacterTexture } from '@utils/assetRegistry'
import { Z_INDEX, COLORS } from '@utils/constants'

export class CardPopup extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle
  private overlay: Phaser.GameObjects.Rectangle
  private closeButton: Phaser.GameObjects.Rectangle
  private contentElements: Phaser.GameObjects.GameObject[] = []

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

    // Card detail panel
    this.bg = scene.add
      .rectangle(0, 0, 700, 550, parseInt(COLORS.DARK.replace('#', '0x'), 16))
      .setStrokeStyle(3, parseInt(COLORS.PRIMARY.replace('#', '0x'), 16))
    this.add(this.bg)

    // Close button (top right)
    this.closeButton = scene.add
      .rectangle(330, -260, 40, 40, parseInt(COLORS.DANGER.replace('#', '0x'), 16))
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.hide())
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(this.closeButton)

    const closeText = scene.add
      .text(330, -260, '✕', {
        fontSize: '28px',
        color: '#fff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setDepth(Z_INDEX.MODAL + 1)
    this.add(closeText)

    this.setDepth(Z_INDEX.MODAL)
    this.setVisible(false)
  }

  show(characterKey: string): void {
    const character = getCharacterByKey(characterKey)
    if (!character) return

    // Clear previous content
    this.contentElements.forEach((el) => el.destroy())
    this.contentElements = []

    // Card image (left side)
    const cardImage = this.scene.add
      .image(this.x - 200, this.y - 50, getCharacterTexture(characterKey))
      .setDisplaySize(200, 280)
      .setDepth(Z_INDEX.MODAL + 1)
    this.contentElements.push(cardImage)

    // Content area (right side)
    let yOffset = -180

    // Character name
    const titleText = this.scene.add
      .text(this.x + 80, this.y + yOffset, character.name, {
        fontSize: '24px',
        color: COLORS.PRIMARY,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'left',
      })
      .setOrigin(0, 0.5)
      .setDepth(Z_INDEX.MODAL + 1)
    this.contentElements.push(titleText)

    yOffset += 45

    // Character type
    const typeText = this.scene.add
      .text(this.x + 80, this.y + yOffset, `Type: ${character.type}`, {
        fontSize: '14px',
        color: '#aaa',
        fontFamily: 'Arial',
      })
      .setOrigin(0, 0.5)
      .setDepth(Z_INDEX.MODAL + 1)
    this.contentElements.push(typeText)

    yOffset += 35

    // Abilities title
    const abilitiesTitle = this.scene.add
      .text(this.x + 80, this.y + yOffset, 'Abilities:', {
        fontSize: '16px',
        color: COLORS.SUCCESS,
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5)
      .setDepth(Z_INDEX.MODAL + 1)
    this.contentElements.push(abilitiesTitle)

    yOffset += 30

    // Abilities list
    character.abilities.forEach((ability) => {
      const abilityText = this.scene.add
        .text(this.x + 90, this.y + yOffset, `• ${ability.description}`, {
          fontSize: '11px',
          color: '#fff',
          fontFamily: 'Arial',
          wordWrap: { width: 250 },
        })
        .setOrigin(0, 0)
        .setDepth(Z_INDEX.MODAL + 1)
      this.contentElements.push(abilityText)

      yOffset += 35
    })

    // Block info if applicable
    if (character.blockDescription) {
      yOffset += 15
      const blockText = this.scene.add
        .text(this.x + 90, this.y + yOffset, `🛡️ ${character.blockDescription}`, {
          fontSize: '11px',
          color: COLORS.WARNING,
          fontFamily: 'Arial',
          wordWrap: { width: 250 },
        })
        .setOrigin(0, 0)
        .setDepth(Z_INDEX.MODAL + 1)
      this.contentElements.push(blockText)
    }

    this.setVisible(true)
  }

  hide(): void {
    this.contentElements.forEach((el) => el.destroy())
    this.contentElements = []
    this.setVisible(false)
  }
}
