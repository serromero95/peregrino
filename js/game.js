// World object

const gameContainer = document.getElementById("game-container");

const world = document.createElement("div");
world.className = "world";
gameContainer.appendChild(world);

const worldWidth = world.clientWidth;

//Grounds

const grounds = [
    { left: 0, width: 520 },
    { left: 760, width: 360 },
    { left: 1380, width: 300 },
    { left: 1980, width: 320 },
    { left: 2600, width: 400 }
];

const groundHeight = 80;

grounds.forEach(ground => {
    const floor = document. createElement("div");

    ground.right = ground.left + ground.width;

    floor.classList.add("ground");

    floor.style.left = ground.left + "px";
    floor.style.width = ground.width + "px";
    floor.style.height = groundHeight + "px";

    world.append(floor);
});

//Platforms

const platforms = [
    { className: "platform1", left: 280, bottom: 180, width: 150, height: 30 },

    // Primer hueco: dos saltos
    { className: "platform2", left: 555, bottom: 150, width: 90, height: 30 },
    { className: "platform3", left: 675, bottom: 220, width: 70, height: 30 },

    { className: "platform4", left: 900, bottom: 240, width: 120, height: 30 },

    // Segundo hueco: plataformas pequeñas y escalonadas
    { className: "platform5", left: 1155, bottom: 150, width: 75, height: 30 },
    { className: "platform6", left: 1260, bottom: 230, width: 70, height: 30 },

    { className: "platform7", left: 1450, bottom: 320, width: 110, height: 30 },

    // Tercer hueco: salto descendente
    { className: "platform8", left: 1715, bottom: 260, width: 70, height: 30 },
    { className: "platform9", left: 1820, bottom: 180, width: 75, height: 30 },

    { className: "platform10", left: 2070, bottom: 260, width: 110, height: 30 },

    // Último hueco: tramo más difícil
    { className: "platform11", left: 2335, bottom: 150, width: 65, height: 30 },
    { className: "platform12", left: 2435, bottom: 230, width: 60, height: 30 },
    { className: "platform13", left: 2530, bottom: 310, width: 55, height: 30 },

    { className: "platform14", left: 2750, bottom: 220, width: 130, height: 30 }
];

platforms.forEach(platform => {
    const block = document.createElement("div");
    platform.right = platform.left + platform.width;
    platform.top = platform.bottom + platform.height;
    
    block.classList.add("platform", platform.className);

    block.style.left = platform.left + "px";
    block.style.bottom = platform.bottom + "px";
    block.style.width = platform.width + "px";
    block.style.height = platform.height + "px";

    world.append(block);
});

//Player

const player = document.createElement("div");
player.className = "player";
gameContainer.appendChild(player);

let playerX = groundHeight;
let playerY = groundHeight;

const playerSpriteOffsetY = -3;

// Lives

const livesContainer = document.createElement("div");
livesContainer.classList.add("lives-container");
gameContainer.append(livesContainer);

let checkPointX = 80;
let checkPointY = groundHeight;

let isRespawning = false;

let hasFallen = false;
let totalLives = 3;
let lives = 3;

renderLives();

//player Attack

let isAttacking = false;

let attackTimeout;

//SafePoints

let enemySafePointX = 700;
let enemySafePointY = groundHeight;

const checkpoints = [
    { x: 80, y: groundHeight },
    { x: 1400, y: groundHeight },
    { x: 2000, y: groundHeight },
    { x: 2700, y: groundHeight }
];

//Enemies

const enemy = document.createElement("div");

enemy.classList.add("enemy", "enemy--right");

world.append(enemy);

let enemyX = 900;
let enemyY = groundHeight;

let enemySpeed = 2;

let isPatrollingRight = true;

let enemyPatrolLeft = 760;
let enemyPatrolRight = 1020;

const enemyWidth = 150;
const enemyHeight = 70;

//Game Over

const overlayGameOver = document.createElement("div");
const imgGameOver = document.createElement("img");
const resetButton = document.createElement("button");

