// Procedural Synthwave / Chiptune Soundtrack for Pixel Breaker Arcade

export class BreakerMusic {
  constructor(synth) {
    this.synth = synth;
    this.isPlaying = false;
    this.currentMode = 'menu'; // 'menu' | 'game'
    this.step = 0;
    this.bar = 0;
    this.timerId = null;

    this.menuBpm = 108;
    this.gameBpm = 124;
    this.currentBpm = this.menuBpm;

    // Frequencies (Hz) for energetic A minor / C major progression
    this.freqs = {
      A1: 55.00, C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00,
      A2: 110.00, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00,
      A3: 220.00, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
      A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25
    };

    // Progression: Am -> F -> C -> G
    this.chords = [
      { bass: 'A2', arp: ['A3', 'C4', 'E4', 'A4'] },
      { bass: 'F2', arp: ['F3', 'A3', 'C4', 'F4'] },
      { bass: 'C2', arp: ['C3', 'E3', 'G3', 'C4'] },
      { bass: 'G2', arp: ['G2', 'B3', 'D4', 'G4'] }
    ];
  }

  start(mode = 'menu') {
    this.currentMode = mode;
    this.currentBpm = mode === 'menu' ? this.menuBpm : this.gameBpm;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.step = 0;
    this.bar = 0;
    this.scheduleTick();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  setMode(mode) {
    this.currentMode = mode;
    this.currentBpm = mode === 'menu' ? this.menuBpm : this.gameBpm;
    if (!this.isPlaying) {
      this.start(mode);
    }
  }

  scheduleTick() {
    if (!this.isPlaying) return;

    const stepMs = (60000 / this.currentBpm) / 4; // 16th notes
    this.tick();

    this.step = (this.step + 1) % 16;
    if (this.step === 0) {
      this.bar = (this.bar + 1) % this.chords.length;
    }

    this.timerId = setTimeout(() => this.scheduleTick(), stepMs);
  }

  tick() {
    if (!this.synth.initialized || this.synth.isMuted) return;

    const chord = this.chords[this.bar];

    // Track 1: Pulsing Octave Bassline
    if (this.step % 2 === 0) {
      const isHighOctave = (this.step % 4 === 2);
      const baseFreq = this.freqs[chord.bass] || 110;
      const freq = isHighOctave ? baseFreq * 2 : baseFreq;

      this.synth.playTone({
        freq,
        type: 'sawtooth',
        duration: 0.1,
        volume: this.currentMode === 'game' ? 0.42 : 0.28,
        bus: 'music'
      });
    }

    // Track 2: 16th Note Arpeggio Lead
    const arpIdx = this.step % chord.arp.length;
    const arpNote = chord.arp[arpIdx];
    const arpFreq = this.freqs[arpNote];
    if (arpFreq) {
      this.synth.playTone({
        freq: arpFreq,
        type: 'square',
        duration: 0.06,
        volume: this.currentMode === 'game' ? 0.28 : 0.2,
        bus: 'music'
      });
    }

    // Track 3: Drum Rhythm
    // Kick on steps 0, 8 (or four-on-the-floor in game mode: 0, 4, 8, 12)
    const isKick = this.currentMode === 'game' ? (this.step % 4 === 0) : (this.step === 0 || this.step === 8);
    if (isKick) {
      this.synth.playTone({
        freq: 120,
        type: 'sine',
        duration: 0.08,
        pitchDrop: 90,
        volume: 0.55,
        bus: 'music'
      });
    }

    // Snare / Noise on steps 4, 12
    if (this.step === 4 || this.step === 12) {
      this.synth.playNoise({
        duration: 0.07,
        volume: 0.35,
        filterFreq: 2400,
        filterType: 'bandpass',
        bus: 'music'
      });
    }

    // Closed Hi-hat on every odd 16th step
    if (this.step % 2 === 1 && this.currentMode === 'game') {
      this.synth.playNoise({
        duration: 0.02,
        volume: 0.15,
        filterFreq: 6500,
        filterType: 'highpass',
        bus: 'music'
      });
    }
  }
}
