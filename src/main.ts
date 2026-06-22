import Phaser from "phaser";
import "./style.css";
import { GameScene } from "./scenes/GameScene";
import { PreloadScene } from "./scenes/PreloadScene";

const config: Phaser.Types.Core.GameConfig & { resolution?: number } = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#0f1d1c",
  render: {
    antialias: true,
    antialiasGL: true,
    pixelArt: false,
    roundPixels: false,
    mipmapFilter: "LINEAR_MIPMAP_LINEAR",
  },
  resolution: Math.max(2, window.devicePixelRatio),
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [PreloadScene, GameScene],
};

new Phaser.Game(config);
