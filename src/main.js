// Application Entry Point for Arcade Station Master Hub
import { SynthEngine } from './audio/SynthEngine.js';
import { HubSoundEffects } from './audio/HubSoundEffects.js';
import { HubMusic } from './audio/HubMusic.js';
import { ArcadeStation, STATION_STATES } from './hub/ArcadeStation.js';
import { RetroShell } from './shell/RetroShell.js';

const HUB_BUTTONS = {
  A: { code: 'Enter', alt: ['Space'], label: 'PLAY' },
  B: { code: 'KeyC', label: 'GUIDE' }
};

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const synth = new SynthEngine();
  const hubSfx = new HubSoundEffects(synth);
  const hubMusic = new HubMusic(synth);
  const station = new ArcadeStation(canvas, synth, hubSfx, hubMusic);

  const startAudio = () => {
    if (!synth.initialized) {
      synth.init();
      if (station.state !== STATION_STATES.IN_GAME) hubMusic.start();
    } else {
      synth.resume();
    }
  };

  const shell = new RetroShell({
    id: 'arcade-station',
    title: 'ARCADE STATION',
    accent: '#00f5d4',
    accent2: '#ff2e88',
    year: '1984',
    repo: 'https://github.com/Jlpineda12/arcade-station',
    buttons: HUB_BUTTONS,
    ticker: [
      '5 JUEGOS · 1 GABINETE',
      'SNAKE · COMBAT · SPACE · BREAKER · MAZE',
      'MÚSICA CHIPTUNE 100% PROCEDURAL',
      'HECHO CON VANILLA JS + WEB AUDIO API',
      '0 DEPENDENCIAS · 0 MP3 · 0 FRAMEWORKS',
      'INSERT COIN TO CONTINUE'
    ],
    onFirstInput: startAudio
  }).init();

  const pillBtns = [...document.querySelectorAll('.cartridge-tab-btn')];

  // Keep marquee, joystick color, deck buttons and terminal prompt in sync
  let lastKey = '';
  station.onStateChange = (st) => {
    const cart = st.cartridges[st.selectedIndex];
    const key = `${st.state}:${st.selectedIndex}`;
    if (key === lastKey) return;
    lastKey = key;
    pillBtns.forEach((b, i) => b.classList.toggle('is-active', i === st.selectedIndex));
    if (st.state === STATION_STATES.IN_GAME) {
      shell.setTitle(cart.title, cart.color);
      shell.setButtons(cart.buttons);
      shell.typeCommand(`./play --cartridge=${cart.id}  # SHIFT+ESC = salir`);
    } else {
      shell.setTitle('ARCADE STATION', cart.color);
      shell.setButtons(HUB_BUTTONS);
      shell.typeCommand(st.state === STATION_STATES.CONTROLS
        ? `man ${cart.id}  # guía de controles`
        : `ls cartridges/ && ./select --slot=${cart.num}  # ${cart.id}`);
    }
  };
  station.requestLaunch = (launch) => shell.powerCycle(launch);
  station.onStateChange(station);

  const returnBtn = document.getElementById('btn-return-hub');
  if (returnBtn) {
    returnBtn.addEventListener('click', () => {
      returnBtn.blur();
      shell.powerCycle(() => station.returnToHub());
    });
  }

  pillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (Number.isNaN(idx)) return;
      btn.blur(); // otherwise the next Enter/Space would re-click the tab
      startAudio();
      shell.powerCycle(() => {
        if (station.state === STATION_STATES.IN_GAME) station.cleanupActiveGame();
        station.state = STATION_STATES.CAROUSEL;
        station.selectedIndex = idx;
        station.visualIndex = idx;
        station.launchSelectedGame();
      });
    });
  });

  function loop(timestamp) {
    station.update(timestamp);
    station.render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
