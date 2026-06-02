import { Game } from './Game.js';

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const startButton = document.getElementById('start-button');
  const restartButton = document.getElementById('restart-button');
  const startScreen = document.getElementById('start-screen');
  const gameOverScreen = document.getElementById('game-over-screen');
  const pauseScreen = document.getElementById('pause-screen');
  const scoreElement = document.getElementById('score');
  const livesElement = document.getElementById('lives');
  const stageElement = document.getElementById('stage');
  const finalScoreElement = document.getElementById('final-score');

  // Create game instance
  const game = new Game(canvas);

  // Start button handler
  startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    game.start();
  });

  // Restart button handler
  restartButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    game.start();
  });

  // Pause handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
      if (game.isRunning && !game.isPaused) {
        game.pause();
        pauseScreen.classList.remove('hidden');
      } else if (game.isPaused) {
        game.resume();
        pauseScreen.classList.add('hidden');
      }
    }
  });

  // Game state listeners
  game.onGameOver = (score) => {
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
  };

  game.onScoreUpdate = (score) => {
    scoreElement.textContent = score;
  };

  game.onLivesUpdate = (lives) => {
    livesElement.textContent = lives;
  };

  game.onStageUpdate = (stage) => {
    stageElement.textContent = stage;
  };

  // Initial UI update
  game.onScoreUpdate(0);
  game.onLivesUpdate(3);
  game.onStageUpdate(1);
});
