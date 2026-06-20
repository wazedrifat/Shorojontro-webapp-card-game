/**
 * Animation Manager
 * Centralized animation library following consistency principles
 */

import Phaser from 'phaser'

export interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string | ((t: number) => number)
  onComplete?: () => void
}

export class AnimationManager {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /**
   * Scale fade in (for UI panels)
   * 95% -> 100% scale with fade in
   */
  scaleFadeIn(target: Phaser.GameObjects.GameObject, config: AnimationConfig = {}): Phaser.Tweens.Tween {
    const defaults = {
      duration: 150,
      ease: Phaser.Math.Easing.Quadratic.Out,
    }

    return this.scene.tweens.add({
      targets: target,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.95, to: 1 },
      ...defaults,
      ...config,
    })
  }

  /**
   * Scale fade out (for UI panels)
   * 100% -> 95% scale with fade out
   */
  scaleFadeOut(target: Phaser.GameObjects.GameObject, config: AnimationConfig = {}): Phaser.Tweens.Tween {
    const defaults = {
      duration: 150,
      ease: Phaser.Math.Easing.Quadratic.In,
    }

    return this.scene.tweens.add({
      targets: target,
      alpha: { from: 1, to: 0 },
      scale: { from: 1, to: 0.95 },
      ...defaults,
      ...config,
    })
  }

  /**
   * Pulse effect (for status changes)
   * Scale 1 -> 1.1 -> 1 over duration
   */
  pulse(target: Phaser.GameObjects.GameObject, config: AnimationConfig = {}): Phaser.Tweens.Tween {
    const defaults = {
      duration: 200,
      ease: Phaser.Math.Easing.Sine.InOut,
    }

    return this.scene.tweens.add({
      targets: target,
      scale: { from: 1, to: 1.1 },
      yoyo: true,
      ...defaults,
      ...config,
    })
  }

  /**
   * Squash effect (for button press)
   * Scale to 0.95 briefly
   */
  squash(target: Phaser.GameObjects.GameObject, config: AnimationConfig = {}): Phaser.Tweens.Tween {
    const defaults = {
      duration: 100,
      ease: Phaser.Math.Easing.Quadratic.InOut,
    }

    return this.scene.tweens.add({
      targets: target,
      scale: { from: 1, to: 0.95 },
      yoyo: true,
      ...defaults,
      ...config,
    })
  }

  /**
   * Card flip animation
   * Scales width to 0, changes texture, scales back to 1
   */
  flipCard(
    target: Phaser.GameObjects.Sprite,
    onFlip: () => void,
    config: AnimationConfig = {}
  ): Phaser.Tweens.Tween {
    const defaults = {
      duration: 150,
      ease: Phaser.Math.Easing.Linear,
    }

    const tween1 = this.scene.tweens.add({
      targets: target,
      scaleX: 0.01,
      ...defaults,
      ...config,
      onComplete: () => {
        onFlip()

        this.scene.tweens.add({
          targets: target,
          scaleX: 1,
          ...defaults,
          ...config,
        })
      },
    })

    return tween1
  }

  /**
   * Slide in from direction
   */
  slideIn(
    target: Phaser.GameObjects.GameObject,
    from: { x?: number; y?: number },
    config: AnimationConfig = {}
  ): Phaser.Tweens.Tween {
    const defaults = {
      duration: 200,
      ease: Phaser.Math.Easing.Quadratic.Out,
    }

    const sprite = target as any
    sprite.setPosition(from.x ?? sprite.x, from.y ?? sprite.y)

    return this.scene.tweens.add({
      targets: target,
      x: sprite.x,
      y: sprite.y,
      ...defaults,
      ...config,
    })
  }

  /**
   * Shake effect (for error/block)
   */
  shake(target: Phaser.GameObjects.GameObject, config: AnimationConfig = {}): Phaser.Tweens.Tween {
    const defaults = {
      duration: 150,
      ease: Phaser.Math.Easing.Linear,
    }

    return this.scene.tweens.add({
      targets: target,
      x: `+=10`,
      yoyo: true,
      repeat: 2,
      ...defaults,
      ...config,
    })
  }

  /**
   * Move to position smoothly
   */
  moveTo(
    target: Phaser.GameObjects.GameObject,
    to: { x: number; y: number },
    config: AnimationConfig = {}
  ): Phaser.Tweens.Tween {
    const defaults = {
      duration: 300,
      ease: Phaser.Math.Easing.Quadratic.InOut,
    }

    return this.scene.tweens.add({
      targets: target,
      ...to,
      ...defaults,
      ...config,
    })
  }

  /**
   * Staggered animation sequence
   */
  stagger(
    targets: Phaser.GameObjects.GameObject[],
    properties: any,
    config: AnimationConfig = {}
  ): Phaser.Tweens.Tween {
    const defaults = {
      duration: 200,
      ease: Phaser.Math.Easing.Quadratic.Out,
      stagger: 50,
    }

    return this.scene.tweens.add({
      targets,
      ...properties,
      ...defaults,
      ...config,
    })
  }
}
