export class Tank {
  constructor(x, y, map) {
    this.x = x;
    this.y = y;
    this.map = map;
    this.width = 40;
    this.height = 40;
    this.speed = 120; // pixels per second
    this.direction = 'up'; // up, down, left, right
    this.alive = true;
    this.moveCooldown = 0;
    this.shootCooldown = 0;
    this.shootDelay = 500; // ms between shots
  }
  
  update(deltaTime, inputHandler) {
    if (!this.alive) return;
    
    // Update cooldowns
    if (this.moveCooldown > 0) {
      this.moveCooldown -= deltaTime;
    }
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }
    
    // Handle movement
    const direction = inputHandler.getDirection();
    if (direction && this.moveCooldown <= 0) {
      this.direction = direction;
      this.move(direction, deltaTime);
    }
    
    // Handle shooting
    if (inputHandler.isShooting() && this.shootCooldown <= 0) {
      this.shoot();
      this.shootCooldown = this.shootDelay;
    }
  }
  
  move(direction, deltaTime) {
    const distance = this.speed * (deltaTime / 1000);
    let newX = this.x;
    let newY = this.y;
    
    switch(direction) {
      case 'up':
        newY -= distance;
        break;
      case 'down':
        newY += distance;
        break;
      case 'left':
        newX -= distance;
        break;
      case 'right':
        newX += distance;
        break;
    }
    
    // Check collision with map boundaries
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + this.width > this.map.width) newX = this.map.width - this.width;
    if (newY + this.height > this.map.height) newY = this.map.height - this.height;
    
    // Check collision with map tiles
    if (!this.map.checkTankCollision(newX, newY, this.width, this.height)) {
      this.x = newX;
      this.y = newY;
    }
  }
  
  shoot() {
    // To be implemented by subclasses
    console.log('Shoot!');
  }
  
  hit() {
    this.alive = false;
  }
  
  render(ctx) {
    // Base tank body
    ctx.fillStyle = this.getColor();
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Cannon based on direction
    ctx.fillStyle = '#333';
    const cannonWidth = 8;
    const cannonLength = 20;
    
    let cannonX = this.x + this.width / 2 - cannonWidth / 2;
    let cannonY = this.y + this.height / 2 - cannonWidth / 2;
    let cannonW = cannonWidth;
    let cannonH = cannonWidth;
    
    switch(this.direction) {
      case 'up':
        cannonY -= cannonLength;
        cannonH = cannonLength;
        break;
      case 'down':
        cannonY += cannonWidth;
        cannonH = cannonLength;
        break;
      case 'left':
        cannonX -= cannonLength;
        cannonW = cannonLength;
        break;
      case 'right':
        cannonX += cannonWidth;
        cannonW = cannonLength;
        break;
    }
    
    ctx.fillRect(cannonX, cannonY, cannonW, cannonH);
    
    // Tank treads
    ctx.fillStyle = '#222';
    const treadWidth = 6;
    switch(this.direction) {
      case 'up':
      case 'down':
        ctx.fillRect(this.x, this.y, treadWidth, this.height);
        ctx.fillRect(this.x + this.width - treadWidth, this.y, treadWidth, this.height);
        break;
      case 'left':
      case 'right':
        ctx.fillRect(this.x, this.y, this.width, treadWidth);
        ctx.fillRect(this.x, this.y + this.height - treadWidth, this.width, treadWidth);
        break;
    }
  }
  
  getColor() {
    return '#444';
  }
}
