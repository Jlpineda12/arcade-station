// Alien Fleet & Mystery UFO Formation Manager

export class AlienManager {
  constructor(stageWidth = 560, stageHeight = 420) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.aliens = [];
    this.alienLasers = [];
    this.ufo = null;
    this.wave = 1;

    // Movement parameters
    this.dir = 1; // 1 = right, -1 = left
    this.speed = 1.0;
    this.dropDistance = 14;
    this.shootTimer = 0;
    this.ufoTimer = 12000; // Spawns every ~12-16s

    this.initWave(1);
  }

  initWave(wave = 1) {
    this.wave = wave;
    this.aliens = [];
    this.alienLasers = [];
    this.ufo = null;
    this.dir = 1;
    this.speed = 1.0 + (wave * 0.2);

    const rows = 4;
    const cols = 8;
    const spacingX = 42;
    const spacingY = 26;
    const startX = 70;
    const startY = 80;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let type = 'squid';
        let points = 10;
        let color = '#00f5d4'; // Cyan

        if (r === 0) {
          type = 'commander';
          points = 30;
          color = '#ff334b'; // Red
        } else if (r === 1 || r === 2) {
          type = 'crab';
          points = 20;
          color = '#fda415'; // Yellow / Amber
        }

        this.aliens.push({
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          width: 24,
          height: 18,
          type,
          points,
          color,
          alive: true
        });
      }
    }
  }

  getAliveCount() {
    return this.aliens.filter(a => a.alive).length;
  }

  update(deltaMs) {
    const alive = this.aliens.filter(a => a.alive);
    if (alive.length === 0) return 'wave_cleared';

    // Speed scales up as fleet thins out
    const fleetRatio = alive.length / 32;
    const currentSpeed = (this.speed + (1 - fleetRatio) * 2.2) * (deltaMs / 16.6);

    let hitEdge = false;
    for (const a of alive) {
      a.x += this.dir * currentSpeed;
      if (a.x < 30 || a.x > this.stageWidth - 30) {
        hitEdge = true;
      }
    }

    if (hitEdge) {
      this.dir *= -1;
      for (const a of alive) {
        a.y += this.dropDistance;
        // Check invasion game over (reached bottom)
        if (a.y >= 340) {
          return 'invasion_breach';
        }
      }
    }

    // Alien Shooting
    this.shootTimer -= deltaMs;
    if (this.shootTimer <= 0) {
      this.shootTimer = Math.max(500, 1600 - (this.wave * 120));
      // Random alive alien shoots
      const shooter = alive[Math.floor(Math.random() * alive.length)];
      if (shooter) {
        this.alienLasers.push({
          x: shooter.x,
          y: shooter.y + 12,
          width: 3,
          height: 10,
          speed: 4.5
        });
      }
    }

    // Update alien lasers
    for (let i = this.alienLasers.length - 1; i >= 0; i--) {
      const l = this.alienLasers[i];
      l.y += l.speed;
      if (l.y > this.stageHeight) {
        this.alienLasers.splice(i, 1);
      }
    }

    // Mystery UFO Spawning & Update
    this.ufoTimer -= deltaMs;
    if (this.ufoTimer <= 0 && !this.ufo) {
      this.ufo = {
        x: -30,
        y: 54,
        width: 36,
        height: 16,
        speed: 2.8,
        points: Math.floor(Math.random() * 3 + 1) * 100 // 100, 200, or 300 pts
      };
      this.ufoTimer = 16000 + Math.random() * 8000;
    }

    if (this.ufo) {
      this.ufo.x += this.ufo.speed;
      if (this.ufo.x > this.stageWidth + 40) {
        this.ufo = null;
      }
    }

    return null;
  }

  draw(ctx) {
    const animStep = Math.floor(Date.now() / 350) % 2;

    // Draw Aliens
    for (const a of this.aliens) {
      if (!a.alive) continue;
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.fillStyle = a.color;

      // Pixel Art Invaders
      if (a.type === 'commander') {
        // Red UFO / Commander
        ctx.fillRect(-10, -6, 20, 4);
        ctx.fillRect(-12, -2, 24, 6);
        ctx.fillRect(-6, 4, 12, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-4, -1, 3, 3);
        ctx.fillRect(2, -1, 3, 3);
      } else if (a.type === 'crab') {
        // Amber Crab
        ctx.fillRect(-8, -6, 16, 6);
        ctx.fillRect(-10, 0, 20, 6);
        if (animStep === 0) {
          ctx.fillRect(-12, 4, 4, 5);
          ctx.fillRect(8, 4, 4, 5);
        } else {
          ctx.fillRect(-8, 6, 4, 5);
          ctx.fillRect(4, 6, 4, 5);
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-5, -2, 3, 3);
        ctx.fillRect(2, -2, 3, 3);
      } else {
        // Cyan Squid
        ctx.fillRect(-6, -6, 12, 8);
        ctx.fillRect(-10, 2, 20, 4);
        if (animStep === 0) {
          ctx.fillRect(-8, 6, 3, 4);
          ctx.fillRect(5, 6, 3, 4);
        } else {
          ctx.fillRect(-5, 6, 3, 4);
          ctx.fillRect(2, 6, 3, 4);
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -2, 2, 2);
        ctx.fillRect(1, -2, 2, 2);
      }

      ctx.restore();
    }

    // Draw Mystery UFO
    if (this.ufo) {
      ctx.save();
      ctx.translate(this.ufo.x, this.ufo.y);
      ctx.fillStyle = '#ff2a44';
      ctx.fillRect(-16, -2, 32, 6);
      ctx.fillRect(-10, -6, 20, 4);
      ctx.fillRect(-6, 4, 12, 3);
      ctx.fillStyle = '#fee440';
      ctx.fillRect(-12, 0, 4, 2);
      ctx.fillRect(0, 0, 4, 2);
      ctx.fillRect(8, 0, 4, 2);
      ctx.restore();
    }

    // Draw Alien Lasers
    ctx.save();
    ctx.fillStyle = '#ff334b';
    ctx.shadowColor = '#ff334b';
    ctx.shadowBlur = 6;
    for (const l of this.alienLasers) {
      ctx.fillRect(l.x - l.width / 2, l.y, l.width, l.height);
    }
    ctx.restore();
  }
}