overlayGameOver.classList.add("overlay-game-over");
imgGameOver.classList.add("img-game-over");
resetButton.classList.add("reset-button");

resetButton.textContent = "Pulsa Enter para reintentar";

imgGameOver.src = "assets/img/ui/game-over.png";

overlayGameOver.append(imgGameOver, resetButton);
gameContainer.append(overlayGameOver);

let isGameOver = false;

// Player stats

let velocityY = 0;
let gravity = 1;
let jumpForce = 18;
let isOnSurface = true;

let movingRight = false;
let movingLeft = false;
let playerSpeed = 5;

const playerWidth = 80;
const playerHeight = 150;

const gameKeys = ["ArrowLeft", "ArrowRight", "Space", "KeyZ"];

//Sreen & Camera

let cameraX = 0;

const screenWidth = gameContainer.clientWidth;

//Functions

function renderLives() {

    livesContainer.innerHTML = "";

    const lostLives = totalLives - lives;
    
    for(let i = 0; i<lives; i++){
        const heart = document.createElement("img");
        heart.src = "assets/img/ui/heart.png";
        heart.classList.add("heart");
        livesContainer.append(heart);
    }

    for(let i=0; i<lostLives; i++) {
        const emptyHeart = document.createElement("img");
        emptyHeart.src = "assets/img/ui/empty-heart.png";
        emptyHeart.classList.add("empty-heart");
        livesContainer.append(emptyHeart);
    }

}

function gameOver() {

        isGameOver = true;
        movingLeft = false;
        movingRight = false;
        overlayGameOver.style.display = "flex";

}

function resetGame() {
    // Player
    playerX = groundHeight;
    playerY = groundHeight;
    velocityY = 0;
    facingRight = true;
    isOnSurface = true;

    movingLeft = false;
    movingRight = false;

    // Checkpoint
    checkPointX = 80;
    checkPointY = groundHeight;

    // States
    isRespawning = false;
    hasFallen = false;
    isGameOver = false;

    // Lives
    lives = totalLives;
    renderLives();

    // Camera
    cameraX = 0;

    // Clean visual states
    player.classList.remove("respawning");
    overlayGameOver.style.display = "none";
}

//Player moves

let facingRight = true;

document.addEventListener("keydown", function(event) {
    if(gameKeys.includes(event.code)) {
        event.preventDefault();
    }

    if (isGameOver) {
        if (event.code === "Enter") {
            resetGame();
        }

        return;
    }
    
    if(isRespawning) {
        return;
    }

    if(event.code === "ArrowRight"){
        movingRight = true;
    }

    if(event.code === "ArrowLeft"){
        movingLeft = true;
    }

    if(event.code === "Space" && isOnSurface) {
        velocityY = jumpForce;
        isOnSurface = false;
    }

    if (event.code === "KeyZ" && !isAttacking) {
        isAttacking = true;
        player.classList.add("attacking");

        clearTimeout(attackTimeout);

        attackTimeout = setTimeout(() => {
            isAttacking = false;
            player.classList.remove("attacking");
        }, 300);
    }

});

document.addEventListener("keyup", function(event) {

    if(event.code === "ArrowRight"){
        movingRight = false;
    }

    if(event.code === "ArrowLeft"){
        movingLeft = false;
    }
});

resetButton.addEventListener("click", resetGame);

