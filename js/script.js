const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let canvasWidth = 800;
let canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const player1 = {
    x: 50,
    y: canvasHeight / 2 - 25,
    width: 10,
    height: 50,
    color: '#3498db',
    speed: 5,
    upPressed: false,
    downPressed: false
};

const player2 = {
    x: canvasWidth - 60,
    y: canvasHeight / 2 - 25,
    width: 10,
    height: 50,
    color: '#e74c3c',
    speed: 5,
    upPressed: false,
    downPressed: false
};

const ball = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    radius: 10,
    color: '#f1c40f',
    dx: 3,
    dy: 3
};

let player1Score = 0;
let player2Score = 0;

function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawField() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.setLineDash([]);

    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(0, canvas.height / 2 - 100, 60, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(canvas.width - 60, canvas.height / 2 - 100, 60, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(60, canvas.height / 2, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width - 60, canvas.height / 2, 20, 0, Math.PI * 2);
    ctx.stroke();
}

function movePlayerWithKeyboard(player, upKey, downKey) {
    document.addEventListener('keydown', function(event) {
        if (event.key === upKey) {
            player.upPressed = true;
        } else if (event.key === downKey) {
            player.downPressed = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === upKey) {
            player.upPressed = false;
        } else if (event.key === downKey) {
            player.downPressed = false;
        }
    });
}

function movePlayerWithMouse(player) {
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseY = event.clientY - rect.top;

        // Centering player's movement around the mouse pointer
        player.y = mouseY - player.height / 2;

        // Clamp player position within canvas boundaries
        if (player.y < 0) {
            player.y = 0;
        } else if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
        }
    });
}

function updatePlayerPosition(player) {
    if (player.upPressed && player.y > 0) {
        player.y -= player.speed;
    } else if (player.downPressed && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        if (ball.x + ball.radius > canvas.width) {
            player1Score++;
        } else {
            player2Score++;
        }
        resetBall();
    }

    if (checkCollision(ball, player1) || checkCollision(ball, player2)) {
        ball.dx = -ball.dx;
    }
}

function checkCollision(ball, player) {
    return ball.x - ball.radius < player.x + player.width &&
           ball.x + ball.radius > player.x &&
           ball.y - ball.radius < player.y + player.height &&
           ball.y + ball.radius > player.y;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

function drawScore() {
    const scoreboard = document.querySelector('.scoreboard');
    scoreboard.textContent = `Player 1: ${player1Score} - Player 2: ${player2Score}`;
}

function draw() {
    drawField();
    drawPlayer(player1);
    drawPlayer(player2);
    drawBall();
    drawScore();
}

function update() {
    updatePlayerPosition(player1);
    updatePlayerPosition(player2);
    updateBall();
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    const aspectRatio = canvasWidth / canvasHeight;
    const newWidth = window.innerWidth * 0.9;
    const newHeight = newWidth / aspectRatio;

    canvas.width = newWidth;
    canvas.height = newHeight;

    const scaleX = newWidth / canvasWidth;
    const scaleY = newHeight / canvasHeight;

    player1.x *= scaleX;
    player1.y *= scaleY;
    player1.width *= scaleX;
    player1.height *= scaleY;

    player2.x *= scaleX;
    player2.y *= scaleY;
    player2.width *= scaleX;
    player2.height *= scaleY;

    ball.x *= scaleX;
    ball.y *= scaleY;
    ball.radius *= scaleX;

    canvasWidth = newWidth;
    canvasHeight = newHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

movePlayerWithKeyboard(player1, 'w', 's');
movePlayerWithKeyboard(player2, 'ArrowUp', 'ArrowDown');
movePlayerWithMouse(player1); // Solo agregamos el control del mouse al jugador 1
gameLoop();
