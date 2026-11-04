// Particle Effects & Retro Ambient Starfield

export class ParticleSystem {
  constructor(stageWidth = 560, stageHeight = 420) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.particles = [];
    this.stars = [];
    this.initStars();
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 50; i++) {
      this.stars.push({
        x: Math.random() * this.stageWidth,
        y: Math.random() * this.stageHeight,
        size: Math.random() < 0.3 ? 2 : 1,
        speed: 0.2 + Math.random() * 0.4,
        alpha: 0.2 + Math.random() * 0.6
      });
    }
  }

  explode(x, y, color = '#fda415', count = 10, speed = 3.5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 0.7 + 0.3) * speed;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Math.floor(Math.random() * 3 + 2),
        color,
        life: 1.0,
        decay: 0.025 + Math.random() * 0.025
      });
    }
  }

  update() {
    // Starfield drift
    for (const s of this.stars) {
      s.y += s.speed;
      if (s.y > this.stageHeight) {
        s.y = 0;
        s.x = Math.random() * this.stageWidth;
      }
    }

    // Particles physics
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // Gravity
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();

    // Stars
    for (const s of this.stars) {
      ctx.fillStyle = `rgba(255, 245, 234, ${s.alpha})`;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
    }

    // Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }

    ctx.restore();
  }
}
