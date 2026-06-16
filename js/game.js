const gameContainer = document.getElementById("game-container");

const player = document.createElement("div");

player.className = "player";

gameContainer.appendChild(player);

const ground = document.createElement("div");

ground.className = "ground";

gameContainer.appendChild(ground);

const platform1 = document.createrElement("div");
const platform2 = document.createrElement("div");
const platform3 = document.createrElement("div");

platform1.className = "platform platform1";
platform2.className = "platform platform2";
platform3.className = "platform platform3";

gameContainer.appendChild(platform1);
gameContainer.appendChild(platform2);
gameContainer.appendChild(platform3);

let playerX = 80;

let playerY = 60;

let velocityY = 0;
let gravity = 1;
let isJumping = false;
let jumpForce = 18;

let movingRight = false;
let movingLeft = false;
let playerSpeed = 5;

document.addEventListener("keydown", function(event) {
    if(event.key === "ArrowRight"){
        movingRight = true;
    }

    if(event.key === "ArrowLeft"){
        movingLeft = true;
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

    if(event.key === "ArrowLeft"){
        movingLeft = false;
    }
});

setInterval(function() {

    if(movingRight){
        playerX = playerX + playerSpeed;
    }

    if(movingLeft){
        playerX = playerX - playerSpeed;
    }

    player.style.left = playerX + "px";

    playerY = playerY + velocityY;
    velocityY = velocityY - gravity;

    if(playerY < 60) {
        playerY = 60;
        velocityY = 0;
        isJumping = false;
    }

    player.style.bottom = playerY + "px";

}, 16);