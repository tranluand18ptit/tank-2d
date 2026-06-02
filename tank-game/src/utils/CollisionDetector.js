export class CollisionDetector {
  // Check collision between bullet and tank
  checkBulletVsTank(bullet, tank) {
    const bulletRect = {
      x: bullet.x,
      y: bullet.y,
      width: bullet.width,
      height: bullet.height
    };
    
    const tankRect = {
      x: tank.x,
      y: tank.y,
      width: tank.width,
      height: tank.height
    };
    
    return this.rectIntersect(bulletRect, tankRect);
  }
  
  // Check collision between two tanks
  checkTankVsTank(tank1, tank2) {
    const rect1 = {
      x: tank1.x,
      y: tank1.y,
      width: tank1.width,
      height: tank1.height
    };
    
    const rect2 = {
      x: tank2.x,
      y: tank2.y,
      width: tank2.width,
      height: tank2.height
    };
    
    return this.rectIntersect(rect1, rect2);
  }
  
  // Check collision between two bullets
  checkBulletVsBullet(bullet1, bullet2) {
    const rect1 = {
      x: bullet1.x,
      y: bullet1.y,
      width: bullet1.width,
      height: bullet1.height
    };
    
    const rect2 = {
      x: bullet2.x,
      y: bullet2.y,
      width: bullet2.width,
      height: bullet2.height
    };
    
    return this.rectIntersect(rect1, rect2);
  }
  
  // Check collision between rectangle and point
  checkPointVsRect(point, rect) {
    return point.x >= rect.x &&
           point.x <= rect.x + rect.width &&
           point.y >= rect.y &&
           point.y <= rect.y + rect.height;
  }
  
  // Generic rectangle intersection check
  rectIntersect(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
  
  // Check if rectangle is within bounds
  isInBounds(rect, maxWidth, maxHeight) {
    return rect.x >= 0 &&
           rect.x + rect.width <= maxWidth &&
           rect.y >= 0 &&
           rect.y + rect.height <= maxHeight;
  }
}
