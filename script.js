let canvas;
let ctx;
let character_x = 100;
let character_y = 150;
let character_lives = 100;
let isMovingRight = false;
let isMovingLeft = false;
let lastMove = 'right';
let lastJumpStarted = 0;
let bg_elements = 0;
let currentCharacterImage = './img/pepe/idle/I-1.png';
let characterGraphics = ['./img/pepe/idle/I-1.png', './img/pepe/walking/W-22.png', './img/pepe/walking/W-25.png'];
let characterGraphicsIndex = 0;
let cloudOffset = 0;
let backgroundPosition = 0;

let chickenType1 = './img/gallinita/gallinita_centro.png';
let chickenType2 = './img/pollito/pollito_centro.png';
let chickens = [];

// Game config

let JUMP_TIME = 300; // in ms
let GAME_SPEED = 0.5;
let AUDIO_RUNNING = new Audio('./audio/running.mp3');
let AUDIO_JUMPING = new Audio('./audio/jumping.mp3');

function init() {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    createChickenList();
    checkForRunning();

    draw();

    calculateCloudOffset();
    listenForKeys();
    calculateChickenPosition();
    checkForCollision();

}

function checkForCollision() {

    setInterval(function () {

        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];

            if ((chicken.position_x - 40) < character_x && (chicken.position_x + 40) > character_x) {

                if (character_lives > 0) {
                    character_lives = character_lives - 20;
                }

            }

        }

    }, 2000);

}

function calculateChickenPosition() {

    setInterval(function () {

        for (let i = 0; i < chickens.length; i++) {

            let chicken = chickens[i];
            chicken.position_x = chicken.position_x - chicken.speed;

        }

    }, 50);
}

function createChickenList() {

    chickens = [
        createChicken(chickenType1, 400, 410),
        createChicken(chickenType2, 600, 420),
        createChicken(chickenType1, 800, 410)
    ];

}

