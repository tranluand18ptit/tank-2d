# Tank 1990 (Battle City) Clone - Complete Development Documentation

## Table of Contents
- [Phase 1: Project Setup](#phase-1-project-setup)
- [Phase 2: Core Game Engine](#phase-2-core-game-engine)
- [Phase 3: Game Entities](#phase-3-game-entities)
- [Phase 4: Map System](#phase-4-map-system)
- [Phase 5: Game Mechanics](#phase-5-game-mechanics)
- [Phase 6: Graphics & Audio](#phase-6-graphics--audio)
- [Phase 7: UI & Polish](#phase-7-ui--polish)
- [Phase 8: Optimization & Testing](#phase-8-optimization--testing)

---

## Phase 1: Project Setup

### Objective
Initialize the project infrastructure and establish the foundation for the game.

### Step-by-Step Instructions

#### 1.1 Initialize Vite Project
```bash
npm create vite@latest tank-game -- --template vanilla
cd tank-game
npm install
```

#### 1.2 Project Structure Setup
Create the following directory structure:
```
tank-game/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── game.js
│   ├── constants.js
│   ├── utils.js
│   ├── entities/
│   │   ├── Tank.js
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Bullet.js
│   │   ├── Brick.js
│   │   ├── Steel.js
│   │   ├── Water.js
│   │   ├── Tree.js
│   │   └── Base.js
│   ├── levels/
│   │   └── level1.js
│   ├── assets/
│   │   ├── sprites/
│   │   └── audio/
│   └── styles/
│       └── style.css
```

#### 1.3 HTML Setup (index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tank 1990 - Battle City Clone</title>
  <link rel="stylesheet" href="./styles/style.css" />
</head>
<body>
  <div id="game-container">
    <canvas id="gameCanvas" width="520" height="520"></canvas>
    <div id="ui-overlay">
      <div id="score-display">Score: 0</div>
      <div id="lives-display">Lives: 3</div>
      <div id="enemies-display">Enemies: 20</div>
    </div>
  </div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

#### 1.4 Basic CSS Styling (src/styles/style.css)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #202020;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Press Start 2P', monospace;
}

#game-container {
  position: relative;
  border: 4px solid #666;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

#gameCanvas {
  display: block;
  background-color: #000;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

#ui-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  font-size: 12px;
  text-shadow: 2px 2px #000;
}

#ui-overlay div {
  margin-bottom: 5px;
}
```

#### 1.5 Constants Configuration (src/constants.js)
```javascript
// Game Constants
export const CANVAS_WIDTH = 520;
export const CANVAS_HEIGHT = 520;
export const TILE_SIZE = 40;
export const GRID_SIZE = 13; // 13x13 grid

// Tank Constants
export const TANK_SIZE = 36;
export const TANK_SPEED = 2;
export const BULLET_SPEED = 5;
export const BULLET_SIZE = 6;

// Game States
export const GAME_STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameover',
  LEVEL_COMPLETE: 'levelcomplete'
};

// Directions
export const DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

// Tile Types
export const TILE_TYPE = {
  EMPTY: 0,
  BRICK: 1,
  STEEL: 2,
  WATER: 3,
  TREE: 4,
  BASE: 5
};

// Enemy Types
export const ENEMY_TYPE = {
  BASIC: 'basic',
  FAST: 'fast',
  POWER: 'power'
};
```

#### 1.6 Utility Functions (src/utils.js)
```javascript
import { TILE_SIZE, DIRECTION } from './constants.js';

/**
 * Check if two rectangles collide
 */
export function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

/**
 * Convert grid coordinates to pixel coordinates
 */
export function gridToPixel(gridX, gridY) {
  return {
    x: gridX * TILE_SIZE,
    y: gridY * TILE_SIZE
  };
}

/**
 * Convert pixel coordinates to grid coordinates
 */
export function pixelToGrid(pixelX, pixelY) {
  return {
    x: Math.floor(pixelX / TILE_SIZE),
    y: Math.floor(pixelY / TILE_SIZE)
  };
}

/**
 * Get direction vector
 */
export function getDirectionVector(direction) {
  switch (direction) {
    case DIRECTION.UP: return { x: 0, y: -1 };
    case DIRECTION.RIGHT: return { x: 1, y: 0 };
    case DIRECTION.DOWN: return { x: 0, y: 1 };
    case DIRECTION.LEFT: return { x: -1, y: 0 };
    default: return { x: 0, y: 0 };
  }
}

/**
 * Load image asset
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Draw sprite with animation frame
 */
export function drawSprite(ctx, spriteSheet, sx, sy, sw, sh, dx, dy, dw, dh) {
  ctx.drawImage(spriteSheet, sx, sy, sw, sh, dx, dy, dw, dh);
}
```

#### 1.7 Main Entry Point (src/main.js)
```javascript
import { Game } from './game.js';
import './styles/style.css';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const game = new Game(canvas);
  game.start();
});
```

#### 1.8 Game Class Skeleton (src/game.js)
```javascript
import { GAME_STATE, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = GAME_STATE.MENU;
    this.lastTime = 0;
  }

  start() {
    this.init();
    this.gameLoop(0);
  }

  init() {
    // Initialize game components
    console.log('Game initialized');
  }

  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  update(deltaTime) {
    // Update game state
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Render game elements
  }

  changeState(newState) {
    this.state = newState;
    console.log(`Game state changed to: ${newState}`);
  }
}
```

### Verification Checklist
- [ ] Vite project runs with `npm run dev`
- [ ] Canvas element displays correctly
- [ ] Basic CSS styling applied
- [ ] Game loop runs without errors
- [ ] Console shows initialization message

---

## Phase 2: Core Game Engine

### Objective
Implement the fundamental game systems including input handling, collision detection, and entity management.

### Step-by-Step Instructions

#### 2.1 Enhanced Game Loop (src/game.js)
```javascript
import { GAME_STATE, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { InputHandler } from './input.js';
import { EntityManager } from './entities/EntityManager.js';
import { CollisionDetector } from './collision.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = GAME_STATE.MENU;
    this.lastTime = 0;
    this.input = new InputHandler();
    this.entities = new EntityManager();
    this.collision = new CollisionDetector();
    this.score = 0;
    this.lives = 3;
    this.currentLevel = 1;
  }

  start() {
    this.init();
    this.setupEventListeners();
    this.gameLoop(0);
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => this.input.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.input.handleKeyUp(e));
  }

  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (this.state === GAME_STATE.PLAYING) {
      this.update(deltaTime);
    }
    this.render();

    requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  update(deltaTime) {
    this.entities.update(deltaTime, this.input);
    this.handleCollisions();
    this.checkWinCondition();
  }

  handleCollisions() {
    const entities = this.entities.getAll();
    this.collision.checkAllCollisions(entities, this);
  }

  render() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    this.entities.render(this.ctx);
    this.renderUI();
  }

  renderUI() {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px monospace';
    this.ctx.fillText(`Score: ${this.score}`, 10, 20);
    this.ctx.fillText(`Lives: ${this.lives}`, 10, 40);
  }

  changeState(newState) {
    this.state = newState;
  }

  addScore(points) {
    this.score += points;
  }

  loseLife() {
    this.lives--;
    if (this.lives <= 0) {
      this.changeState(GAME_STATE.GAME_OVER);
    }
  }

  checkWinCondition() {
    // To be implemented in Phase 5
  }
}
```

#### 2.2 Input Handler (src/input.js)
```javascript
import { DIRECTION } from './constants.js';

