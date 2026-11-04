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
        controls: 'FLECHAS / [W, A, S, D]: Mover serpiente',
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
        controls: '[A, D]: Mover • [W]: Saltar • [J]: Golpe • [K]: Patada • [L]: Hadouken • [S]: Bloqueo',
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
        controls: '[A, D]: Nave • [SPACE] / [J]: Láser • [K] / [X]: Smart Bomb',
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
        controls: '[A, D] / Mouse: Paleta • [SPACE] / [J]: Lanzar bola / Disparar blasters',
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
        controls: 'FLECHAS / [W, A, S, D]: Navegar laberinto con input buffering',
        repo: 'https://github.com/Jlpineda12/pixel-maze-arcade',
        live: 'https://jlpineda12.github.io/pixel-maze-arcade/'
      }
    ];

    this.selectedIndex = 0;
    this.activeGame = null;
    this.activeGameAudio = null;

    // Carousel Animation
    this.carouselOffset = 0;
    this.targetOffset = 0;

    this.setupInputs();
  }

  setupInputs() {
    window.addEventListener('keydown', (e) => {
      // Audio start on first interaction
      if (!this.synth.initialized) {
        this.synth.init();
        if (this.state === STATION_STATES.CAROUSEL) {
          this.hubMusic.start();
        }
      }

      if (this.state === STATION_STATES.CAROUSEL) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          this.navigateCarousel(-1);
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          this.navigateCarousel(1);
        } else if (e.code === 'Enter' || e.code === 'Space') {
          this.launchSelectedGame();
        } else if (e.code === 'KeyC') {
          this.hubSfx.menuConfirm();
          this.state = STATION_STATES.CONTROLS;
        } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'].includes(e.code)) {
          const idx = parseInt(e.code.replace('Digit', ''), 10) - 1;
          if (idx >= 0 && idx < this.cartridges.length) {
            this.selectedIndex = idx;
            this.hubSfx.cartridgeScroll();
          }
        }
      } else if (this.state === STATION_STATES.CONTROLS) {
        if (e.code === 'Enter' || e.code === 'Escape' || e.code === 'Space' || e.code === 'KeyC') {
          this.hubSfx.menuConfirm();
          this.state = STATION_STATES.CAROUSEL;
        }
      } else if (this.state === STATION_STATES.IN_GAME) {
        // Return to hub shortcut: Escape + Shift or button
        if (e.code === 'Escape' && e.shiftKey) {
          this.returnToHub();
        }
      }
    });

    // Canvas click detection for carousel navigation
    this.canvas.addEventListener('click', (e) => {
      if (!this.synth.initialized) {
        this.synth.init();
        if (this.state === STATION_STATES.CAROUSEL) this.hubMusic.start();
      }

      if (this.state === STATION_STATES.CAROUSEL) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Left Arrow Click (x: 20-80, y: 180-260)
        if (x >= 20 && x <= 80 && y >= 180 && y <= 260) {
          this.navigateCarousel(-1);
        }
        // Right Arrow Click (x: 480-540, y: 180-260)
        else if (x >= 480 && x <= 540 && y >= 180 && y <= 260) {
          this.navigateCarousel(1);
        }
        // Center Cartridge Click (launch game)
        else if (x >= 140 && x <= 420 && y >= 140 && y <= 310) {
          this.launchSelectedGame();
        }
      } else if (this.state === STATION_STATES.CONTROLS) {
        this.hubSfx.menuConfirm();
        this.state = STATION_STATES.CAROUSEL;
      }
    });
  }

  navigateCarousel(dir) {
    this.selectedIndex = (this.selectedIndex + dir + this.cartridges.length) % this.cartridges.length;
    this.hubSfx.cartridgeScroll();
  }

  launchSelectedGame() {
    const cart = this.cartridges[this.selectedIndex];
    this.hubSfx.cartridgeInsert();
    this.hubSfx.launchGame();
    this.hubMusic.stop();

    // Clean up any previously active game
    this.cleanupActiveGame();

    // Intercept event listeners during game instantiation
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

    this.state = STATION_STATES.IN_GAME;

    // Show persistent Exit to Hub banner in UI
    const exitBtn = document.getElementById('btn-return-hub');
    if (exitBtn) exitBtn.style.display = 'inline-flex';
  }

  cleanupActiveGame() {
    if (this.activeGameCleanups) {
      this.activeGameCleanups.forEach(fn => fn());
      this.activeGameCleanups = [];
    }
    if (this.activeGameAudio && this.activeGameAudio.music && typeof this.activeGameAudio.music.stop === 'function') {
      this.activeGameAudio.music.stop();
    }
    if (this.activeGame && typeof this.activeGame.destroy === 'function') {
      this.activeGame.destroy();
    }
    this.activeGame = null;
    this.activeGameAudio = null;
  }

  returnToHub() {
    if (this.state !== STATION_STATES.IN_GAME) return;

    this.cleanupActiveGame();
    this.state = STATION_STATES.CAROUSEL;
    this.hubSfx.returnToHub();
    this.hubMusic.start();

    // Hide persistent Exit to Hub banner in UI
    const exitBtn = document.getElementById('btn-return-hub');
    if (exitBtn) exitBtn.style.display = 'none';
  }

  update(timestamp) {
    if (this.state === STATION_STATES.IN_GAME && this.activeGame) {
      this.activeGame.update(timestamp);
    }
  }

  render() {
    if (this.state === STATION_STATES.IN_GAME && this.activeGame) {
      this.activeGame.render();
      return;
    }

    const { ctx } = this;
    ctx.save();

    // Plum background
    ctx.fillStyle = '#351d3d';
    ctx.fillRect(0, 0, this.width, this.height);

    // Decorative grid
    this.drawGrid(ctx);

    if (this.state === STATION_STATES.CAROUSEL) {
      this.renderCarousel();
    } else if (this.state === STATION_STATES.CONTROLS) {
      this.renderControls();
    }

    ctx.restore();
  }

  drawGrid(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(92, 54, 102, 0.35)';
    ctx.lineWidth = 1;

    const step = 28;
    for (let x = 0; x <= this.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y <= this.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawPixelHearts(startX, startY, count = 5) {
    const { ctx } = this;
    const spacing = 28;

    for (let i = 0; i < 5; i++) {
      const x = startX + i * spacing;
      const y = startY;

      if (i < count) {
        // Active Amber Heart
        ctx.fillStyle = '#fda415';
        ctx.fillRect(x + 2, y, 4, 3);
        ctx.fillRect(x + 8, y, 4, 3);
        ctx.fillRect(x, y + 3, 14, 5);
        ctx.fillRect(x + 2, y + 8, 10, 3);
        ctx.fillRect(x + 4, y + 11, 6, 2);
        ctx.fillRect(x + 6, y + 13, 2, 2);

        // Core Glint
        ctx.fillStyle = '#fff5ea';
        ctx.fillRect(x + 3, y + 2, 2, 2);
      } else {
        ctx.fillStyle = 'rgba(90, 50, 100, 0.4)';
        ctx.fillRect(x, y, 14, 14);
      }
    }
  }

  renderCarousel() {
    const { ctx, width } = this;
    const cx = width / 2;
    const current = this.cartridges[this.selectedIndex];

    // 1. Top HUD
    ctx.textAlign = 'left';
    ctx.font = '11px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText('ARCADE STATION', 34, 34);

    const hiScore = localStorage.getItem(current.hiScoreKey) || '123000';
    ctx.fillStyle = '#fda415';
    ctx.fillText(`HI: ${hiScore}`, 34, 52);

    // 5 Hearts in top right
    this.drawPixelHearts(380, 24, 5);

    // 2. Station Header
    ctx.textAlign = 'center';
    ctx.font = '22px "Press Start 2P", monospace';
    ctx.fillStyle = '#fc7814';
    ctx.fillText('SELECT CARTRIDGE', cx, 95);

    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillStyle = '#00f5d4';
    ctx.fillText('★ 5 RETRO CLASSICS IN 1 CABINET ★', cx, 118);

    // 3. Navigation Arrows
    ctx.font = '20px "Press Start 2P", monospace';
    ctx.fillStyle = '#fda415';
    ctx.fillText('◀', 46, 220);
    ctx.fillText('▶', width - 46, 220);

    // 4. Center Selected Cartridge Box
    const boxW = 340;
    const boxH = 150;
    const boxX = cx - boxW / 2;
    const boxY = 140;

    // Cartridge Shadow & Body
    ctx.fillStyle = '#1c0a22';
    ctx.fillRect(boxX + 4, boxY + 4, boxW, boxH);

    ctx.fillStyle = '#26132f';
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Glowing Border
    ctx.strokeStyle = current.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Cartridge Top Tab
    ctx.fillStyle = current.color;
    ctx.fillRect(cx - 50, boxY - 12, 100, 12);
    ctx.fillStyle = '#1c0a22';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(`CART #${current.num}`, cx, boxY - 3);

    // Cartridge Content
    ctx.font = '28px "Press Start 2P", monospace';
    ctx.fillText(current.icon, cx, boxY + 44);

    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillStyle = current.color;
    ctx.fillText(current.title, cx, boxY + 76);

    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText(current.subtitle, cx, boxY + 98);

    // Mini cartridge dots
    for (let i = 0; i < this.cartridges.length; i++) {
      const dotX = cx - ((this.cartridges.length - 1) * 16) / 2 + i * 16;
      const dotY = boxY + 128;
      ctx.fillStyle = i === this.selectedIndex ? current.color : 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(dotX - 4, dotY - 4, 8, 8);
    }

    // 5. Action Prompts
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = '#fda415';
    ctx.fillText('PRESS [ENTER] TO PLAY', cx, 340);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#b39ebd';
    ctx.fillText('PRESS [C] FOR CONTROLS GUIDE', cx, 375);

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#7a6b85';
    ctx.fillText('[1-5]: QUICK SELECT • [← / →]: BROWSE', cx, 400);
  }

  renderControls() {
    const { ctx, width } = this;
    const cx = width / 2;

    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillStyle = '#fda415';
    ctx.fillText('★ HOW TO PLAY ★', cx, 40);

    // Box
    ctx.fillStyle = 'rgba(25, 12, 30, 0.85)';
    ctx.fillRect(26, 55, width - 52, 310);
    ctx.strokeStyle = '#fda415';
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 55, width - 52, 310);

    ctx.font = '9px "Press Start 2P", monospace';

    let y = 84;
    this.cartridges.forEach((c) => {
      ctx.textAlign = 'left';
      ctx.fillStyle = c.color;
      ctx.fillText(`${c.icon} ${c.title}`, 40, y);

      ctx.fillStyle = '#fff5ea';
      ctx.fillText(c.controls, 40, y + 16);
      y += 44;
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#00f5d4';
    ctx.fillText('[SHIFT + ESC] OR TOP PILL EXITS TO HUB', cx, 315);

    ctx.fillStyle = '#fda415';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText('PRESS [ENTER] OR [ESC] TO RETURN', cx, 348);
  }
}
