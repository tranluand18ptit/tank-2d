export class InputHandler {
  constructor() {
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false
    };
    
    // Bind event listeners
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }
  
  handleKeyDown(e) {
    switch(e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keys.up = true;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keys.down = true;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keys.left = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keys.right = true;
        break;
      case ' ':
        this.keys.shoot = true;
        break;
    }
  }
  
  handleKeyUp(e) {
    switch(e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keys.up = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keys.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keys.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keys.right = false;
        break;
      case ' ':
        this.keys.shoot = false;
        break;
    }
  }
  
  getDirection() {
    if (this.keys.up) return 'up';
    if (this.keys.down) return 'down';
    if (this.keys.left) return 'left';
    if (this.keys.right) return 'right';
    return null;
  }
  
  isMoving() {
    return this.keys.up || this.keys.down || this.keys.left || this.keys.right;
  }
  
  isShooting() {
    return this.keys.shoot;
  }
}
