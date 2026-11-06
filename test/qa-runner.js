// Automated QA Test Suite for Arcade Station Master Hub
import { ArcadeStation, STATION_STATES } from '../src/hub/ArcadeStation.js';
import { HubMusic } from '../src/audio/HubMusic.js';
import { HubSoundEffects } from '../src/audio/HubSoundEffects.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

function section(title) {
  console.log(`\n========================================`);
  console.log(`🕹️ ${title}`);
  console.log(`========================================`);
}

// ========================================================
// 1. MOCK ENVIRONMENT SETUP
// ========================================================
const mockCanvas = {
  width: 560,
  height: 420,
  getContext: () => ({
    save: () => {},
    restore: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    fillText: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    quadraticCurveTo: () => {},
    closePath: () => {},
    fill: () => {},
    stroke: () => {},
    clip: () => {},
    rect: () => {},
    arc: () => {},
    translate: () => {},
    rotate: () => {}
  }),
  addEventListener: () => {},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 560, height: 420 })
};

const mockSynth = {
  ctx: { currentTime: 0 },
  initialized: true,
  playTone: () => {},
  playNoise: () => {},
  masterGain: {}
};

const mockHubSfx = {
  cartridgeScroll: () => {},
  cartridgeInsert: () => {},
  launchGame: () => {},
  returnToHub: () => {},
  menuConfirm: () => {}
};

const mockHubMusic = {
  start: () => {},
  stop: () => {}
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.localStorage = {
  getItem: () => '123000',
  setItem: () => {}
};
global.performance = {
  now: () => 1000
};
global.document = {
  getElementById: () => ({ style: {} }),
  querySelectorAll: () => []
};

// ========================================================
// 2. STATION INITIALIZATION TESTS
// ========================================================
section('1. Arcade Station Initial State');

const station = new ArcadeStation(mockCanvas, mockSynth, mockHubSfx, mockHubMusic);
assert(station.state === STATION_STATES.CAROUSEL, 'Station starts in CAROUSEL state');
assert(station.cartridges.length === 5, 'Station manages exactly 5 arcade cartridges');
assert(station.selectedIndex === 0, 'Initial selection is cartridge 0 (Snake)');

const expectedIds = ['snake', 'combat', 'space', 'breaker', 'maze'];
const actualIds = station.cartridges.map(c => c.id);
assert(JSON.stringify(actualIds) === JSON.stringify(expectedIds), 'Cartridges match exact 5 games specification');

// ========================================================
// 3. CAROUSEL NAVIGATION TESTS
// ========================================================
section('2. Carousel Navigation & Cycling');

station.navigateCarousel(1);
assert(station.selectedIndex === 1, 'Navigating right selects Cartridge 1 (Combat)');

station.navigateCarousel(1);
assert(station.selectedIndex === 2, 'Navigating right selects Cartridge 2 (Space)');

station.navigateCarousel(1);
assert(station.selectedIndex === 3, 'Navigating right selects Cartridge 3 (Breaker)');

station.navigateCarousel(1);
assert(station.selectedIndex === 4, 'Navigating right selects Cartridge 4 (Maze)');

station.navigateCarousel(1);
assert(station.selectedIndex === 0, 'Navigating right from last cartridge wraps to 0');

station.navigateCarousel(-1);
assert(station.selectedIndex === 4, 'Navigating left from 0 wraps back to 4');

// ========================================================
// 4. GAME LAUNCH & RETURN INTEGRATION
// ========================================================
section('3. Game Launch & Clean Return');

// Launch Snake (0)
station.selectedIndex = 0;
station.launchSelectedGame();
assert(station.state === STATION_STATES.IN_GAME, 'State transitions to IN_GAME on launch');
assert(station.activeGame !== null, 'Active game instance created');

// Return to Hub
station.returnToHub();
assert(station.state === STATION_STATES.CAROUSEL, 'State transitions back to CAROUSEL on returnToHub');
assert(station.activeGame === null, 'Active game instance cleaned up');

// Launch Combat (1)
station.selectedIndex = 1;
station.launchSelectedGame();
assert(station.state === STATION_STATES.IN_GAME, 'Combat launched successfully');
station.returnToHub();

// Launch Space (2)
station.selectedIndex = 2;
station.launchSelectedGame();
assert(station.state === STATION_STATES.IN_GAME, 'Space launched successfully');
station.returnToHub();

// Launch Breaker (3)
station.selectedIndex = 3;
station.launchSelectedGame();
assert(station.state === STATION_STATES.IN_GAME, 'Breaker launched successfully');
station.returnToHub();

// Launch Maze (4)
station.selectedIndex = 4;
station.launchSelectedGame();
assert(station.state === STATION_STATES.IN_GAME, 'Maze launched successfully');
station.returnToHub();

// ========================================================
// 5. PROCEDURAL AUDIO LOBBY
// ========================================================
section('4. Lobby Audio Synthesis');

const hubMusic = new HubMusic(mockSynth);
assert(hubMusic.bpm === 116, 'Lobby music plays at 116 BPM');
assert(hubMusic.chords.length === 4, 'Lobby music contains 4-chord progression');

const hubSfx = new HubSoundEffects(mockSynth);
assert(typeof hubSfx.cartridgeScroll === 'function', 'Has cartridgeScroll sound effect');
assert(typeof hubSfx.cartridgeInsert === 'function', 'Has cartridgeInsert sound effect');
assert(typeof hubSfx.launchGame === 'function', 'Has launchGame sound effect');
assert(typeof hubSfx.returnToHub === 'function', 'Has returnToHub sound effect');

// ========================================================
// SUMMARY
// ========================================================
console.log(`\n========================================`);
console.log(`🏁 QA RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}

// Exit explicitly: audio sequencer timers would otherwise keep Node alive
process.exit(failed > 0 ? 1 : 0);
