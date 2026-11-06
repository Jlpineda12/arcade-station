// Main Pixel Breaker Arcade Controller

import { renderThemedMenu, drawThemedBackdrop } from './MenuFX.js';
import { Paddle } from './Paddle.js';
import { Ball } from './Ball.js';
import { BrickManager } from './BrickManager.js';
import { PowerUpManager, POWERUP_TYPES } from './PowerUps.js';
import { ParticleSystem } from './Particles.js';

export const GAME_STATES = {
  MENU: 'MENU',
  CONTROLS: 'CONTROLS',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  LEVEL_CLEAR: 'LEVEL_CLEAR',
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
    this.paddle = new Paddle(this.width, this.height);
    this.balls = [new Ball(this.width, this.height)];
    this.bricks = new BrickManager(this.width, this.height);
    this.powerups = new PowerUpManager(this.width, this.height);
    this.particles = new ParticleSystem(this.width, this.height);

    // Scoring & Lives
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('pixel_breaker_hiscore') || '123000', 10);
    this.lives = 5;
    this.maxLives = 5;
    this.combo = 0;

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
          // Launch docked balls or shoot laser
          let launchedAny = false;
          for (const b of this.balls) {
            if (b.stuckToPaddle) {
              b.launch((Math.random() - 0.5) * 0.4);
              launchedAny = true;
            }
          }
          if (launchedAny) {
            this.sfx.paddleHit();
          } else if (this.paddle.hasLasers) {
            if (this.paddle.shootLaser()) {
              this.sfx.laserFire();
            }
          }
        } else if (e.code === 'KeyP' || e.code === 'Escape') {
          this.togglePause();
        }
      } else if (this.state === GAME_STATES.LEVEL_CLEAR) {
        if (e.code === 'Enter' || e.code === 'Space') {
          this.advanceNextLevel();
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
      if (this.state === GAME_STATES.PLAYING) {
        for (const b of this.balls) {
          if (b.stuckToPaddle) b.launch(0);
        }
        if (this.paddle.hasLasers) {
          if (this.paddle.shootLaser()) this.sfx.laserFire();
        }
      }
    });

    // Touch / Pointer controls for smooth mobile paddle dragging
    this.canvas.addEventListener('pointermove', (e) => {
      if (this.state !== GAME_STATES.PLAYING) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const pointerX = (e.clientX - rect.left) * scaleX;
      this.paddle.x = Math.max(20 + this.paddle.width / 2, Math.min(this.width - 20 - this.paddle.width / 2, pointerX));
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
        this.sfx.menuConfirm();
        this.startGame();
      }
    }
  }

  startGame() {
    this.state = GAME_STATES.PLAYING;
    this.score = 0;
    this.lives = this.maxLives;
    this.combo = 0;

    this.paddle.reset();
    this.bricks.initLevel(1);
    this.powerups.reset();

    const mainBall = new Ball(this.width, this.height);
    mainBall.dock(this.paddle);
    this.balls = [mainBall];

    this.music.setMode('game');
  }

  advanceNextLevel() {
    const nextLvl = (this.bricks.currentLevel % this.bricks.maxLevels) + 1;
    this.bricks.initLevel(nextLvl);
    this.paddle.reset();
    this.powerups.reset();
    this.combo = 0;

    const mainBall = new Ball(this.width, this.height);
    mainBall.dock(this.paddle);
    this.balls = [mainBall];

    this.state = GAME_STATES.PLAYING;
    this.music.setMode('game');
  }

  togglePause() {
    if (this.state === GAME_STATES.PLAYING) {
      this.state = GAME_STATES.PAUSED;
      this.music.stop();
    } else if (this.state === GAME_STATES.PAUSED) {
      this.state = GAME_STATES.PLAYING;
      this.music.start('game');
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

    // 1. Paddle movement
    const moveLeft = this.keys['KeyA'] || this.keys['ArrowLeft'];
    const moveRight = this.keys['KeyD'] || this.keys['ArrowRight'];
    this.paddle.update(deltaMs, moveLeft, moveRight);

    // 2. Power-ups update & collection
    const collected = this.powerups.update(deltaMs, this.paddle);
    for (const pType of collected) {
      this.sfx.powerupCollect();
      this.applyPowerUp(pType);
    }

    // 3. Laser collisions with bricks
    if (this.paddle.hasLasers) {
      for (let lIdx = this.paddle.lasers.length - 1; lIdx >= 0; lIdx--) {
        const l = this.paddle.lasers[lIdx];
        const res = this.bricks.checkLaserCollision(l);
        if (res) {
          this.paddle.lasers.splice(lIdx, 1);
          if (res.type === 'broken') {
            this.score += res.brick.points;
            this.particles.explode(res.brick.x + res.brick.width / 2, res.brick.y + res.brick.height / 2, res.brick.baseColor, 12);
            this.sfx.brickBreak();
            this.powerups.spawn(res.brick.x + res.brick.width / 2, res.brick.y + res.brick.height / 2);
          } else if (res.type === 'hit') {
            this.sfx.brickHit(this.combo);
            this.particles.explode(res.brick.x + res.brick.width / 2, res.brick.y + res.brick.height / 2, res.brick.baseColor, 6);
          } else {
            this.sfx.wallBounce();
          }
        }
      }
    }

    // 4. Balls update & physics
    for (let bIdx = this.balls.length - 1; bIdx >= 0; bIdx--) {
      const ball = this.balls[bIdx];
      const event = ball.update(deltaMs, this.paddle);

      if (event === 'lost') {
        this.balls.splice(bIdx, 1);
        continue;
      } else if (event === 'wall_hit') {
        this.sfx.wallBounce();
      } else if (event === 'paddle_hit') {
        this.sfx.paddleHit();
        this.combo = 0; // Reset combo when touching paddle
        this.particles.explode(ball.x, this.paddle.y, '#fda415', 5, 2);
      }

      // Check Ball vs Bricks
      const hit = this.bricks.checkBallCollision(ball);
      if (hit) {
        this.combo++;
        if (hit.type === 'broken') {
          this.score += hit.brick.points;
          this.sfx.brickHit(this.combo);
          this.sfx.brickBreak();
          this.triggerScreenShake(3);
          this.particles.explode(hit.brick.x + hit.brick.width / 2, hit.brick.y + hit.brick.height / 2, hit.brick.baseColor, 14);
          this.powerups.spawn(hit.brick.x + hit.brick.width / 2, hit.brick.y + hit.brick.height / 2);

          if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pixel_breaker_hiscore', this.highScore.toString());
          }
        } else if (hit.type === 'hit') {
          this.sfx.brickHit(this.combo);
          this.particles.explode(hit.brick.x + hit.brick.width / 2, hit.brick.y + hit.brick.height / 2, hit.brick.baseColor, 6);
        } else if (hit.type === 'silver_bounce') {
          this.sfx.wallBounce();
        }
      }
    }

    // 5. Check if all balls were lost
    if (this.balls.length === 0) {
      this.handleBallLost();
    }

    // 6. Check if level is cleared
    if (this.bricks.isLevelCleared()) {
      this.handleLevelClear();
    }
  }

  applyPowerUp(pType) {
    if (pType.id === 'W') {
      this.paddle.setWide(12000);
    } else if (pType.id === 'M') {
      // Spawn 2 extra balls
      const refBall = this.balls[0] || { x: this.paddle.x, y: this.paddle.y - 10, speed: 5.6 };
      for (let i = 0; i < 2; i++) {
        const nb = new Ball(this.width, this.height);
        nb.stuckToPaddle = false;
        nb.x = refBall.x;
        nb.y = refBall.y;
        nb.speed = refBall.speed;
        const angle = (-Math.PI / 2) + (i === 0 ? -0.4 : 0.4);
        nb.vx = nb.speed * Math.cos(angle);
        nb.vy = nb.speed * Math.sin(angle);
        this.balls.push(nb);
      }
    } else if (pType.id === 'L') {
      this.paddle.setLasers(12000);
    } else if (pType.id === 'S') {
      for (const b of this.balls) b.setSlow(9000);
    } else if (pType.id === 'H') {
      if (this.lives < this.maxLives) this.lives++;
    }
  }

  handleBallLost() {
    this.lives--;
    this.combo = 0;
    this.sfx.ballLost();
    this.triggerScreenShake(8);

    if (this.lives > 0) {
      this.paddle.reset();
      const newBall = new Ball(this.width, this.height);
      newBall.dock(this.paddle);
      this.balls = [newBall];
    } else {
      this.triggerGameOver();
    }
  }

  handleLevelClear() {
    this.score += 1000;
    this.state = GAME_STATES.LEVEL_CLEAR;
    this.music.stop();
    this.sfx.levelCleared();
  }

  triggerGameOver() {
    this.state = GAME_STATES.GAME_OVER;
    this.music.stop();
    this.sfx.gameOver();
  }

  render() {
    const { ctx } = this;
    ctx.save();

    // Themed animated backdrop (shared with the title screen)
    drawThemedBackdrop(ctx, 'breaker', this.width, this.height);

    if (this.shakeIntensity > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
      const sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
      ctx.translate(sx, sy);
    }

    // Starfield & Ambient grid
    this.particles.draw(ctx);

    if (this.state === GAME_STATES.MENU) {
      this.renderMenu();
    } else if (this.state === GAME_STATES.CONTROLS) {
      this.renderControls();
    } else {
      // Gameplay Rendering
      this.bricks.draw(ctx);
      this.powerups.draw(ctx);
      this.paddle.draw(ctx);
      for (const b of this.balls) b.draw(ctx);
      this.renderHUD();

      if (this.state === GAME_STATES.PAUSED) {
        this.renderPauseOverlay();
      } else if (this.state === GAME_STATES.LEVEL_CLEAR) {
        this.renderLevelClearOverlay();
      } else if (this.state === GAME_STATES.GAME_OVER) {
        this.renderGameOver();
      }
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

  drawPixelHearts(startX, startY, count) {
    const { ctx } = this;
    const spacing = 28;

    for (let i = 0; i < this.maxLives; i++) {
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
        // Empty Heart Outline
        ctx.fillStyle = 'rgba(90, 50, 100, 0.4)';
        ctx.fillRect(x, y, 14, 14);
      }
    }
  }

  renderMenu() {
    // Themed animated title screen (backdrop, wave title, attract-mode scene)
    renderThemedMenu(this.ctx, {
      id: 'breaker',
      width: this.canvas.width,
      height: this.canvas.height,
      highScore: this.highScore,
      choice: this.selectedChoice
    });
  }

  renderControls() {
    const { ctx, width } = this;
    drawThemedBackdrop(ctx, 'breaker', this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'rgba(8, 3, 14, 0.55)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
      { k: 'ARROWS / [A, D]', d: 'MOVE PADDLE' },
      { k: '[SPACE] / [J]', d: 'LAUNCH / LASER' },
      { k: '[P] / [ESC]', d: 'PAUSE GAME' },
      { k: '[W] CAPSULE', d: 'WIDE PADDLE (12s)' },
      { k: '[M] CAPSULE', d: 'MULTI-BALL (x3)' },
      { k: '[L] CAPSULE', d: 'LASER CANNONS (12s)' },
      { k: 'SILVER BRICKS', d: 'ARMORED / INDESTRUCTIBLE' }
    ];

    let y = 110;
    lines.forEach(item => {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#fda415';
      ctx.fillText(item.k, 60, y);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff5ea';
      ctx.fillText(item.d, width - 60, y);
      y += 29;
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

    // Top-Left: SCORE & LEVEL
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff5ea';
    ctx.fillText('SCORE', 34, 40);

    ctx.fillStyle = '#fda415';
    ctx.fillText(this.score.toString().padStart(6, '0'), 34, 60);

    ctx.fillStyle = '#00f5d4';
    ctx.fillText(`LVL ${this.bricks.currentLevel}`, 130, 60);

    // Combo Counter
    if (this.combo > 1) {
      ctx.fillStyle = '#ff758f';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText(`${this.combo}x COMBO`, 210, 60);
    }

    // Top-Right: 5 Hearts
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

  renderLevelClearOverlay() {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(30, 14, 38, 0.85)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = 'center';
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.fillStyle = '#00f5d4';
    ctx.fillText('LEVEL CLEARED!', this.width / 2, 180);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = '#fda415';
    ctx.fillText('+1000 BONUS POINTS', this.width / 2, 220);

    ctx.fillStyle = '#fff5ea';
    ctx.fillText('PRESS [SPACE] FOR NEXT LEVEL', this.width / 2, 270);
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
    ctx.fillText(`FINAL SCORE: ${this.score}`, this.width / 2, 215);

    ctx.font = '11px "Press Start 2P", monospace';
    ctx.fillStyle = '#fda415';
    ctx.fillText('PRESS [ENTER] TO REPLAY', this.width / 2, 280);

    ctx.fillStyle = '#b39ebd';
    ctx.fillText('PRESS [ESC] FOR MAIN MENU', this.width / 2, 310);
    ctx.restore();
  }
}
