/**
 * Asset Registry
 * Manages asset loading and references
 * Supports both placeholder generation and real card photos
 */

export interface CardAsset {
  key: string
  source: 'placeholder' | 'photo'
  path?: string
  width?: number
  height?: number
}

export interface AssetRegistry {
  cards: Map<string, CardAsset>
  tokens: Map<string, string>
  ui: Map<string, string>
}

/**
 * Generate a placeholder card image (for development)
 */
export function generatePlaceholderCard(
  characterName: string,
  characterKey: string
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 300

  const ctx = canvas.getContext('2d')!

  // Card background gradient
  const gradient = ctx.createLinearGradient(0, 0, 200, 300)
  gradient.addColorStop(0, '#1a3a52')
  gradient.addColorStop(1, '#0f2438')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 200, 300)

  // Card border
  ctx.strokeStyle = '#4a9eff'
  ctx.lineWidth = 3
  ctx.strokeRect(3, 3, 194, 294)

  // Character name
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(characterName, 100, 40)

  // Character key (for debugging)
  ctx.fillStyle = '#888'
  ctx.font = '12px Arial'
  ctx.fillText(characterKey, 100, 280)

  return canvas
}

/**
 * Generate placeholder token image
 */
export function generatePlaceholderToken(type: 'coin' | 'tax' | 'jinn' | 'puppet'): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64

  const ctx = canvas.getContext('2d')!
  const centerX = 32
  const centerY = 32
  const radius = 28

  // Background circle
  let color = '#ffd700'
  if (type === 'tax') color = '#8b0000'
  if (type === 'jinn') color = '#9370db'
  if (type === 'puppet') color = '#ff69b4'

  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fill()

  // Border
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.stroke()

  // Text
  ctx.fillStyle = '#000'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const labels = {
    coin: '💰',
    tax: 'TAX',
    jinn: 'JINN',
    puppet: 'PUP',
  }
  ctx.fillText(labels[type], centerX, centerY)

  return canvas
}

/**
 * Create default asset registry with placeholders
 */
export function createDefaultAssetRegistry(): AssetRegistry {
  const registry: AssetRegistry = {
    cards: new Map(),
    tokens: new Map(),
    ui: new Map(),
  }

  // Add placeholder cards for all characters
  const characters = [
    'veerVikram',
    'kaluDakayt',
    'petukchandra',
    'jinnerBadshah',
    'mamdoHomdho',
    'putuulRaj',
    'bokhdoity',
    'chichkeChhor',
    'arun',
    'nantuMiya',
    'betalPrataraj',
  ]

  for (const char of characters) {
    registry.cards.set(char, {
      key: char,
      source: 'placeholder',
      width: 200,
      height: 300,
    })
  }

  // Tokens
  registry.tokens.set('coin', 'token-coin')
  registry.tokens.set('tax', 'token-tax')
  registry.tokens.set('jinn', 'token-jinn')
  registry.tokens.set('puppet', 'token-puppet')

  return registry
}

/**
 * Load custom card assets from photos
 * Photos should be placed in: public/assets/cards/photos/
 */
export function registerPhotoAssets(photoMappings: Record<string, string>): Partial<AssetRegistry> {
  const cards = new Map<string, CardAsset>()

  for (const [characterKey, photoPath] of Object.entries(photoMappings)) {
    cards.set(characterKey, {
      key: characterKey,
      source: 'photo',
      path: photoPath,
      width: 200,
      height: 300,
    })
  }

  return { cards }
}
