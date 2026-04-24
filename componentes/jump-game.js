let canvas, ctx, scoreElement;
const GAME_WIDTH = 600;

let offsetX = 0;
let gameOver = false;
let firstJump = false;
let animationId = null;

const backgroundImg = new Image();
const platformImg = new Image();
const platBrokenImg = new Image();

let score = 0;
let gravity = 0.3;
let cameraY = 0;
let shakeTime = 0;
let shakeIntensity = 0;

const player = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    vy: 0,
    vx: 0,
    jumpForce: -12,
    emoji: "👾"
};

let platforms = [];
const platformCount = 8;

function resize() {
    if (!canvas) return;
    canvas.width = 600;  
    canvas.height = 500;  
    offsetX = 0;
}

window.addEventListener('resize', resize);

function init() {
    if(animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    let loaded = 0;
    const total = 3;
    const onLoad = () => { 
        loaded++;
        if (loaded === total) startGame(); 
    };
    
    backgroundImg.onload = onLoad;
    platformImg.onload = onLoad;
    platBrokenImg.onload = onLoad;

    backgroundImg.src = 'assets/background.jpg';
    platformImg.src = 'assets/platform.png';
    platBrokenImg.src = 'assets/platBroken.png';
}

function startGame() {
    canvas = document.getElementById('canvas1');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    scoreElement = document.getElementById('score');
    
    resize();

    player.x = GAME_WIDTH / 2;
    player.y = canvas.height - 700;
    player.vy = 0;
    player.vx = 0;
    score = 0;
    cameraY = player.y - (canvas.height / 1.4);
    gameOver = false;
    firstJump = false;
    scoreElement.innerText = score;
    
    platforms = [];
    platforms.push({ 
        x: (GAME_WIDTH / 2) - 50, 
        y: player.y + 50, 
        w: 100, 
        h: 20, 
        type: "normal", 
        hasBooster: false, 
        active: true 
    });

    for(let i = 1; i <= platformCount; i++) {
        createPlatform(player.y + 50 - (i*120));
    }

    if (!canvas.dataset.initialized) {
        canvas.addEventListener('touchstart', e => {
            const touchX = e.touches[0].clientX;
            player.vx = (touchX < canvas.width / 2) ? -7 : 7;
        });
        canvas.addEventListener('touchend', () => player.vx = 0);
        window.addEventListener('keydown', e => {
            if(e.key === "ArrowLeft" || e.key === "a") player.vx = -7;
            if(e.key === "ArrowRight" || e.key === "d") player.vx = 7;
            if (gameOver) startGame();
        });
        window.addEventListener('keyup', () => player.vx = 0);
        canvas.dataset.initialized = "true";
    }
    animationId = requestAnimationFrame(update);
}

function createPlatform(posY) {
    const type = Math.random() > 0.8 ? "breaking" : "normal";
    const hasBooster = Math.random() > 0.92;

    platforms.push({
        x: Math.random() * (GAME_WIDTH - 100),
        y: posY,
        w: 100,
        h: 20,
        type: type,
        hasBooster: hasBooster,
        active: true
    });
}

function applyShake(intensity, duration) {
    shakeIntensity = intensity;
    shakeTime = duration;
}

function update() {
    
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "40px 'Courier New'";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px 'Courier New'";
        ctx.fillText("Press Any Key to Restart", canvas.width / 2, canvas.height / 2 + 50);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    if(player.y < cameraY + canvas.height / 2) {
        cameraY += (player.y - (cameraY + canvas.height /2)) * 1;
    }

    ctx.save();
    ctx.translate(offsetX, 0);
    if(shakeTime > 0) {
        ctx.translate(Math.random() * shakeIntensity, Math.random() * shakeIntensity);
        shakeTime--;
    }

    player.vy += gravity;
    player.y += player.vy;
    player.x += player.vx;

    if(player.x < -20) player.x = GAME_WIDTH;
    if(player.x > GAME_WIDTH) player.x = -20;

    platforms = platforms.filter(p => p.y - cameraY < canvas.height + 100);

    while (platforms.length < platformCount) {
        let highestPlatY = Math.min(...platforms.map(p => p.y));
        
        let jumpHeight = (Math.pow(player.jumpForce, 2) / (2 * gravity));
        let platDist = 100 + Math.random() * (jumpHeight - 120);

        platforms.push({
            x: Math.random() * (GAME_WIDTH - 100),
            y: highestPlatY - platDist,
            w: 100,
            h: 20,
            type: Math.random() > 0.8 ? "breaking" : "normal",
            hasBooster: Math.random() > 0.9,
            active: true
        });
        
        score++;
        scoreElement.innerText = score;
    }

    platforms.forEach(p => {
        if(!p.active) return;
        let screenY = p.y - cameraY;
        let pImg = p.type === "breaking" ? platBrokenImg : platformImg;
        ctx.drawImage(pImg, p.x, screenY, p.w, p.h);

        if(p.hasBooster) {
            ctx.font = "30px Arial";
            ctx.fillText("🚀", p.x + 30, screenY - 10);
        }

        if(player.vy > 0 &&
            player.x + 20 > p.x && player.x -20 < p.x + p.w &&
            player.y > p.y && player.y < p.y + p.h) {

                player.vy = player.jumpForce;
                firstJump = true;
                if (p.type === "breaking") {
                    p.active = false;
                }

                if (p.hasBooster) {
                    player.vy = -25;
                    applyShake(10, 20);
                } else {
                    applyShake(2, 5);
                }
        }
    });

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.vy < -15 ? "👾" : player.emoji, player.x, player.y - cameraY);

    ctx.restore();

    if (player.y - cameraY > canvas.height) {
        gameOver = true;
        update();
        return;
    }
    animationId = requestAnimationFrame(update);
}
