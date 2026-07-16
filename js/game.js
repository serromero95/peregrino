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

// Lives
let checkPointX = 80;
let checkPointY = groundHeight;

let isRespawning = false;

let hasFallen = false;
let lives = 3;

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

const gameKeys = ["ArrowLeft", "ArrowRight", "Space"];

//Sreen & Camera

let cameraX = 0;

const screenWidth = gameContainer.clientWidth;

//Player moves

let facingRight = true;

document.addEventListener("keydown", function(event) {
    if(gameKeys.includes(event.code)) {
        event.preventDefault();
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

});

document.addEventListener("keyup", function(event) {

    if(event.code === "ArrowRight"){
        movingRight = false;
    }

    if(event.code === "ArrowLeft"){
        movingLeft = false;
    }
});

setInterval(function() {
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

    const previousPlayerY = playerY;
    playerY = playerY + velocityY;
    velocityY = velocityY - gravity;

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
    player.style.bottom = playerY + "px";

    gameContainer.style.backgroundPositionX = -(cameraX * 0.2) + "px";

    world.style.left = -cameraX + "px";

}, 16);