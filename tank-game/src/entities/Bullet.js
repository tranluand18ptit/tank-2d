export class Bullet {
  constructor(x, y, direction, owner) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 8;
    this.direction = direction; // up, down, left, right
    this.owner = owner; // 'player' or 'enemy'
    this.speed = 300; // pixels per second
    this.alive = true;
  }
  
  update(deltaTime) {
    const distance = this.speed * (deltaTime / 1000);
    
    switch(this.direction) {
      case 'up':
        this.y -= distance;
        break;
      case 'down':
        this.y += distance;
        break;
      case 'left':
        this.x -= distance;
        break;
      case 'right':
        this.x += distance;
        break;
    }
  }
  
  render(ctx) {
    ctx.fillStyle = this.owner === 'player' ? '#f1c40f' : '#e74c3c';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Add a small glow effect
    ctx.fillStyle = this.owner === 'player' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(231, 76, 60, 0.3)';
    ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
  }
  
  isOutOfBounds(maxWidth, maxHeight) {
    return this.x < 0 || this.x > maxWidth || this.y < 0 || this.y > maxHeight;
  }
}