function updateCharacter() {

    let base_image = new Image();
    base_image.src = currentCharacterImage;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        character_y = character_y - 4;
    } else {

        if (character_y < 150) {
            character_y = character_y + 4;
        }
    }

    // if (isFalling) {
    //     character_y = character_y + 5;

    //     // - 5 so that he does not fall one step too low
    //     if (character_y > 300 - 5) {
    //         isFalling = false;
    //     }
    // }

    if (base_image.complete) {
        if ((!isMovingRight && !isMovingLeft) && lastMove == 'left') {
            ctx.save();
            ctx.translate(base_image.width * 0.6, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
            ctx.restore();
        }
        if ((!isMovingRight && !isMovingLeft) && lastMove == 'right') {
            ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
        }
        if (isMovingRight) {
            ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
            lastMove = 'right';
        }
        if (isMovingLeft) {
            ctx.save();
            ctx.translate(base_image.width * 0.6, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
            ctx.restore();
            lastMove = 'left';
        }
    };

}

function checkForRunning() {

    setInterval(function () {

        if (isMovingRight || isMovingLeft) {

            AUDIO_RUNNING.play();

            let index = characterGraphicsIndex % characterGraphics.length;

            currentCharacterImage = characterGraphics[index];
            characterGraphicsIndex++;

        }

        if (!isMovingRight && !isMovingLeft) {
            let index = 0;
            currentCharacterImage = characterGraphics[index];
            characterGraphicsIndex = 0;
            AUDIO_RUNNING.pause();
        }

    }, 50);

}

function calculateCloudOffset() {

    setInterval(function () {

        cloudOffset = cloudOffset + 0.5;

    }, 50);
}

function draw() {

    drawBackground();
    // drawGround();
    updateCharacter();
    drawChicken();
    drawUI();
    requestAnimationFrame(draw);

}

function drawBackground() {

    drawBackgroundObject('./img/background/sky.png', 0, 0, 0.534, 0.534, 1);

    for (let i = 0; i < 5; i = i + 2) {

        drawBackgroundObject('./img/background/clouds/complete.png', (0 - cloudOffset) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject('./img/background/background3/complete.png', (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject('./img/background/background2/complete.png', (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject('./img/background/background1/complete.png', (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);

        if (isMovingLeft) {
            backgroundPosition = backgroundPosition - GAME_SPEED;
        }

        if (isMovingRight) {
            backgroundPosition = backgroundPosition + GAME_SPEED;
        }

    }

}

function drawGround() {

    // ctx.fillStyle = "#ddbc00";
    // ctx.fillRect(0, canvas.height, canvas.width, -100);

    // drawBackgroundObject('./img/background/background3/1.png', (0 - backgroundPosition), 0, 0.54, 0.54, 1);
    // drawBackgroundObject('./img/background/background2/1.png', (0 - backgroundPosition), 0, 0.54, 0.54, 1);
    // drawBackgroundObject('./img/background/background1/1.png', (0 - backgroundPosition), 0, 0.54, 0.54, 1);

    // drawBackgroundObject('./img/background/background1/complete.png', (0 - backgroundPosition), 0, 0.534, 0.534, 1);
    // drawBackgroundObject('./img/background/background1/complete.png', (0 - backgroundPosition) + canvas.width * 4, 0, 0.534, 0.534, 1);
    // drawBackgroundObject('./img/background/background1/complete.png', (0 - backgroundPosition) + canvas.width * 6, 0, 0.534, 0.534, 1);

    // if(!isMovingLeft && !isMovingRight) {
    //     drawBackgroundObject('./img/background/background1/1.png', 0 - backgroundPosition, -400, 1, 1, 1);
    // }

}

function drawBackgroundObject(src, offsetX, offsetY, scaleX, scaleY, opacity) {

    if (opacity != undefined) {
        ctx.globalAlpha = opacity;
    }

    let base_image = new Image();
    base_image.src = src;
    if (base_image.complete) {
        ctx.drawImage(base_image, bg_elements + offsetX, offsetY, base_image.width * scaleX, base_image.height * scaleY);
    };

    ctx.globalAlpha = 1;

}

function drawChicken() {

    for (let i = 0; i < chickens.length; i++) {

        let chicken = chickens[i];

        drawBackgroundObject(chicken.img, chicken.position_x, chicken.position_y, chicken.scaleX, chicken.scaleY, 1);

    }

}

function createChicken(type, position_x, position_y) {
    return {
        'img': type,
        'position_x': position_x,
        'position_y': position_y,
        'scaleX': 0.4,
        'scaleY': 0.4,
        'speed': (Math.random() * 5)
    }
}

function drawUI() {

    drawBackgroundObject('./img/pepe/lives/lives_' + character_lives + '.png', 10, 0, 0.4, 0.4, 1);

}

// function drawBackgroundObjectReverse(src, offsetX, offsetY, scaleX, scaleY, opacity) {

//     if(opacity != undefined) {
//         ctx.globalAlpha = opacity;
//     }

//     let base_image = new Image();
//     base_image.src = src;
//     ctx.save();
//     ctx.translate(canvas.width, 0);
//     ctx.scale(-1, 1);
//     if (base_image.complete) {
//         ctx.drawImage(base_image, bg_elements + offsetX, offsetY, base_image.width * scaleX, base_image.height * scaleY);
//     };
//     ctx.restore();

//     ctx.globalAlpha = 1;

// }

function listenForKeys() {

    document.addEventListener('keydown', e => {

        const k = e.key;

        if (k == 'ArrowRight') {
            isMovingRight = true;
            // character_x = character_x + 10;
        }

        if (k == 'ArrowLeft') {
            isMovingLeft = true;
            // character_x = character_x - 10;
        }

        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;

        if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) {
            AUDIO_JUMPING.play();
            lastJumpStarted = new Date().getTime();
        }

    });

    document.addEventListener('keyup', e => {

        const k = e.key;

        if (k == 'ArrowRight') {
            isMovingRight = false;
            // character_x = character_x + 10;            
        }

        if (k == 'ArrowLeft') {
            isMovingLeft = false;
            // character_x = character_x - 10;            
        }

    });

}