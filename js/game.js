const gameContainer = document.getElementById("game-container");

const world = document.createElement("div");
world.className = "world";
gameContainer.appendChild(world);

const ground = document.createElement("div");
ground.className = "ground";
world.appendChild(ground);

const platform1 = document.createElement("div");
const platform2 = document.createElement("div");
const platform3 = document.createElement("div");

platform1.className = "platform platform1";
platform2.className = "platform platform2";
platform3.className = "platform platform3";

world.appendChild(platform1);
world.appendChild(platform2);
world.appendChild(platform3);

const player = document.createElement("div");
player.className = "player";
gameContainer.appendChild(player);

let playerX = 80;
let playerY = 80;

let velocityY = 0;
let gravity = 1;
let isJumping = false;
let jumpForce = 18;

let movingRight = false;
let movingLeft = false;
let playerSpeed = 5;

const playerWidth = 80;
const playerHeight = 150;


const platform1Left = 300;
const platform1Width = 220;

const platform1Right = platform1Left + platform1Width;
const platform1Bottom = 170;
const platform1Height = 30;
const platform1Top = platform1Bottom + platform1Height;

const platform2Left = 600;
const platform2Width = 200;

const platform2Right = platform2Left + platform2Width;
const platform2Bottom = 260;
const platform2Height = 30;
const platform2Top = platform2Bottom + platform2Height;

const platform3Left = 900;
const platform3Width = 180;

const platform3Right = platform3Left + platform3Width;
const platform3Bottom = 350;
const platform3Height = 30;
const platform3Top = platform3Bottom + platform3Height;

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

    const playerRight = playerX + playerWidth;

    if(playerX < 0) {
        playerX = 0;
    }

    if(playerRight > 1280) {
        playerX = 1280 - playerWidth;
    }

    const previousPlayerY = playerY;
    playerY = playerY + velocityY;
    velocityY = velocityY - gravity;

    if(playerY < 80) {
        playerY = 80;
        velocityY = 0;
        isJumping = false;
    }

    if(playerRight >= platform1Left && playerX <= platform1Right && playerY <= platform1Top && previousPlayerY >= platform1Top && velocityY < 0) {

        playerY = platform1Top;
        velocityY = 0; 
        isJumping = false;

    }

    if (playerRight >= platform2Left && playerX <= platform2Right && playerY <= platform2Top && previousPlayerY >= platform2Top && velocityY < 0) {

        playerY = platform2Top;
        velocityY = 0;
        isJumping = false;

    }

    if (playerRight >= platform3Left && playerX <= platform3Right && playerY <= platform3Top && previousPlayerY >= platform3Top && velocityY < 0) {

        playerY = platform3Top;
        velocityY = 0;
        isJumping = false;

    }

    player.style.left = playerX + "px";
    player.style.bottom = playerY + "px";

}, 16);