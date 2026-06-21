import Phaser from "phaser";
import { characterCardKeys } from "../assets/assetManifest";

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

    this.runSequence(2).catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Animation sequence failed", error);
    });
  }

  private async runSequence(playerCount: number) {
    await this.animateIntroFlight(27);

    const deck = this.buildDeck();
    await this.shuffleDeck(deck, 5000);
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
    const topCards = deck.slice(-12);
    const shuffleSteps = Math.max(1, Math.floor(durationMs / 320));

    for (let step = 0; step < shuffleSteps; step += 1) {
      const outTweens = topCards.map((card, index) =>
        this.tweenPromise({
          targets: card.sprite,
          x: this.deckPosition.x + Phaser.Math.Between(-160, 160),
          y: this.deckPosition.y + Phaser.Math.Between(-120, 120),
          angle: Phaser.Math.Between(-28, 28),
          scaleX: GameScene.CARD_SCALE * 0.7,
          duration: 160 + index * 6,
          ease: "Sine.easeInOut",
        }),
      );

      await Promise.all(outTweens);

      const backTweens = topCards.map((card, index) =>
        this.tweenPromise({
          targets: card.sprite,
          x: this.deckPosition.x + index * 0.3,
          y: this.deckPosition.y - index * 0.4,
          angle: 0,
          scaleX: GameScene.CARD_SCALE,
          duration: 160 + index * 6,
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

  private getTextResolution() {
    const deviceRatio = window.devicePixelRatio || 1;
    // eslint-disable-next-line no-console
    console.log("Device pixel ratio:", deviceRatio);
    return Math.max(2, deviceRatio);
  }

  private prepareScaledCardTextures() {
    const cardKeys = ["cards/card_backside", ...characterCardKeys];
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
