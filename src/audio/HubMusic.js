// Procedural Synthwave / Chiptune Lobby Theme for Arcade Station

export class HubMusic {
  constructor(synth) {
    this.synth = synth;
    this.isPlaying = false;
    this.step = 0;
    this.bar = 0;
    this.timerId = null;
    this.bpm = 116;

    // Frequencies (Hz) for energetic D minor / F major progression
    this.freqs = {
      D2: 73.42, F2: 87.31, G2: 98.00, A2: 110.00, Bb2: 116.54, C3: 130.81,
      D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, Bb3: 233.08,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, D5: 587.33
    };

    // Chords: Dm -> Bb -> F -> C
    this.chords = [
      { bass: 'D2', lead: ['D4', 'F4', 'A4', 'D5', 'A4', 'F4', 'D4', 'F4'] },
      { bass: 'Bb2', lead: ['Bb3', 'D4', 'F4', 'Bb4', 'F4', 'D4', 'Bb3', 'D4'] },
      { bass: 'F2', lead: ['F3', 'A3', 'C4', 'F4', 'C4', 'A3', 'F3', 'A3'] },
      { bass: 'C3', lead: ['C3', 'E3', 'G3', 'C4', 'G3', 'E3', 'C3', 'E3'] }
    ];
  }

  start() {
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

  scheduleTick() {
    if (!this.isPlaying) return;

    const stepMs = (60000 / this.bpm) / 4;
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

    // Pulsing Synth Bass
    if (this.step % 4 === 0 || this.step % 4 === 2) {
      const freq = this.freqs[chord.bass] || 73.42;
      this.synth.playTone({
        freq,
        type: 'sawtooth',
        duration: 0.1,
        volume: 0.35,
        bus: 'music'
      });
    }

    // Melodic Arpeggio Lead
    if (this.step % 2 === 0) {
      const idx = Math.floor(this.step / 2) % chord.lead.length;
      const freq = this.freqs[chord.lead[idx]];
      if (freq) {
        this.synth.playTone({
          freq,
          type: 'square',
          duration: 0.07,
          volume: 0.28,
          bus: 'music'
        });
      }
    }

    // Retro Arcade Drums
    if (this.step === 0 || this.step === 8) {
      this.synth.playTone({
        freq: 130,
        type: 'sine',
        duration: 0.08,
        pitchDrop: 90,
        volume: 0.5,
        bus: 'music'
      });
    }

    if (this.step === 4 || this.step === 12) {
      this.synth.playNoise({
        duration: 0.06,
        volume: 0.32,
        filterFreq: 2600,
        filterType: 'bandpass',
        bus: 'music'
      });
    }
  }
}
