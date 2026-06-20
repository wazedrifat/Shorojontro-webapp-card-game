# Environment Setup Guide

## ✅ Installed & Verified

Your development environment is **ready to go**! Here's what's been set up:

### System Requirements
- ✅ **Node.js**: v22.18.0
- ✅ **npm**: 11.5.2

### Project Installation
- ✅ **Dependencies installed**: 195 packages
- ✅ **TypeScript configuration**: Strict mode enabled
- ✅ **Build system**: Vite 5.x configured and tested
- ✅ **Type checking**: Passing (0 errors)
- ✅ **Production build**: Tested and working

## Quick Start

### Development Server
```bash
npm run dev
```
Starts Vite dev server on `http://localhost:3000` with hot-reload enabled.

### Type Checking
```bash
npm run type-check
```
Validates TypeScript types (run before committing).

### Production Build
```bash
npm run build
```
Creates optimized build in `dist/` folder.

### Preview Build
```bash
npm run preview
```
Serves the production build locally for testing.

### Linting
```bash
npm run lint
```
Checks code quality with ESLint.

## Project Structure

```
shorojontro-webapp/
├── src/
│   ├── main.ts                     # Entry point
│   ├── scenes/                     # Phaser scenes
│   │   ├── PreloadScene.ts        # Asset/i18n loading
│   │   ├── MenuScene.ts           # Language & game start
│   │   ├── GameScene.ts           # Main gameplay
│   │   └── GameOverScene.ts       # End screen
│   ├── game/                       # Game logic
│   │   ├── GameEngine.ts          # Core game loop
│   │   ├── Player.ts              # Player state
│   │   ├── AIBot.ts               # AI logic
│   │   ├── Card.ts                # Character definitions
│   │   └── GameRules.ts           # Rule validation
│   ├── ui/                         # UI components
│   │   ├── AnimationManager.ts    # Reusable animations
│   │   └── ToastNotification.ts   # Toast messages
│   ├── localization/               # i18n
│   │   ├── i18n.ts                # Manager
│   │   └── translations/
│   │       ├── bd.json            # বাংলা
│   │       └── en.json            # English
│   ├── utils/                      # Utilities
│   │   ├── constants.ts           # Game constants
│   │   └── helpers.ts             # Helper functions
│   └── assets/                     # Asset registry
│       └── assetRegistry.ts       # Card/token management
├── public/                         # Static assets (for photos)
│   └── assets/cards/photos/       # Place card photos here
├── dist/                           # Production build (git-ignored)
├── node_modules/                   # Dependencies (git-ignored)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.json
├── .npmrc
├── .gitignore
└── index.html
```

## Asset Management

### Using Physical Card Photos

To add photos of your cards to the game:

1. **Prepare photos**: High-quality images of your physical cards
   - Format: PNG, JPG, or WebP
   - Dimensions: ~200x300px (standard card size)
   - Recommended: 72 DPI, under 500KB each

2. **Place files**: Create the directory and add photos:
   ```
   public/assets/cards/photos/
   ├── veerVikram.jpg
   ├── kaluDakayt.jpg
   ├── petukchandra.jpg
   └── ... (one per character)
   ```

3. **Register in code**: Update `src/assets/assetRegistry.ts`:
   ```typescript
   import { registerPhotoAssets } from '@assets/assetRegistry'
   
   const photoMappings = {
     veerVikram: '/assets/cards/photos/veerVikram.jpg',
     kaluDakayt: '/assets/cards/photos/kaluDakayt.jpg',
     // ... etc
   }
   
   const customAssets = registerPhotoAssets(photoMappings)
   ```

4. **Load in PreloadScene**: The scene will automatically use registered photos instead of placeholders.

### Placeholder Mode

Until you add photos, the game uses generated placeholder cards. This is perfect for development and testing!

## Configuration Files

### `.npmrc`
Ensures consistent npm behavior:
- Sets registry to official npm
- Handles legacy peer dependencies

### `tsconfig.json`
TypeScript strict mode with path aliases:
- `@/*` → `src/*`
- `@scenes/*` → `src/scenes/*`
- `@game/*` → `src/game/*`
- etc.

### `vite.config.ts`
Optimized for game development:
- Path aliases for clean imports
- Dev server on port 3000
- Production minification with Terser
- Phaser pre-bundling

## Localization

### Adding Translations

Edit the JSON files in `src/localization/translations/`:

**bd.json** (বাংলা):
```json
{
  "characters": {
    "veerVikram": {
      "name": "বীর বিক্রম",
      "ability": "বীরত্ব ভাতা",
      "description": "ব্যাংক থেকে ৩ টি মুদ্রা নিন"
    }
  }
}
```

**en.json** (English):
```json
{
  "characters": {
    "veerVikram": {
      "name": "Veer Vikram",
      "ability": "Warrior's Stipend",
      "description": "Take 3 coins from the bank"
    }
  }
}
```

### Using Translations in Code

```typescript
import { i18n } from '@localization/i18n'

// Set language
i18n.setLanguage('bd') // or 'en'

// Get translations
const name = i18n.character('veerVikram', 'name')
const ability = i18n.character('veerVikram', 'ability')
const uiText = i18n.t('play', 'ui')
```

## Git Workflow

### Initial Setup (Already Done)
```bash
git add .
git commit -m "feat: Initialize Shorojontro project with Phaser 3, TypeScript, and localization"
git push origin main
```

### Development Workflow
```bash
# Before committing
npm run type-check
npm run lint

# Create feature branches
git checkout -b feature/gameplay-logic

# Commit with meaningful messages
git commit -m "feat: Implement turn structure and action validation"

# Push and create PR
git push origin feature/gameplay-logic
```

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- --port 3001
```

### Module Not Found Errors
- Check tsconfig.json path aliases
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

### Type Errors
```bash
npm run type-check
```
Shows exact errors with line numbers. Fix before committing.

### Slow npm Operations
The `devdir` warning is harmless. To suppress:
```bash
npm config set devdir ~/.npm-devdir
```

## Next Steps

1. **Start dev server**: `npm run dev`
2. **Create your first feature branch**: `git checkout -b feature/core-gameplay`
3. **Implement game logic** following the modular architecture
4. **Add photos** of your physical cards when ready
5. **Test thoroughly** with `npm run type-check` before commits

---

**Ready to code!** The foundation is solid and following TypeScript, Phaser, and architecture best practices. Good luck building Shorojontro! 🎮