setInterval(function() {

    if (isGameOver) {
        return;
    }

    isOnSurface = false;

    if(movingRight){
        playerX = playerX + playerSpeed;
        facingRight = true;
    }

    if(movingLeft){
        playerX = playerX - playerSpeed;
        facingRight = false;
    }

    if(playerX < 0) {
        playerX = 0;
    }

    if(playerX + playerWidth > worldWidth) {
        playerX = worldWidth - playerWidth;
    }

    if(playerX + playerWidth / 2 > screenWidth/2) {
        cameraX = playerX + playerWidth/2 - (screenWidth/2);
    } else {
        cameraX = 0;
    }

    if(cameraX > worldWidth - screenWidth) {
        cameraX = worldWidth - screenWidth;
    }

    if (cameraX < 0) {
        cameraX = 0;
    }

    const playerRight = playerX + playerWidth;
    const playerTop = playerY + playerHeight;

    const previousPlayerY = playerY;
    playerY = playerY + velocityY;
    velocityY = velocityY - gravity;

    //Enemy

    if(isPatrollingRight && enemyX < enemyPatrolRight) {
        enemyX += enemySpeed;
    } else if (!isPatrollingRight && enemyX > enemyPatrolLeft) {
        enemyX -= enemySpeed;
    } else if (isPatrollingRight) {
        isPatrollingRight = false;
        enemy.classList.add("enemy--left");
        enemy.classList.remove("enemy--right");
    } else {
        isPatrollingRight = true;
        enemy.classList.add("enemy--right");
        enemy.classList.remove("enemy--left");
    }

    const enemyRight = enemyX + enemyWidth;
    const enemyTop = enemyY + enemyHeight;

    //checkPoints

    checkpoints.forEach(checkpoint => {
        if (playerX >= checkpoint.x) {
            checkPointX = checkpoint.x;
            checkPointY = checkpoint.y;
        }
    });

    //Enemy Collision

    if (
        playerRight >= enemyX &&
        playerX <= enemyRight &&
        playerTop >= enemyY &&
        playerY <= enemyTop &&
        !isRespawning
    ) {
        if(isAttacking) {
            enemy.remove();
        } else if (!isRespawning) {
            lives--;
            renderLives();

            if(lives === 0) {
                gameOver();
                return;
            }

            isRespawning = true;
            movingLeft = false;
            movingRight = false;

            playerX = enemySafePointX;
            playerY = enemySafePointY;
            velocityY = 0;

            player.classList.add("respawning");

            setTimeout(() => {
                isRespawning = false;
                player.classList.remove("respawning");
            }, 1500);
        }
    }

    //Grounds collision

    grounds.forEach(ground => {

        if ( 
            playerY <= groundHeight &&
            playerRight >= ground.left &&
            playerX <= ground.right &&
            previousPlayerY >= groundHeight &&
            velocityY < 0
        ) {
            playerY = groundHeight;
            velocityY = 0;
            isOnSurface = true;
        }

    })

    //Platform collision

    platforms.forEach(platform => {

        if( 
            playerRight >= platform.left &&
            playerX <= platform.right &&
            playerY <= platform.top && 
            previousPlayerY >= platform.top &&
            velocityY < 0
        ) {
            playerY = platform.top;
            velocityY = 0; 
            isOnSurface = true;
        }

    });

    if (isOnSurface) {
        if(facingRight) {
            checkPointX = Math.max(0, playerX - playerWidth);
        } else {
            checkPointX = Math.min(worldWidth - playerWidth, playerX + playerWidth);
        }
        checkPointY = playerY;
    }

    if (playerY < -playerHeight) {
        hasFallen = true;
    }

    if(hasFallen) {
        movingLeft = false;
        movingRight = false;

        lives--;
        renderLives();

        if(lives === 0) {
            gameOver();
            return;
        }

        
        console.log(lives)
        
        isRespawning = true;

        playerX = checkPointX;
        playerY = checkPointY;
        velocityY = 0;

        player.classList.add("respawning");

        console.log(hasFallen);
        hasFallen = false;

        setTimeout(() => {
            console.log("fin respawn");
            isRespawning = false;
            player.classList.remove("respawning");
        }, 1500);
    }

    

    const playerScreenX = playerX - cameraX;

    player.style.left = playerScreenX + "px";
    player.style.bottom = (playerY + playerSpriteOffsetY) + "px";

    gameContainer.style.backgroundPositionX = -(cameraX * 0.2) + "px";

    world.style.left = -cameraX + "px";

    enemy.style.left = enemyX + "px";
    enemy.style.bottom = enemyY + "px";

}, 16);