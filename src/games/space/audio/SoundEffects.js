// Procedural Retro Space Sound Effects (SFX)

export class SoundEffects {
  constructor(synth) {
    this.synth = synth;
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

  // Player laser blast (classic 8-bit downward laser sweep)
  laser() {
    this.synth.playTone({
      freq: 920,
      type: 'square',
      duration: 0.09,
      pitchDrop: 680,
      volume: 0.45
    });
  }

  // Alien laser blast (lower pitch)
  alienLaser() {
    this.synth.playTone({
      freq: 380,
      type: 'sawtooth',
      duration: 0.1,
      pitchDrop: 220,
      volume: 0.35
    });
  }

  // Alien exploded
  alienExplode() {
    this.synth.playNoise({
      duration: 0.14,
      volume: 0.55,
      playbackRate: 1.1,
      filterFreq: 1800,
      filterType: 'bandpass'
    });
    this.synth.playTone({
      freq: 220,
      type: 'triangle',
      duration: 0.1,
      pitchDrop: 160,
      volume: 0.45
    });
  }

  // Player ship destroyed (heavy explosion)
  playerExplode() {
    this.synth.playNoise({
      duration: 0.65,
      volume: 0.85,
      playbackRate: 0.65,
      filterFreq: 1200,
      filterType: 'lowpass'
    });
    this.synth.playTone({
      freq: 340,
      type: 'sawtooth',
      duration: 0.7,
      pitchDrop: 300,
      volume: 0.75
    });
  }

  // Mystery UFO sound
  ufoSiren() {
    this.synth.playTone({
      freq: 620,
      type: 'sine',
      duration: 0.12,
      pitchRise: 140,
      volume: 0.35
    });
  }

  // Power-up pickup chime
  powerup() {
    const notes = [440.00, 554.37, 659.25, 880.00];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.synth.playTone({
          freq,
          type: 'square',
          duration: 0.08,
          volume: 0.6
        });
      }, idx * 45);
    });
  }

  // Shield deflection
  shieldHit() {
    this.synth.playTone({
      freq: 1200,
      type: 'square',
      duration: 0.06,
      volume: 0.4
    });
  }

  // Smart Bomb screen clear
  bombBlast() {
    this.synth.playNoise({
      duration: 0.8,
      volume: 0.9,
      playbackRate: 0.5,
      filterFreq: 900,
      filterType: 'lowpass'
    });
  }
}
