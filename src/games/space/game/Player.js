// Player Starfighter Entity

export class Player {
  constructor(stageWidth = 560, stageHeight = 420) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.width = 34;
    this.height = 24;
    this.reset();
  }

  reset() {
    this.x = this.stageWidth / 2;
    this.y = this.stageHeight - 45;
    this.speed = 5.2;
    this.shootCooldown = 0;
    this.lasers = [];
    this.hasDualShot = false;
    this.dualShotTimer = 0;
    this.hasShield = false;
    this.invulnerableTimer = 0;
  }

  update(deltaMs, moveLeft, moveRight) {
    if (moveLeft) this.x -= this.speed;
    if (moveRight) this.x += this.speed;

    // Stage clamping
    const halfW = this.width / 2;
    if (this.x - halfW < 20) this.x = 20 + halfW;
    if (this.x + halfW > this.stageWidth - 20) this.x = this.stageWidth - 20 - halfW;

    if (this.shootCooldown > 0) this.shootCooldown -= deltaMs;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= deltaMs;

    if (this.hasDualShot) {
      this.dualShotTimer -= deltaMs;
      if (this.dualShotTimer <= 0) this.hasDualShot = false;
    }

    // Update lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.y -= l.speed;
      if (l.y < -10) {
        this.lasers.splice(i, 1);
      }
    }
  }

  shoot() {
    if (this.shootCooldown > 0) return false;

    this.shootCooldown = 180; // 180ms fire rate
    if (this.hasDualShot) {
      this.lasers.push(
        { x: this.x - 10, y: this.y - 12, width: 4, height: 12, speed: 9 },
        { x: this.x + 10, y: this.y - 12, width: 4, height: 12, speed: 9 }
      );
    } else {
      this.lasers.push({ x: this.x, y: this.y - 14, width: 4, height: 14, speed: 9 });
    }
    return true;
  }

  hit() {
    if (this.invulnerableTimer > 0) return false;

    if (this.hasShield) {
      this.hasShield = false;
      this.invulnerableTimer = 1000;
      return 'shield_absorbed';
    }

    this.invulnerableTimer = 2000;
    return 'life_lost';
  }

  getHitbox() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Blinking when invulnerable
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Shield Bubble
    if (this.hasShield) {
      ctx.strokeStyle = '#00f5d4';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f5d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Pixel Starfighter Body (Cyan / White / Orange)
    ctx.fillStyle = '#00f5d4'; // Cyan Wings
    ctx.fillRect(-16, 2, 32, 6);
    ctx.fillRect(-12, -4, 24, 6);

    ctx.fillStyle = '#ffffff'; // White Fuselage
    ctx.fillRect(-6, -10, 12, 18);
    ctx.fillRect(-3, -14, 6, 4);

    ctx.fillStyle = '#fda415'; // Amber Thrusters
    ctx.fillRect(-14, 8, 4, 3);
    ctx.fillRect(10, 8, 4, 3);

    // Engine Flame
    const flameH = (Math.floor(Date.now() / 80) % 2 === 0) ? 6 : 9;
    ctx.fillStyle = '#ff334b';
    ctx.fillRect(-4, 8, 8, flameH);

    ctx.restore();

    // Draw Lasers
    ctx.save();
    ctx.fillStyle = '#00f5d4';
    ctx.shadowColor = '#00f5d4';
    ctx.shadowBlur = 8;
    for (const l of this.lasers) {
      ctx.fillRect(l.x - l.width / 2, l.y, l.width, l.height);
    }
    ctx.restore();
  }
}
