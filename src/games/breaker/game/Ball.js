// Breakout Ball with Angular Ricochet & Multi-ball Physics

export class Ball {
  constructor(stageWidth = 560, stageHeight = 420) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.radius = 5.5;
    this.baseSpeed = 5.6;
    this.maxSpeed = 8.5;
    this.speed = this.baseSpeed;

    this.x = stageWidth / 2;
    this.y = stageHeight - 45;
    this.vx = 0;
    this.vy = 0;
    this.stuckToPaddle = true;

    this.trail = [];
    this.slowTimer = 0;
  }

  dock(paddle) {
    this.stuckToPaddle = true;
    this.x = paddle.x;
    this.y = paddle.y - this.radius - 2;
    this.vx = 0;
    this.vy = 0;
    this.speed = this.baseSpeed;
    this.trail = [];
  }

  launch(angleOffset = 0) {
    if (!this.stuckToPaddle) return;
    this.stuckToPaddle = false;
    const angle = (-Math.PI / 2) + angleOffset;
    this.vx = this.speed * Math.cos(angle);
    this.vy = this.speed * Math.sin(angle);
  }

  setSlow(durationMs = 9000) {
    this.slowTimer = durationMs;
    this.speed = Math.max(4.0, this.baseSpeed * 0.75);
    const currMag = Math.hypot(this.vx, this.vy);
    if (currMag > 0) {
      this.vx = (this.vx / currMag) * this.speed;
      this.vy = (this.vy / currMag) * this.speed;
    }
  }

  update(deltaMs, paddle) {
    if (this.stuckToPaddle) {
      this.x = paddle.x;
      this.y = paddle.y - this.radius - 2;
      return null;
    }

    if (this.slowTimer > 0) {
      this.slowTimer -= deltaMs;
      if (this.slowTimer <= 0) {
        this.speed = this.baseSpeed;
        const currMag = Math.hypot(this.vx, this.vy);
        if (currMag > 0) {
          this.vx = (this.vx / currMag) * this.speed;
          this.vy = (this.vy / currMag) * this.speed;
        }
      }
    }

    // Save trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 5) this.trail.shift();

    // Move
    this.x += this.vx;
    this.y += this.vy;

    let event = null;

    // Left / Right Walls
    const minX = 22 + this.radius;
    const maxX = this.stageWidth - 22 - this.radius;
    if (this.x <= minX) {
      this.x = minX;
      this.vx = Math.abs(this.vx);
      event = 'wall_hit';
    } else if (this.x >= maxX) {
      this.x = maxX;
      this.vx = -Math.abs(this.vx);
      event = 'wall_hit';
    }

    // Top Wall (HUD clearance)
    const minY = 36 + this.radius;
    if (this.y <= minY) {
      this.y = minY;
      this.vy = Math.abs(this.vy);
      event = 'wall_hit';
    }

    // Bottom Stage Exit (Ball lost)
    if (this.y > this.stageHeight + 10) {
      return 'lost';
    }

    // Collision with Paddle
    const halfW = paddle.width / 2;
    if (
      this.vy > 0 &&
      this.y + this.radius >= paddle.y &&
      this.y - this.radius <= paddle.y + paddle.height &&
      this.x + this.radius >= paddle.x - halfW &&
      this.x - this.radius <= paddle.x + halfW
    ) {
      // Angular deflection based on where ball hits paddle
      const offset = (this.x - paddle.x) / halfW; // -1.0 (left edge) to 1.0 (right edge)
      const clampedOffset = Math.max(-0.92, Math.min(0.92, offset));
      const maxBounceAngle = Math.PI * 0.38; // 68 degrees
      const angle = clampedOffset * maxBounceAngle;

      // Slight acceleration on paddle bounce
      if (this.slowTimer <= 0 && this.speed < this.maxSpeed) {
        this.speed = Math.min(this.maxSpeed, this.speed + 0.08);
      }

      this.vx = this.speed * Math.sin(angle);
      this.vy = -Math.abs(this.speed * Math.cos(angle));
      this.y = paddle.y - this.radius - 1;
      return 'paddle_hit';
    }

    return event;
  }

  draw(ctx) {
    ctx.save();

    // Draw trail
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const alpha = (i + 1) / (this.trail.length * 3);
      ctx.fillStyle = `rgba(253, 164, 21, ${alpha})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.radius * 0.75, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ball outer ring
    ctx.fillStyle = '#fda415';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 1, 0, Math.PI * 2);
    ctx.fill();

    // Ball inner core
    ctx.fillStyle = '#fff5ea';
    ctx.beginPath();
    ctx.arc(this.x - 1, this.y - 1, this.radius - 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
