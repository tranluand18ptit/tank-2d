import { Tank } from './Tank.js';

export class Enemy extends Tank {
  constructor(x, y, map) {
    super(x, y, map);
    this.speed = 80; // Enemies are slower
    this.direction = 'down';
    this.moveTimer = 0;
    this.moveInterval = 1000; // Change direction every second
    this.shootTimer = 0;
    this.shootInterval = 1500; // Shoot every 1.5 seconds
    this.scoreValue = 100;
    this.type = 'basic'; // basic, fast, armor
  }
  
  update(deltaTime, player, bullets, map) {
    if (!this.alive) return;
    
    // Update timers
    this.moveTimer += deltaTime;
    this.shootTimer += deltaTime;
    
    // AI Movement - simple random movement with direction changes
    if (this.moveTimer >= this.moveInterval) {
      this.changeDirection();
      this.moveTimer = 0;
    }
    
    // Move in current direction
    this.move(this.direction, deltaTime);
    
    // AI Shooting - shoot randomly or when player is in line of sight
    if (this.shootTimer >= this.shootInterval) {
      if (this.canSeePlayer(player)) {
        this.shoot(bullets);
        this.shootTimer = 0;
      } else if (Math.random() < 0.3) {
        // 30% chance to shoot even without seeing player
        this.shoot(bullets);
        this.shootTimer = 0;
      }
    }
  }
  
  changeDirection() {
    const directions = ['up', 'down', 'left', 'right'];
    // Prefer moving down towards the base
    if (Math.random() < 0.4) {
      this.direction = 'down';
    } else {
      this.direction = directions[Math.floor(Math.random() * directions.length)];
    }
  }
  
  canSeePlayer(player) {
    if (!player || !player.alive) return false;
    
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const myCenterX = this.x + this.width / 2;
    const myCenterY = this.y + this.height / 2;
    
    // Check if player is in the same row or column
    switch(this.direction) {
      case 'up':
        return Math.abs(playerCenterX - myCenterX) < 20 && playerCenterY < myCenterY;
      case 'down':
        return Math.abs(playerCenterX - myCenterX) < 20 && playerCenterY > myCenterY;
      case 'left':
        return Math.abs(playerCenterY - myCenterY) < 20 && playerCenterX < myCenterX;
      case 'right':
        return Math.abs(playerCenterY - myCenterY) < 20 && playerCenterX > myCenterX;
    }
    
    return false;
  }
  
  shoot(bullets) {
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
    
    // Create bullet and add to bullets array
    const bullet = {
      x: bulletX,
      y: bulletY,
      width: 8,
      height: 8,
      direction: this.direction,
      owner: 'enemy',
      speed: 200,
      update: function(deltaTime) {
        const distance = this.speed * (deltaTime / 1000);
        switch(this.direction) {
          case 'up': this.y -= distance; break;
          case 'down': this.y += distance; break;
          case 'left': this.x -= distance; break;
          case 'right': this.x += distance; break;
        }
      },
      render: function(ctx) {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x, this.y, this.width, this.height);
      },
      isOutOfBounds: function(maxWidth, maxHeight) {
        return this.x < 0 || this.x > maxWidth || this.y < 0 || this.y > maxHeight;
      }
    };
    
    bullets.push(bullet);
  }
  
  hit() {
    this.alive = false;
  }
  
  getColor() {
    switch(this.type) {
      case 'fast':
        return '#e67e22'; // Orange
      case 'armor':
        return '#9b59b6'; // Purple
      default:
        return '#e74c3c'; // Red for basic
    }
  }
  
  render(ctx) {
    super.render(ctx);
    
    // Render enemy type indicator
    if (this.type === 'armor') {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
    }
  }
}
