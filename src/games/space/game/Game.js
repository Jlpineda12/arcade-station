// Main Space Arcade Controller

import { Player } from './Player.js';
import { AlienManager } from './AlienManager.js';
import { BunkerManager } from './Bunkers.js';
import { ParticleSystem } from './Particles.js';

export const GAME_STATES = {
  MENU: 'MENU',
  CONTROLS: 'CONTROLS',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER'
};

export class Game {
  constructor(canvas, synth, sfx, music) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.synth = synth;
    this.sfx = sfx;
    this.music = music;

    this.width = 560;
    this.height = 420;
    this.state = GAME_STATES.MENU;

    // Entities
    this.player = new Player(this.width, this.height);
    this.aliens = new AlienManager(this.width, this.height);
    this.bunkers = new BunkerManager(this.width, 350);
    this.particles = new ParticleSystem(this.width, this.height);

    // Scoring & Lives
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('pixel_space_hiscore') || '123000', 10);
    this.lives = 5;
    this.maxLives = 5;
    this.bombs = 1;

    // Timing & Juice
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9;
    this.keys = {};

    // Menu Selection
    this.selectedChoice = 'YES';

    this.setupInputs();
  }

  setupInputs() {
    window.addEventListener('keydown', (e) => {
      if (!this.synth.initialized) {
        this.synth.init();
        this.music.start('menu');
      }

      this.keys[e.code] = true;

      if (this.state === GAME_STATES.MENU) {
        if (e.code === 'KeyC') {
          this.sfx.menuConfirm();
          this.state = GAME_STATES.CONTROLS;
        } else {
          this.handleMenuInput(e);
        }
      } else if (this.state === GAME_STATES.CONTROLS) {
        if (e.code === 'Enter' || e.code === 'Escape' || e.code === 'Space' || e.code === 'KeyC') {
          this.sfx.menuConfirm();
          this.state = GAME_STATES.MENU;
        }
      } else if (this.state === GAME_STATES.PLAYING) {
        if (e.code === 'Space' || e.code === 'KeyJ' || e.code === 'KeyZ') {
          if (this.player.shoot()) this.sfx.laser();
        } else if (e.code === 'KeyK' || e.code === 'KeyX' || e.code === 'KeyB') {
          this.useSmartBomb();
        } else if (e.code === 'KeyP' || e.code === 'Escape') {
          this.togglePause();
        }
      } else if (this.state === GAME_STATES.GAME_OVER) {
        if (e.code === 'Enter' || e.code === 'Space') {
          this.sfx.coinInsert();
          this.startGame();
        } else if (e.code === 'Escape') {
          this.state = GAME_STATES.MENU;
          this.music.setMode('menu');
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    this.canvas.addEventListener('click', () => {
      if (!this.synth.initialized) {
        this.synth.init();
        this.music.start('menu');
      }

      if (this.state === GAME_STATES.MENU) {
        this.sfx.coinInsert();
        this.startGame();
      } else if (this.state === GAME_STATES.CONTROLS) {
        this.state = GAME_STATES.MENU;
      } else if (this.state === GAME_STATES.GAME_OVER) {
        this.sfx.coinInsert();
        this.startGame();
      }
    });
  }

  handleMenuInput(e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      if (this.selectedChoice !== 'YES') {
        this.selectedChoice = 'YES';
        this.sfx.menuMove();
      }
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      if (this.selectedChoice !== 'NO') {
        this.selectedChoice = 'NO';
        this.sfx.menuMove();
      }
    } else if (e.code === 'Enter' || e.code === 'Space') {
      if (this.selectedChoice === 'YES') {
        this.sfx.coinInsert();
        this.startGame();
      } else {
        this.sfx.menuConfirm();
        setTimeout(() => { this.selectedChoice = 'YES'; }, 400);
      }
    }
  }

  startGame() {
    this.score = 0;
    this.lives = this.maxLives;
    this.bombs = 1;
    this.player.reset();
    this.aliens.initWave(1);
    this.bunkers.initBunkers();
    this.particles.clear();
    this.state = GAME_STATES.PLAYING;
    this.music.setMode('space');
  }

  togglePause() {
    if (this.state === GAME_STATES.PLAYING) {
      this.state = GAME_STATES.PAUSED;
      this.music.stop();
    } else if (this.state === GAME_STATES.PAUSED) {
      this.state = GAME_STATES.PLAYING;
      this.music.start('space');
    }
  }

  useSmartBomb() {
    if (this.bombs <= 0) return;
    this.bombs--;
    this.sfx.bombBlast();
    this.triggerScreenShake(12);

    // Clear all alien lasers and destroy all active aliens
    this.aliens.alienLasers = [];
    for (const a of this.aliens.aliens) {
      if (a.alive) {
        a.alive = false;
        this.score += a.points;
        this.particles.explode(a.x, a.y, a.color, 12);
      }
    }
  }

  triggerScreenShake(intensity = 6) {
    this.shakeIntensity = intensity;
  }

  update(timestamp) {
    const deltaMs = 16.6;
    this.particles.update();

    if (this.shakeIntensity > 0.05) {
      this.shakeIntensity *= this.shakeDecay;
    } else {
      this.shakeIntensity = 0;
    }

    if (this.state !== GAME_STATES.PLAYING) return;

    // 1. Player Movement
    const moveLeft = this.keys['KeyA'] || this.keys['ArrowLeft'];
    const moveRight = this.keys['KeyD'] || this.keys['ArrowRight'];
    this.player.update(deltaMs, moveLeft, moveRight);

    // 2. Alien Fleet Update
    const alienStatus = this.aliens.update(deltaMs);
    this.music.setAlienCountRatio(this.aliens.getAliveCount(), 32);

    if (alienStatus === 'wave_cleared') {
      this.score += 500;
      this.aliens.initWave(this.aliens.wave + 1);
      this.bunkers.initBunkers(); // Restore bunkers on next wave
      this.sfx.powerup();
    } else if (alienStatus === 'invasion_breach') {
      this.triggerGameOver();
      return;
    }

    // 3. Collision: Player Lasers vs Aliens
    for (let lIdx = this.player.lasers.length - 1; lIdx >= 0; lIdx--) {
      const laser = this.player.lasers[lIdx];
      let absorbed = false;

      // Check Bunkers
      if (this.bunkers.checkCollision(laser)) {
        this.player.lasers.splice(lIdx, 1);
        continue;
      }

      // Check Aliens
      for (const a of this.aliens.aliens) {
        if (!a.alive) continue;
        if (
          laser.x > a.x - a.width / 2 &&
          laser.x < a.x + a.width / 2 &&
          laser.y > a.y - a.height / 2 &&
          laser.y < a.y + a.height / 2
        ) {
          a.alive = false;
          absorbed = true;
          this.score += a.points;
          this.particles.explode(a.x, a.y, a.color, 14);
          this.sfx.alienExplode();
          this.triggerScreenShake(3);

          // Chance to drop power-up
          if (Math.random() < 0.1) {
            this.player.hasDualShot = true;
            this.player.dualShotTimer = 10000;
            this.sfx.powerup();
          }

          if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pixel_space_hiscore', this.highScore.toString());
          }
          break;
        }
      }

      // Check Mystery UFO
      if (!absorbed && this.aliens.ufo) {
        const u = this.aliens.ufo;
        if (
          laser.x > u.x - u.width / 2 &&
          laser.x < u.x + u.width / 2 &&
          laser.y > u.y - u.height / 2 &&
          laser.y < u.y + u.height / 2
        ) {
          absorbed = true;
          this.score += u.points;
          this.particles.explode(u.x, u.y, '#fee440', 24, 6);
          this.sfx.powerup();
          this.aliens.ufo = null;
        }
      }

      if (absorbed) {
        this.player.lasers.splice(lIdx, 1);
      }
    }

    // 4. Collision: Alien Lasers vs Player & Bunkers
    for (let aIdx = this.aliens.alienLasers.length - 1; aIdx >= 0; aIdx--) {
      const aLaser = this.aliens.alienLasers[aIdx];

      // Bunker absorption
      if (this.bunkers.checkCollision(aLaser)) {
        this.aliens.alienLasers.splice(aIdx, 1);
        continue;
      }

      // Player collision
      const pBox = this.player.getHitbox();
      if (
        aLaser.x > pBox.x &&
        aLaser.x < pBox.x + pBox.width &&
        aLaser.y > pBox.y &&
        aLaser.y < pBox.y + pBox.height
      ) {
        this.aliens.alienLasers.splice(aIdx, 1);
        const result = this.player.hit();
        if (result === 'shield_absorbed') {
          this.sfx.shieldHit();
          this.triggerScreenShake(5);
        } else if (result === 'life_lost') {
          this.handlePlayerDeath();
        }
      }
    }
  }

  handlePlayerDeath() {
    this.lives--;
    this.sfx.playerExplode();
    this.triggerScreenShake(12);
    this.particles.explode(this.player.x, this.player.y, '#00f5d4', 22, 5);

    if (this.lives > 0) {
      this.player.reset();
    } else {
      this.triggerGameOver();
    }
  }

  triggerGameOver() {
    this.state = GAME_STATES.GAME_OVER;
    this.music.stop();
    this.sfx.playerExplode();
  }

  render() {
    const { ctx } = this;
    ctx.save();

    // Plum / Space background (#24132b)
    ctx.fillStyle = '#24132b';
    ctx.fillRect(0, 0, this.width, this.height);

    if (this.shakeIntensity > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
      const sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
      ctx.translate(sx, sy);
    }

    // Starfield & Particles
    this.particles.draw(ctx);

    if (this.state === GAME_STATES.MENU) {
      this.renderMenu();
    } else if (this.state === GAME_STATES.CONTROLS) {
      this.renderControls();
    } else {
      // Bunkers
      this.bunkers.draw(ctx);

      // Aliens
      this.aliens.draw(ctx);

      // Player
      this.player.draw(ctx);

      // HUD
      this.renderHUD();

      if (this.state === GAME_STATES.PAUSED) {
        this.renderPauseOverlay();
      } else if (this.state === GAME_STATES.GAME_OVER) {
        this.renderGameOver();
      }
    }

    // Glass specular reflections
    this.drawGlassReflections();

    ctx.restore();
  }

  renderMenu() {
    const { ctx, width } = this;
    ctx.save();
    ctx.textAlign = 'center';
    const cx = width / 2;

    // Top-Left: HI-SCORE
    ctx.textAlign = 'left';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText('HI-SCORE', 34, 46);

    ctx.fillStyle = '#fda415';
    ctx.fillText(this.highScore.toString().padStart(6, '0'), 34, 72);

    // Top-Right: 5 Orange Pixel Hearts
    this.drawPixelHearts(380, 36, 5);

    // Center Big Orange Title: SPACE
    ctx.textAlign = 'center';
    ctx.font = '50px "Press Start 2P", monospace';
    ctx.fillStyle = '#7d3309';
    ctx.fillText('SPACE', cx, 194);

    ctx.fillStyle = '#fc7814';
    ctx.fillText('SPACE', cx, 190);

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 140, width, 26);
    ctx.clip();
    ctx.fillStyle = '#fda415';
    ctx.fillText('SPACE', cx, 190);
    ctx.restore();

    ctx.font = '11px "Press Start 2P", monospace';
    ctx.fillStyle = '#00f5d4';
    ctx.fillText('★ RETRO INVADERS 1984 ★', cx, 230);

    // Subtitle: ARE YOU READY?
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText('ARE YOU READY?', cx, 295);

    // Options: YES ◀       NO
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText('YES', 230, 354);

    if (this.selectedChoice === 'YES') {
      ctx.fillStyle = '#fda415';
      ctx.beginPath();
      ctx.moveTo(244, 346);
      ctx.lineTo(258, 338);
      ctx.lineTo(258, 354);
      ctx.closePath();
      ctx.fill();
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText('NO', 320, 354);

    if (this.selectedChoice === 'NO') {
      ctx.fillStyle = '#fda415';
      ctx.beginPath();
      ctx.moveTo(366, 346);
      ctx.lineTo(380, 338);
      ctx.lineTo(380, 354);
      ctx.closePath();
      ctx.fill();
    }

    // Controls prompt
    ctx.textAlign = 'center';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#b39ebd';
    ctx.fillText('PRESS [C] FOR CONTROLS', cx, 392);

    ctx.restore();
  }

  renderControls() {
    const { ctx, width } = this;
    ctx.save();
    ctx.textAlign = 'center';
    const cx = width / 2;

    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillStyle = '#fda415';
    ctx.fillText('★ HOW TO PLAY ★', cx, 55);

    // Box
    ctx.fillStyle = 'rgba(25, 12, 30, 0.75)';
    ctx.fillRect(40, 75, width - 80, 265);
    ctx.strokeStyle = '#fda415';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 75, width - 80, 265);

    ctx.font = '10px "Press Start 2P", monospace';
    const lines = [
      { k: 'ARROWS / [A, D]', d: 'MOVE STARFIGHTER' },
      { k: '[SPACE] / [J]', d: 'FIRE LASER CANNON' },
      { k: '[K] / [X]', d: 'USE SMART BOMB' },
      { k: '[P] / [ESC]', d: 'PAUSE GAME' },
      { k: 'GREEN BUNKERS', d: 'ABSORB LASER HITS' },
      { k: 'RED MYSTERY UFO', d: '+100-300 BONUS PTS' }
    ];

    let y = 115;
    lines.forEach(item => {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#fda415';
      ctx.fillText(item.k, 65, y);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff5ea';
      ctx.fillText(item.d, width - 65, y);
      y += 34;
    });

    ctx.textAlign = 'center';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText('PRESS [ENTER] OR [ESC] TO RETURN', cx, 375);

    ctx.restore();
  }

  renderHUD() {
    const { ctx } = this;
    ctx.save();

    // Top-Left: SCORE & WAVE
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText('SCORE', 34, 40);

    ctx.fillStyle = '#fda415';
    ctx.fillText(this.score.toString().padStart(6, '0'), 34, 62);

    ctx.fillStyle = '#00f5d4';
    ctx.fillText(`WAVE ${this.aliens.wave}`, 34, 82);

    // Top-Right: Remaining Lives
    this.drawPixelHearts(380, 32, this.lives);

    ctx.restore();
  }

  renderPauseOverlay() {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(30, 14, 38, 0.8)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = 'center';
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.fillStyle = '#fda415';
    ctx.fillText('PAUSED', this.width / 2, this.height / 2);

    ctx.font = '11px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText('PRESS [P] OR [ESC] TO RESUME', this.width / 2, this.height / 2 + 36);
    ctx.restore();
  }

  renderGameOver() {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(30, 14, 38, 0.88)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = 'center';
    ctx.font = '26px "Press Start 2P", monospace';
    ctx.fillStyle = '#ff334b';
    ctx.fillText('GAME OVER', this.width / 2, 170);

    ctx.font = '13px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText(`SCORE: ${this.score}`, this.width / 2, 220);

    ctx.fillStyle = '#fda415';
    ctx.fillText(`BEST: ${this.highScore}`, this.width / 2, 250);

    const blink = Math.floor(Date.now() / 400) % 2 === 0;
    if (blink) {
      ctx.fillStyle = '#fff5ea';
      ctx.fillText('PRESS [ENTER] TO RETRY', this.width / 2, 315);
    }
    ctx.restore();
  }

  drawPixelHearts(startX, startY, count) {
    const { ctx } = this;
    const heartSpacing = 26;
    for (let i = 0; i < 5; i++) {
      const hx = startX + (i * heartSpacing);
      const isFilled = i < count;
      const px = 2.6;
      const rows = [
        [0,1,1,0,1,1,0],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [0,1,1,1,1,1,0],
        [0,0,1,1,1,0,0],
        [0,0,0,1,0,0,0]
      ];
      ctx.save();
      for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < rows[r].length; c++) {
          if (rows[r][c] === 1) {
            ctx.fillStyle = !isFilled ? '#482c52' : (r < 3 ? '#fda415' : '#fc7814');
            ctx.fillRect(hx + (c * px), startY + (r * px), px, px);
          }
        }
      }
      ctx.restore();
    }
  }

  drawGlassReflections() {
    const { ctx } = this;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(35, 140);
    ctx.quadraticCurveTo(38, 60, 120, 36);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(this.width - 35, 150);
    ctx.quadraticCurveTo(this.width - 38, 70, this.width - 110, 42);
    ctx.stroke();
    ctx.restore();
  }
}
