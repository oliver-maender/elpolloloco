let canvas;
let ctx;
let character_x = 100;
let character_y = 150;
let isMovingRight = false;
let isMovingLeft = false;
let lastJumpStarted = 0;
let bg_elements = 0;
let currentCharacterImage = './img/pepe/idle/I-1.png';
let characterGraphicsRight = ['./img/pepe/idle/I-1.png', './img/pepe/walking/W-22.png', './img/pepe/walking/W-25.png'];
let characterGraphicsLeft = ['./img/pepe/idle/I-1.png', './img/pepe/walking/W-22.png', './img/pepe/walking/W-25.png'];
let characterGraphicsIndex = 0;
let cloudOffset = 0;
let backgroundPosition = 0;

// Game config

let JUMP_TIME = 300; // in ms
let GAME_SPEED = 4;

function init() {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    checkForRunning();

    draw();
    calculateCloudOffset();
    listenForKeys();

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
        ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
    };

}

function checkForRunning() {

    setInterval(function() {

        if(isMovingRight) {

            let index = characterGraphicsIndex % characterGraphicsRight.length;

            currentCharacterImage = characterGraphicsRight[index];
            characterGraphicsIndex++;
    
        }
    
        if(isMovingLeft) {

            let index = characterGraphicsIndex % characterGraphicsRight.length;

            currentCharacterImage = characterGraphicsLeft[index];
            characterGraphicsIndex++;
            
        }

    }, 50);
    
}

function calculateCloudOffset() {
    
    setInterval(function() {

        cloudOffset = cloudOffset + 0.5;

    }, 50);
}

function draw() {

    drawBackground();
    drawGround();
    updateCharacter();
    requestAnimationFrame(draw);

}

function drawBackground() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBackgroundObject('./img/background/clouds/1.png', 0 - cloudOffset, 0, 0.5, 0.5, 1);

}

function drawGround() {

    // ctx.fillStyle = "#ddbc00";
    // ctx.fillRect(0, canvas.height, canvas.width, -100);

        // drawBackgroundObject('./img/background/background3/1.png', (0 - backgroundPosition), 0, 0.54, 0.54, 1);
        // drawBackgroundObject('./img/background/background2/1.png', (0 - backgroundPosition), 0, 0.54, 0.54, 1);
        // drawBackgroundObject('./img/background/background1/1.png', (0 - backgroundPosition), 0, 0.54, 0.54, 1);

        for (let i = 0; i < 10; i = i + 2) {

            drawBackgroundObject('./img/background/background1/complete.png', (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
            
        }

        // drawBackgroundObject('./img/background/background1/complete.png', (0 - backgroundPosition), 0, 0.534, 0.534, 1);
        // drawBackgroundObject('./img/background/background1/complete.png', (0 - backgroundPosition) + canvas.width * 4, 0, 0.534, 0.534, 1);
        // drawBackgroundObject('./img/background/background1/complete.png', (0 - backgroundPosition) + canvas.width * 6, 0, 0.534, 0.534, 1);

    // if(!isMovingLeft && !isMovingRight) {
    //     drawBackgroundObject('./img/background/background1/1.png', 0 - backgroundPosition, -400, 1, 1, 1);
    // }

    if (isMovingLeft) {
        // bg_elements = bg_elements + GAME_SPEED;
        // drawBackgroundObject('./img/background/background1/1.png', 0 - backgroundPosition, -400, 1, 1, 1);
        backgroundPosition--;
    }

    if (isMovingRight) {
        // bg_elements = bg_elements - GAME_SPEED;
        backgroundPosition++;
    }

}

function drawBackgroundObject(src, offsetX, offsetY, scaleX, scaleY, opacity) {

    if(opacity != undefined) {
        ctx.globalAlpha = opacity;
    }

    let base_image = new Image();
    base_image.src = src;
    if (base_image.complete) {
        ctx.drawImage(base_image, bg_elements + offsetX, offsetY, base_image.width * scaleX, base_image.height * scaleY);
    };

    ctx.globalAlpha = 1;

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

        console.log(k);

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