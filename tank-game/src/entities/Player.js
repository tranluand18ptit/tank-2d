import { Tank } from './Tank.js';

export class Player extends Tank {
  constructor(x, y, map) {
    super(x, y, map);
    this.speed = 150; // Player is slightly faster
    this.lives = 3;
    this.powerLevel = 1; // 1-4 based on power-ups
  }
  
  shoot(game) {
    let bulletX = this.x + this.width / 2 - 4;
    let bulletY = this.y + this.height / 2 - 4;
    
    switch(this.direction) {
      case 'up':
        bulletY -= 20;
        break;
      case 'down':
        bulletY += 20;
        break;
      case 'left':
        bulletX -= 20;
        break;
      case 'right':
        bulletX += 20;
        break;
    }
    
    if (game) {
      game.shoot('player', bulletX, bulletY, this.direction);
    }
  }
  
  hit() {
    if (this.powerLevel > 1) {
      this.powerLevel--;
    } else {
      super.hit();
    }
  }
  
  getColor() {
    return '#f1c40f'; // Yellow/gold for player
  }
  
  render(ctx) {
    super.render(ctx);
    
    // Render power level indicator
    if (this.powerLevel > 1) {
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(`P${this.powerLevel}`, this.x + 2, this.y - 5);
    }
  }
}
