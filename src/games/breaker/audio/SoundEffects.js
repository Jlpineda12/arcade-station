// Procedural Retro Sound Effects for Pixel Breaker Arcade

export class SoundEffects {
  constructor(synth) {
    this.synth = synth;
    // Pentatonic scale frequencies for dynamic musical combo brick hits
    this.pentatonic = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      1046.50 // C6
    ];
  }

  coinInsert() {
    this.synth.playTone({
      freq: 987.77,
      type: 'square',
      duration: 0.08,
      volume: 0.6,
      bus: 'sfx'
    });
    setTimeout(() => {
      this.synth.playTone({
        freq: 1318.51,
        type: 'square',
        duration: 0.25,
        volume: 0.7,
        bus: 'sfx'
      });
    }, 75);
  }

  menuMove() {
    this.synth.playTone({
      freq: 493.88,
      type: 'square',
      duration: 0.04,
      volume: 0.35,
      bus: 'sfx'
    });
  }

  menuConfirm() {
    this.synth.playTone({
      freq: 587.33,
      type: 'square',
      duration: 0.06,
      volume: 0.5,
      bus: 'sfx'
    });
    setTimeout(() => {
      this.synth.playTone({
        freq: 880.00,
        type: 'square',
        duration: 0.12,
        volume: 0.6,
        bus: 'sfx'
      });
    }, 60);
  }

  // Paddle bounce - crisp metallic rebound
  paddleHit() {
    this.synth.playTone({
      freq: 440,
      type: 'triangle',
      duration: 0.06,
      pitchDrop: 120,
      volume: 0.55
    });
    this.synth.playTone({
      freq: 880,
      type: 'square',
      duration: 0.04,
      volume: 0.35
    });
  }

  // Border wall ricochet
  wallBounce() {
    this.synth.playTone({
      freq: 320,
      type: 'square',
      duration: 0.03,
      volume: 0.3
    });
  }

  // Melodic brick hit: scale note rises with consecutive combos without touching paddle
  brickHit(combo = 0) {
    const idx = Math.min(this.pentatonic.length - 1, combo);
    const freq = this.pentatonic[idx];

    this.synth.playTone({
      freq,
      type: 'square',
      duration: 0.08,
      volume: 0.5
    });
  }

  // Shattered brick explosion
  brickBreak() {
    this.synth.playNoise({
      duration: 0.1,
      volume: 0.45,
      filterFreq: 1600,
      filterType: 'bandpass'
    });
  }

  // Powerup falling spawn sound
  powerupSpawn() {
    this.synth.playTone({
      freq: 600,
      type: 'sine',
      duration: 0.08,
      pitchRise: 250,
      volume: 0.35
    });
  }

  // Powerup collected fanfare
  powerupCollect() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.synth.playTone({
          freq,
          type: 'square',
          duration: 0.07,
          volume: 0.55
        });
      }, idx * 45);
    });
  }

  // Laser cannon fire from paddle
  laserFire() {
    this.synth.playTone({
      freq: 840,
      type: 'sawtooth',
      duration: 0.08,
      pitchDrop: 560,
      volume: 0.45
    });
  }

  // Ball lost below paddle
  ballLost() {
    this.synth.playTone({
      freq: 380,
      type: 'sawtooth',
      duration: 0.3,
      pitchDrop: 240,
      volume: 0.6
    });
    this.synth.playNoise({
      duration: 0.25,
      volume: 0.4,
      filterFreq: 800,
      filterType: 'lowpass'
    });
  }

  // Stage clear fanfare
  levelCleared() {
    const notes = [392, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.synth.playTone({
          freq,
          type: 'square',
          duration: 0.12,
          volume: 0.6
        });
      }, i * 70);
    });
  }

  // Game over theme
  gameOver() {
    const sadNotes = [330, 311.13, 293.66, 261.63];
    sadNotes.forEach((freq, i) => {
      setTimeout(() => {
        this.synth.playTone({
          freq,
          type: 'triangle',
          duration: 0.25,
          volume: 0.6
        });
      }, i * 160);
    });
  }
}