export class InputHandler {
  constructor() {
    this.keys = {};
    this.direction = null;
    this.shooting = false;
    this.shootPressed = false;
  }

  handleKeyDown(event) {
    this.keys[event.code] = true;
    this.updateDirection();
    
    if (event.code === 'Space' && !this.shootPressed) {
      this.shooting = true;
      this.shootPressed = true;
    }
  }

  handleKeyUp(event) {
    this.keys[event.code] = false;
    this.updateDirection();
    
    if (event.code === 'Space') {
      this.shooting = false;
      this.shootPressed = false;
    }
  }

  updateDirection() {
    if (this.keys['ArrowUp'] || this.keys['KeyW']) {
      this.direction = DIRECTION.UP;
    } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.direction = DIRECTION.RIGHT;
    } else if (this.keys['ArrowDown'] || this.keys['KeyS']) {
      this.direction = DIRECTION.DOWN;
    } else if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.direction = DIRECTION.LEFT;
    } else {
      this.direction = null;
    }
  }

  reset() {
    this.keys = {};
    this.direction = null;
    this.shooting = false;
    this.shootPressed = false;
  }
}
```

#### 2.3 Collision Detector (src/collision.js)
```javascript
import { checkCollision } from './utils.js';
import { TILE_TYPE } from './constants.js';

export class CollisionDetector {
  checkAllCollisions(entities, game) {
    const bullets = entities.filter(e => e.type === 'bullet');
    const tanks = entities.filter(e => e.type === 'tank' || e.type === 'enemy');
    const mapObjects = entities.filter(e => ['brick', 'steel', 'base'].includes(e.type));

    // Bullet vs Tank collisions
    bullets.forEach(bullet => {
      tanks.forEach(tank => {
        if (bullet.owner !== tank && checkCollision(bullet.getBounds(), tank.getBounds())) {
          bullet.hit(tank);
          tank.hit(bullet);
        }
      });

      // Bullet vs Map objects
      mapObjects.forEach(obj => {
        if (checkCollision(bullet.getBounds(), obj.getBounds())) {
          bullet.hit(obj);
          obj.hit(bullet);
        }
      });
    });

    // Tank vs Tank collisions
    for (let i = 0; i < tanks.length; i++) {
      for (let j = i + 1; j < tanks.length; j++) {
        if (checkCollision(tanks[i].getBounds(), tanks[j].getBounds())) {
          this.resolveTankCollision(tanks[i], tanks[j]);
        }
      }
    }

    // Tank vs Map objects
    tanks.forEach(tank => {
      mapObjects.forEach(obj => {
        if (checkCollision(tank.getBounds(), obj.getBounds())) {
          this.resolveTankMapCollision(tank, obj);
        }
      });
    });
  }

