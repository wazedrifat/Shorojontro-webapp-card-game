import Phaser from "phaser";
import {
  characterActionCardKeys,
  characterCardKeys,
  generalActionCardKeys,
} from "../assets/assetManifest";

type CardSprite = {
  sprite: Phaser.GameObjects.Image;
  faceKey: string;
};

type PlayerAnchor = {
  x: number;
  y: number;
  rotation: number;
};

export class GameScene extends Phaser.Scene {
  private static readonly CARD_SCALE = 1;
  private static readonly CARD_SCALE_FLY = 0.86;
  private static readonly CARD_SCALE_DEAL = 0.95;
  private static readonly CARD_SCALE_FLIP = 1;
  private static readonly COIN_SCALE = 0.102;
  private cardBaseScale = 0.074;
  private cardWidth = 160;
  private cardHeight = 220;
  private deckPosition!: Phaser.Math.Vector2;
  private bankPosition!: Phaser.Math.Vector2;
  private actionButton?: Phaser.GameObjects.Container;
  private actionMenu?: Phaser.GameObjects.Container;
  private actionPanel?: Phaser.GameObjects.Container;
  private actionOverlay?: Phaser.GameObjects.Rectangle;
  private cardPopup?: Phaser.GameObjects.Container;

  constructor() {
    super("GameScene");
  }

