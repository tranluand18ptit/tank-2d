# Tank 1990 (Battle City) Clone - Development Plan

## Project Overview
Create a web-based clone of the classic NES game "Tank 1990" (Battle City) using Vite and Vanilla JavaScript.

## Tech Stack
- **Build Tool**: Vite
- **Language**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas API
- **Styling**: CSS3
- **Audio**: Web Audio API or Howler.js (optional)

## Project Structure
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

## Development Phases

### Phase 1: Project Setup
- [ ] Initialize Vite project with vanilla JS template
- [ ] Set up basic project structure
- [ ] Configure canvas element in HTML
- [ ] Create basic CSS styling
- [ ] Set up game loop infrastructure

### Phase 2: Core Game Engine
- [ ] Implement game loop (requestAnimationFrame)
- [ ] Create input handler for keyboard controls
- [ ] Implement collision detection system
- [ ] Create entity management system
- [ ] Implement game state management (menu, playing, game over)

### Phase 3: Game Entities
- [ ] Create base Tank class with:
  - Movement logic
  - Direction handling
  - Animation frames
  - Shooting mechanics
- [ ] Implement Player tank with:
  - WASD/Arrow key controls
  - Health system
  - Power-up system
- [ ] Implement Enemy tanks with:
  - AI behavior (random movement, targeting)
  - Different enemy types (basic, fast, power)
  - Spawn system
- [ ] Create Bullet class with:
  - Trajectory calculation
  - Collision handling
  - Destruction logic

### Phase 4: Map System
- [ ] Define tile types:
  - Brick (destructible)
  - Steel (indestructible)
  - Water (impassable)
  - Trees (visual overlay)
  - Base (eagle to protect)
- [ ] Create level format/data structure
- [ ] Implement map rendering
- [ ] Add map boundary checks

### Phase 5: Game Mechanics
- [ ] Implement scoring system
- [ ] Create power-up system:
  - Helmet (temporary invincibility)
  - Star (upgrade tank)
  - Grenade (destroy all enemies)
  - Shovel (fortify base)
  - Timer (freeze enemies)
  - Life (extra life)
- [ ] Implement enemy spawning waves
- [ ] Add win/lose conditions
- [ ] Create multiple levels

### Phase 6: Graphics & Audio
- [ ] Create sprite sheets or pixel art assets
- [ ] Implement sprite animation system
- [ ] Add sound effects (shooting, explosions, etc.)
- [ ] Add background music
- [ ] Create visual effects (explosions, etc.)

### Phase 7: UI & Polish
- [ ] Create main menu screen
- [ ] Add pause functionality
- [ ] Implement game over screen
- [ ] Add score display
- [ ] Show remaining enemies
- [ ] Add lives indicator
- [ ] Create level transition screens

### Phase 8: Optimization & Testing
- [ ] Optimize rendering performance
- [ ] Test on different browsers
- [ ] Add responsive design considerations
- [ ] Fix bugs and edge cases
- [ ] Balance gameplay difficulty

## Key Game Features to Implement

### Controls
- Player 1: WASD or Arrow keys to move, Space to shoot
- Player 2 (optional): IJKL to move, Enter to shoot

### Game Rules
- Protect the base (eagle symbol)
- Destroy all enemy tanks to advance
- Player loses a life when hit by bullet
- Game over when all lives lost or base destroyed
- 20 enemies per stage (mix of types)

### Enemy Types
1. **Basic Tank**: Standard speed and firepower
2. **Fast Tank**: Higher speed, same firepower
3. **Power Tank**: More health, can destroy steel

## Implementation Timeline Estimate
- Phase 1-2: 1-2 days
- Phase 3-4: 3-4 days
- Phase 5: 2-3 days
- Phase 6: 2-3 days
- Phase 7-8: 2-3 days
- **Total**: ~10-15 days for MVP

## Next Steps
1. Initialize Vite project
2. Set up basic game loop
3. Start with player tank movement
4. Gradually add features following the phases above