  resolveTankCollision(tank1, tank2) {
    const bounds1 = tank1.getBounds();
    const bounds2 = tank2.getBounds();
    
    const overlapX = Math.min(bounds1.right - bounds2.left, bounds2.right - bounds1.left);
    const overlapY = Math.min(bounds1.bottom - bounds2.top, bounds2.bottom - bounds1.top);

    if (overlapX < overlapY) {
      if (bounds1.x < bounds2.x) {
        tank1.move(-overlapX / 2, 0);
        tank2.move(overlapX / 2, 0);
      } else {
        tank1.move(overlapX / 2, 0);
        tank2.move(-overlapX / 2, 0);
      }
    } else {
      if (bounds1.y < bounds2.y) {
        tank1.move(0, -overlapY / 2);
        tank2.move(0, overlapY / 2);
      } else {
        tank1.move(0, overlapY / 2);
        tank2.move(0, -overlapY / 2);
      }
    }
  }

  resolveTankMapCollision(tank, mapObject) {
    const bounds = tank.getBounds();
    const objBounds = mapObject.getBounds();
    
    const overlapX = Math.min(bounds.right - objBounds.left, objBounds.right - bounds.left);
    const overlapY = Math.min(bounds.bottom - objBounds.top, objBounds.bottom - bounds.top);

    if (overlapX < overlapY) {
      if (bounds.x < objBounds.x) {
        tank.move(-overlapX, 0);
      } else {
        tank.move(overlapX, 0);
      }
    } else {
      if (bounds.y < objBounds.y) {
        tank.move(0, -overlapY);
      } else {
        tank.move(0, overlapY);
      }
    }
  }
}
```

#### 2.4 Entity Manager (src/entities/EntityManager.js)
```javascript
export class EntityManager {
  constructor() {
    this.entities = [];
  }

  add(entity) {
    this.entities.push(entity);
  }

  remove(entity) {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }

  removeAll(type) {
    this.entities = this.entities.filter(e => e.type !== type);
  }

  update(deltaTime, input) {
    this.entities.forEach(entity => {
      if (entity.active) {
        entity.update(deltaTime, input);
      }
    });
    
    // Remove inactive entities
    this.entities = this.entities.filter(e => e.active);
  }

  render(ctx) {
    // Render non-tree entities first
    this.entities
      .filter(e => e.type !== 'tree')
      .forEach(entity => entity.render(ctx));
    
    // Render trees on top
    this.entities
      .filter(e => e.type === 'tree')
      .forEach(entity => entity.render(ctx));
  }

  getAll() {
    return [...this.entities];
  }

  getByType(type) {
    return this.entities.filter(e => e.type === type);
  }

  clear() {
    this.entities = [];
  }
}
```

### Verification Checklist
- [ ] Game loop runs at 60 FPS
- [ ] Keyboard input responds correctly
- [ ] Collision detection works for basic shapes
- [ ] Entity manager adds/removes entities
- [ ] No console errors during gameplay

---

## Phase 3: Game Entities

### Objective
Create all game entities including tanks, bullets, and map objects with proper behavior.

### Step-by-Step Instructions

#### 3.1 Base Tank Class (src/entities/Tank.js)
```javascript
import { DIRECTION, TANK_SIZE, TANK_SPEED } from '../constants.js';
import { getDirectionVector } from '../utils.js';
import { Bullet } from './Bullet.js';

