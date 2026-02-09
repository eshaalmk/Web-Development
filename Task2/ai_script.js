// ===== GAME CONSTANTS =====
const GAME_TIME = 30;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 500;
const BOW_POSITION = { x: 100, y: GAME_HEIGHT / 2 };
const TARGET_INITIAL_POSITION = { x: GAME_WIDTH - 150, y: GAME_HEIGHT / 2 };
const TARGET_MIN_Y = 60;
const TARGET_MAX_Y = GAME_HEIGHT - 60;

// ===== DOM ELEMENTS =====
const gameArea = document.getElementById('gameArea');
const arrowsContainer = document.getElementById('arrowsContainer');
const targetContainer = document.getElementById('targetContainer');
const target = document.getElementById('target');
const bowContainer = document.getElementById('bowContainer');

// Overlay screens
const startScreen = document.getElementById('startScreen');
const pauseScreen = document.getElementById('pauseScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

// HUD elements
const scoreElement = document.getElementById('score');
const timeLeftElement = document.getElementById('timeLeft');
const levelElement = document.getElementById('level');
const accuracyElement = document.getElementById('accuracy');
const difficultyBar = document.getElementById('difficultyBar');
const gameStatus = document.getElementById('gameStatus');

// Pause screen elements
const pauseScoreElement = document.getElementById('pauseScore');
const pauseTimeElement = document.getElementById('pauseTime');

// Game over screen elements
const finalScoreElement = document.getElementById('finalScore');
const finalAccuracyElement = document.getElementById('finalAccuracy');
const finalLevelElement = document.getElementById('finalLevel');

// Buttons
const startButton = document.getElementById('startButton');
const pauseMenuButton = document.getElementById('pauseMenuButton');
const resumeButton = document.getElementById('resumeButton');
const restartButton = document.getElementById('restartButton');
const playAgainButton = document.getElementById('playAgainButton');
const menuButton = document.getElementById('menuButton');

// ===== GAME STATE =====
let gameState = {
    score: 0,
    timeLeft: GAME_TIME,
    level: 1,
    shotsFired: 0,
    shotsHit: 0,
    gameRunning: false,
    gamePaused: false,
    gameOver: false,
    targetX: TARGET_INITIAL_POSITION.x,
    targetY: TARGET_INITIAL_POSITION.y,
    targetDirection: 'down',
    targetSpeed: 5,
    targetSize: 120,
    animationId: null,
    gameTimer: null,
    targetTimer: null
};

// ===== INITIALIZATION =====
function initializeGame() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize target position
    updateTargetPosition(gameState.targetY);
    
    // Show start screen
    showScreen(startScreen);
}

// ===== EVENT HANDLING =====
function setupEventListeners() {
    // Game area click to shoot
    gameArea.addEventListener('click', handleGameAreaClick);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Control buttons
    startButton.addEventListener('click', startGame);
    pauseMenuButton.addEventListener('click', togglePause);
    resumeButton.addEventListener('click', resumeGame);
    restartButton.addEventListener('click', restartGame);
    playAgainButton.addEventListener('click', restartGame);
    menuButton.addEventListener('click', returnToMenu);
}

function handleGameAreaClick(event) {
    if (!gameState.gameRunning || gameState.gamePaused || gameState.gameOver) return;
    
    // Check if clicking on target (for potential future features)
    const targetRect = target.getBoundingClientRect();
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    const isClickingTarget = (
        clickX >= targetRect.left &&
        clickX <= targetRect.right &&
        clickY >= targetRect.top &&
        clickY <= targetRect.bottom
    );
    
    // Always shoot regardless of click location
    shootArrow();
    
    // Prevent event bubbling
    event.stopPropagation();
}

function handleKeyPress(event) {
    switch (event.code) {
        case 'Space':
        case 'Enter':
            event.preventDefault();
            if (gameState.gameRunning && !gameState.gamePaused && !gameState.gameOver) {
                shootArrow();
            }
            break;
            
        case 'KeyP':
            event.preventDefault();
            if (gameState.gameRunning && !gameState.gameOver) {
                togglePause();
            }
            break;
            
        case 'Escape':
            event.preventDefault();
            if (gameState.gamePaused) {
                resumeGame();
            } else if (gameState.gameRunning && !gameState.gameOver) {
                togglePause();
            }
            break;
    }
}

