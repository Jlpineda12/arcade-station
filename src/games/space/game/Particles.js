// Particle System & Parallax Starfield

export class ParticleSystem {
  constructor(width = 560, height = 420) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.stars = [];
    this.initStars(60);
  }

  initStars(count = 60) {
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() < 0.7 ? 1.5 : 2.5,
        speed: Math.random() * 0.8 + 0.3,
        alpha: Math.random() * 0.8 + 0.2
      });
    }
  }

  // Explosion burst
  explode(x, y, color = '#fda415', count = 16, speed = 4) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const vel = (Math.random() * 0.8 + 0.2) * speed;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * vel,
        vy: Math.sin(angle) * vel,
        size: Math.random() < 0.5 ? 3 : 5,
        color,
        alpha: 1.0,
        decay: Math.random() * 0.04 + 0.025
      });
    }
  }

  update() {
    // Scroll starfield
    for (const s of this.stars) {
      s.y += s.speed;
      if (s.y > this.height) {
        s.y = 0;
        s.x = Math.random() * this.width;
      }
    }

    // Update explosion particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // 1. Draw Starfield
    ctx.save();
    for (const s of this.stars) {
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    }

    // 2. Draw Particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    }
    ctx.restore();
  }

  clear() {
    this.particles = [];
  }
}