export class Tank {
  constructor(x, y, type = 'basic') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = TANK_SIZE;
    this.height = TANK_SIZE;
    this.direction = DIRECTION.UP;
    this.speed = TANK_SPEED;
    this.moving = false;
    this.shootCooldown = 0;
    this.shootDelay = 30; // frames
    this.health = 1;
    this.active = true;
    this.animationFrame = 0;
    this.animationTimer = 0;
  }

  update(deltaTime, input) {
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    if (this.moving) {
      this.animationTimer++;
      if (this.animationTimer > 10) {
        this.animationFrame = (this.animationFrame + 1) % 2;
        this.animationTimer = 0;
      }
    }
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  moveInDirection(direction) {
    const vector = getDirectionVector(direction);
    const newX = this.x + vector.x * this.speed;
    const newY = this.y + vector.y * this.speed;

    // Boundary checks
    if (newX >= 0 && newX + this.width <= 520 &&
        newY >= 0 && newY + this.height <= 520) {
      this.x = newX;
      this.y = newY;
      this.direction = direction;
      this.moving = true;
    } else {
      this.moving = false;
    }
  }

  shoot() {
    if (this.shootCooldown <= 0) {
      this.shootCooldown = this.shootDelay;
      return this.createBullet();
    }
    return null;
  }

  createBullet() {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    let bulletX, bulletY;
    
    switch (this.direction) {
      case DIRECTION.UP:
        bulletX = centerX - 3;
        bulletY = this.y - 6;
        break;
      case DIRECTION.RIGHT:
        bulletX = this.x + this.width + 6;
        bulletY = centerY - 3;
        break;
      case DIRECTION.DOWN:
        bulletX = centerX - 3;
        bulletY = this.y + this.height + 6;
        break;
      case DIRECTION.LEFT:
        bulletX = this.x - 6;
        bulletY = centerY - 3;
        break;
    }

    return new Bullet(bulletX, bulletY, this.direction, this);
  }

  hit(damage = 1) {
    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.active = false;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  render(ctx) {
    // Placeholder rendering - will be replaced with sprites in Phase 6
    ctx.fillStyle = this.getColor();
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Direction indicator
    ctx.fillStyle = '#fff';
    const center = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    const offset = 10;
    
    switch (this.direction) {
      case DIRECTION.UP:
        ctx.fillRect(center.x - 2, this.y, 4, offset);
        break;
      case DIRECTION.RIGHT:
        ctx.fillRect(this.x + this.width - offset, center.y - 2, offset, 4);
        break;
      case DIRECTION.DOWN:
        ctx.fillRect(center.x - 2, this.y + this.height - offset, 4, offset);
        break;
      case DIRECTION.LEFT:
        ctx.fillRect(this.x, center.y - 2, offset, 4);
        break;
    }
  }

  getColor() {
    return '#4a4'; // Default green
  }
}
```

#### 3.2 Player Tank (src/entities/Player.js)
```javascript
import { Tank } from './Tank.js';
import { DIRECTION } from '../constants.js';

export class Player extends Tank {
  constructor(x, y) {
    super(x, y, 'player');
    this.lives = 3;
    this.powerLevel = 1;
    this.invincible = false;
    this.invincibleTimer = 0;
  }

  update(deltaTime, input) {
    super.update(deltaTime, input);

    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    if (input.direction !== null) {
      this.moveInDirection(input.direction);
    } else {
      this.moving = false;
    }

    if (input.shooting) {
      return this.shoot();
    }
    return null;
  }

  hit(damage = 1) {
    if (this.invincible) return;
    
    super.hit(damage);
    if (!this.active) {
      this.lives--;
      if (this.lives > 0) {
        this.respawn();
      }
    }
  }

  respawn() {
    this.x = 200;
    this.y = 480;
    this.direction = DIRECTION.UP;
    this.health = 1;
    this.active = true;
    this.invincible = true;
    this.invincibleTimer = 180; // 3 seconds at 60 FPS
  }

  upgrade() {
    this.powerLevel = Math.min(this.powerLevel + 1, 3);
    this.shootDelay = Math.max(this.shootDelay - 10, 10);
    this.health = Math.min(this.health + 1, 3);
  }

  getColor() {
    return '#ff0'; // Yellow for player
  }

  render(ctx) {
    if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
      return; // Blink effect
    }
    super.render(ctx);
  }
}
```

#### 3.3 Enemy Tank (src/entities/Enemy.js)
```javascript
import { Tank } from './Tank.js';
import { DIRECTION, ENEMY_TYPE, TANK_SPEED } from '../constants.js';

export class Enemy extends Tank {
  constructor(x, y, type = ENEMY_TYPE.BASIC) {
    super(x, y, 'enemy');
    this.enemyType = type;
    this.aiTimer = 0;
    this.aiInterval = 60;
    this.moveDuration = 0;
    this.targetDirection = DIRECTION.DOWN;
    
    this.setupByType();
  }

  setupByType() {
    switch (this.enemyType) {
      case ENEMY_TYPE.BASIC:
        this.speed = TANK_SPEED;
        this.health = 1;
        this.scoreValue = 100;
        break;
      case ENEMY_TYPE.FAST:
        this.speed = TANK_SPEED * 1.5;
        this.health = 1;
        this.scoreValue = 200;
        break;
      case ENEMY_TYPE.POWER:
        this.speed = TANK_SPEED * 0.7;
        this.health = 3;
        this.scoreValue = 300;
        this.canDestroySteel = true;
        break;
    }
  }

  update(deltaTime, input) {
    super.update(deltaTime, input);
    
    this.aiTimer++;
    
    if (this.aiTimer >= this.aiInterval) {
      this.makeDecision();
      this.aiTimer = 0;
    }

    if (this.moveDuration > 0) {
      this.moveInDirection(this.targetDirection);
      this.moveDuration--;
      
      // Random shooting
      if (Math.random() < 0.02) {
        return this.shoot();
      }
    }
    
    return null;
  }

  makeDecision() {
    // Simple AI: random movement with tendency toward base
    const directions = [DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN, DIRECTION.LEFT];
    
    // 40% chance to move toward base (bottom center)
    if (Math.random() < 0.4) {
      if (this.y < 400) {
        this.targetDirection = DIRECTION.DOWN;
      } else if (this.x < 240) {
        this.targetDirection = DIRECTION.RIGHT;
      } else if (this.x > 280) {
        this.targetDirection = DIRECTION.LEFT;
      } else {
        this.targetDirection = directions[Math.floor(Math.random() * directions.length)];
      }
    } else {
      this.targetDirection = directions[Math.floor(Math.random() * directions.length)];
    }
    
    this.moveDuration = 30 + Math.floor(Math.random() * 60);
    this.aiInterval = 30 + Math.floor(Math.random() * 60);
  }

