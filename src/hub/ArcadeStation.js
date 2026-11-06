// Master Arcade Station Controller: Unifies all 5 Retro Arcade Games

import { Game as SnakeGame } from '../games/snake/game/Game.js';
import { SoundEffects as SnakeSfx } from '../games/snake/audio/SoundEffects.js';
import { ProceduralMusic as SnakeMusic } from '../games/snake/audio/ProceduralMusic.js';

import { Game as CombatGame } from '../games/combat/game/Game.js';
import { SoundEffects as CombatSfx } from '../games/combat/audio/SoundEffects.js';
import { BattleMusic as CombatMusic } from '../games/combat/audio/BattleMusic.js';

import { Game as SpaceGame } from '../games/space/game/Game.js';
import { SoundEffects as SpaceSfx } from '../games/space/audio/SoundEffects.js';
import { SpaceMusic } from '../games/space/audio/SpaceMusic.js';

import { Game as BreakerGame } from '../games/breaker/game/Game.js';
import { SoundEffects as BreakerSfx } from '../games/breaker/audio/SoundEffects.js';
import { BreakerMusic } from '../games/breaker/audio/BreakerMusic.js';

import { Game as MazeGame } from '../games/maze/game/Game.js';
import { SoundEffects as MazeSfx } from '../games/maze/audio/SoundEffects.js';
import { MazeMusic } from '../games/maze/audio/MazeMusic.js';

export const STATION_STATES = {
  CAROUSEL: 'CAROUSEL',
  CONTROLS: 'CONTROLS',
  IN_GAME: 'IN_GAME'
};

export class ArcadeStation {
  constructor(canvas, synth, hubSfx, hubMusic) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.synth = synth;
    this.hubSfx = hubSfx;
    this.hubMusic = hubMusic;

    this.width = 560;
    this.height = 420;
    this.state = STATION_STATES.CAROUSEL;

