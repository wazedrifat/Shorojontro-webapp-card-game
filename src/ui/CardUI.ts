/**
 * Card UI Component
 * Individual card rendering and interactions
 */

import Phaser from 'phaser'
import { AnimationManager } from './AnimationManager'
import { Player } from '@game/Player'
import { i18n } from '@localization/i18n'
import { getCharacterByKey } from '@game/Card'
import { generateCardSVG, generateBackSVG } from './CardSVGGenerator'

export interface CardUIOptions {
  x: number
  y: number
  characterKey: string
  faceUp: boolean
  interactive?: boolean
  owner?: Player
}

export class CardUI extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics
  private characterKey: string
  private faceUp: boolean
  private animationManager: AnimationManager
  private svgGraphics: Phaser.GameObjects.Graphics | null = null

  constructor(scene: Phaser.Scene, options: CardUIOptions, animationManager: AnimationManager) {
    super(scene, options.x, options.y)

    this.characterKey = options.characterKey
    this.faceUp = options.faceUp
    this.animationManager = animationManager

    // Create background graphics
    this.bg = scene.make.graphics({ x: 0, y: 0, add: false })
    this.add(this.bg)

    // Draw card
    this.drawCard()

    // Make interactive
    if (options.interactive) {
      const hitArea = new Phaser.Geom.Rectangle(-60, -90, 120, 180)
      this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
      this.on('pointerover', () => this.onHover())
      this.on('pointerout', () => this.onHoverOut())
    }

    scene.add.existing(this)
  }

  private drawCard(): void {
    this.bg.clear()

    if (this.faceUp) {
      // Draw SVG on canvas
      this.drawSVGCard(generateCardSVG(this.characterKey, 120, 180))
    } else {
      this.drawSVGCard(generateBackSVG(120, 180))
    }
  }

  private drawSVGCard(svg: SVGElement): void {
    // Convert SVG to canvas
    const canvas = document.createElement('canvas')
    canvas.width = 120
    canvas.height = 180

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw background based on SVG
    if (this.faceUp) {
      const colors = this.getCardColors()
      ctx.fillStyle = colors.bg
      ctx.fillRect(0, 0, 120, 180)
      ctx.strokeStyle = colors.text
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, 120, 180)

      // Draw content
      ctx.font = 'bold 40px Arial'
      ctx.textAlign = 'center'
      ctx.fillStyle = colors.icon
      ctx.fillText(colors.icon, 60, 50)

      ctx.font = 'bold 11px Arial'
      ctx.fillStyle = colors.text
      const charName = i18n.character(this.characterKey, 'name').substring(0, 10)
      ctx.fillText(charName, 60, 130)
    } else {
      // Back of card
      ctx.fillStyle = '#4a4a4a'
      ctx.fillRect(0, 0, 120, 180)
      ctx.strokeStyle = '#666'
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, 120, 180)

      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = '#666'
        ctx.beginPath()
        ctx.moveTo(0, i * 30)
        ctx.lineTo(120, i * 30)
        ctx.stroke()
      }

      ctx.font = 'bold 60px Arial'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#888'
      ctx.fillText('?', 60, 90)
    }

    // Create texture from canvas
    const textureKey = `card_${this.characterKey}_${Date.now()}`
    this.scene.textures.addCanvas(textureKey, canvas)

    // Display on graphics
    this.bg.clear()
    this.bg.fillStyle(0xffffff, 1)
    this.bg.fillRectShape(new Phaser.Geom.Rectangle(-60, -90, 120, 180))
    this.bg.fillStyle(0x000000, 0)

    const image = this.scene.add.image(0, 0, textureKey)
    image.setDisplaySize(120, 180)
    this.add(image)
  }

  private getCardColors(): { bg: string; text: string; icon: string } {
    const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
      veerVikram: { bg: '#8B4513', text: '#FFD700', icon: '⚔️' },
      kaluDakayt: { bg: '#2C3E50', text: '#E74C3C', icon: '🗡️' },
      petukchandra: { bg: '#27AE60', text: '#F39C12', icon: '📜' },
      jinnerBadshah: { bg: '#8E44AD', text: '#9B59B6', icon: '👑' },
      mamdoHomdho: { bg: '#C0392B', text: '#ECF0F1', icon: '🍖' },
      putuulRaj: { bg: '#E67E22', text: '#34495E', icon: '🎭' },
      bokhdoity: { bg: '#34495E', text: '#E74C3C', icon: '💀' },
      chichkeChhor: { bg: '#16A085', text: '#ECF0F1', icon: '🏃' },
      arun: { bg: '#2980B9', text: '#ECF0F1', icon: '🔍' },
      nantuMiya: { bg: '#F39C12', text: '#2C3E50', icon: '💰' },
      betalPrataraj: { bg: '#C0392B', text: '#ECF0F1', icon: '👻' },
    }
    return colorMap[this.characterKey] || { bg: '#555', text: '#fff', icon: '?' }
  }

  private onHover(): void {
    this.setScale(1.1)
  }

  private onHoverOut(): void {
    this.setScale(1)
  }

  flip(newCharacterKey: string): void {
    const sprite = this as any
    this.animationManager.flipCard(
      sprite,
      () => {
        this.characterKey = newCharacterKey
        this.faceUp = true
        this.drawCard()
      },
      { duration: 150 }
    )
  }

  getCharacterKey(): string {
    return this.characterKey
  }

  isFaceUp(): boolean {
    return this.faceUp
  }
}

