// Procedural Sound Effects for Arcade Station Master Hub

export class HubSoundEffects {
  constructor(synth) {
    this.synth = synth;
  }

  // Carousel cartridge scroll tick
  cartridgeScroll() {
    this.synth.playTone({
      freq: 640,
      type: 'triangle',
      duration: 0.04,
      pitchDrop: 180,
      volume: 0.4
    });
  }

  // Cartridge slot inserted
  cartridgeInsert() {
    this.synth.playNoise({
      duration: 0.06,
      volume: 0.5,
      filterFreq: 1800,
      filterType: 'bandpass'
    });
    setTimeout(() => {
      this.synth.playTone({
        freq: 880,
        type: 'square',
        duration: 0.12,
        volume: 0.6
      });
    }, 45);
  }

  // Game launch fanfare
  launchGame() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.synth.playTone({
          freq,
          type: 'square',
          duration: 0.08,
          volume: 0.6
        });
      }, idx * 50);
    });
  }

  // Return to hub from game
  returnToHub() {
    this.synth.playTone({
      freq: 587.33,
      type: 'triangle',
      duration: 0.1,
      pitchDrop: 200,
      volume: 0.5
    });
  }

  // Menu Confirm
  menuConfirm() {
    this.synth.playTone({
      freq: 587.33,
      type: 'square',
      duration: 0.06,
      volume: 0.5
    });
    setTimeout(() => {
      this.synth.playTone({
        freq: 880.00,
        type: 'square',
        duration: 0.12,
        volume: 0.6
      });
    }, 60);
  }
}