    // Cartridges definition
    this.cartridges = [
      {
        id: 'snake',
        num: 1,
        title: 'PIXEL SNAKE',
        subtitle: 'RETRO SLITHER 1976',
        icon: '🐍',
        color: '#00f5d4',
        hiScoreKey: 'pixel_snake_hiscore',
        GameClass: SnakeGame,
        SfxClass: SnakeSfx,
        MusicClass: SnakeMusic,
        controls: [['FLECHAS / WASD', 'MOVER SERPIENTE'], ['ENTER / SPACE', 'CONFIRMAR'], ['P / ESC', 'PAUSA'], ['MANZANA', '+100 PTS'], ['FRUTA DORADA', '+500 PTS']],
        buttons: { A: { code: 'Enter', alt: ['Space'], label: 'START' }, B: { code: 'KeyP', label: 'PAUSE' } },
        repo: 'https://github.com/Jlpineda12/pixel-snake-arcade',
        live: 'https://jlpineda12.github.io/pixel-snake-arcade/'
      },
      {
        id: 'combat',
        num: 2,
        title: 'PIXEL COMBAT',
        subtitle: 'CYBER-RYU VS SHADOW-KEN',
        icon: '🥊',
        color: '#ff334b',
        hiScoreKey: 'pixel_combat_hiscore',
        GameClass: CombatGame,
        SfxClass: CombatSfx,
        MusicClass: CombatMusic,
        controls: [['A / D', 'MOVERSE'], ['W', 'SALTAR'], ['S', 'AGACHARSE'], ['J / Z', 'PUÑO'], ['K / X', 'PATADA'], ['L', 'HADOUKEN'], ['SPACE', 'BLOQUEO']],
        buttons: { A: { code: 'KeyJ', alt: ['KeyZ'], label: 'PUNCH' }, B: { code: 'KeyK', alt: ['KeyX'], label: 'KICK' } },
        repo: 'https://github.com/Jlpineda12/pixel-combat-arcade',
        live: 'https://jlpineda12.github.io/pixel-combat-arcade/'
      },
      {
        id: 'space',
        num: 3,
        title: 'PIXEL SPACE',
        subtitle: 'RETRO INVADERS 1984',
        icon: '🚀',
        color: '#fda415',
        hiScoreKey: 'pixel_space_hiscore',
        GameClass: SpaceGame,
        SfxClass: SpaceSfx,
        MusicClass: SpaceMusic,
        controls: [['A / D', 'MOVER NAVE'], ['SPACE / J', 'LÁSER'], ['K / X', 'SMART BOMB'], ['P / ESC', 'PAUSA']],
        buttons: { A: { code: 'Space', alt: ['KeyJ'], label: 'FIRE' }, B: { code: 'KeyK', alt: ['KeyX'], label: 'BOMB' } },
        repo: 'https://github.com/Jlpineda12/pixel-space-arcade',
        live: 'https://jlpineda12.github.io/pixel-space-arcade/'
      },
      {
        id: 'breaker',
        num: 4,
        title: 'PIXEL BREAKER',
        subtitle: 'RETRO ARKANOID 1986',
        icon: '🧱',
        color: '#ff758f',
        hiScoreKey: 'pixel_breaker_hiscore',
        GameClass: BreakerGame,
        SfxClass: BreakerSfx,
        MusicClass: BreakerMusic,
        controls: [['A / D / MOUSE', 'MOVER PALETA'], ['SPACE / J', 'LANZAR / LÁSER'], ['P / ESC', 'PAUSA'], ['CÁPSULA W', 'PALETA ANCHA'], ['CÁPSULA M', 'MULTI-BOLA'], ['CÁPSULA L', 'CAÑONES']],
        buttons: { A: { code: 'Space', alt: ['KeyJ'], label: 'LAUNCH' }, B: { code: 'KeyP', label: 'PAUSE' } },
        repo: 'https://github.com/Jlpineda12/pixel-breaker-arcade',
        live: 'https://jlpineda12.github.io/pixel-breaker-arcade/'
      },
      {
        id: 'maze',
        num: 5,
        title: 'PIXEL MAZE',
        subtitle: 'PAC-CHASER & GHOSTS 1980',
        icon: '🍒',
        color: '#fee440',
        hiScoreKey: 'pixel_maze_hiscore',
        GameClass: MazeGame,
        SfxClass: MazeSfx,
        MusicClass: MazeMusic,
        controls: [['FLECHAS / WASD', 'MOVERSE'], ['SWIPE', 'GIRAR (MÓVIL)'], ['P / ESC', 'PAUSA'], ['PUNTO', '+10 PTS'], ['ENERGIZER', 'CAZA FANTASMAS']],
        buttons: { A: { code: 'Enter', alt: ['Space'], label: 'START' }, B: { code: 'KeyP', label: 'PAUSE' } },
        repo: 'https://github.com/Jlpineda12/pixel-maze-arcade',
        live: 'https://jlpineda12.github.io/pixel-maze-arcade/'
      }
    ];


    this.selectedIndex = 0;
    this.activeGame = null;
    this.activeGameAudio = null;
    this.activeGameCleanups = [];

    // Carousel animation: visualIndex eases towards selectedIndex
    this.visualIndex = 0;
    this.lastNavDir = 1;
    this.guidePage = 0;
    this.time = 0;
    this.lastTs = 0;

    // Hooks set by main.js (shell integration)
    this.onStateChange = null;
    this.requestLaunch = null;

