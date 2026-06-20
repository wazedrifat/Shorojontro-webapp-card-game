/**
 * Audio Manager
 * Handles game sounds and music
 */

export type SoundEffect = 'cardDraw' | 'cardFlip' | 'coin' | 'challenge' | 'block' | 'kill' | 'eliminate'

export class AudioManager {
  private muted: boolean = false
  private volume: number = 0.5

  constructor() {
    // Check if user has sound preference saved
    const savedMuted = localStorage.getItem('shorojontro-muted')
    if (savedMuted) {
      this.muted = JSON.parse(savedMuted)
    }

    const savedVolume = localStorage.getItem('shorojontro-volume')
    if (savedVolume) {
      this.volume = parseFloat(savedVolume)
    }
  }

  play(sound: SoundEffect): void {
    if (this.muted) return

    // Generate sound programmatically or use placeholder
    console.log(`Playing sound: ${sound} (volume: ${this.volume})`)

    // In a full implementation, you would use Web Audio API or Phaser sound system
    // For now, we just log
  }

  playMusic(trackName: string): void {
    if (this.muted) return
    console.log(`Playing music: ${trackName}`)
  }

  stopMusic(): void {
    console.log('Music stopped')
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    localStorage.setItem('shorojontro-muted', JSON.stringify(muted))
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('shorojontro-volume', this.volume.toString())
  }

  getMuted(): boolean {
    return this.muted
  }

  getVolume(): number {
    return this.volume
  }
}
