// Falling Power-Up Capsule Entities

export const POWERUP_TYPES = {
  WIDE: { id: 'W', name: 'WIDE PADDLE', color: '#00f5d4', textColor: '#102520' },
  MULTI: { id: 'M', name: 'MULTI-BALL', color: '#fda415', textColor: '#2e1c05' },
  LASER: { id: 'L', name: 'LASER CANNONS', color: '#ff334b', textColor: '#ffffff' },
  SLOW: { id: 'S', name: 'SLOW BALL', color: '#a7f3d0', textColor: '#064e3b' },
  HEART: { id: 'H', name: 'EXTRA HEART', color: '#ff758f', textColor: '#ffffff' }
};

export class PowerUpManager {
  constructor(stageWidth = 560, stageHeight = 420) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.items = [];
  }

  reset() {
    this.items = [];
  }

  spawn(x, y) {
    // 18% chance to spawn a capsule upon breaking a brick
    if (Math.random() > 0.18) return;

    const roll = Math.random();
    let type = POWERUP_TYPES.WIDE;
    if (roll < 0.25) type = POWERUP_TYPES.WIDE;
    else if (roll < 0.50) type = POWERUP_TYPES.MULTI;
    else if (roll < 0.72) type = POWERUP_TYPES.LASER;
    else if (roll < 0.88) type = POWERUP_TYPES.SLOW;
    else type = POWERUP_TYPES.HEART;

    this.items.push({
      x,
      y,
      width: 24,
      height: 14,
      vy: 2.2,
      type
    });
  }

  update(deltaMs, paddle) {
    const collected = [];

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += item.vy;

      // Check collision with paddle
      const halfW = paddle.width / 2;
      if (
        item.y + item.height / 2 >= paddle.y &&
        item.y - item.height / 2 <= paddle.y + paddle.height &&
        item.x + item.width / 2 >= paddle.x - halfW &&
        item.x - item.width / 2 <= paddle.x + halfW
      ) {
        collected.push(item.type);
        this.items.splice(i, 1);
        continue;
      }

      // Check floor boundary
      if (item.y > this.stageHeight + 20) {
        this.items.splice(i, 1);
      }
    }

    return collected;
  }

  draw(ctx) {
    ctx.save();
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const item of this.items) {
      const px = Math.round(item.x - item.width / 2);
      const py = Math.round(item.y - item.height / 2);

      // Pill Background
      ctx.fillStyle = '#1e1024';
      ctx.fillRect(px - 1, py - 1, item.width + 2, item.height + 2);

      ctx.fillStyle = item.type.color;
      ctx.fillRect(px, py, item.width, item.height);

      // Letter Tag
      ctx.fillStyle = item.type.textColor;
      ctx.fillText(item.type.id, item.x, item.y + 1);
    }

    ctx.restore();
  }
}
