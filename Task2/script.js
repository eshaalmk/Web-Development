// Get elements
const gameArea = document.getElementById('gameArea');
const shooter = document.getElementById('shooter');
const target = document.getElementById('target');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const levelElement = document.getElementById('level');
const shootBtn = document.getElementById('shootBtn');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const messageElement = document.getElementById('message');

// Game variables
let score = 0;
let time = 30;
let level = 1;
let gameRunning = false;
let gameTimer;
let targetTimer;
let targetDirection = 'down';

// Start game
function startGame() {
    // Reset
    score = 0;
    time = 30;
    level = 1;
    gameRunning = true;
    targetDirection = 'down';
    
    // Update display
    scoreElement.textContent = score;
    timeElement.textContent = time;
    levelElement.textContent = level;
    messageElement.textContent = '';
    
    // Buttons
    startBtn.disabled = true;
    restartBtn.disabled = false;
    shootBtn.disabled = false;
    
    // Remove old arrows
    document.querySelectorAll('.arrow').forEach(a => a.remove());
    
    // Position target in middle of right side
    target.style.top = '125px'; // 300/2 - 50/2
    
    // Start moving target
    moveTarget();
    
    // Start timer
    startTimer();
}

// Move target up and down - NOW FASTER AT EACH LEVEL
function moveTarget() {
    clearInterval(targetTimer);
    
    // Speed based on level - FIXED: Higher level = FASTER (lower number)
    let speed = 40; // Level 1 speed
    if (level === 2) speed = 25; // Level 2: faster
    if (level === 3) speed = 15; // Level 3: fastest
    
    let targetY = 125;
    
    targetTimer = setInterval(() => {
        if (!gameRunning) return;
        
        // Move amount also increases with level
        let moveAmount = 5;
        if (level === 2) moveAmount = 7;
        if (level === 3) moveAmount = 9;
        
        if (targetDirection === 'down') {
            targetY += moveAmount;
            if (targetY >= 250) targetDirection = 'up';
        } else {
            targetY -= moveAmount;
            if (targetY <= 0) targetDirection = 'down';
        }
        
        target.style.top = targetY + 'px';
    }, speed);
}

// Start timer
function startTimer() {
    clearInterval(gameTimer);
    
    gameTimer = setInterval(() => {
        if (!gameRunning) return;
        
        time--;
        timeElement.textContent = time;
        
        // Level up - AND RESTART MOVEMENT WITH NEW SPEED
        if (time === 20 && level === 1) {
            level = 2;
            levelElement.textContent = level;
            moveTarget(); // Restart with new speed
            showMsg('Level 2: 10 points, Faster!');
        }
        if (time === 10 && level === 2) {
            level = 3;
            levelElement.textContent = level;
            moveTarget(); // Restart with new speed
            showMsg('Level 3: 15 points, Very Fast!');
        }
        
        // End game
        if (time <= 0) {
            endGame();
        }
    }, 1000);
}

// Shoot arrow
shootBtn.addEventListener('click', function() {
    if (!gameRunning) return;
    
    // Get shooter position (middle)
    const shooterRect = shooter.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    const shooterY = shooterRect.top - gameRect.top + 20; // Middle of shooter
    
    // Create arrow starting from shooter's middle
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    arrow.style.top = (shooterY - 2) + 'px'; // Center it vertically
    arrow.style.left = '90px'; // Right side of shooter
    
    gameArea.appendChild(arrow);
    
    // Move arrow
    let pos = 90;
    const moveArrow = setInterval(() => {
        if (!gameRunning) {
            clearInterval(moveArrow);
            return;
        }
        
        pos += 8;
        arrow.style.left = pos + 'px';
        
        // Check if reached target area
        if (pos >= 500) {
            clearInterval(moveArrow);
            checkHit(shooterY);
            
            // Remove arrow
            setTimeout(() => {
                if (arrow.parentNode) arrow.remove();
            }, 300);
        }
    }, 20);
});

// Check hit
function checkHit(arrowY) {
    const targetRect = target.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    const targetTop = targetRect.top - gameRect.top;
    const targetBottom = targetTop + 50;
    
    // Hit check: arrow Y is within target Y range
    if (arrowY >= targetTop && arrowY <= targetBottom) {
        // Add points based on level
        if (level === 1) score += 5;
        else if (level === 2) score += 10;
        else score += 15;
        
        scoreElement.textContent = score;
        showMsg('Hit! +' + (level * 5) + ' points');
    }
}

// Show message
function showMsg(text) {
    messageElement.textContent = text;
    setTimeout(() => {
        if (messageElement.textContent === text) {
            messageElement.textContent = '';
        }
    }, 1000);
}

// End game
function endGame() {
    gameRunning = false;
    clearInterval(gameTimer);
    clearInterval(targetTimer);
    messageElement.textContent = 'Game Over! Score: ' + score;
    startBtn.disabled = false;
    shootBtn.disabled = true;
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);