// ===== GAME FLOW CONTROL =====
function startGame() {
    resetGameState();
    showScreen(null); // Hide all overlays
    updateGameStatus('ACTIVE');
    
    gameState.gameRunning = true;
    startTimer();
    moveTarget();
    
    // Animate bow on start
    animateBowDraw();
}

function togglePause() {
    if (gameState.gameOver) return;
    
    gameState.gamePaused = !gameState.gamePaused;
    
    if (gameState.gamePaused) {
        pauseGame();
    } else {
        resumeGame();
    }
}

function pauseGame() {
    clearInterval(gameState.gameTimer);
    clearInterval(gameState.targetTimer);
    cancelAnimationFrame(gameState.animationId);
    
    // Update pause screen stats
    pauseScoreElement.textContent = gameState.score;
    pauseTimeElement.textContent = `${gameState.timeLeft}s`;
    
    showScreen(pauseScreen);
    updateGameStatus('PAUSED');
}

function resumeGame() {
    showScreen(null);
    updateGameStatus('ACTIVE');
    
    gameState.gamePaused = false;
    startTimer();
    moveTarget();
}

function endGame() {
    gameState.gameRunning = false;
    gameState.gameOver = true;
    
    clearInterval(gameState.gameTimer);
    clearInterval(gameState.targetTimer);
    cancelAnimationFrame(gameState.animationId);
    
    // Update game over screen
    const accuracy = calculateAccuracy();
    finalScoreElement.textContent = gameState.score;
    finalAccuracyElement.textContent = `${accuracy}%`;
    finalLevelElement.textContent = `Level ${gameState.level}`;
    
    showScreen(gameOverScreen);
    updateGameStatus('COMPLETE');
}

function restartGame() {
    resetGameState();
    showScreen(null);
    updateGameStatus('ACTIVE');
    
    gameState.gameRunning = true;
    startTimer();
    moveTarget();
    
    // Clear arrows
    arrowsContainer.innerHTML = '';
}

function returnToMenu() {
    resetGameState();
    showScreen(startScreen);
    updateGameStatus('READY');
    
    // Clear arrows
    arrowsContainer.innerHTML = '';
}

// ===== GAME LOGIC FUNCTIONS =====
function moveTarget() {
    clearInterval(gameState.targetTimer);
    
    gameState.targetTimer = setInterval(function() {
        if (!gameState.gameRunning || gameState.gamePaused || gameState.gameOver) return;
        
        // Move target based on direction
        if (gameState.targetDirection === 'down') {
            gameState.targetY += gameState.targetSpeed;
            if (gameState.targetY >= TARGET_MAX_Y) {
                gameState.targetY = TARGET_MAX_Y;
                gameState.targetDirection = 'up';
            }
        } else {
            gameState.targetY -= gameState.targetSpeed;
            if (gameState.targetY <= TARGET_MIN_Y) {
                gameState.targetY = TARGET_MIN_Y;
                gameState.targetDirection = 'down';
            }
        }
        
        updateTargetPosition(gameState.targetY);
    }, 16); // ~60fps
}

function shootArrow() {
    if (!gameState.gameRunning || gameState.gamePaused || gameState.gameOver) return;
    
    gameState.shotsFired++;
    updateAccuracy();
    
    // Create arrow element
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    
    // Position arrow at bow
    arrow.style.left = `${BOW_POSITION.x + 60}px`;
    arrow.style.top = `${BOW_POSITION.y - 2}px`;
    
    arrowsContainer.appendChild(arrow);
    
    // Calculate target position for arrow trajectory
    const targetY = gameState.targetY;
    
    // Animate arrow
    const startTime = Date.now();
    const duration = 800; // ms
    
    function animateArrow() {
        if (!gameState.gameRunning || gameState.gamePaused) return;
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Calculate position (straight line to target)
        const currentX = BOW_POSITION.x + 60 + (TARGET_INITIAL_POSITION.x - BOW_POSITION.x - 60) * progress;
        const currentY = BOW_POSITION.y + (targetY - BOW_POSITION.y) * progress;
        
        arrow.style.left = `${currentX}px`;
        arrow.style.top = `${currentY - 2}px`;
        
        // Check for collision
        if (progress >= 0.95) {
            checkCollision(arrow, currentX, currentY);
            return;
        }
        
        // Continue animation
        if (progress < 1) {
            gameState.animationId = requestAnimationFrame(animateArrow);
        } else {
            // Remove arrow if it misses
            setTimeout(function() {
                if (arrow.parentNode) {
                    arrow.remove();
                }
            }, 300);
        }
    }
    
    animateArrow();
}

