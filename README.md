# ষড়যন্ত্র (Shorojontro) - Card Game

A Bangladeshi social deduction card game built with **Phaser 3**, **TypeScript**, and **Vite**.

## Overview

**Shorojontro** is a fast-paced bluffing and deduction card game where players secretly hold character cards and claim to be any character to perform powerful actions. Challenge opponents, block actions, and eliminate them to become the last player standing.

### Features

- 🎴 10+ unique characters with special abilities
- 🌐 Dual localization: Bangla (বাংলা) and English
- 🤖 Single-player mode with AI bot opponents
- 🎨 Beautiful card animations inspired by Hearthstone and Slay the Spire
- 📱 Responsive design for PC and mobile browsers
- 📸 Support for custom card assets (photos of physical cards)

## Tech Stack

- **Phaser 3** - 2D game framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **ESLint** - Code quality

## Project Structure

```
src/
├── main.ts                    # Entry point
├── scenes/                    # Phaser scenes
│   ├── PreloadScene.ts       # Asset & localization loading
│   ├── MenuScene.ts          # Main menu
│   ├── GameScene.ts          # Core gameplay
│   └── GameOverScene.ts      # End screen
├── game/                      # Game logic
│   ├── GameEngine.ts         # Turn & action resolution
│   ├── Player.ts             # Player state
│   ├── AIBot.ts              # AI logic
│   ├── Card.ts               # Character definitions
│   ├── GameRules.ts          # Rule enforcement
│   └── GameState.ts          # Shared state
├── ui/                        # UI components
│   ├── HandUI.ts             # Card hand rendering
│   ├── BoardUI.ts            # Main board layout
│   ├── CardUI.ts             # Individual card display
│   ├── ActionPanel.ts        # Action selection
│   ├── AnimationManager.ts   # Reusable animations
│   └── ToastNotification.ts  # Notifications
├── localization/              # i18n
│   ├── i18n.ts               # i18n manager
│   └── translations/
│       ├── bd.json           # Bangla
│       └── en.json           # English
├── utils/                     # Utilities
│   ├── constants.ts          # Game constants
│   └── helpers.ts            # Helper functions
└── assets/                    # Asset references & generators
    ├── assetRegistry.ts      # Asset management
    └── placeholders/         # Placeholder generators
```

## Getting Started

### Prerequisites

- Node.js v20+ ([download](https://nodejs.org/))
- npm 11+

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## Development

### Adding Custom Card Assets

To use photos of your physical cards:

1. Place high-quality images in `public/assets/cards/photos/`
2. Update `src/assets/assetRegistry.ts` with card mappings
3. Configure asset loading in `PreloadScene.ts`

Supported formats: PNG, JPG, WebP

### Localization

Add/update translations in `src/localization/translations/`:

```json
{
  "characters": {
    "veerVikram": {
      "name": "বীর বিক্রম",
      "ability": "বীরত্ব ভাতা",
      "description": "ব্যাংক থেকে ৩ নিন"
    }
  }
}
```

## Game Rules

### Objective

Eliminate all other players to win. Last player with at least one unrevealed character card wins.

### Key Mechanics

- **Influence**: Each face-down card represents one life
- **Actions**: Declare character-based or general actions
- **Challenge**: Question if an opponent really has the character they claim
- **Block**: Use character abilities to prevent opponent actions
- **Kill**: With 7+ coins, eliminate an opponent's card

[Full rules in manual-en.md](./manual-en.md) | [সম্পূর্ণ নিয়মকানুন](./manual-bd.md)

## Roadmap

- [x] Project setup
- [ ] Core game engine
- [ ] Single-player gameplay
- [ ] UI/animations
- [ ] Localization
- [ ] Asset pipeline
- [ ] Multiplayer (future)
- [ ] Enhanced AI (future)
- [ ] Tournament mode (future)

## Contributing

This is a personal project, but contributions are welcome! Please open an issue or PR.

## License

[MIT License](./LICENSE)

## Credits

- **Game Design**: Inspired by Coup/Rebellion with Bangladeshi cultural themes
- **Original Cards**: Based on physical card set (photos/artwork)
- **Framework**: Built with [Phaser](https://phaser.io/)

---

Made with ❤️ in Bangladesh