  getColor() {
    switch (this.enemyType) {
      case ENEMY_TYPE.FAST: return '#f44';
      case ENEMY_TYPE.POWER: return '#44f';
      default: return '#aaa';
    }
  }

  getScoreValue() {
    return this.scoreValue;
  }
}
```

#### 3.4 Bullet Class (src/entities/Bullet.js)
```javascript
import { BULLET_SPEED, BULLET_SIZE, DIRECTION } from '../constants.js';
import { getDirectionVector } from '../utils.js';

export class Bullet {
  constructor(x, y, direction, owner) {
    this.x = x;
    this.y = y;
    this.width = BULLET_SIZE;
    this.height = BULLET_SIZE;
    this.direction = direction;
    this.owner = owner;
    this.speed = BULLET_SPEED;
    this.active = true;
    this.type = 'bullet';
  }

  update(deltaTime, input) {
    const vector = getDirectionVector(this.direction);
    this.x += vector.x * this.speed;
    this.y += vector.y * this.speed;

    // Remove if out of bounds
    if (this.x < 0 || this.x > 520 || this.y < 0 || this.y > 520) {
      this.active = false;
    }
  }

  hit(target) {
    this.active = false;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  render(ctx) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
```

#### 3.5 Map Objects (src/entities/Brick.js, Steel.js, Water.js, Tree.js, Base.js)

**Brick.js:**
```javascript
import { TILE_SIZE } from '../constants.js';

export class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
    this.health = 1;
    this.active = true;
    this.type = 'brick';
  }

  hit(bullet) {
    this.health--;
    if (this.health <= 0) {
      this.active = false;
    }
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  render(ctx) {
    ctx.fillStyle = '#b52';
    ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
    
    // Brick pattern
    ctx.fillStyle = '#841';
    ctx.fillRect(this.x + 4, this.y + 4, this.width / 2 - 4, this.height / 2 - 4);
    ctx.fillRect(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 - 4, this.height / 2 - 4);
  }
}
```

**Steel.js:**
```javascript
import { TILE_SIZE } from '../constants.js';

export class Steel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
    this.active = true;
    this.type = 'steel';
  }

  hit(bullet) {
    // Steel is indestructible by normal bullets
    if (bullet.owner && bullet.owner.canDestroySteel) {
      this.active = false;
    }
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  render(ctx) {
    ctx.fillStyle = '#ccc';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Metal pattern
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
    ctx.fillStyle = '#999';
    ctx.fillRect(this.x + 8, this.y + 8, this.width - 16, this.height - 16);
  }
}
```

**Water.js:**
```javascript
import { TILE_SIZE } from '../constants.js';

export class Water {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
    this.active = true;
    this.type = 'water';
    this.animationFrame = 0;
    this.animationTimer = 0;
  }

  update(deltaTime) {
    this.animationTimer++;
    if (this.animationTimer > 20) {
      this.animationFrame = (this.animationFrame + 1) % 2;
      this.animationTimer = 0;
    }
  }

  hit(bullet) {
    // Bullets pass through water
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  render(ctx) {
    ctx.fillStyle = this.animationFrame === 0 ? '#24a' : '#28c';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
```

**Tree.js:**
```javascript
import { TILE_SIZE } from '../constants.js';

export class Tree {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
    this.active = true;
    this.type = 'tree';
  }

  hit(bullet) {
    // Trees are destroyed by bullets
    this.active = false;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  render(ctx) {
    ctx.fillStyle = '#2a2';
    // Draw tree foliage
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#4d4';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2 - 4, this.y + this.height / 2 - 4, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}
```

**Base.js:**
```javascript
import { TILE_SIZE } from '../constants.js';

export class Base {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
    this.health = 1;
    this.active = true;
    this.type = 'base';
  }

  hit(bullet) {
    this.health--;
    if (this.health <= 0) {
      this.active = false;
      // Trigger game over
      if (this.onBaseDestroyed) {
        this.onBaseDestroyed();
      }
    }
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  render(ctx) {
    ctx.fillStyle = '#ff0';
    ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
    
    // Eagle symbol
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + 8);
    ctx.lineTo(this.x + this.width - 8, this.y + this.height - 8);
    ctx.lineTo(this.x + 8, this.y + this.height - 8);
    ctx.closePath();
    ctx.fill();
  }
}
```

### Verification Checklist
- [ ] Player tank moves with WASD/Arrow keys
- [ ] Player shoots with Space bar
- [ ] Enemy tanks spawn and move randomly
- [ ] Bullets travel in correct direction
- [ ] Collisions between entities work properly
- [ ] Map objects render correctly
- [ ] Base destruction triggers game over

---

## Phase 4: Map System

### Objective
Implement the level system with tile-based maps and proper rendering.

### Step-by-Step Instructions

#### 4.1 Level Data Structure (src/levels/level1.js)
```javascript
import { TILE_TYPE } from '../constants.js';

export const level1 = {
  width: 13,
  height: 13,
  data: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 2, 2, 2, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 2, 3, 2, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 2, 2, 2, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 4, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 4, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 5, 1, 0, 0, 0, 0, 0]
  ],
  enemySpawns: [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 12, y: 0 }
  ],
  playerSpawn: { x: 4, y: 12 },
  enemiesPerWave: 20,
  enemyTypes: ['basic', 'basic', 'fast', 'power']
};
```

#### 4.2 Map Class (src/Map.js)
```javascript
import { TILE_SIZE, TILE_TYPE } from './constants.js';
import { Brick } from './entities/Brick.js';
import { Steel } from './entities/Steel.js';
import { Water } from './entities/Water.js';
import { Tree } from './entities/Tree.js';
import { Base } from './entities/Base.js';

