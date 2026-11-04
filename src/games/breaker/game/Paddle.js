// Arcade Paddle with Expandable Size and Laser Cannon Attachments

export class Paddle {
  constructor(stageWidth = 560, stageHeight = 420) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.baseWidth = 76;
    this.wideWidth = 106;
    this.width = this.baseWidth;
    this.height = 14;
    this.speed = 7.5;

    this.y = this.stageHeight - 34;
    this.x = this.stageWidth / 2;

    // Power-up states
    this.isWide = false;
    this.wideTimer = 0;

    this.hasLasers = false;
    this.laserTimer = 0;
    this.laserCooldown = 0;
    this.lasers = [];
  }

  reset() {
    this.x = this.stageWidth / 2;
    this.width = this.baseWidth;
    this.isWide = false;
    this.wideTimer = 0;
    this.hasLasers = false;
    this.laserTimer = 0;
    this.laserCooldown = 0;
    this.lasers = [];
  }

  setWide(durationMs = 12000) {
    this.isWide = true;
    this.wideTimer = durationMs;
    this.width = this.wideWidth;
  }

  setLasers(durationMs = 12000) {
    this.hasLasers = true;
    this.laserTimer = durationMs;
  }

  shootLaser() {
    if (!this.hasLasers || this.laserCooldown > 0) return false;

    this.laserCooldown = 220; // 220ms cooldown
    const halfW = this.width / 2;
    this.lasers.push(
      { x: this.x - halfW + 6, y: this.y - 4, width: 4, height: 12, speed: 8 },
      { x: this.x + halfW - 6, y: this.y - 4, width: 4, height: 12, speed: 8 }
    );
    return true;
  }

  update(deltaMs, moveLeft, moveRight) {
    if (moveLeft) this.x -= this.speed;
    if (moveRight) this.x += this.speed;

    // Stage clamping
    const halfW = this.width / 2;
    const minX = 20 + halfW;
    const maxX = this.stageWidth - 20 - halfW;
    if (this.x < minX) this.x = minX;
    if (this.x > maxX) this.x = maxX;

    // Wide timer countdown
    if (this.isWide) {
      this.wideTimer -= deltaMs;
      if (this.wideTimer <= 0) {
        this.isWide = false;
        this.width = this.baseWidth;
      }
    }

    // Laser timer countdown
    if (this.hasLasers) {
      this.laserTimer -= deltaMs;
      if (this.laserTimer <= 0) {
        this.hasLasers = false;
      }
    }

    if (this.laserCooldown > 0) {
      this.laserCooldown -= deltaMs;
    }

    // Update laser projectiles
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.y -= l.speed;
      if (l.y < 0) {
        this.lasers.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    const halfW = this.width / 2;
    const px = Math.round(this.x - halfW);
    const py = Math.round(this.y);

    ctx.save();

    // Main Chassis
    ctx.fillStyle = '#2b1b36';
    ctx.fillRect(px, py, this.width, this.height);

    // Beveled Border
    ctx.fillStyle = this.hasLasers ? '#ff334b' : (this.isWide ? '#00f5d4' : '#fda415');
    ctx.fillRect(px + 2, py + 2, this.width - 4, this.height - 4);

    // Core Highlight
    ctx.fillStyle = '#fff5ea';
    ctx.fillRect(px + 8, py + 4, this.width - 16, 3);

    // Side Caps
    ctx.fillStyle = '#1c0f24';
    ctx.fillRect(px, py, 4, this.height);
    ctx.fillRect(px + this.width - 4, py, 4, this.height);

    // Laser Cannons Attachment (if active)
    if (this.hasLasers) {
      ctx.fillStyle = '#ff334b';
      ctx.fillRect(px - 2, py - 6, 5, 8);
      ctx.fillRect(px + this.width - 3, py - 6, 5, 8);
      ctx.fillStyle = '#fda415';
      ctx.fillRect(px, py - 6, 1, 2);
      ctx.fillRect(px + this.width - 1, py - 6, 1, 2);
    }

    // Draw active lasers
    ctx.fillStyle = '#ff334b';
    for (const l of this.lasers) {
      ctx.fillRect(l.x - l.width / 2, l.y, l.width, l.height);
      ctx.fillStyle = '#fda415';
      ctx.fillRect(l.x - 1, l.y + 2, 2, l.height - 4);
      ctx.fillStyle = '#ff334b';
    }

    ctx.restore();
  }
}
