/**
 * Constants
 * Game-wide constants and configuration
 */

// Game constants
export const GAME_CONFIG = {
  STARTING_COINS: 2,
  BANK_COINS: 50,
  KILL_COST: 7,
  MANDATORY_KILL_THRESHOLD: 10,
  MAX_HAND_SIZE: 8,
} as const

// Character limits (for default game)
export const CHARACTER_SELECTION = {
  SLAYER_COUNT: 1,
  INCOME_COUNT: 1,
  KNOWLEDGE_COUNT: 1,
  SPECIAL_COUNT: 2,
  TOTAL: 5,
} as const

// Animation timings (in ms)
export const ANIMATION_TIMING = {
  CARD_FLIP: 150,
  UI_TRANSITION: 150,
  PULSE: 200,
  SLIDE: 200,
  LONG_ACTION: 500,
  STAGGER_DELAY: 50,
} as const

// Z-index layers
export const Z_INDEX = {
  BACKGROUND: 0,
  GAME_BOARD: 10,
  CARDS: 20,
  UI_OVERLAY: 100,
  MODAL: 200,
  TOAST: 1000,
} as const

// Colors
export const COLORS = {
  PRIMARY: '#4a9eff',
  SECONDARY: '#2d5a2d',
  SUCCESS: '#4ade80',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  BACKGROUND: '#0a0e27',
  DARK: '#0f172a',
  LIGHT: '#e0e0e0',
  MUTED: '#888',
} as const
