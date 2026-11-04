// Application Entry Point for Arcade Station Master Hub
import { SynthEngine } from './audio/SynthEngine.js';
import { HubSoundEffects } from './audio/HubSoundEffects.js';
import { HubMusic } from './audio/HubMusic.js';
import { ArcadeStation } from './hub/ArcadeStation.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const synth = new SynthEngine();
  const hubSfx = new HubSoundEffects(synth);
  const hubMusic = new HubMusic(synth);
  const station = new ArcadeStation(canvas, synth, hubSfx, hubMusic);

  // Audio start trigger on first user interaction
  const startAudio = () => {
    if (!synth.initialized) {
      synth.init();
      hubMusic.start();
    } else {
      synth.resume();
    }
  };

  window.addEventListener('click', startAudio, { once: true });
  window.addEventListener('touchstart', startAudio, { once: true });
  window.addEventListener('keydown', startAudio, { once: true });

  // Persistent Exit to Hub button
  const returnBtn = document.getElementById('btn-return-hub');
  if (returnBtn) {
    returnBtn.addEventListener('click', () => {
      station.returnToHub();
    });
  }

  // Quick Cartridge Pill Bar in DOM
  const pillBtns = document.querySelectorAll('.cartridge-tab-btn');
  pillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (!isNaN(idx)) {
        if (!synth.initialized) {
          synth.init();
          hubMusic.start();
        }
        station.selectedIndex = idx;
        station.launchSelectedGame();
      }
    });
  });

  // Main 60 FPS animation loop
  function loop(timestamp) {
    station.update(timestamp);
    station.render();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
