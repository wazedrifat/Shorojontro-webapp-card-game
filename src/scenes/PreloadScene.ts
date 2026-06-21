import Phaser from "phaser";
import { assetManifest } from "../assets/assetManifest";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    const { width, height } = this.scale;

    const loadingText = this.add
      .text(width / 2, height / 2, "Loading assets...", {
        fontSize: "24px",
        color: "#e9d7a2",
      })
      .setOrigin(0.5);

    this.load.on("progress", (value: number) => {
      loadingText.setText(`Loading assets... ${Math.floor(value * 100)}%`);
    });

    this.load.on("loaderror", (file: Phaser.Loader.File) => {
      // eslint-disable-next-line no-console
      console.error(`Failed to load asset: ${file.key} (${file.src})`);
    });

    this.load.once("complete", () => {
      loadingText.setText("Starting...");
      this.scene.start("GameScene");
    });

    assetManifest.forEach((asset) => {
      this.load.image(asset.key, asset.url);
    });
  }

  create() {}
}
