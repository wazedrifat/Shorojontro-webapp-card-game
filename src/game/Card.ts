/**
 * Character Card Definition
 * Defines all playable characters and their abilities
 */

export type CharacterType = 'slayer' | 'income' | 'knowledge' | 'special'

export interface CharacterAbility {
  key: string
  cost: number
  requiresTarget: boolean
  description: string
}

export interface Character {
  key: string
  name: string
  type: CharacterType
  abilities: CharacterAbility[]
  canBlock: (actionKey: string) => boolean
  blockDescription?: string
}

// Character Definitions
export const CHARACTERS: Record<string, Character> = {
  veerVikram: {
    key: 'veerVikram',
    name: 'Veer Vikram',
    type: 'income',
    abilities: [
      {
        key: 'warriorStipend',
        cost: 0,
        requiresTarget: false,
        description: 'Take 3 coins from the bank',
      },
    ],
    canBlock: () => false,
  },

  kaluDakayt: {
    key: 'kaluDakayt',
    name: 'Kalu Dakayt',
    type: 'special',
    abilities: [
      {
        key: 'robbery',
        cost: 0,
        requiresTarget: true,
        description: 'Take 2 coins from a target player',
      },
    ],
    canBlock: (actionKey) => actionKey === 'robbery',
  },

  petukchandra: {
    key: 'petukchandra',
    name: 'Petukchandra',
    type: 'knowledge',
    abilities: [
      {
        key: 'exchange',
        cost: 0,
        requiresTarget: false,
        description: 'Draw 2 cards from deck, return 2 cards',
      },
    ],
    canBlock: () => false,
  },

  jinnerBadshah: {
    key: 'jinnerBadshah',
    name: "Jinn's King",
    type: 'special',
    abilities: [
      {
        key: 'protection',
        cost: 1,
        requiresTarget: false,
        description: 'Take 1 coin and place Jinn Token for protection',
      },
    ],
    canBlock: () => false,
  },

  mamdoHomdho: {
    key: 'mamdoHomdho',
    name: 'Mamdo-Homdho',
    type: 'income',
    abilities: [
      {
        key: 'grandFeast',
        cost: 0,
        requiresTarget: false,
        description: 'Take 8 coins from bank. Pay 1 to each player who also claims Mamdo',
      },
    ],
    canBlock: () => false,
  },

  putuulRaj: {
    key: 'putuulRaj',
    name: 'Puppet King',
    type: 'special',
    abilities: [
      {
        key: 'puppetScheme',
        cost: 0,
        requiresTarget: true,
        description: 'Place puppet tokens linking you and another player',
      },
    ],
    canBlock: () => false,
  },

  bokhdoity: {
    key: 'bokhdoity',
    name: 'Bokhdoity',
    type: 'slayer',
    abilities: [
      {
        key: 'neckStrike',
        cost: 0,
        requiresTarget: true,
        description: 'Give target 3 coins and they lose 1 card',
      },
    ],
    canBlock: (actionKey) => actionKey === 'neckStrike',
  },

  chichkeChhor: {
    key: 'chichkeChhor',
    name: 'Chichke Chor',
    type: 'special',
    abilities: [
      {
        key: 'theft',
        cost: 0,
        requiresTarget: false,
        description: 'All other players give you 1 coin each',
      },
    ],
    canBlock: (actionKey) => actionKey === 'theft',
  },

  arun: {
    key: 'arun',
    name: 'Arun',
    type: 'knowledge',
    abilities: [
      {
        key: 'detectiveWork',
        cost: 1,
        requiresTarget: false,
        description: 'Look at cards from deck. Pay per additional card viewed',
      },
    ],
    canBlock: () => false,
  },

  nantuMiya: {
    key: 'nantuMiya',
    name: 'Nantu Miya',
    type: 'special',
    abilities: [
      {
        key: 'taxScheme',
        cost: 0,
        requiresTarget: true,
        description: 'Place tax tokens on character - players pay 1 coin to use it',
      },
    ],
    canBlock: () => false,
  },

  betalPrataraj: {
    key: 'betalPrataraj',
    name: 'Betel Prataraj',
    type: 'slayer',
    abilities: [
      {
        key: 'invisibility',
        cost: 0,
        requiresTarget: true,
        description: 'Target pays 2 coins or you pay 5 to remove their card',
      },
    ],
    canBlock: () => false,
  },
}

export function getCharacterByKey(key: string): Character | undefined {
  return CHARACTERS[key]
}

export function getCharactersByType(type: CharacterType): Character[] {
  return Object.values(CHARACTERS).filter((char) => char.type === type)
}
