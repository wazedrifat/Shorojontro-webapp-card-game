/**
 * Card SVG Generator
 * Creates unique visual representations for each character
 */

import { getCharacterByKey } from '@game/Card'
import { i18n } from '@localization/i18n'

const CHARACTER_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  veerVikram: { bg: '#8B4513', text: '#FFD700', icon: '⚔️' },
  kaluDakayt: { bg: '#2C3E50', text: '#E74C3C', icon: '🗡️' },
  petukchandra: { bg: '#27AE60', text: '#F39C12', icon: '📜' },
  jinnerBadshah: { bg: '#8E44AD', text: '#9B59B6', icon: '👑' },
  mamdoHomdho: { bg: '#C0392B', text: '#ECF0F1', icon: '🍖' },
  putuulRaj: { bg: '#E67E22', text: '#34495E', icon: '🎭' },
  bokhdoity: { bg: '#34495E', text: '#E74C3C', icon: '💀' },
  chichkeChhor: { bg: '#16A085', text: '#ECF0F1', icon: '🏃' },
  arun: { bg: '#2980B9', text: '#ECF0F1', icon: '🔍' },
  nantuMiya: { bg: '#F39C12', text: '#2C3E50', icon: '💰' },
  betalPrataraj: { bg: '#C0392B', text: '#ECF0F1', icon: '👻' },
}

export function generateCardSVG(characterKey: string, width: number = 120, height: number = 180): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('width', width.toString())
  svg.setAttribute('height', height.toString())

  const colors = CHARACTER_COLORS[characterKey] || { bg: '#555', text: '#fff', icon: '?' }
  const character = getCharacterByKey(characterKey)

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bg.setAttribute('width', width.toString())
  bg.setAttribute('height', height.toString())
  bg.setAttribute('fill', colors.bg)
  bg.setAttribute('stroke', colors.text)
  bg.setAttribute('stroke-width', '2')
  svg.appendChild(bg)

  // Icon/Emoji
  const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  iconText.setAttribute('x', (width / 2).toString())
  iconText.setAttribute('y', (height / 3).toString())
  iconText.setAttribute('text-anchor', 'middle')
  iconText.setAttribute('font-size', '40')
  iconText.setAttribute('dominant-baseline', 'middle')
  iconText.textContent = colors.icon
  svg.appendChild(iconText)

  // Character name
  const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  nameText.setAttribute('x', (width / 2).toString())
  nameText.setAttribute('y', (height * 0.7).toString())
  nameText.setAttribute('text-anchor', 'middle')
  nameText.setAttribute('font-size', '11')
  nameText.setAttribute('font-weight', 'bold')
  nameText.setAttribute('fill', colors.text)
  nameText.setAttribute('font-family', 'Arial')
  nameText.textContent = character ? i18n.character(characterKey, 'name').substring(0, 10) : characterKey
  svg.appendChild(nameText)

  return svg
}

export function generateBackSVG(width: number = 120, height: number = 180): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('width', width.toString())
  svg.setAttribute('height', height.toString())

  // Background pattern
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bg.setAttribute('width', width.toString())
  bg.setAttribute('height', height.toString())
  bg.setAttribute('fill', '#4a4a4a')
  bg.setAttribute('stroke', '#666')
  bg.setAttribute('stroke-width', '2')
  svg.appendChild(bg)

  // Pattern
  for (let i = 0; i < 6; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', '0')
    line.setAttribute('y1', (i * 30).toString())
    line.setAttribute('x2', width.toString())
    line.setAttribute('y2', (i * 30).toString())
    line.setAttribute('stroke', '#666')
    line.setAttribute('stroke-width', '1')
    svg.appendChild(line)
  }

  // "?" symbol
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  text.setAttribute('x', (width / 2).toString())
  text.setAttribute('y', (height / 2).toString())
  text.setAttribute('text-anchor', 'middle')
  text.setAttribute('font-size', '60')
  text.setAttribute('font-weight', 'bold')
  text.setAttribute('fill', '#888')
  text.setAttribute('dominant-baseline', 'middle')
  text.textContent = '?'
  svg.appendChild(text)

  return svg
}