export class GameMap {
  constructor(levelData, entityManager) {
    this.levelData = levelData;
    this.entityManager = entityManager;
    this.width = levelData.width;
    this.height = levelData.height;
    this.tiles = [];
    this.base = null;
  }

  load() {
    this.tiles = [];
    
    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        const tileType = this.levelData.data[y][x];
        const pixelX = x * TILE_SIZE;
        const pixelY = y * TILE_SIZE;
        
        let tile = null;
        
        switch (tileType) {
          case TILE_TYPE.BRICK:
            tile = new Brick(pixelX, pixelY);
            break;
          case TILE_TYPE.STEEL:
            tile = new Steel(pixelX, pixelY);
            break;
          case TILE_TYPE.WATER:
            tile = new Water(pixelX, pixelY);
            this.entityManager.add(tile);
            break;
          case TILE_TYPE.TREE:
            tile = new Tree(pixelX, pixelY);
            this.entityManager.add(tile);
            break;
          case TILE_TYPE.BASE:
            this.base = new Base(pixelX, pixelY);
            this.base.onBaseDestroyed = () => this.handleBaseDestroyed();
            this.entityManager.add(this.base);
            break;
        }
        
        this.tiles[y][x] = tile;
        
        if (tile && tile.type === 'brick') {
          this.entityManager.add(tile);
        } else if (tile && tile.type === 'steel') {
          this.entityManager.add(tile);
        }
      }
    }
  }

  handleBaseDestroyed() {
    console.log('Base destroyed! Game Over!');
    // Trigger game over state
  }

  getTileAt(gridX, gridY) {
    if (gridX >= 0 && gridX < this.width && gridY >= 0 && gridY < this.height) {
      return this.tiles[gridY][gridX];
    }
    return null;
  }

  isPassable(x, y, width, height) {
    const left = Math.floor(x / TILE_SIZE);
    const right = Math.floor((x + width - 1) / TILE_SIZE);
    const top = Math.floor(y / TILE_SIZE);
    const bottom = Math.floor((y + height - 1) / TILE_SIZE);

    for (let ty = top; ty <= bottom; ty++) {
      for (let tx = left; tx <= right; tx++) {
        const tile = this.getTileAt(tx, ty);
        if (tile && (tile.type === 'brick' || tile.type === 'steel' || tile.type === 'water')) {
          return false;
        }
      }
    }

    return true;
  }

  update(deltaTime) {
    // Update animated tiles (water, etc.)
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.tiles[y][x];
        if (tile && tile.update) {
          tile.update(deltaTime);
        }
      }
    }
  }

  render(ctx) {
    // Base tiles are rendered by entity manager
  }

  getEnemySpawns() {
    return this.levelData.enemySpawns.map(spawn => ({
      x: spawn.x * TILE_SIZE,
      y: spawn.y * TILE_SIZE
    }));
  }

  getPlayerSpawn() {
    const spawn = this.levelData.playerSpawn;
    return {
      x: spawn.x * TILE_SIZE,
      y: spawn.y * TILE_SIZE
    };
  }
}
```

#### 4.3 Integration with Game Class
Update `src/game.js` to use the map system:

```javascript
import { GameMap } from './Map.js';
import { level1 } from './levels/level1.js';

// In Game class constructor:
this.map = null;

// In init():
this.loadLevel(1);

loadLevel(levelNum) {
  let levelData;
  if (levelNum === 1) {
    levelData = level1;
  }
  
  this.entities.clear();
  this.map = new GameMap(levelData, this.entities);
  this.map.load();
  
  // Spawn player
  const playerSpawn = this.map.getPlayerSpawn();
  this.player = new Player(playerSpawn.x, playerSpawn.y);
  this.entities.add(this.player);
  
  // Setup enemy spawning
  this.enemiesRemaining = levelData.enemiesPerWave;
  this.enemySpawnPoints = this.map.getEnemySpawns();
  this.spawnEnemyTimer = 0;
}
```

### Verification Checklist
- [ ] Level 1 loads correctly
- [ ] All tile types render properly
- [ ] Player spawns at correct location
- [ ] Enemy spawn points are accessible
- [ ] Base is positioned correctly
- [ ] Tiles block tank movement appropriately

---

## Phase 5: Game Mechanics

### Objective
Implement scoring, power-ups, enemy waves, and win/lose conditions.

### Step-by-Step Instructions

#### 5.1 Power-Up System (src/entities/PowerUp.js)
```javascript
import { TILE_SIZE } from '../constants.js';

export const POWERUP_TYPE = {
  HELMET: 'helmet',
  STAR: 'star',
  GRENADE: 'grenade',
  SHOVEL: 'shovel',
  TIMER: 'timer',
  LIFE: 'life'
};

