let timerId;
const square = document.getElementById("square");

function startMovement() {
    if (timerId) return;

    timerId = setInterval(() => {
        
        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        square.style.left = randomX + "px";
        square.style.top = randomY + "px";
    }, 500); 
}

function stopMovement() {
    clearInterval(timerId);
    timerId = null;
}
