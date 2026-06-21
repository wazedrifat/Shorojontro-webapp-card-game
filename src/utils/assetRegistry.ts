/**
 * Character Key to Phaser Texture Key Mapping
 */

export const CHARACTER_TEXTURE_MAP: Record<string, string> = {
  veerVikram: 'char_veerVikram',
  kaluDakayt: 'char_kaluDakayt',
  petukchandra: 'char_petukchandra',
  jinnerBadshah: 'char_jinnerBadshah',
  mamdoHomdho: 'char_mamdoHomdho',
  putuulRaj: 'char_putuulRaj',
  bokhdoity: 'char_bokhdoity',
  chichkeChhor: 'char_chichkeChhor',
  arun: 'char_arun',
  nantuMiya: 'char_nantuMiya',
  betalPrataraj: 'char_betalPrataraj',
}

export function getCharacterTexture(characterKey: string): string {
  return CHARACTER_TEXTURE_MAP[characterKey] || 'card_backside'
}

export function getCardBacksideTexture(): string {
  return 'card_backside'
}

// Coin texture keys
export const COIN_TEXTURES = {
  coin: 'coin_regular',
  coinJin: 'coin_jin',
  coinKhajna: 'coin_khajna',
  coinPuppet: 'coin_puppet',
}