export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = TILE_SIZE;
    this.height = TILE_SIZE;
    this.type = type;
    this.active = true;
    this.lifetime = 600; // 10 seconds
    this.blinkTimer = 0;
  }

  update(deltaTime) {
    this.lifetime--;
    if (this.lifetime <= 0) {
      this.active = false;
    }
    
    this.blinkTimer++;
  }

  apply(game) {
    switch (this.type) {
      case POWERUP_TYPE.HELMET:
        if (game.player) {
          game.player.invincible = true;
          game.player.invincibleTimer = 600; // 10 seconds
        }
        break;
      case POWERUP_TYPE.STAR:
        if (game.player) {
          game.player.upgrade();
        }
        break;
      case POWERUP_TYPE.GRENADE:
        game.destroyAllEnemies();
        break;
      case POWERUP_TYPE.SHOVEL:
        game.fortifyBase();
        break;
      case POWERUP_TYPE.TIMER:
        game.freezeEnemies(10); // 10 seconds
        break;
      case POWERUP_TYPE.LIFE:
        if (game.player) {
          game.player.lives++;
        }
        break;
    }
    this.active = false;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  render(ctx) {
    if (this.blinkTimer % 10 < 5) {
      ctx.fillStyle = this.getColor();
      ctx.fillRect(this.x + 8, this.y + 8, this.width - 16, this.height - 16);
      
      ctx.fillStyle = '#fff';
      ctx.font = '20px monospace';
      ctx.fillText(this.getSymbol(), this.x + 12, this.y + 28);
    }
  }

  getColor() {
    switch (this.type) {
      case POWERUP_TYPE.HELMET: return '#ff0';
      case POWERUP_TYPE.STAR: return '#f0f';
      case POWERUP_TYPE.GRENADE: return '#f00';
      case POWERUP_TYPE.SHOVEL: return '#852';
      case POWERUP_TYPE.TIMER: return '#0ff';
      case POWERUP_TYPE.LIFE: return '#0f0';
      default: return '#fff';
    }
  }

  getSymbol() {
    switch (this.type) {
      case POWERUP_TYPE.HELMET: return 'H';
      case POWERUP_TYPE.STAR: return '★';
      case POWERUP_TYPE.GRENADE: return 'G';
      case POWERUP_TYPE.SHOVEL: return 'S';
      case POWERUP_TYPE.TIMER: return 'T';
      case POWERUP_TYPE.LIFE: return '♥';
      default: return '?';
    }
  }
}
```

#### 5.2 Enhanced Game Mechanics (src/game.js additions)
```javascript
// Add to Game class:

spawnEnemy() {
  if (this.enemiesRemaining <= 0) return;
  
  if (this.enemySpawnPoints.length === 0) return;
  
  const spawnPoint = this.enemySpawnPoints[Math.floor(Math.random() * this.enemySpawnPoints.length)];
  
  // Check if spawn point is clear
  const canSpawn = !this.entities.getByType('enemy').some(enemy => {
    const bounds = enemy.getBounds();
    return Math.abs(enemy.x - spawnPoint.x) < 40 && Math.abs(enemy.y - spawnPoint.y) < 40;
  });
  
  if (canSpawn) {
    const enemyTypeConfig = this.map.levelData.enemyTypes;
    const randomType = enemyTypeConfig[Math.floor(Math.random() * enemyTypeConfig.length)];
    
    const enemy = new Enemy(spawnPoint.x, spawnPoint.y, randomType);
    this.entities.add(enemy);
    this.enemiesRemaining--;
  }
}

destroyAllEnemies() {
  const enemies = this.entities.getByType('enemy');
  enemies.forEach(enemy => {
    enemy.destroy();
    this.addScore(enemy.getScoreValue());
  });
}

fortifyBase() {
  // Add steel walls around base for 30 seconds
  if (this.map.base) {
    const baseX = this.map.base.x;
    const baseY = this.map.base.y;
    // Implementation for temporary steel walls
  }
}

freezeEnemies(duration) {
  const enemies = this.entities.getByType('enemy');
  enemies.forEach(enemy => {
    enemy.frozen = true;
    enemy.freezeTimer = duration * 60;
  });
}

checkWinCondition() {
  const enemies = this.entities.getByType('enemy');
  
  if (enemies.length === 0 && this.enemiesRemaining === 0) {
    // Level complete
    this.changeState(GAME_STATE.LEVEL_COMPLETE);
    setTimeout(() => {
      this.currentLevel++;
      this.loadLevel(this.currentLevel);
      this.changeState(GAME_STATE.PLAYING);
    }, 3000);
  }
}

