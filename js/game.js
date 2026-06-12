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
        player.style.left = playerX + "px";
    }

    if(event.key === "ArrowLeft"){
        playerX = playerX - 10;
        player.style.left = playerX + "px";
    }
});

let playerY = 60;

setInterval(function() {
    playerY = playerY - 5;
    player.style.bottom = playerY + "px";
}, 16);