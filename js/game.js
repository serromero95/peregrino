const gameContainer = document.getElementById("game-container");

const player = document.createElement("div");

player.className = "player";

gameContainer.appendChild(player);

const ground = document.createElement("div");

ground.className = "ground";

gameContainer.appendChild(ground);

let playerX = 80;

document.addEventListener("keydown", function(event) {
    if(event.key === "ArrowRight"){
        playerX = playerX + 10;
    }
    player.style.left = playerX + "px";
});

document.addEventListener("keydown", function(event) {
    if(event.key === "ArrowLeft"){
        playerX = playerX - 10;
    }
    player.style.left = playerX + "px";
});