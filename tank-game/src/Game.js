import { InputHandler } from './utils/InputHandler.js';
import { CollisionDetector } from './utils/CollisionDetector.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Bullet } from './entities/Bullet.js';
import { Map } from './levels/Map.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Set canvas size (standard NES resolution scaled up)
    this.canvas.width = 520;
    this.canvas.height = 520;
    
    // Game state
    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.lives = 3;
    this.stage = 1;
    this.lastTime = 0;
    
    // Game objects
    this.player = null;
    this.enemies = [];
    this.bullets = [];
    this.map = null;
    
    // Systems
    this.inputHandler = new InputHandler();
    this.collisionDetector = new CollisionDetector();
    
    // Callbacks
    this.onGameOver = null;
    this.onScoreUpdate = null;
    this.onLivesUpdate = null;
    this.onStageUpdate = null;
    
    // Enemy spawn timer
    this.enemySpawnTimer = 0;
    this.enemySpawnInterval = 3000; // ms
    this.maxEnemies = 4;
    this.enemiesToSpawn = 20;
    this.enemiesSpawned = 0;
    
    // Base (eagle) state
    this.baseDestroyed = false;
    this.basePosition = { x: 240, y: 480 };
  }
  
  start() {
    this.reset();
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }
  
  reset() {
    this.score = 0;
    this.lives = 3;
    this.stage = 1;
    this.baseDestroyed = false;
    this.enemiesSpawned = 0;
    this.enemiesToSpawn = 20;
    
    this.initLevel();
    
    // Update UI
    if (this.onScoreUpdate) this.onScoreUpdate(this.score);
    if (this.onLivesUpdate) this.onLivesUpdate(this.lives);
    if (this.onStageUpdate) this.onStageUpdate(this.stage);
  }
  
  initLevel() {
    // Create map
    this.map = new Map(this.canvas.width, this.canvas.height, this.stage);
    
    // Create player at starting position
    this.player = new Player(160, 480, this.map);
    
    // Reset enemies and bullets
    this.enemies = [];
    this.bullets = [];
    this.enemiesSpawned = 0;
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }
  
  gameOver() {
    this.isRunning = false;
    if (this.onGameOver) {
      this.onGameOver(this.score);
    }
  }
  
  gameLoop(currentTime) {
    if (!this.isRunning || this.isPaused) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Update game state
    this.update(deltaTime);
    
    // Render
    this.render();
    
    // Continue loop
    requestAnimationFrame((time) => this.gameLoop(time));
  }
  
  update(deltaTime) {
    // Update player
    if (this.player && this.player.alive) {
      this.player.update(deltaTime, this.inputHandler);
    }
    
    // Update bullets
    this.bullets.forEach((bullet, index) => {
      bullet.update(deltaTime);
      if (bullet.isOutOfBounds(this.canvas.width, this.canvas.height)) {
        this.bullets.splice(index, 1);
      }
    });
    
    // Update enemies
    this.enemies.forEach((enemy, index) => {
      enemy.update(deltaTime, this.player, this.bullets, this.map);
      if (!enemy.alive) {
        this.enemies.splice(index, 1);
        this.addScore(enemy.scoreValue);
      }
    });
    
    // Spawn enemies
    this.enemySpawnTimer += deltaTime;
    if (this.enemySpawnTimer >= this.enemySpawnInterval && 
        this.enemies.length < this.maxEnemies && 
        this.enemiesSpawned < this.enemiesToSpawn) {
      this.spawnEnemy();
      this.enemySpawnTimer = 0;
    }
    
    // Check collisions
    this.checkCollisions();
    
    // Check win/lose conditions
    this.checkGameConditions();
  }
  
  spawnEnemy() {
    const spawnPoints = [
      { x: 40, y: 40 },
      { x: 240, y: 40 },
      { x: 440, y: 40 }
    ];
    
    const spawnPoint = spawnPoints[this.enemiesSpawned % spawnPoints.length];
    const enemy = new Enemy(spawnPoint.x, spawnPoint.y, this.map);
    this.enemies.push(enemy);
    this.enemiesSpawned++;
  }
  
  checkCollisions() {
    // Bullet collisions
    this.bullets.forEach((bullet, bIndex) => {
      // Bullet vs Map tiles
      const tileHit = this.map.checkBulletCollision(bullet);
      if (tileHit) {
        this.bullets.splice(bIndex, 1);
        return;
      }
      
      // Bullet vs Player
      if (bullet.owner !== 'player' && this.player && this.player.alive) {
        if (this.collisionDetector.checkBulletVsTank(bullet, this.player)) {
          this.player.hit();
          this.bullets.splice(bIndex, 1);
          
          if (!this.player.alive) {
            this.lives--;
            if (this.onLivesUpdate) this.onLivesUpdate(this.lives);
            
            if (this.lives <= 0) {
              this.player = null;
            } else {
              // Respawn player
              this.player = new Player(160, 480, this.map);
            }
          }
          return;
        }
      }
      
      // Bullet vs Enemies
      if (bullet.owner === 'player') {
        this.enemies.forEach((enemy, eIndex) => {
          if (this.collisionDetector.checkBulletVsTank(bullet, enemy)) {
            enemy.hit();
            this.bullets.splice(bIndex, 1);
          }
        });
      }
      
      // Bullet vs Bullet
      this.bullets.forEach((otherBullet, oIndex) => {
        if (oIndex !== bIndex && bullet.owner !== otherBullet.owner) {
          if (this.collisionDetector.checkBulletVsBullet(bullet, otherBullet)) {
            this.bullets.splice(Math.max(bIndex, oIndex), 1);
            this.bullets.splice(Math.min(bIndex, oIndex), 1);
          }
        }
      });
    });
    
    // Player vs Enemy collision
    if (this.player && this.player.alive) {
      this.enemies.forEach((enemy) => {
        if (this.collisionDetector.checkTankVsTank(this.player, enemy)) {
          this.player.hit();
          if (!this.player.alive) {
            this.lives--;
            if (this.onLivesUpdate) this.onLivesUpdate(this.lives);
            
            if (this.lives <= 0) {
              this.player = null;
            } else {
              this.player = new Player(160, 480, this.map);
            }
          }
        }
      });
    }
  }
  
  checkGameConditions() {
    // Check if base is destroyed
    if (this.baseDestroyed) {
      this.gameOver();
      return;
    }
    
    // Check if all enemies are defeated
    if (this.enemiesSpawned >= this.enemiesToSpawn && this.enemies.length === 0) {
      this.nextStage();
    }
    
    // Check if player has no lives
    if (this.lives <= 0 && !this.player) {
      this.gameOver();
    }
  }
  
  nextStage() {
    this.stage++;
    if (this.onStageUpdate) this.onStageUpdate(this.stage);
    this.initLevel();
  }
  
  addScore(points) {
    this.score += points;
    if (this.onScoreUpdate) this.onScoreUpdate(this.score);
  }
  
  render() {
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render map
    if (this.map) {
      this.map.render(this.ctx);
    }
    
    // Render base
    this.renderBase();
    
    // Render player
    if (this.player && this.player.alive) {
      this.player.render(this.ctx);
    }
    
    // Render enemies
    this.enemies.forEach((enemy) => {
      enemy.render(this.ctx);
    });
    
    // Render bullets
    this.bullets.forEach((bullet) => {
      bullet.render(this.ctx);
    });
  }
  
  renderBase() {
    if (this.baseDestroyed) {
      // Render destroyed base
      this.ctx.fillStyle = '#555';
      this.ctx.fillRect(this.basePosition.x - 20, this.basePosition.y - 20, 40, 40);
    } else {
      // Render eagle/base
      this.ctx.fillStyle = '#3498db';
      this.ctx.beginPath();
      this.ctx.moveTo(this.basePosition.x, this.basePosition.y - 25);
      this.ctx.lineTo(this.basePosition.x + 20, this.basePosition.y + 15);
      this.ctx.lineTo(this.basePosition.x - 20, this.basePosition.y + 15);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
  
  shoot(owner, x, y, direction) {
    const bullet = new Bullet(x, y, direction, owner);
    this.bullets.push(bullet);
  }
}