  create() {
    const { width, height } = this.scale;
    const textResolution = this.getTextResolution();
    this.cardBaseScale = this.calculateCardBaseScale(width);
    this.prepareScaledCardTextures();
    this.cacheCardDimensions();

    this.add
      .rectangle(width / 2, height / 2, width, height, 0x0b1615, 1)
      .setDepth(-5);

    this.add
      .text(width / 2 - this.cardWidth * 0.9, height / 2 - this.cardHeight * 1.15, "Shorojontro", {
        fontSize: "28px",
        color: "#e9d7a2",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5)
      .setResolution(textResolution);

    this.deckPosition = new Phaser.Math.Vector2(width / 2, height / 2 + 10);
    this.bankPosition = new Phaser.Math.Vector2(
      width / 2 + 220,
      height / 2 + 30,
    );
    this.addPlayerLabels(textResolution);
    this.addActionButton(textResolution);

    this.runSequence(2).catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Animation sequence failed", error);
    });
  }

  private async runSequence(playerCount: number) {
    await this.animateIntroFlight(27);

    const deck = this.buildDeck();
    await this.shuffleDeck(deck, 3000);
    await this.dealCards(deck, playerCount);
    await this.dropCoins(playerCount);
  }

  private buildDeck(): CardSprite[] {
    const chosen = Phaser.Utils.Array.Shuffle([...characterCardKeys]).slice(0, 5);
    const deckKeys = chosen.flatMap((key) => [key, key, key]);
    Phaser.Utils.Array.Shuffle(deckKeys);

    return deckKeys.map((key, index) => {
      const sprite = this.add
        .image(
          this.deckPosition.x + index * 0.3,
          this.deckPosition.y - index * 0.4,
          this.getScaledCardKey("cards/card_backside"),
        )
        .setScale(GameScene.CARD_SCALE)
        .setDepth(10 + index);

      return { sprite, faceKey: this.getScaledCardKey(key) };
    });
  }

  private async animateIntroFlight(cardCount: number) {
    const { width, height } = this.scale;
    const cards = Array.from({ length: cardCount }, (_, index) => {
      const spawnX = Phaser.Math.Between(-200, width + 200);
      const spawnY = Phaser.Math.Between(-200, height + 200);
      return this.add
        .image(spawnX, spawnY, this.getScaledCardKey("cards/card_backside"))
        .setScale(GameScene.CARD_SCALE_FLY)
        .setDepth(index);
    });

    await Promise.all(
      cards.map((card, index) =>
        this.tweenPromise({
          targets: card,
          x: this.deckPosition.x,
          y: this.deckPosition.y,
          angle: Phaser.Math.Between(-30, 30),
          scale: GameScene.CARD_SCALE,
          duration: 800,
          delay: index * 30,
          ease: "Cubic.easeOut",
        }),
      ),
    );

    cards.forEach((card) => card.destroy());
  }

  private async shuffleDeck(deck: CardSprite[], durationMs: number) {
    const topCards = deck;
    const shuffleSteps = Math.max(1, Math.floor(durationMs / 320));

    for (let step = 0; step < shuffleSteps; step += 1) {
      const outTweens = topCards.map((card, index) => {
        const depthIndex = Phaser.Math.Between(-8, 12);
        card.sprite.setDepth(40 + depthIndex);
        return this.tweenPromise({
          targets: card.sprite,
          x: this.deckPosition.x + Phaser.Math.Between(-220, 220),
          y: this.deckPosition.y + Phaser.Math.Between(-170, 170),
          angle: Phaser.Math.Between(-45, 45),
          scaleX: GameScene.CARD_SCALE * Phaser.Math.FloatBetween(0.45, 1.05),
          scaleY: GameScene.CARD_SCALE * Phaser.Math.FloatBetween(0.6, 1.15),
          duration: 200 + index * 6,
          ease: "Sine.easeInOut",
        });
      });

      await Promise.all(outTweens);

      const backTweens = topCards.map((card, index) =>
        this.tweenPromise({
          targets: card.sprite,
          x: this.deckPosition.x + index * 0.3,
          y: this.deckPosition.y - index * 0.4,
          angle: 0,
          scaleX: GameScene.CARD_SCALE,
          scaleY: GameScene.CARD_SCALE,
          duration: 200 + index * 6,
          ease: "Sine.easeInOut",
        }),
      );

      await Promise.all(backTweens);
    }

    deck.forEach((card, index) => {
      card.sprite.setPosition(
        this.deckPosition.x + index * 0.3,
        this.deckPosition.y - index * 0.4,
      );
      card.sprite.setScale(GameScene.CARD_SCALE);
      card.sprite.setAngle(0);
    });
  }

  private async dealCards(deck: CardSprite[], playerCount: number) {
    const anchors = this.getPlayerAnchors(playerCount);
    const dealOrder: Array<{ card: CardSprite; playerIndex: number }> = [];

    for (let cardIndex = 0; cardIndex < 2; cardIndex += 1) {
      for (let playerIndex = 0; playerIndex < playerCount; playerIndex += 1) {
        const card = deck.pop();
        if (card) {
          dealOrder.push({ card, playerIndex });
        }
      }
    }

    for (const [index, deal] of dealOrder.entries()) {
      const anchor = anchors[deal.playerIndex];
      const cardIndexForPlayer = Math.floor(index / playerCount);
      const cardWidth = deal.card.sprite.displayWidth;
      const overlapRatio = 0.05;
      const spacing = cardWidth * (1 - overlapRatio);
      const offset = (cardIndexForPlayer === 0 ? -1 : 1) * spacing * 0.5;
      const sideX = anchor.x + offset;
      const sideY = anchor.y;
      const spreadAngle = cardIndexForPlayer === 0 ? -3 : 3;

      await this.tweenPromise({
        targets: deal.card.sprite,
        x: sideX,
        y: sideY,
        angle: Phaser.Math.RadToDeg(anchor.rotation) + spreadAngle,
        scale: GameScene.CARD_SCALE_DEAL,
        duration: 450,
        delay: index * 80,
        ease: "Cubic.easeOut",
      });

      if (deal.playerIndex === 0) {
        this.time.delayedCall(2000, () => {
          void this.flipCard(deal.card.sprite, deal.card.faceKey);
        });
        deal.card.sprite.setInteractive({ useHandCursor: true });
        deal.card.sprite.on("pointerdown", () => {
          this.showCardPopup(deal.card.faceKey);
        });
      }
    }

    deck.forEach((card, index) => {
      card.sprite.setPosition(
        this.deckPosition.x - index * 0.45,
        this.deckPosition.y + index * 0.35,
      );
      card.sprite.setDepth(10 + index);
    });
  }

  private async dropCoins(playerCount: number) {
    const coins: Phaser.GameObjects.Image[] = [];
    const cardTexture = this.textures.get(this.getScaledCardKey("cards/card_backside"));
    const cardSource = cardTexture?.getSourceImage() as
      | HTMLImageElement
      | HTMLCanvasElement
      | undefined;
    const cardWidth = cardSource?.width ?? 160;
    for (let i = 0; i < 50; i += 1) {
      const coin = this.add
        .image(this.deckPosition.x, -80, "cards/coins/coin")
        .setScale(GameScene.COIN_SCALE)
        .setDepth(20 + i);
      coins.push(coin);

      this.tweens.add({
        targets: coin,
        x: this.bankPosition.x + Phaser.Math.Between(-50, 50),
        y: this.bankPosition.y + Phaser.Math.Between(-30, 30),
        angle: Phaser.Math.Between(-40, 40),
        duration: 700,
        delay: i * 20,
        ease: "Back.easeOut",
      });
    }

    await this.delay(1400);

    const anchors = this.getPlayerAnchors(playerCount);
    const payoutCoins = coins.slice(0, playerCount * 2);

    await Promise.all(
      payoutCoins.map((coin, index) => {
        const playerIndex = Math.floor(index / 2);
        const anchor = anchors[playerIndex];
        const offset = index % 2 === 0 ? -18 : 18;
        const coinBaseX = anchor.x + Math.max(cardWidth * 1.2, this.scale.width * 0.08);
        return this.tweenPromise({
          targets: coin,
          x: coinBaseX + offset,
          y: anchor.y,
          scale: GameScene.COIN_SCALE * 1.15,
          duration: 600,
          delay: index * 120,
          ease: "Cubic.easeOut",
        });
      }),
    );
  }

  private getPlayerAnchors(playerCount: number): PlayerAnchor[] {
    const { width, height } = this.scale;
    const anchors: PlayerAnchor[] = [];
    const radiusX = width * 0.35;
    const radiusY = height * 0.35;

    for (let i = 0; i < playerCount; i += 1) {
      const angleDeg = 90 + i * (360 / playerCount);
      const angleRad = Phaser.Math.DegToRad(angleDeg);
      const x = width / 2 + Math.cos(angleRad) * radiusX;
      const y = height / 2 + Math.sin(angleRad) * radiusY;
      const rotation = y > height / 2 ? 0 : Math.PI;
      anchors.push({ x, y, rotation });
    }

    return anchors;
  }

  private async flipCard(card: Phaser.GameObjects.Image, faceKey: string) {
    await this.tweenPromise({
      targets: card,
      scaleX: 0,
      duration: 180,
      ease: "Sine.easeIn",
    });
    card.setTexture(faceKey);
    await this.tweenPromise({
      targets: card,
      scaleX: GameScene.CARD_SCALE_FLIP,
      duration: 200,
      ease: "Sine.easeOut",
    });
  }

  private addPlayerLabels(textResolution: number) {
    const anchors = this.getPlayerAnchors(2);
    anchors.forEach((anchor, index) => {
      this.add
        .text(
          anchor.x - Math.max(this.cardWidth * 1.4, this.scale.width * 0.1),
          anchor.y,
          `Player ${index + 1}`,
          {
          fontSize: "18px",
          color: "#e9d7a2",
          },
        )
        .setOrigin(1, 0.5)
        .setResolution(textResolution);
    });
  }

  private addActionButton(textResolution: number) {
    const { width, height } = this.scale;
    const buttonWidth = Math.max(160, width * 0.12);
    const buttonHeight = 46;
    const x = width * 0.08;
    const y = height * 0.5;

    const buttonBg = this.add
      .rectangle(0, 0, buttonWidth, buttonHeight, 0x1b2c2a, 0.9)
      .setStrokeStyle(2, 0xd7c48f, 0.9)
      .setOrigin(0.5);
    const buttonText = this.add
      .text(0, 0, "Action", {
        fontSize: "18px",
        color: "#f0e2b8",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setResolution(textResolution);

    const container = this.add.container(x, y, [buttonBg, buttonText]);
    container.setSize(buttonWidth, buttonHeight);
    container.setInteractive(
      new Phaser.Geom.Rectangle(
        -buttonWidth / 2,
        -buttonHeight / 2,
        buttonWidth,
        buttonHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );

    container.on("pointerdown", () => {
      this.toggleActionMenu(textResolution);
    });

    container.on("pointerover", () => {
      buttonBg.setFillStyle(0x243b37, 0.95);
    });
    container.on("pointerout", () => {
      buttonBg.setFillStyle(0x1b2c2a, 0.9);
    });

    this.actionButton = container;
  }

  private toggleActionMenu(textResolution: number) {
    if (this.actionMenu) {
      this.actionMenu.destroy(true);
      this.actionMenu = undefined;
      return;
    }

    const { width, height } = this.scale;
    const menuWidth = Math.max(220, width * 0.16);
    const menuHeight = 140;
    const x = width * 0.08;
    const y = height * 0.5 + 70;

    const menuBg = this.add
      .rectangle(0, 0, menuWidth, menuHeight, 0x0f1f1d, 0.95)
      .setStrokeStyle(2, 0xd7c48f, 0.85)
      .setOrigin(0.5);

    const generalBtn = this.buildMenuButton(
      0,
      -30,
      "General Action",
      textResolution,
      () => this.openActionPanel("general", textResolution),
    );
    const characterBtn = this.buildMenuButton(
      0,
      30,
      "Character Action",
      textResolution,
      () => this.openActionPanel("character", textResolution),
    );

    const menu = this.add.container(x, y, [menuBg, generalBtn, characterBtn]);
    menu.setDepth(50);
    menu.scale = 0.9;
    this.tweens.add({
      targets: menu,
      scale: 1,
      duration: 180,
      ease: "Back.easeOut",
    });

    this.actionMenu = menu;
  }

  private buildMenuButton(
    x: number,
    y: number,
    label: string,
    textResolution: number,
    onClick: () => void,
  ) {
    const width = 180;
    const height = 38;
    const bg = this.add
      .rectangle(0, 0, width, height, 0x223935, 0.9)
      .setStrokeStyle(1, 0xdbc894, 0.8)
      .setOrigin(0.5);
    const text = this.add
      .text(0, 0, label, {
        fontSize: "16px",
        color: "#f3e7c2",
      })
      .setOrigin(0.5)
      .setResolution(textResolution);

    const container = this.add.container(x, y, [bg, text]);
    container.setSize(width, height);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on("pointerover", () => bg.setFillStyle(0x2b4843, 1));
    container.on("pointerout", () => bg.setFillStyle(0x223935, 0.9));
    container.on("pointerdown", () => onClick());
    return container;
  }

  private openActionPanel(
    type: "general" | "character",
    textResolution: number,
  ) {
    if (this.actionPanel) {
      this.actionPanel.destroy(true);
    }

    if (this.actionMenu) {
      this.actionMenu.destroy(true);
      this.actionMenu = undefined;
    }

    const { width, height } = this.scale;
    const overlay = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.55)
      .setInteractive()
      .setDepth(500);
    this.actionOverlay = overlay;

    const panelWidth = Math.min(width * 0.72, 900);
    const panelHeight = Math.min(height * 0.62, 560);
    const panelBg = this.add
      .rectangle(0, 0, panelWidth, panelHeight, 0x132220, 0.96)
      .setStrokeStyle(2, 0xd7c48f, 0.9)
      .setOrigin(0.5);

    const title = this.add
      .text(0, -panelHeight / 2 + 26, `${type === "general" ? "General" : "Character"} Actions`, {
        fontSize: "22px",
        color: "#f3e7c2",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setResolution(textResolution);

    const closeBtn = this.add
      .text(panelWidth / 2 - 24, -panelHeight / 2 + 18, "✕", {
        fontSize: "20px",
        color: "#f3e7c2",
      })
      .setOrigin(0.5)
      .setResolution(textResolution);

    closeBtn.setInteractive({ useHandCursor: true });
    const closePanel = () => {
      this.actionPanel?.destroy(true);
      this.actionPanel = undefined;
      this.actionOverlay?.destroy();
      this.actionOverlay = undefined;
    };

    closeBtn.on("pointerdown", closePanel);
    overlay.on("pointerdown", closePanel);

    const cardKeys =
      type === "general" ? generalActionCardKeys : characterActionCardKeys;
    const deckKeys = Phaser.Utils.Array.Shuffle([...cardKeys]);
    const deckX = panelWidth * 0.16;
    const deckY = panelHeight * 0.05;
    const activeX = 0;
    const activeY = 30;
    const cardMaxWidth = panelWidth * 0.32;
    const cardScale = cardMaxWidth / this.cardWidth;

    const stackSize = 3;
    const getStackKey = (index: number) => {
      const offset = stackSize - index;
      return deckKeys[offset % deckKeys.length];
    };

    const stackSprites = Array.from({ length: stackSize }, (_, index) =>
      this.add
        .image(
          deckX + index * 6,
          deckY + index * 6,
          this.getScaledCardKey(getStackKey(index)),
        )
        .setScale(cardScale * (1 - index * 0.03))
        .setAngle(-6 + index * 2)
        .setDepth(index),
    );

    const activeCard = this.add
      .image(activeX, activeY, this.getScaledCardKey(deckKeys[0]))
      .setScale(cardScale)
      .setInteractive({ useHandCursor: true });

    const updateStackFaces = () => {
      stackSprites.forEach((sprite, index) => {
        sprite.setTexture(this.getScaledCardKey(getStackKey(index)));
      });
    };

    const cycleCard = () => {
      if (deckKeys.length === 0) {
        return;
      }
      const currentKey = deckKeys.shift();
      if (!currentKey) {
        return;
      }
      deckKeys.push(currentKey);
      const nextKey = deckKeys[0];

      this.tweens.add({
        targets: activeCard,
        x: deckX + 20,
        y: deckY + 20,
        angle: -18,
        scale: cardScale * 0.75,
        alpha: 0.4,
        duration: 260,
        ease: "Cubic.easeIn",
        onComplete: () => {
          updateStackFaces();
          activeCard.setTexture(this.getScaledCardKey(nextKey));
          activeCard.setPosition(activeX, activeY);
          activeCard.setAngle(0);
          activeCard.setAlpha(1);
          this.tweens.add({
            targets: activeCard,
            scale: cardScale,
            duration: 260,
            ease: "Back.easeOut",
          });
        },
      });
      // eslint-disable-next-line no-console
      console.log("Selected action card:", currentKey);
    };

    const deckContainer = this.add.container(0, 0, [
      ...stackSprites,
      activeCard,
    ]);

    const showActionDetail = (cardKey: string) => {
      deckContainer.setVisible(false);
      nextBtn.setVisible(false);
      const detailCard = this.buildPopupCardSprite(cardKey, panelWidth * 0.5);
      detailCard.setPosition(0, 20);

      const playBtn = this.buildMenuButton(
        panelWidth / 2 - 90,
        panelHeight / 2 - 40,
        "Play",
        textResolution,
        () => {
          // eslint-disable-next-line no-console
          console.log("Play action card:", cardKey);
          this.actionPanel?.destroy(true);
          this.actionPanel = undefined;
          this.actionOverlay?.destroy();
          this.actionOverlay = undefined;
        },
      );

      const backBtn = this.buildMenuButton(
        -panelWidth / 2 + 90,
        panelHeight / 2 - 40,
        "Back",
        textResolution,
        () => {
          detailContainer.destroy(true);
          deckContainer.setVisible(true);
          nextBtn.setVisible(true);
        },
      );

      const detailContainer = this.add.container(0, 0, [
        detailCard,
        playBtn,
        backBtn,
      ]);
      panel.add(detailContainer);
    };

    activeCard.on("pointerdown", () => {
      showActionDetail(deckKeys[0]);
    });
    this.input.on(
      "wheel",
      (_pointer: Phaser.Input.Pointer, _dx: number, dy: number) => {
      if (!this.actionPanel) {
        return;
      }
      if (dy !== 0) {
        cycleCard();
      }
      },
    );

    const nextBtn = this.buildMenuButton(
      panelWidth / 2 - 90,
      panelHeight / 2 - 40,
      "Next",
      textResolution,
      cycleCard,
    );
    const closeHint = this.add
      .text(panelWidth / 2 - 90, panelHeight / 2 - 80, "Tap to close", {
        fontSize: "12px",
        color: "#cbb88a",
      })
      .setOrigin(0.5)
      .setResolution(textResolution);

    const panel = this.add.container(width / 2, height / 2, [
      panelBg,
      title,
      closeBtn,
      deckContainer,
      nextBtn,
      closeHint,
    ]);
    panel.setDepth(510);
    panel.scale = 0.9;
    this.tweens.add({
      targets: panel,
      scale: 1,
      duration: 220,
      ease: "Back.easeOut",
    });

    this.actionPanel = panel;
  }

  private getTextResolution() {
    const deviceRatio = window.devicePixelRatio || 1;
    // eslint-disable-next-line no-console
    console.log("Device pixel ratio:", deviceRatio);
    return Math.max(2, deviceRatio);
  }

  private prepareScaledCardTextures() {
    const cardKeys = [
      "cards/card_backside",
      ...characterCardKeys,
      ...generalActionCardKeys,
      ...characterActionCardKeys,
    ];
    cardKeys.forEach((key) => {
      const scaledKey = this.getScaledCardKey(key);
      if (this.textures.exists(scaledKey)) {
        return;
      }

      const texture = this.textures.get(key);
      const source = texture.getSourceImage() as HTMLImageElement | HTMLCanvasElement;
      if (!source) {
        return;
      }

      const targetWidth = Math.max(1, Math.round(source.width * this.cardBaseScale));
      const targetHeight = Math.max(
        1,
        Math.round(source.height * this.cardBaseScale),
      );

      const canvasTexture = this.textures.createCanvas(
        scaledKey,
        targetWidth,
        targetHeight,
      );
      if (!canvasTexture) {
        return;
      }

      const ctx = canvasTexture.getContext();
      ctx.imageSmoothingEnabled = true;
      if ("imageSmoothingQuality" in ctx) {
        ctx.imageSmoothingQuality = "high";
      }
      ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
      canvasTexture.refresh();
    });
  }

  private getScaledCardKey(key: string) {
    return `${key}__scaled`;
  }

  private showCardPopup(textureKey: string) {
    if (this.cardPopup) {
      this.cardPopup.destroy(true);
    }

    const { width, height } = this.scale;
    const overlay = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setInteractive()
      .setDepth(520);

    const card = this.buildPopupCardSprite(
      textureKey,
      width * 0.86,
      height * 0.86,
    );
    card.setPosition(width / 2, height / 2);

    const popup = this.add.container(0, 0, [overlay, card]);
    popup.setDepth(521);

    overlay.on("pointerdown", () => {
      popup.destroy(true);
      this.cardPopup = undefined;
    });

    this.cardPopup = popup;
  }

  private buildPopupCardSprite(
    textureKey: string,
    maxWidth: number,
    maxHeight?: number,
  ) {
    const texture = this.textures.get(textureKey);
    const source = texture?.getSourceImage() as
      | HTMLImageElement
      | HTMLCanvasElement
      | undefined;
    const width = source?.width ?? this.cardWidth;
    const height = source?.height ?? this.cardHeight;
    const scale = Math.min(1, maxWidth / width);
    const maxScaleByHeight = maxHeight ? maxHeight / height : 1;
    const finalScale = Math.min(scale, maxScaleByHeight);

    return this.add.image(0, 0, textureKey).setScale(finalScale);
  }

  private calculateCardBaseScale(viewportWidth: number) {
    const targetCardWidth = viewportWidth * 0.16;
    const texture = this.textures.get("cards/card_backside");
    const source = texture?.getSourceImage() as HTMLImageElement | HTMLCanvasElement;
    if (!source) {
      return 0.074;
    }
    return Math.min(0.18, Math.max(0.06, targetCardWidth / source.width));
  }

  private cacheCardDimensions() {
    const cardTexture = this.textures.get(this.getScaledCardKey("cards/card_backside"));
    const source = cardTexture?.getSourceImage() as
      | HTMLImageElement
      | HTMLCanvasElement
      | undefined;
    if (source) {
      this.cardWidth = source.width;
      this.cardHeight = source.height;
    }
  }

  private delay(duration: number) {
    return new Promise<void>((resolve) => {
      this.time.delayedCall(duration, () => resolve());
    });
  }

  private tweenPromise(
    config: Phaser.Types.Tweens.TweenBuilderConfig,
  ): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        ...config,
        onComplete: () => resolve(),
      });
    });
  }
}
