import Phaser from 'phaser'
import { PreloadScene } from '@scenes/PreloadScene'
import { MenuScene } from '@scenes/MenuScene'
import { GameScene } from '@scenes/GameScene'
import { GameOverScene } from '@scenes/GameOverScene'

console.log('[main.ts] Starting Shorojontro game initialization')

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#0a0e27',
  parent: 'game',
  render: {
    pixelArt: false,
    antialias: true,
    transparent: false,
  },
  scene: [PreloadScene, MenuScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: true,
    fullscreenTarget: 'parent',
  },
}

console.log('[main.ts] Phaser config created:', config)
console.log('[main.ts] Creating Phaser game instance')

const game = new Phaser.Game(config)

console.log('[main.ts] Phaser game instance created:', game)
console.log('[main.ts] Current scene:', game.scene.keys)

// Handle window resize
window.addEventListener('resize', () => {
  console.log('[main.ts] Window resized')
  game.scale.resize(window.innerWidth, window.innerHeight)
})

console.log('[main.ts] Game initialization complete')
