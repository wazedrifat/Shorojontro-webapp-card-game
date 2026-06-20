import Phaser from 'phaser'
import { PreloadScene } from '@scenes/PreloadScene'
import { MenuScene } from '@scenes/MenuScene'
import { GameScene } from '@scenes/GameScene'
import { GameOverScene } from '@scenes/GameOverScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#0a0e27',
  render: {
    pixelArt: false,
    antialias: true,
  },
  scene: [PreloadScene, MenuScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

const game = new Phaser.Game(config)

// Handle window resize
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight)
})
