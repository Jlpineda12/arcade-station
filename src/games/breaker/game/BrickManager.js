// Multi-Layer Destructible & Indestructible Pixel Bricks

export class BrickManager {
  constructor(stageWidth = 560, stageHeight = 420) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.bricks = [];
    this.currentLevel = 1;
    this.maxLevels = 3;
    this.initLevel(1);
  }

  initLevel(level = 1) {
    this.currentLevel = level;
    this.bricks = [];

    const cols = 10;
    const brickW = 46;
    const brickH = 15;
    const gapX = 5;
    const gapY = 5;
    const totalW = cols * brickW + (cols - 1) * gapX; // 505px
    const startX = Math.round((this.stageWidth - totalW) / 2); // 28px
    const startY = 70;

    if (level === 1) {
      // Level 1: Classic 5-row rainbow wall
      const rows = 5;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let hp = 1;
          let points = 10;
          let color = '#fed136'; // Amber / Yellow

          if (r === 0) {
            hp = 3; points = 50; color = '#fda415'; // Gold
          } else if (r === 1) {
            hp = 2; points = 30; color = '#ff334b'; // Ruby Red
          } else if (r === 2) {
            hp = 1; points = 20; color = '#ff758f'; // Pink
          } else if (r === 3) {
            hp = 1; points = 15; color = '#00f5d4'; // Cyan
          }

          this.bricks.push({
            x: startX + c * (brickW + gapX),
            y: startY + r * (brickH + gapY),
            width: brickW,
            height: brickH,
            maxHp: hp,
            hp,
            points,
            baseColor: color,
            isSilver: false
          });
        }
      }
    } else if (level === 2) {
      // Level 2: Space Invader Grid with Silver Shield Bricks
      const pattern = [
        "  GGGGGG  ",
        " RRRRRRRR ",
        "RRSSR RSSR",
        "CCCCCCCCCC",
        " A  AA  A ",
        "  S    S  "
      ];

      for (let r = 0; r < pattern.length; r++) {
        const line = pattern[r];
        for (let c = 0; c < line.length; c++) {
          const ch = line[c];
          if (ch === ' ') continue;

          let hp = 1;
          let points = 15;
          let color = '#00f5d4';
          let isSilver = false;

          if (ch === 'G') { hp = 3; points = 50; color = '#fda415'; }
          else if (ch === 'R') { hp = 2; points = 30; color = '#ff334b'; }
          else if (ch === 'C') { hp = 1; points = 20; color = '#00f5d4'; }
          else if (ch === 'A') { hp = 1; points = 10; color = '#fed136'; }
          else if (ch === 'S') { hp = 999; points = 0; color = '#a09cb0'; isSilver = true; }

          this.bricks.push({
            x: startX + c * (brickW + gapX),
            y: startY + r * (brickH + gapY),
            width: brickW,
            height: brickH,
            maxHp: hp,
            hp,
            points,
            baseColor: color,
            isSilver
          });
        }
      }
    } else {
      // Level 3: Fortress Citadel
      const rows = 6;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isEdge = (c === 0 || c === cols - 1);
          const isCenter = (c === 4 || c === 5);
          let hp = 2;
          let points = 30;
          let color = '#ff334b';
          let isSilver = false;

          if (isEdge && r < 4) {
            hp = 999; points = 0; color = '#a09cb0'; isSilver = true;
          } else if (isCenter && r === 0) {
            hp = 3; points = 50; color = '#fda415';
          } else if (r % 2 === 0) {
            hp = 1; points = 15; color = '#00f5d4';
          }

          this.bricks.push({
            x: startX + c * (brickW + gapX),
            y: startY + r * (brickH + gapY),
            width: brickW,
            height: brickH,
            maxHp: hp,
            hp,
            points,
            baseColor: color,
            isSilver
          });
        }
      }
    }
  }

  isLevelCleared() {
    return !this.bricks.some(b => !b.isSilver && b.hp > 0);
  }

  getDestructibleCount() {
    return this.bricks.filter(b => !b.isSilver && b.hp > 0).length;
  }

  // Check collision with Ball
  checkBallCollision(ball) {
    for (let i = this.bricks.length - 1; i >= 0; i--) {
      const b = this.bricks[i];
      if (b.hp <= 0) continue;

      // Nearest point on brick rectangle to ball center
      const nearestX = Math.max(b.x, Math.min(ball.x, b.x + b.width));
      const nearestY = Math.max(b.y, Math.min(ball.y, b.y + b.height));

      const dx = ball.x - nearestX;
      const dy = ball.y - nearestY;
      const distSq = dx * dx + dy * dy;

      if (distSq < ball.radius * ball.radius) {
        // Determine collision side (horizontal vs vertical)
        const overlapX = ball.radius - Math.abs(dx);
        const overlapY = ball.radius - Math.abs(dy);

        if (overlapX < overlapY) {
          ball.vx = -ball.vx;
          ball.x += (dx > 0 ? 1 : -1) * overlapX;
        } else {
          ball.vy = -ball.vy;
          ball.y += (dy > 0 ? 1 : -1) * overlapY;
        }

        // Damage brick if not silver
        if (!b.isSilver) {
          b.hp--;
          if (b.hp <= 0) {
            this.bricks.splice(i, 1);
            return { type: 'broken', brick: b };
          }
          return { type: 'hit', brick: b };
        } else {
          return { type: 'silver_bounce', brick: b };
        }
      }
    }
    return null;
  }

  // Check collision with Paddle Lasers
  checkLaserCollision(laser) {
    for (let i = this.bricks.length - 1; i >= 0; i--) {
      const b = this.bricks[i];
      if (b.hp <= 0) continue;

      if (
        laser.x > b.x &&
        laser.x < b.x + b.width &&
        laser.y > b.y &&
        laser.y < b.y + b.height
      ) {
        if (!b.isSilver) {
          b.hp--;
          if (b.hp <= 0) {
            this.bricks.splice(i, 1);
            return { type: 'broken', brick: b };
          }
          return { type: 'hit', brick: b };
        }
        return { type: 'silver_bounce', brick: b };
      }
    }
    return null;
  }

  draw(ctx) {
    ctx.save();
    for (const b of this.bricks) {
      if (b.hp <= 0) continue;

      const px = Math.round(b.x);
      const py = Math.round(b.y);

      // Shading based on current HP ratio
      let color = b.baseColor;
      if (b.isSilver) {
        color = '#a09cb0';
      } else if (b.maxHp === 3 && b.hp === 2) {
        color = '#d6870a';
      } else if (b.maxHp === 3 && b.hp === 1) {
        color = '#9e6205';
      } else if (b.maxHp === 2 && b.hp === 1) {
        color = '#b5172b';
      }

      // Brick Shadow / Bevel
      ctx.fillStyle = '#180c1f';
      ctx.fillRect(px, py, b.width, b.height);

      ctx.fillStyle = color;
      ctx.fillRect(px + 1, py + 1, b.width - 2, b.height - 2);

      // Highlight Bar
      ctx.fillStyle = b.isSilver ? '#e4e2eb' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(px + 2, py + 2, b.width - 4, 2);

      // Silver Brick Cross Pattern
      if (b.isSilver) {
        ctx.fillStyle = '#6e6a7c';
        ctx.fillRect(px + b.width / 2 - 1, py + 2, 2, b.height - 4);
      }
    }
    ctx.restore();
  }
}