function checkCollision(arrow, arrowX, arrowY) {
    // Calculate target bounds
    const targetBounds = {
        left: gameState.targetX - gameState.targetSize / 2,
        right: gameState.targetX + gameState.targetSize / 2,
        top: gameState.targetY - gameState.targetSize / 2,
        bottom: gameState.targetY + gameState.targetSize / 2
    };
    
    // Check if arrow is within target bounds
    const isHit = (
        arrowX >= targetBounds.left &&
        arrowX <= targetBounds.right &&
        arrowY >= targetBounds.top &&
        arrowY <= targetBounds.bottom
    );
    
    if (isHit) {
        gameState.shotsHit++;
        
        // Calculate points based on precision
        const targetCenterX = gameState.targetX;
        const targetCenterY = gameState.targetY;
        const distance = Math.sqrt(
            Math.pow(arrowX - targetCenterX, 2) + Math.pow(arrowY - targetCenterY, 2)
        );
        
        let points = 0;
        if (distance <= 10) points = 10; // Bullseye
        else if (distance <= 30) points = 5; // Inner ring
        else points = 2; // Outer ring
        
        // Add level multiplier
        points *= gameState.level;
        
        // Update score
        gameState.score += points;
        updateScore();
        updateAccuracy();
        
        // Visual feedback
        arrow.classList.add('hit');
        createHitEffect(arrowX, arrowY);
        animateTargetHit();
        
        // Remove arrow after hit animation
        setTimeout(function() {
            if (arrow.parentNode) {
                arrow.remove();
            }
        }, 600);
        
        // Check for level progression
        increaseDifficulty();
    } else {
        // Miss - remove arrow
        setTimeout(function() {
            if (arrow.parentNode) {
                arrow.remove();
            }
        }, 300);
    }
}

