/**
 * Toast Notification System
 * Shows temporary feedback messages
 */

import Phaser from 'phaser'
import { AnimationManager } from './AnimationManager'

export interface ToastConfig {
  duration?: number
  x?: number
  y?: number
  color?: string
  fontSize?: string
}

export class ToastNotification {
  private scene: Phaser.Scene
  private animationManager: AnimationManager

  constructor(scene: Phaser.Scene, animationManager: AnimationManager) {
    this.scene = scene
    this.animationManager = animationManager
  }

  show(message: string, config: ToastConfig = {}): void {
    const defaults: ToastConfig = {
      duration: 3000,
      x: this.scene.cameras.main.width - 150,
      y: 50,
      color: '#fff',
      fontSize: '16px',
    }

    const finalConfig = { ...defaults, ...config }

    const text = this.scene.add
      .text(finalConfig.x!, finalConfig.y!, message, {
        fontSize: finalConfig.fontSize,
        color: finalConfig.color,
        fontFamily: 'Arial',
        backgroundColor: '#333',
        padding: { x: 15, y: 10 },
        align: 'center',
      })
      .setOrigin(1, 0)
      .setDepth(1000)
      .setAlpha(0)

    // Slide in
    this.animationManager.slideIn(text, { x: finalConfig.x! + 50, y: finalConfig.y! }, { duration: 200 })

    // Auto-hide
    this.scene.time.delayedCall(finalConfig.duration!, () => {
      this.animationManager.scaleFadeOut(text, { duration: 200, onComplete: () => text.destroy() })
    })
  }

  success(message: string, config: ToastConfig = {}): void {
    this.show(message, { ...config, color: '#4ade80' })
  }

  error(message: string, config: ToastConfig = {}): void {
    this.show(message, { ...config, color: '#ef4444' })
  }

  warning(message: string, config: ToastConfig = {}): void {
    this.show(message, { ...config, color: '#f59e0b' })
  }

  info(message: string, config: ToastConfig = {}): void {
    this.show(message, { ...config, color: '#3b82f6' })
  }
}
