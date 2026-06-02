export class Map {
  constructor(width, height, stage = 1) {
    this.width = width;
    this.height = height;
    this.stage = stage;
    this.tileSize = 40; // Each tile is 40x40 pixels
    this.cols = Math.floor(width / this.tileSize);
    this.rows = Math.floor(height / this.tileSize);
    
    // Tile types: 0=empty, 1=brick, 2=steel, 3=water, 4=trees, 5=base
    this.tiles = [];
    
    // Generate map for the stage
    this.generateMap(stage);
  }
  
  generateMap(stage) {
    // Initialize empty grid
    this.tiles = [];
    for (let row = 0; row < this.rows; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.tiles[row][col] = 0;
      }
    }
    
    // Simple procedural map generation based on stage
    // In a full game, you would have predefined level designs
    
    const pattern = stage % 3;
    
    switch(pattern) {
      case 0:
        // Open field with some obstacles
        this.createObstacles(0.2, [6, 7]); // 20% fill, avoid base area
        break;
      case 1:
        // More dense obstacles
        this.createObstacles(0.35, [6, 7]);
        break;
      case 2:
        // Maze-like pattern
        this.createMaze();
        break;
    }
    
    // Always protect the base with bricks
    this.protectBase();
  }
  
  createObstacles(fillRate, avoidRows) {
    for (let row = 0; row < this.rows; row++) {
      if (avoidRows.includes(row)) continue;
      
      for (let col = 0; col < this.cols; col++) {
        if (Math.random() < fillRate) {
          // Randomly choose between brick and steel
          const rand = Math.random();
          if (rand < 0.7) {
            this.tiles[row][col] = 1; // Brick
          } else if (rand < 0.85) {
            this.tiles[row][col] = 2; // Steel
          } else {
            this.tiles[row][col] = 3; // Water
          }
        }
      }
    }
  }
  
  createMaze() {
    // Create vertical walls
    for (let row = 0; row < this.rows; row++) {
      if (row === 6 || row === 7) continue; // Avoid base
      
      for (let col = 2; col < this.cols; col += 4) {
        if (Math.random() < 0.6) {
          this.tiles[row][col] = 1; // Brick
        }
      }
    }
    
    // Create horizontal walls
    for (let col = 0; col < this.cols; col++) {
      for (let row = 2; row < this.rows - 2; row += 4) {
        if (row === 6 || row === 7) continue;
        
        if (Math.random() < 0.5) {
          this.tiles[row][col] = 1; // Brick
        }
      }
    }
  }
  
  protectBase() {
    // Base is at position (6, 12) roughly
    const baseRow = 12;
    const baseCol = 6;
    
    // Create a U-shaped protection around the base
    const protectionPattern = [
      [baseRow - 1, baseCol - 1],
      [baseRow - 1, baseCol],
      [baseRow - 1, baseCol + 1],
      [baseRow, baseCol - 1],
      [baseRow, baseCol + 1],
      [baseRow + 1, baseCol - 1],
      [baseRow + 1, baseCol + 1]
    ];
    
    protectionPattern.forEach(([row, col]) => {
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        this.tiles[row][col] = 1; // Brick
      }
    });
  }
  
  getTile(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return 0; // Out of bounds is empty
    }
    return this.tiles[row][col];
  }
  
  setTile(row, col, type) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.tiles[row][col] = type;
    }
  }
  
  checkBulletCollision(bullet) {
    // Get bullet center point
    const centerX = bullet.x + bullet.width / 2;
    const centerY = bullet.y + bullet.height / 2;
    
    // Convert to grid coordinates
    const col = Math.floor(centerX / this.tileSize);
    const row = Math.floor(centerY / this.tileSize);
    
    const tile = this.getTile(row, col);
    
    // Check collision with destructible tiles
    if (tile === 1) { // Brick
      this.setTile(row, col, 0); // Destroy brick
      return true;
    } else if (tile === 2) { // Steel
      // Steel doesn't get destroyed by normal bullets
      return true;
    } else if (tile === 5) { // Base
      // Game over if base is hit
      return true;
    }
    
    return false;
  }
  
  checkTankCollision(x, y, width, height) {
    // Check all four corners of the tank
    const corners = [
      { x: x, y: y },
      { x: x + width, y: y },
      { x: x, y: y + height },
      { x: x + width, y: y + height }
    ];
    
    for (const corner of corners) {
      const col = Math.floor(corner.x / this.tileSize);
      const row = Math.floor(corner.y / this.tileSize);
      
      const tile = this.getTile(row, col);
      
      // Collide with brick, steel, water, and base
      if (tile === 1 || tile === 2 || tile === 3 || tile === 5) {
        return true;
      }
    }
    
    return false;
  }
  
  render(ctx) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tile = this.tiles[row][col];
        const x = col * this.tileSize;
        const y = row * this.tileSize;
        
        switch(tile) {
          case 1: // Brick
            ctx.fillStyle = '#d35400';
            ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
            // Add brick pattern
            ctx.fillStyle = '#e67e22';
            ctx.fillRect(x + 4, y + 4, this.tileSize / 2 - 4, this.tileSize / 2 - 4);
            ctx.fillRect(x + this.tileSize / 2 + 2, y + this.tileSize / 2 + 2, this.tileSize / 2 - 6, this.tileSize / 2 - 6);
            break;
            
          case 2: // Steel
            ctx.fillStyle = '#bdc3c7';
            ctx.fillRect(x + 4, y + 4, this.tileSize - 8, this.tileSize - 8);
            ctx.strokeStyle = '#95a5a6';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 6, y + 6, this.tileSize - 12, this.tileSize - 12);
            break;
            
          case 3: // Water
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x, y, this.tileSize, this.tileSize);
            break;
            
          case 4: // Trees
            ctx.fillStyle = '#27ae60';
            ctx.beginPath();
            ctx.arc(x + this.tileSize / 2, y + this.tileSize / 2, this.tileSize / 2 - 2, 0, Math.PI * 2);
            ctx.fill();
            break;
            
          case 5: // Base (handled separately in Game)
            break;
        }
      }
    }
  }
}
