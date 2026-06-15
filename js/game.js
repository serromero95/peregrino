const gameContainer = document.getElementById("game-container");

const player = document.createElement("div");

player.className = "player";

gameContainer.appendChild(player);

const ground = document.createElement("div");

ground.className = "ground";

gameContainer.appendChild(ground);

let playerX = 80;

let playerY = 60;

let velocityY = 0;
let gravity = 1;
let isJumping = false;
let jumpForce = 18;

let movingRight = false;
let movingLeft = false;
let playerSpeed = 0;

document.addEventListener("keydown", function(event) {
    if(event.key === "ArrowRight"){
        movingRight = true;
        playerSpeed = 10;
    }

    if(event.key === "ArrowLeft"){
        playerX = playerX - 10;
        player.style.left = playerX + "px";
    }

    if(event.code === "Space" && !isJumping) {
        isJumping = true;
        velocityY = jumpForce;
    }

});

document.addEventListener("keyup", function(event) {
    if(event.key === "ArrowRight"){
        movingRight = false;
    }
});

setInterval(function() {

    if(movingRight){
        playerX = playerX + playerSpeed;
        player.style.left = playerX + "px";
    }

    playerY = playerY + velocityY;
    velocityY = velocityY - gravity;

    if(playerY < 60) {
        playerY = 60;
        velocityY = 0;
        isJumping = false;
    }

    player.style.bottom = playerY + "px";

}, 16);