update(deltaTime) {
  this.entities.update(deltaTime, this.input);
  this.handleCollisions();
  this.checkWinCondition();
  
  // Enemy spawning
  if (this.enemiesRemaining > 0) {
    this.spawnEnemyTimer++;
    if (this.spawnEnemyTimer > 180) { // Spawn every 3 seconds
      this.spawnEnemy();
      this.spawnEnemyTimer = 0;
    }
  }
  
  // Check power-up collisions
  const powerUps = this.entities.getByType('powerup');
  powerUps.forEach(powerUp => {
    if (checkCollision(this.player.getBounds(), powerUp.getBounds())) {
      powerUp.apply(this);
    }
  });
}
```

### Verification Checklist
- [ ] Score increases when destroying enemies
- [ ] Power-ups spawn randomly
- [ ] Power-up effects work correctly
- [ ] Enemies spawn in waves
- [ ] Level completes when all enemies destroyed
- [ ] Game over when all lives lost or base destroyed

---

## Phase 6: Graphics & Audio

### Objective
Add visual polish with sprites, animations, and sound effects.

### Step-by-Step Instructions

#### 6.1 Sprite Sheet Setup
Create or download a sprite sheet with all game assets organized in a grid.

#### 6.2 Asset Loader (src/assets/AssetLoader.js)
```javascript
export class AssetLoader {
  constructor() {
    this.images = {};
    this.sounds = {};
    this.loaded = false;
  }

  async loadAll() {
    await this.loadImages();
    await this.loadSounds();
    this.loaded = true;
  }

  async loadImages() {
    const spriteSheet = await this.loadImage('assets/sprites/spritesheet.png');
    this.images['spritesheet'] = spriteSheet;
  }

  async loadSounds() {
    // Load sound files
    const sounds = ['shoot', 'explode', 'start', 'gameover'];
    for (const sound of sounds) {
      try {
        this.sounds[sound] = await this.loadSound(`assets/audio/${sound}.mp3`);
      } catch (e) {
        console.warn(`Sound ${sound} not loaded`);
      }
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  loadSound(src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(src);
      audio.addEventListener('canplaythrough', () => resolve(audio));
      audio.addEventListener('error', reject);
      audio.src = src;
    });
  }

  getImage(name) {
    return this.images[name];
  }

  getSound(name) {
    return this.sounds[name];
  }

  playSound(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.warn('Audio play failed:', e));
    }
  }
}
```

#### 6.3 Enhanced Rendering with Sprites
Update entity render methods to use sprite sheets:

```javascript
render(ctx, spriteSheet) {
  const frameWidth = 36;
  const frameHeight = 36;
  const spriteX = this.animationFrame * frameWidth;
  const spriteY = this.direction * frameHeight;
  
  ctx.drawImage(
    spriteSheet,
    spriteX, spriteY, frameWidth, frameHeight,
    this.x, this.y, this.width, this.height
  );
}
```

### Verification Checklist
- [ ] Sprite sheets load correctly
- [ ] Tank animations play smoothly
- [ ] Sound effects trigger on actions
- [ ] Visual effects (explosions) display properly

---

## Phase 7: UI & Polish

### Objective
Create menus, HUD, and polish the user experience.

### Step-by-Step Instructions

#### 7.1 Menu Screens (src/ui/Menu.js)
```javascript
export class Menu {
  constructor(game) {
    this.game = game;
    this.selectedOption = 0;
    this.options = ['Start Game', '2 Players', 'Options', 'Exit'];
  }

  render(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 520, 520);
    
    ctx.fillStyle = '#ff0';
    ctx.font = '30px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TANK 1990', 260, 150);
    
    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    
    this.options.forEach((option, index) => {
      const y = 250 + index * 40;
      if (index === this.selectedOption) {
        ctx.fillStyle = '#ff0';
        ctx.fillText(`> ${option} <`, 260, y);
      } else {
        ctx.fillStyle = '#fff';
        ctx.fillText(option, 260, y);
      }
    });
  }

  handleInput(key) {
    if (key === 'ArrowUp') {
      this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
    } else if (key === 'ArrowDown') {
      this.selectedOption = (this.selectedOption + 1) % this.options.length;
    } else if (key === 'Enter' || key === 'Space') {
      this.selectOption();
    }
  }

  selectOption() {
    switch (this.selectedOption) {
      case 0:
        this.game.startGame();
        break;
      case 1:
        this.game.startGame(2);
        break;
    }
  }
}
```

### Verification Checklist
- [ ] Main menu displays correctly
- [ ] Pause functionality works
- [ ] Game over screen shows score
- [ ] HUD displays score, lives, enemies
- [ ] Level transitions are smooth

---

## Phase 8: Optimization & Testing

### Objective
Optimize performance and ensure cross-browser compatibility.

### Step-by-Step Instructions

#### 8.1 Performance Optimizations
- Use object pooling for bullets
- Implement spatial partitioning for collision detection
- Optimize render calls with dirty rectangle tracking
- Minimize garbage collection by reusing objects

#### 8.2 Cross-Browser Testing
Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

#### 8.3 Build for Production
```bash
npm run build
npm run preview
```

### Verification Checklist
- [ ] Game runs at 60 FPS consistently
- [ ] No memory leaks detected
- [ ] Works on all major browsers
- [ ] Responsive design considerations implemented
- [ ] All bugs fixed
- [ ] Gameplay difficulty balanced

---

## Conclusion

This documentation provides a comprehensive guide for building a Tank 1990 clone. Follow each phase sequentially, testing thoroughly before moving to the next. The estimated timeline is 10-15 days for a complete MVP.

Good luck with your development!
