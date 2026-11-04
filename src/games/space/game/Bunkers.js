// Destructible Pixel Bunkers / Defense Barriers

export class BunkerManager {
  constructor(stageWidth = 560, groundY = 350) {
    this.stageWidth = stageWidth;
    this.groundY = groundY;
    this.bunkers = [];
    this.initBunkers();
  }

  initBunkers() {
    this.bunkers = [];
    const count = 3;
    const bunkerW = 48;
    const bunkerH = 28;
    const spacing = this.stageWidth / (count + 1);
    const startY = this.groundY - 60;

    for (let b = 0; b < count; b++) {
      const bx = spacing * (b + 1) - bunkerW / 2;
      const blocks = [];
      const cols = 6;
      const rows = 4;
      const blockW = bunkerW / cols;
      const blockH = bunkerH / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Arch cutout in bottom center
          if (r === rows - 1 && (c === 2 || c === 3)) continue;
          blocks.push({
            x: bx + c * blockW,
            y: startY + r * blockH,
            width: blockW,
            height: blockH,
            hp: 2 // Takes 2 laser hits to destroy
          });
        }
      }

      this.bunkers.push({ x: bx, y: startY, blocks });
    }
  }

  // Check collision with projectile, returns true if shot is absorbed
  checkCollision(laser) {
    for (const b of this.bunkers) {
      for (let i = b.blocks.length - 1; i >= 0; i--) {
        const blk = b.blocks[i];
        if (
          laser.x > blk.x &&
          laser.x < blk.x + blk.width &&
          laser.y > blk.y &&
          laser.y < blk.y + blk.height
        ) {
          blk.hp--;
          if (blk.hp <= 0) {
            b.blocks.splice(i, 1);
          }
          return true; // Shot absorbed
        }
      }
    }
    return false;
  }

  draw(ctx) {
    ctx.save();
    for (const b of this.bunkers) {
      for (const blk of b.blocks) {
        ctx.fillStyle = blk.hp === 2 ? '#39e75f' : '#22c55e'; // Green energy bunker
        ctx.fillRect(blk.x + 1, blk.y + 1, blk.width - 2, blk.height - 2);
      }
    }
    ctx.restore();
  }
}