    this.setupInputs();
  }

  // ---------------------------------------------------------------------------
  // INPUT
  // ---------------------------------------------------------------------------
  setupInputs() {
    window.addEventListener('keydown', (e) => {
      if (!this.synth.initialized) {
        this.synth.init();
        if (this.state !== STATION_STATES.IN_GAME) this.hubMusic.start();
      }

      if (this.state === STATION_STATES.CAROUSEL) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          this.navigateCarousel(-1);
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          this.navigateCarousel(1);
        } else if (e.code === 'Enter' || e.code === 'Space') {
          this.requestGameLaunch();
        } else if (e.code === 'KeyC') {
          this.openGuide();
        } else if (/^Digit[1-5]$/.test(e.code)) {
          const idx = parseInt(e.code.slice(5), 10) - 1;
          if (idx !== this.selectedIndex) {
            this.lastNavDir = idx > this.selectedIndex ? 1 : -1;
            this.selectedIndex = idx;
            this.hubSfx.cartridgeScroll();
            this.emitChange();
          }
        }
      } else if (this.state === STATION_STATES.CONTROLS) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          this.guidePage = (this.guidePage + this.cartridges.length - 1) % this.cartridges.length;
          this.hubSfx.cartridgeScroll();
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          this.guidePage = (this.guidePage + 1) % this.cartridges.length;
          this.hubSfx.cartridgeScroll();
        } else if (['Enter', 'Escape', 'Space', 'KeyC'].includes(e.code)) {
          this.hubSfx.menuConfirm();
          this.state = STATION_STATES.CAROUSEL;
          this.emitChange();
        }
      } else if (this.state === STATION_STATES.IN_GAME) {
        if (e.code === 'Escape' && e.shiftKey) this.returnToHub();
      }
    });

    this.canvas.addEventListener('click', (e) => {
      if (!this.synth.initialized) {
        this.synth.init();
        if (this.state === STATION_STATES.CAROUSEL) this.hubMusic.start();
      }
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (this.width / rect.width);
      const y = (e.clientY - rect.top) * (this.height / rect.height);

      if (this.state === STATION_STATES.CAROUSEL) {
        if (x < 120 && y > 130 && y < 320) this.navigateCarousel(-1);
        else if (x > this.width - 120 && y > 130 && y < 320) this.navigateCarousel(1);
        else if (x >= 150 && x <= 410 && y >= 120 && y <= 330) this.requestGameLaunch();
      } else if (this.state === STATION_STATES.CONTROLS) {
        if (x < 90) this.guidePage = (this.guidePage + this.cartridges.length - 1) % this.cartridges.length;
        else if (x > this.width - 90) this.guidePage = (this.guidePage + 1) % this.cartridges.length;
        else { this.state = STATION_STATES.CAROUSEL; this.emitChange(); }
        this.hubSfx.menuConfirm();
      }
    });
  }

  emitChange() {
    if (typeof this.onStateChange === 'function') this.onStateChange(this);
  }

  openGuide() {
    this.hubSfx.menuConfirm();
    this.guidePage = this.selectedIndex;
    this.state = STATION_STATES.CONTROLS;
    this.emitChange();
  }

  navigateCarousel(dir) {
    this.lastNavDir = dir;
    this.selectedIndex = (this.selectedIndex + dir + this.cartridges.length) % this.cartridges.length;
    this.hubSfx.cartridgeScroll();
    this.emitChange();
  }

  /** UI entry point: lets the shell play a CRT power-cycle around the launch. */
  requestGameLaunch() {
    if (typeof this.requestLaunch === 'function') this.requestLaunch(() => this.launchSelectedGame());
    else this.launchSelectedGame();
  }

  // ---------------------------------------------------------------------------
  // GAME LIFECYCLE
  // ---------------------------------------------------------------------------
  launchSelectedGame() {
    const cart = this.cartridges[this.selectedIndex];
    this.hubSfx.cartridgeInsert();
    this.hubSfx.launchGame();
    this.hubMusic.stop();
    this.cleanupActiveGame();

    // Track the game's window listeners so they can be removed on exit
    const cleanups = [];
    const origWindowAdd = window.addEventListener;
    window.addEventListener = (type, listener, options) => {
      cleanups.push(() => window.removeEventListener(type, listener, options));
      origWindowAdd.call(window, type, listener, options);
    };

    try {
      const sfx = new cart.SfxClass(this.synth);
      const music = new cart.MusicClass(this.synth);
      this.activeGameAudio = { sfx, music };
      this.activeGame = new cart.GameClass(this.canvas, this.synth, sfx, music);
      this.activeGameCleanups = cleanups;
    } finally {
      window.addEventListener = origWindowAdd;
    }

    if (this.synth.initialized && this.activeGameAudio.music && typeof this.activeGameAudio.music.start === 'function') {
      try { this.activeGameAudio.music.start('menu'); } catch { /* optional */ }
    }

    this.state = STATION_STATES.IN_GAME;
    const exitBtn = document.getElementById('btn-return-hub');
    if (exitBtn) exitBtn.style.display = 'inline-flex';
    this.emitChange();
  }

  cleanupActiveGame() {
    if (this.activeGameCleanups) {
      this.activeGameCleanups.forEach(fn => fn());
      this.activeGameCleanups = [];
    }
    const music = this.activeGameAudio && this.activeGameAudio.music;
    if (music && typeof music.stop === 'function') music.stop();
    if (this.activeGame && typeof this.activeGame.destroy === 'function') this.activeGame.destroy();
    this.activeGame = null;
    this.activeGameAudio = null;
  }

  returnToHub() {
    if (this.state !== STATION_STATES.IN_GAME) return;
    this.cleanupActiveGame();
    this.state = STATION_STATES.CAROUSEL;
    this.hubSfx.returnToHub();
    this.hubMusic.start();
    const exitBtn = document.getElementById('btn-return-hub');
    if (exitBtn) exitBtn.style.display = 'none';
    this.emitChange();
  }

  // ---------------------------------------------------------------------------
  // LOOP
  // ---------------------------------------------------------------------------
  update(timestamp) {
    const dt = this.lastTs ? Math.min(50, timestamp - this.lastTs) : 16;
    this.lastTs = timestamp;
    this.time += dt / 1000;

    if (this.state === STATION_STATES.IN_GAME && this.activeGame) {
      this.activeGame.update(timestamp);
      return;
    }

    // Ease the carousel (shortest way around the ring)
    const n = this.cartridges.length;
    let diff = this.selectedIndex - this.visualIndex;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    this.visualIndex += diff * Math.min(1, dt / 90);
    if (Math.abs(diff) < 0.001) this.visualIndex = this.selectedIndex;
    this.visualIndex = (this.visualIndex + n) % n;
  }

  render() {
    if (this.state === STATION_STATES.IN_GAME && this.activeGame) {
      this.activeGame.render();
      return;
    }
    const { ctx } = this;
    ctx.save();
    ctx.textBaseline = 'alphabetic';
    this.drawBackdrop(ctx);
    if (this.state === STATION_STATES.CAROUSEL) this.renderCarousel();
    else if (this.state === STATION_STATES.CONTROLS) this.renderControls();
    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // DRAW HELPERS
  // ---------------------------------------------------------------------------
  font(px) { return `${px}px "Press Start 2P", monospace`; }

  text(str, x, y, { size = 10, color = '#fff5ea', align = 'center', shadow = null } = {}) {
    const { ctx } = this;
    // Press Start 2P has no accented capitals: Á→A … (Ñ is supported)
    str = String(str).replace(/[ÁÉÍÓÚ]/g, (c) => ({ Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' })[c]);
    ctx.font = this.font(size);
    ctx.textAlign = align;
    if (shadow) {
      ctx.fillStyle = shadow;
      ctx.fillText(str, x + 2, y + 2);
    }
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
  }

  drawBackdrop(ctx) {
    const { width: w, height: h, time: t } = this;
    const accent = this.cartridges[this.selectedIndex].color;

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0c0418');
    sky.addColorStop(0.55, '#2a0b45');
    sky.addColorStop(0.56, '#12031f');
    sky.addColorStop(1, '#06010c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // stars
    for (let i = 0; i < 60; i++) {
      const sx = (i * 97.3) % w;
      const sy = (i * 53.7) % (h * 0.5);
      const a = 0.3 + 0.7 * Math.abs(Math.sin(t * (0.8 + (i % 5) * 0.3) + i));
      ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`;
      ctx.fillRect(sx | 0, sy | 0, i % 9 === 0 ? 2 : 1, i % 9 === 0 ? 2 : 1);
    }

    // perspective floor grid
    const horizon = h * 0.56;
    ctx.save();
    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    const vx = w / 2;
    for (let i = -12; i <= 12; i++) {
      ctx.beginPath();
      ctx.moveTo(vx + i * 14, horizon);
      ctx.lineTo(vx + i * 90, h);
      ctx.stroke();
    }
    const scroll = (t * 0.6) % 1;
    for (let i = 0; i < 9; i++) {
      const p = Math.pow((i + scroll) / 9, 2.2);
      const y = horizon + p * (h - horizon);
      ctx.globalAlpha = 0.12 + p * 0.45;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, horizon, w, 2);
    ctx.globalAlpha = 1;
  }

  drawPixelHeart(x, y, color) {
    const { ctx } = this;
    ctx.fillStyle = color;
    ctx.fillRect(x + 2, y, 4, 3);
    ctx.fillRect(x + 8, y, 4, 3);
    ctx.fillRect(x, y + 3, 14, 5);
    ctx.fillRect(x + 2, y + 8, 10, 3);
    ctx.fillRect(x + 4, y + 11, 6, 2);
    ctx.fillRect(x + 6, y + 13, 2, 2);
    ctx.fillStyle = '#fff5ea';
    ctx.fillRect(x + 3, y + 2, 2, 2);
  }

  // Cartridge body with label window. `scale` lets side carts shrink.
  drawCartridge(cart, cx, cy, scale, alpha, live) {
    const { ctx } = this;
    const w = 210 * scale;
    const h = 196 * scale;
    const x = cx - w / 2;
    const y = cy - h / 2;
    ctx.save();
    ctx.globalAlpha = alpha;

    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(x + 6 * scale, y + 8 * scale, w, h);

    // shell with notched top corners
    const notch = 14 * scale;
    ctx.beginPath();
    ctx.moveTo(x + notch, y);
    ctx.lineTo(x + w - notch, y);
    ctx.lineTo(x + w, y + notch);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + notch);
    ctx.closePath();
    const body = ctx.createLinearGradient(x, y, x, y + h);
    body.addColorStop(0, '#4a4458');
    body.addColorStop(1, '#2a2533');
    ctx.fillStyle = body;
    ctx.fill();
    ctx.lineWidth = live ? 3 : 2;
    ctx.strokeStyle = live ? cart.color : '#1a1622';
    ctx.stroke();

    // grip ridges
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    for (let i = 0; i < 5; i++) ctx.fillRect(x + 18 * scale + i * 8 * scale, y + 6 * scale, 4 * scale, 10 * scale);

    // label
    const lx = x + 14 * scale;
    const ly = y + 22 * scale;
    const lw = w - 28 * scale;
    const lh = h - 40 * scale;
    ctx.fillStyle = cart.color;
    ctx.fillRect(lx, ly, lw, lh);
    ctx.fillStyle = '#12051a';
    ctx.fillRect(lx + 4 * scale, ly + 4 * scale, lw - 8 * scale, lh * 0.62);

    // live preview window
    ctx.save();
    ctx.beginPath();
    ctx.rect(lx + 4 * scale, ly + 4 * scale, lw - 8 * scale, lh * 0.62);
    ctx.clip();
    this.drawPreview(cart.id, lx + 4 * scale, ly + 4 * scale, lw - 8 * scale, lh * 0.62, live ? this.time : 0, cart.color);
    ctx.restore();

    // label text
    const ty = ly + lh * 0.62 + 4 * scale;
    ctx.textAlign = 'center';
    ctx.font = this.font(Math.round(10 * scale));
    ctx.fillStyle = '#12051a';
    ctx.fillText(cart.title, cx, ty + 18 * scale);
    ctx.font = this.font(Math.max(5, Math.round(6 * scale)));
    ctx.fillText(cart.subtitle.slice(0, 26), cx, ty + 32 * scale);

    // cart number badge
    ctx.fillStyle = '#12051a';
    ctx.fillRect(x + w - 40 * scale, y + 4 * scale, 30 * scale, 14 * scale);
    ctx.fillStyle = cart.color;
    ctx.font = this.font(Math.max(5, Math.round(7 * scale)));
    ctx.fillText(`#${cart.num}`, x + w - 25 * scale, y + 15 * scale);

    ctx.restore();
  }

  // Tiny animated attract-mode scene for each cartridge label
  drawPreview(id, x, y, w, h, t, color) {
    const { ctx } = this;
    const px = Math.max(2, Math.round(w / 46));
    ctx.fillStyle = '#12051a';
    ctx.fillRect(x, y, w, h);

    if (id === 'snake') {
      ctx.strokeStyle = 'rgba(0,245,212,0.08)';
      for (let gx = 0; gx < w; gx += px * 3) { ctx.beginPath(); ctx.moveTo(x + gx, y); ctx.lineTo(x + gx, y + h); ctx.stroke(); }
      const len = 14;
      for (let i = 0; i < len; i++) {
        const s = t * 3 - i * 0.22;
        const sx = x + w / 2 + Math.cos(s) * w * 0.33;
        const sy = y + h / 2 + Math.sin(s * 2) * h * 0.28;
        ctx.fillStyle = i === 0 ? '#ffffff' : (i % 2 ? '#00f5d4' : '#00c9ae');
        ctx.fillRect(Math.round(sx), Math.round(sy), px * 2, px * 2);
      }
      ctx.fillStyle = '#ff334b';
      ctx.fillRect(x + w * 0.82, y + h * 0.2, px * 2, px * 2);
      ctx.fillStyle = '#39ff14';
      ctx.fillRect(x + w * 0.82 + px, y + h * 0.2 - px, px, px);
    } else if (id === 'combat') {
      ctx.fillStyle = '#ff9a3c';
      ctx.beginPath(); ctx.arc(x + w / 2, y + h * 0.42, h * 0.22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2a0b2f';
      ctx.fillRect(x, y + h * 0.78, w, h * 0.22);
      const bob = Math.round(Math.sin(t * 6) * px * 0.5);
      const drawFighter = (fx, gi, belt, dir) => {
        const fy = y + h * 0.78 - px * 11 + bob;
        ctx.fillStyle = '#fed7aa'; ctx.fillRect(fx, fy, px * 3, px * 3);
        ctx.fillStyle = belt; ctx.fillRect(fx, fy, px * 3, px);
        ctx.fillStyle = gi; ctx.fillRect(fx - px, fy + px * 3, px * 5, px * 4);
        ctx.fillRect(fx + (dir > 0 ? px * 4 : -px * 3), fy + px * 4, px * 2, px);
        ctx.fillRect(fx - px, fy + px * 7, px * 2, px * 4);
        ctx.fillRect(fx + px * 2, fy + px * 7, px * 2, px * 4);
      };
      drawFighter(x + w * 0.2, '#00bbf9', '#ff334b', 1);
      drawFighter(x + w * 0.72, '#ff2a44', '#fee440', -1);
      const p = (t * 0.7) % 1;
      const fbx = x + w * 0.3 + p * w * 0.4;
      ctx.fillStyle = '#7df9ff';
      ctx.fillRect(fbx, y + h * 0.78 - px * 7, px * 3, px * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fbx + px, y + h * 0.78 - px * 7, px, px * 2);
    } else if (id === 'space') {
      for (let i = 0; i < 18; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + (i % 3) * 0.2})`;
        ctx.fillRect(x + (i * 37) % w, y + ((i * 23 + t * 20) % h), 1, 1);
      }
      const off = Math.sin(t * 1.5) * w * 0.08;
      const frame = Math.floor(t * 3) % 2;
      const cols = ['#ff334b', '#fda415', '#00f5d4'];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 6; c++) {
          const ax = x + w * 0.14 + c * w * 0.13 + off;
          const ay = y + h * 0.12 + r * h * 0.15;
          ctx.fillStyle = cols[r];
          ctx.fillRect(ax, ay, px * 3, px * 2);
          ctx.fillRect(ax + (frame ? -px : 0), ay + px * 2, px, px);
          ctx.fillRect(ax + px * 2 + (frame ? px : 0), ay + px * 2, px, px);
        }
      }
      const sx = x + w / 2 + Math.sin(t * 2.1) * w * 0.3;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx - px * 2, y + h * 0.84, px * 5, px * 2);
      ctx.fillRect(sx, y + h * 0.84 - px, px, px);
      const shot = (t * 2.4) % 1;
      ctx.fillStyle = '#fee440';
      ctx.fillRect(sx, y + h * 0.84 - px - shot * h * 0.6, px, px * 2);
    } else if (id === 'breaker') {
      const bc = ['#fda415', '#ff334b', '#ff758f', '#00f5d4'];
      const bw = (w - px * 4) / 7;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 7; c++) {
          if ((r * 7 + c + Math.floor(t * 2)) % 11 === 0) continue;
          ctx.fillStyle = bc[r];
          ctx.fillRect(x + px * 2 + c * bw, y + px * 2 + r * px * 3, bw - 2, px * 2);
        }
      }
      const tri = (v) => 1 - Math.abs((v % 2) - 1);
      const bx = x + px + tri(t * 0.9) * (w - px * 3);
      const by = y + h * 0.35 + tri(t * 1.3) * (h * 0.5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bx, by, px * 1.5, px * 1.5);
      const padX = Math.min(Math.max(bx - px * 4, x), x + w - px * 9);
      ctx.fillStyle = '#fda415';
      ctx.fillRect(padX, y + h - px * 3, px * 9, px * 1.5);
    } else if (id === 'maze') {
      ctx.strokeStyle = '#3c4bd6';
      ctx.lineWidth = Math.max(2, px * 0.8);
      ctx.strokeRect(x + px, y + px, w - px * 2, h - px * 2);
      ctx.strokeRect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.4);
      const lane = y + h * 0.17;
      const p = (t * 0.35) % 1;
      const pacX = x + w * 0.1 + p * w * 0.8;
      for (let i = 0; i < 10; i++) {
        const dx = x + w * 0.1 + (i / 9) * w * 0.8;
        if (dx > pacX) { ctx.fillStyle = '#fee440'; ctx.fillRect(dx, lane, px * 0.8, px * 0.8); }
      }
      const mouth = Math.abs(Math.sin(t * 12)) * 0.7;
      ctx.fillStyle = '#fee440';
      ctx.beginPath();
      ctx.moveTo(pacX, lane);
      ctx.arc(pacX, lane, px * 2.2, mouth, Math.PI * 2 - mouth);
      ctx.closePath();
      ctx.fill();
      const gx = pacX - w * 0.22;
      if (gx > x) {
        ctx.fillStyle = Math.floor(t * 4) % 2 ? '#ff5fa2' : '#ff334b';
        ctx.fillRect(gx - px * 2, lane - px * 2, px * 4, px * 4);
        ctx.fillStyle = '#fff';
        ctx.fillRect(gx - px, lane - px, px, px);
        ctx.fillRect(gx + px * 0.5, lane - px, px, px);
      }
      ctx.fillStyle = '#ff334b';
      ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, px * 1.4, 0, Math.PI * 2); ctx.fill();
    }

    // label scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for (let sy = 0; sy < h; sy += 3) ctx.fillRect(x, y + sy, w, 1);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    ctx.globalAlpha = 1;
  }

  renderCarousel() {
    const { ctx, width: w, time: t } = this;
    const cx = w / 2;
    const n = this.cartridges.length;
    const current = this.cartridges[this.selectedIndex];

    // HUD
    this.text('ARCADE STATION', 24, 30, { size: 10, align: 'left', shadow: '#000' });
    const hi = (typeof localStorage !== 'undefined' && localStorage.getItem(current.hiScoreKey)) || '123000';
    this.text(`HI ${String(hi).padStart(6, '0')}`, 24, 48, { size: 9, color: current.color, align: 'left' });
    for (let i = 0; i < 3; i++) this.drawPixelHeart(w - 98 + i * 24, 20, current.color);
    if (Math.floor(t * 2) % 2 === 0) this.text('CREDIT 01', w - 24, 52, { size: 7, color: '#b39ebd', align: 'right' });

    // Wavy title
    ctx.font = this.font(18);
    const title = 'SELECT CARTRIDGE';
    const total = ctx.measureText(title).width;
    let tx = cx - total / 2;
    ctx.textAlign = 'left';
    for (let i = 0; i < title.length; i++) {
      const ch = title[i];
      const cw = ctx.measureText(ch).width;
      const dy = Math.sin(t * 4 + i * 0.5) * 3;
      ctx.fillStyle = '#5a1a00';
      ctx.fillText(ch, tx + 2, 92 + dy + 3);
      const hue = (i / title.length + t * 0.15) % 1;
      ctx.fillStyle = hue < 0.5 ? '#fc7814' : '#fda415';
      ctx.fillText(ch, tx, 92 + dy);
      tx += cw;
    }

    // Carousel ring: draw far carts first
    const items = [];
    for (let i = 0; i < n; i++) {
      let rel = i - this.visualIndex;
      if (rel > n / 2) rel -= n;
      if (rel < -n / 2) rel += n;
      if (Math.abs(rel) > 1.6) continue;
      items.push({ i, rel });
    }
    items.sort((a, b) => Math.abs(b.rel) - Math.abs(a.rel));
    for (const { i, rel } of items) {
      const a = Math.abs(rel);
      const scale = 1 - Math.min(a, 1) * 0.42;
      const px = cx + rel * 175;
      const py = 218 + a * 10 + (a < 0.05 ? Math.sin(t * 2.5) * 3 : 0);
      this.drawCartridge(this.cartridges[i], px, py, scale, 1 - Math.min(a, 1.5) * 0.45, a < 0.5);
    }

    // Arrows (pulse in direction of travel)
    const pulse = Math.sin(t * 6) * 3;
    this.text('◀', 26 - Math.max(0, pulse), 226, { size: 18, color: '#fda415', align: 'center' });
    this.text('▶', w - 26 + Math.max(0, pulse), 226, { size: 18, color: '#fda415', align: 'center' });

    // Prompts
    if (Math.floor(t * 2.2) % 2 === 0) {
      this.text('PRESS START', cx, 352, { size: 14, color: current.color, shadow: '#000' });
    }
    this.text('[ENTER] JUGAR  ·  [C] CONTROLES', cx, 380, { size: 7, color: '#d6c6e0' });
    this.text('◀ ▶ NAVEGAR  ·  [1-5] SELECCIÓN RÁPIDA', cx, 398, { size: 7, color: '#8c7a99' });
  }

  renderControls() {
    const { ctx, width: w } = this;
    const cx = w / 2;
    const cart = this.cartridges[this.guidePage];

    ctx.fillStyle = 'rgba(10, 4, 16, 0.82)';
    ctx.fillRect(0, 0, w, this.height);

    this.text('★ HOW TO PLAY ★', cx, 40, { size: 16, color: '#fda415', shadow: '#5a1a00' });

    // Panel
    const px = 40;
    const py = 62;
    const pw = w - 80;
    const ph = 282;
    ctx.fillStyle = 'rgba(25, 12, 30, 0.95)';
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = cart.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, pw, ph);
    ctx.fillStyle = cart.color;
    ctx.fillRect(px, py, pw, 30);
    this.text(`${cart.num}/5  ${cart.title}`, cx, py + 20, { size: 10, color: '#12051a' });

    // Preview strip
    this.drawPreview(cart.id, px + 14, py + 42, 150, 104, this.time, cart.color);

    // Key rows (right of preview, then full width)
    const rows = cart.controls;
    let y = py + 56;
    rows.forEach((row, idx) => {
      const left = idx < 4 ? px + 180 : px + 14;
      const right = px + pw - 14;
      if (idx === 4) y = py + 168;
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(left - 4, y - 12, right - left + 8, 18);
      this.text(row[0], left, y, { size: 7, color: cart.color, align: 'left' });
      this.text(row[1], right, y, { size: 7, color: '#fff5ea', align: 'right' });
      y += 24;
    });

    this.text('SHIFT+ESC O BOTÓN ROJO: SALIR AL HUB', cx, py + ph - 14, { size: 7, color: '#00f5d4' });

    // Page arrows and dots
    this.text('◀', 20, 210, { size: 14, color: '#fda415' });
    this.text('▶', w - 20, 210, { size: 14, color: '#fda415' });
    for (let i = 0; i < this.cartridges.length; i++) {
      ctx.fillStyle = i === this.guidePage ? cart.color : 'rgba(255,255,255,0.25)';
      ctx.fillRect(cx - 40 + i * 18, 362, 10, 10);
    }
    this.text('[ENTER] / [ESC] VOLVER', cx, 398, { size: 8, color: '#b39ebd' });
  }
}
