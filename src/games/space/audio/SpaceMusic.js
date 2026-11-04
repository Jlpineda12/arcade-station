// Procedural Space Invaders / Galaga Arcade Soundtrack

export class SpaceMusic {
  constructor(synth) {
    this.synth = synth;
    this.isPlaying = false;
    this.currentMode = 'menu'; // 'menu' | 'space'
    this.step = 0;
    this.bar = 0;
    this.timerId = null;

    this.menuBpm = 110;
    this.spaceBaseBpm = 128;
    this.currentBpm = this.menuBpm;

    // Frequencies (Hz) for authentic arcade space progression
    this.freqs = {
      C2: 65.41, D2: 73.42, Eb2: 77.78, F2: 87.31, G2: 98.00, Ab2: 103.83, Bb2: 116.54,
      C3: 130.81, Eb3: 155.56, F3: 174.61, G3: 196.00, Bb3: 233.08,
      C4: 261.63, Eb4: 311.13, F4: 349.23, G4: 392.00, Bb4: 466.16, C5: 523.25
    };

    // 4-step descending alien march notes
    this.marchNotes = ['G2', 'F2', 'Eb2', 'D2'];
    this.marchIdx = 0;

    // Chords
    this.chords = [
      { bass: 'C2', notes: ['C3', 'Eb3', 'G3', 'C4'] },
      { bass: 'Ab2', notes: ['Ab2', 'C3', 'Eb3', 'Ab3'] },
      { bass: 'Eb2', notes: ['Eb3', 'G3', 'Bb3', 'Eb4'] },
      { bass: 'Bb2', notes: ['Bb2', 'D3', 'F3', 'Bb3'] }
    ];

    this.speedMultiplier = 1.0;
  }

  start(mode = 'menu') {
    this.currentMode = mode;
    this.currentBpm = mode === 'menu' ? this.menuBpm : (this.spaceBaseBpm * this.speedMultiplier);
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
    this.currentBpm = mode === 'menu' ? this.menuBpm : (this.spaceBaseBpm * this.speedMultiplier);
    if (!this.isPlaying) {
      this.start(mode);
    }
  }

  // Speed up music dynamically as the alien fleet is cleared
  setAlienCountRatio(aliveCount, totalCount) {
    const cleared = 1 - (aliveCount / Math.max(1, totalCount));
    this.speedMultiplier = Math.min(1.45, 1.0 + (cleared * 0.45));
    if (this.currentMode === 'space') {
      this.currentBpm = this.spaceBaseBpm * this.speedMultiplier;
    }
  }

  scheduleTick() {
    if (!this.isPlaying) return;

    const stepMs = (60000 / this.currentBpm) / 4;
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

    // Track 1: Descending Alien Heartbeat March on quarter notes
    if (this.step % 4 === 0) {
      const marchNote = this.marchNotes[this.marchIdx];
      this.marchIdx = (this.marchIdx + 1) % this.marchNotes.length;
      const freq = this.freqs[marchNote] || 98.0;

      this.synth.playTone({
        freq,
        type: 'square',
        duration: 0.1,
        volume: 0.4,
        bus: 'music'
      });
    }

    // Track 2: 16th Arpeggiated Space Starlight (Triangle wave)
    const arpIdx = this.step % chord.notes.length;
    const arpFreq = this.freqs[chord.notes[arpIdx]];
    if (arpFreq) {
      this.synth.playTone({
        freq: arpFreq,
        type: 'triangle',
        duration: 0.05,
        volume: this.currentMode === 'menu' ? 0.2 : 0.26,
        bus: 'music'
      });
    }

    // Track 3: Space Drums
    if (this.step === 0 || this.step === 8) {
      this.synth.playTone({
        freq: 130,
        type: 'sine',
        duration: 0.08,
        pitchDrop: 100,
        volume: 0.5,
        bus: 'music'
      });
    }

    if (this.step === 4 || this.step === 12) {
      this.synth.playNoise({
        duration: 0.06,
        volume: 0.35,
        filterFreq: 2600,
        filterType: 'bandpass',
        bus: 'music'
      });
    }

    if (this.step % 2 === 0) {
      this.synth.playNoise({
        duration: 0.02,
        volume: 0.1,
        filterFreq: 7000,
        filterType: 'highpass',
        bus: 'music'
      });
    }
  }
}