function startTimer() {
    clearInterval(gameState.gameTimer);
    
    gameState.gameTimer = setInterval(function() {
        if (!gameState.gameRunning || gameState.gamePaused || gameState.gameOver) return;
        
        gameState.timeLeft--;
        updateTime();
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function increaseDifficulty() {
    // Increase level every 5 hits
    const newLevel = Math.floor(gameState.shotsHit / 5) + 1;
    
    if (newLevel > gameState.level && newLevel <= 3) {
        gameState.level = newLevel;
        
        // Increase target speed
        gameState.targetSpeed = 5 + (gameState.level * 2);
        
        // Decrease target size gradually
        gameState.targetSize = 120 - ((gameState.level - 1) * 20);
        target.style.width = `${gameState.targetSize}px`;
        target.style.height = `${gameState.targetSize}px`;
        
        // Update target rings
        updateTargetRings();
        
        // Update UI
        updateLevel();
        updateDifficultyBar();
        
        // Show level up message
        showLevelUpMessage();
    }
}

// ===== UI UPDATE FUNCTIONS =====
function updateScore() {
    scoreElement.textContent = gameState.score;
    scoreElement.style.animation = 'none';
    setTimeout(function() {
        scoreElement.style.animation = 'slideIn 0.3s ease';
    }, 10);
}

function updateTime() {
    timeLeftElement.textContent = gameState.timeLeft;
    
    // Color coding for time
    if (gameState.timeLeft <= 10) {
        timeLeftElement.style.color = 'var(--color-danger)';
    } else if (gameState.timeLeft <= 20) {
        timeLeftElement.style.color = 'var(--color-warning)';
    } else {
        timeLeftElement.style.color = 'var(--color-text)';
    }
}

function updateLevel() {
    levelElement.textContent = gameState.level;
}

function updateAccuracy() {
    const accuracy = calculateAccuracy();
    accuracyElement.textContent = `${accuracy}%`;
}

function calculateAccuracy() {
    if (gameState.shotsFired === 0) return 0;
    return Math.round((gameState.shotsHit / gameState.shotsFired) * 100);
}

function updateDifficultyBar() {
    const width = (gameState.level / 3) * 100;
    difficultyBar.style.width = `${width}%`;
}

function updateGameStatus(status) {
    const statusIndicator = gameStatus.querySelector('.status-indicator');
    const statusText = gameStatus.querySelector('span');
    
    switch (status) {
        case 'READY':
            statusIndicator.style.background = 'var(--color-text-secondary)';
            statusText.textContent = 'READY';
            break;
        case 'ACTIVE':
            statusIndicator.style.background = 'var(--color-success)';
            statusText.textContent = 'ACTIVE';
            break;
        case 'PAUSED':
            statusIndicator.style.background = 'var(--color-warning)';
            statusText.textContent = 'PAUSED';
            break;
        case 'COMPLETE':
            statusIndicator.style.background = 'var(--color-primary)';
            statusText.textContent = 'COMPLETE';
            break;
    }
}

function updateTargetPosition(y) {
    targetContainer.style.top = `${y - gameState.targetSize / 2}px`;
}

function updateTargetRings() {
    const outerRing = target.querySelector('.outer');
    const middleRing = target.querySelector('.middle');
    const innerRing = target.querySelector('.inner');
    
    const size = gameState.targetSize;
    
    outerRing.style.width = `${size}px`;
    outerRing.style.height = `${size}px`;
    
    middleRing.style.width = `${size * 0.67}px`;
    middleRing.style.height = `${size * 0.67}px`;
    
    innerRing.style.width = `${size * 0.33}px`;
    innerRing.style.height = `${size * 0.33}px`;
}

// ===== VISUAL EFFECTS =====
function animateBowDraw() {
    const bowString = document.querySelector('.bow-string');
    
    bowString.style.transform = 'translateX(-50%) scaleX(1.2)';
    bowString.style.transition = 'transform 0.2s ease';
    
    setTimeout(function() {
        bowString.style.transform = 'translateX(-50%) scaleX(1)';
    }, 200);
}

function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    gameArea.appendChild(effect);
    
    setTimeout(function() {
        if (effect.parentNode) {
            effect.remove();
        }
    }, 600);
}

function animateTargetHit() {
    target.style.transform = 'scale(1.2)';
    target.style.transition = 'transform 0.2s ease';
    
    setTimeout(function() {
        target.style.transform = 'scale(1)';
    }, 200);
}

function showLevelUpMessage() {
    const message = document.createElement('div');
    message.className = 'level-up-message';
    message.textContent = `Level ${gameState.level}!`;
    message.style.cssText = `
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-primary);
        color: white;
        padding: 8px 16px;
        border-radius: var(--border-radius-md);
        font-weight: 600;
        z-index: 100;
        animation: fadeIn 0.3s ease;
    `;
    
    gameArea.appendChild(message);
    
    setTimeout(function() {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.3s ease';
        setTimeout(function() {
            if (message.parentNode) {
                message.remove();
            }
        }, 300);
    }, 1500);
}

// ===== UTILITY FUNCTIONS =====
function resetGameState() {
    gameState = {
        score: 0,
        timeLeft: GAME_TIME,
        level: 1,
        shotsFired: 0,
        shotsHit: 0,
        gameRunning: false,
        gamePaused: false,
        gameOver: false,
        targetX: TARGET_INITIAL_POSITION.x,
        targetY: TARGET_INITIAL_POSITION.y,
        targetDirection: 'down',
        targetSpeed: 5,
        targetSize: 120,
        animationId: null,
        gameTimer: null,
        targetTimer: null
    };
    
    // Reset UI
    updateScore();
    updateTime();
    updateLevel();
    updateAccuracy();
    updateDifficultyBar();
    updateTargetRings();
    updateTargetPosition(gameState.targetY);
}

function showScreen(screenElement) {
    // Hide all screens
    [startScreen, pauseScreen, gameOverScreen].forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show requested screen or hide all
    if (screenElement) {
        screenElement.classList.add('active');
        document.querySelector('.game-container').classList.add('hidden');
    } else {
        document.querySelector('.game-container').classList.remove('hidden');
    }
}

// ===== INITIALIZE GAME =====
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});