// canvas

let canvas;
let ctx;

// character

let characterX = 100;
let characterY = 150;
let characterLives = 100;
let tabascoJuice = 0;
let coinValue = 0;
let isMovingRight = false;
let isMovingLeft = false;
let lastMove = 'right';
let lastJumpStarted = 0;
let isJumping = false;
let jumpsHigher = false;
let characterHurtAt = 0;
let characterLostAt = 0;
let currentCharacterImage;
let characterIdleGraphicsIndex = 0;
let characterWalkingGraphicsIndex = 0;

let characterIdleGraphics = [];
let characterWalkingGraphics = [];

// general

let bottleThrowTime = 0;
let thrownBottleX;
let thrownBottleY;
let gameFinished = false;
let lastTap = 0;

let JUMP_TIME = 300; // in ms
let GAME_SPEED = 5;
let AUDIO_RUNNING = new Audio('./audio/running.mp3');
let AUDIO_JUMPING = new Audio('./audio/jumping.mp3');
let AUDIO_BOTTLE = new Audio('./audio/bottle_beta.mp3');

let intervalTime = (Math.random() * 1300) + 200;
let intervals = [];

let imagePaths = ['./img/background/background1/complete.png', './img/background/background2/complete.png', './img/background/background3/complete.png', './img/background/clouds/complete.png', './img/background/sky.png', './img/bottle/juice/juice_0.png', './img/bottle/juice/juice_20.png', './img/bottle/juice/juice_40.png', './img/bottle/juice/juice_60.png', './img/bottle/juice/juice_80.png', './img/bottle/juice/juice_100.png', './img/bottle/bottle.png', './img/caminata/lives/lives_0.png', './img/caminata/lives/lives_20.png', './img/caminata/lives/lives_40.png', './img/caminata/lives/lives_60.png', './img/caminata/lives/lives_80.png', './img/caminata/lives/lives_100.png', './img/caminata/G2.png', './img/caminata/G21.png', './img/caminata/G26.png', './img/gallinita/gallinita_centro.png', './img/gallinita/gallinita_muerte.png', './img/gallinita/gallinita_paso_derecho.png', './img/gallinita/gallinita_paso_izquierdo.png', './img/pepe/idle/I-1.png', './img/pepe/idle/I-4.png', './img/pepe/idle/I-7.png', './img/pepe/idle/I-10.png', './img/pepe/lives/lives_0.png', './img/pepe/lives/lives_20.png', './img/pepe/lives/lives_40.png', './img/pepe/lives/lives_60.png', './img/pepe/lives/lives_80.png', './img/pepe/lives/lives_100.png', './img/pepe/walking/W-21.png', './img/pepe/walking/W-22.png', './img/pepe/walking/W-23.png', './img/pepe/walking/W-24.png', './img/pepe/walking/W-25.png', './img/pepe/walking/W-26.png', './img/pollito/pollito_centro.png', './img/pollito/pollito_muerte.png', './img/pollito/pollito_paso_derecho.png', './img/pollito/pollito_paso_izquierdo.png', './img/caminata/G1.png', './img/caminata/G3.png', './img/pepe/hurt/H-41.png', './img/pepe/jumping/J-33.png', './img/gameover/game_over.png', './img/start/start01.png', './img/coins/coin.png', './img/coins/value/coins_0.png', './img/coins/value/coins_20.png', './img/coins/value/coins_40.png', './img/coins/value/coins_60.png', './img/coins/value/coins_80.png', './img/coins/value/coins_100.png'];
let images = [];

let placedBottles = [500, 900, 1100, 1300, 1400, 1700, 2200, 2500];

let placedCoinsX = [500, 600, 700, 800, 900];
let placedCoinsY = [250, 200, 150, 200, 250];

let touchPosY = [];

// chickens

let chickens = [];
let chickenType1Graphics = [];
let chickenType2Graphics = [];

// final boss

let finalBossPositionX = 4000;
let finalBossPositionY = 0;
let finalBossSpeed = (Math.random() * 10) + 1;
let finalBossLives = 100;
let finalBossHurtAt = 0;
let bossDefeatedAt = 0;
let finalBossGraphicsIndex = 0;

let finalBossGraphics = [];

// environment

let cloudOffset = 0;
let backgroundPosition = 0;




function init() {

    preloadImages();
    drawStartScreen();

}

/**
 * Requests fullscreen from browser
 */
function goFullscreen() {
    let element = document.getElementById('canvas');
    element.requestFullscreen();
    element.webkitRequestFullscreen();
}

/**
 * Creates and draws on the canvas before the game gets loaded
 */
function drawStartScreen() {

    let startInterval = setInterval(function () {

        if (images.length == imagePaths.length) {
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext("2d");
            drawBackgroundObject(images[50], 0, 0, 0.534, 0.534, 1);
        }

    }, 50);

    document.addEventListener('keydown', e => {
        clearInterval(startInterval);
        startGame();
    }, { once: true });

    let element = document.getElementById('canvas');
    element.addEventListener('touchstart', handleStart, { once: true });

}

/**
 * Handles the start for the touch version
 * 
 * @param {event} e - The event to recognize a touch
 */
function handleStart(e) {

    if (e.touches) {

        startGame();
        clearInterval(startInterval);

    }

}

/**
 * Calls all the game logic functions
 */
function startGame() {

    document.getElementById('info-box').style.display = 'none';

    createChickenList();
    calculateCloudOffset();
    calculateChickenPosition();
    calculateFinalBossPosition();
    // calculateAnimationChange();
    listenForKeys();
    checkForRunning();
    checkForCollision();
    checkForJump();

    draw();

}

/**
 * Creates all images from the array with paths and save the created images in an array
 */
function preloadImages() {

    for (let i = 0; i < imagePaths.length; i++) {
        let image = new Image();
        image.src = imagePaths[i];
        images.push(image);
    }

    characterIdleGraphics = [images[25], images[26], images[27], images[28]];
    characterWalkingGraphics = [images[35], images[36], images[37], images[38], images[39], images[40]];
    chickenType1Graphics = [images[21], images[23], images[21], images[24]];
    chickenType2Graphics = [images[41], images[43], images[41], images[44]];
    finalBossGraphics = [images[18], images[45], images[18], images[46]];

}

/**
 * Calculates a random number between -10 and 10 and returns this as speed for the chickens and final boss
 * 
 * @returns Random number between -10 and 10
 */
function calculateSpeed() {
    return (Math.random() * 20) - 10;
}

// function checkBackgroundImageCache(src_path) {
//     base_image = images.find(function(img) {
//         return img.src.endsWith(src_path.substring(src_path, src_path.length));
//     })

//     if(!base_image) {
//         base_image = new Image();
//         base_image.src = src_path;
//     }
// }

/**
 * Checks for the positions of different entities of the game and handles them
 */
function checkForCollision() {

    intervals.push(setInterval(function () {

        checkForCollisionWithChicken();
        checkForCollisionWithBottles();
        checkForCollisionBottleWithFinalBoss();
        checkForCollisionWithFinalBoss();
        checkForCollisionWithCoins();

    }, 100));

}

/**
 * Checks for the positions of all chickens and handles them
 */
function checkForCollisionWithChicken() {

    for (let i = 0; i < chickens.length; i++) {
        let chicken = chickens[i];
        let chicken_x = chicken.position_x - backgroundPosition;

        if ((chicken_x - 100) < characterX && (chicken_x + 0) > characterX) {
            if (characterY > 110) {
                if (characterLives > 0) {
                    characterLives -= 5;
                    currentCharacterImage = images[47];
                    characterHurtAt = new Date().getTime();
                }

                if (characterLives <= 0) {
                    characterLives = 0;
                    characterLostAt = new Date().getTime();
                    gameFinished = true;
                }
            }
        }
    }

}

/**
 * Checks for the positions of all bottles and handles them
 */
function checkForCollisionWithBottles() {

    for (let i = 0; i < placedBottles.length; i++) {
        let bottle = placedBottles[i];
        let bottle_x = bottle - backgroundPosition;

        if ((bottle_x - 50) < characterX && (bottle_x + 0) > characterX) {
            if (characterY > 110) {
                placedBottles.splice(i, 1);
                AUDIO_BOTTLE.play();
                tabascoJuice++;
            }
        }
    }

}

/**
 * Checks for the positions of all coins and handles them
 */
function checkForCollisionWithCoins() {

    for (let i = 0; i < placedCoinsX.length; i++) {
        let coin = placedCoinsX[i];
        let coin_x = coin - backgroundPosition;
        let coin_y = placedCoinsY[i];

        if ((coin_x - 50) < characterX && (coin_x + 0) > characterX && (coin_y - 60) > characterY && (coin_y - 500) < characterY) {
            placedCoinsX.splice(i, 1);
            placedCoinsY.splice(i, 1);
            coinValue++;
        }
    }

}

/**
 * Checks for the position of the final boss and the bottles and handles them
 */
function checkForCollisionBottleWithFinalBoss() {

    if (thrownBottleX + backgroundPosition > finalBossPositionX && thrownBottleX + backgroundPosition - 200 < finalBossPositionX) {
        if (thrownBottleY + 500 > finalBossPositionY && thrownBottleY - 500 < finalBossPositionY) {
            if (finalBossLives > 0) {
                finalBossLives -= 10;
                finalBossHurtAt = new Date().getTime();
            }

            if (finalBossLives == 0 && bossDefeatedAt == 0) {
                bossDefeatedAt = new Date().getTime();
                finishLevel();
            }
        }
    }
}

/**
 * Checks for the positions of the final boss and handles it
 */
function checkForCollisionWithFinalBoss() {

    if (characterX + backgroundPosition + 100 > finalBossPositionX && characterX + backgroundPosition - 300 < finalBossPositionX) {

        if (characterLives > 0) {
            characterLives -= 20;
            currentCharacterImage = images[47];
            characterHurtAt = new Date().getTime();
        }

        if (characterLives <= 0) {
            characterLives = 0;
            characterLostAt = new Date().getTime();
            gameFinished = true;
        }

    }

}

/**
 * Will be called when the character or the final boss has 0 lives
 */
function finishLevel() {

    setTimeout(function () {
        AUDIO_BOTTLE.play();
    }, 1000);

    gameFinished = true;

}

/**
 * Calculates the positions and animations for all chickens except final boss
 */
function calculateChickenPosition() {

    let iterations = 0;

    intervals.push(setInterval(function () {

        calculateIndividualChickenPosition(iterations);

        if (iterations < 50) {
            iterations++;
        } else {
            iterations = 0;
        }

    }, 50));

}

/**
 * Calculates the position for every chicken individually
 * 
 * @param {number} iterations - The iterations to calculate the speed of the animation change
 */
function calculateIndividualChickenPosition(iterations) {

    for (let i = 0; i < chickens.length; i++) {

        let chicken = chickens[i];

        if (iterations == 0) {
            chicken.speed = calculateSpeed();
        }

        chicken.position_x = chicken.position_x - chicken.speed;

        if (iterations % (11 - Math.round(Math.abs(chicken.speed))) == 0) {
            chicken.graphInd++;
        }

        chicken.graphInd = chicken.graphInd % chickenType1Graphics.length;

    }

}

/**
 * Calculates the position and animation for the final boss
 */
function calculateFinalBossPosition() {

    let iterations = 0;

    intervals.push(setInterval(function () {

        if (iterations == 0) {
            finalBossSpeed = calculateSpeed();
        }

        calculateFinalBossPositionAndAnimation(iterations);

        if (iterations < 50) {
            iterations++;
        } else {
            iterations = 0;
        }

    }, 50));

}

/**
 * Calculates the position of the final boss and controls the animation
 * 
 * @param {number} iterations - The iterations to calculate the speed of the animation change
 */
function calculateFinalBossPositionAndAnimation(iterations) {

    if (!((finalBossPositionX < 3000 && finalBossSpeed > 0) || (finalBossPositionX > 4500 && finalBossSpeed < 0))) {
        finalBossPositionX = finalBossPositionX - finalBossSpeed;
    }

    if (iterations % (11 - Math.round(Math.abs(finalBossSpeed))) == 0) {
        finalBossGraphicsIndex++;
    }

    finalBossGraphicsIndex = finalBossGraphicsIndex % finalBossGraphics.length;

}

/**
 * Creates an array which calls the function to create chickens and transmits parameters
 */
function createChickenList() {

    chickens = [
        createChicken(1, 700, 410),
        createChicken(2, 900, 420),
        createChicken(1, 1200, 410),
        createChicken(1, 1500, 410),
        createChicken(2, 2000, 410),
        createChicken(2, 2200, 410),
        createChicken(1, 2800, 410),
        createChicken(1, 3000, 410)
    ];

}

/**
 * Calculates the position and animation for the character
 */
function updateCharacter() {

    let base_image = currentCharacterImage;

    // checkForJump();

    if (base_image.complete) {
        drawStanding(base_image);
        drawWalking(base_image);
    };

}

/**
 * Handles the character jump
 */
function checkForJump() {

    intervals.push(setInterval(function () {

        if (jumpsHigher == true) {
            if (isJumping == false) {
                drawJump();
                isJumping = true;
            }
            if (characterY < -50) {
                jumpsHigher = false;
            }
            characterY = characterY - 10;
        }
        else {
            if (characterY < 150) {
                characterY = characterY + 10;
            }
            else {
                isJumping = false;
            }
        }

    }, 20));

}

/**
 * Draws the character when it is walking
 * 
 * @param {image} base_image - The image to be drawn
 */
function drawWalking(base_image) {

    if (isMovingRight) {
        ctx.drawImage(base_image, characterX, characterY, base_image.width * 0.3, base_image.height * 0.3);
        lastMove = 'right';
    }
    if (isMovingLeft) {
        drawBackgroundObjectReverse(base_image, characterX, characterY, 0.3, 0.3, 0.6, 1);
        lastMove = 'left';
    }

}

/**
 * Draws the character when it is standing
 * 
 * @param {image} base_image - The image to be drawn
 */
function drawStanding(base_image) {

    if ((!isMovingRight && !isMovingLeft) && lastMove == 'left') {
        drawBackgroundObjectReverse(base_image, characterX, characterY, 0.3, 0.3, 0.6, 1);
    }
    if ((!isMovingRight && !isMovingLeft) && lastMove == 'right') {
        ctx.drawImage(base_image, characterX, characterY, base_image.width * 0.3, base_image.height * 0.3);
    }

}

/**
 * Checks and handles whether and if yes in which direction the character runs
 */
function checkForRunning() {

    currentCharacterImage = characterIdleGraphics[0];

    let iterations = 0;

    intervals.push(setInterval(function () {

        let currentTime = new Date().getTime();

        checkForWalking(currentTime, iterations);
        checkForStanding(currentTime);

        if (iterations < 10) {
            iterations++;
        }
        else {
            iterations = 0
        }

    }, 20));

}

/**
 * Handles the character animation and sound while walking
 * 
 * @param {number} currentTime - The current time at the moment the action is made
 */
function checkForWalking(currentTime, iterations) {

    if ((isMovingRight || isMovingLeft) && (currentTime - characterHurtAt > 500) && isJumping == false) {

        AUDIO_RUNNING.play();

        if (iterations == 0) {
            characterWalkingGraphicsIndex++;
        }

        let index = characterWalkingGraphicsIndex % characterWalkingGraphics.length;

        currentCharacterImage = characterWalkingGraphics[index];

    }

    if (isMovingLeft) {
        if (backgroundPosition > 0) {
            backgroundPosition = backgroundPosition - GAME_SPEED;
        }
    }
    if (isMovingRight) {
        backgroundPosition = backgroundPosition + GAME_SPEED;
    }

}

/**
 * Handles the character animation and sound while standing
 * 
 * @param {number} currentTime - The current time at the moment the action is made
 */
function checkForStanding(currentTime) {

    if ((!isMovingRight && !isMovingLeft) && (currentTime - characterHurtAt > 500) && isJumping == false) {
        let index = 0;
        currentCharacterImage = characterIdleGraphics[index];
        characterIdleGraphicsIndex = 0;
        AUDIO_RUNNING.pause();
    }

}

/**
 * Calculates the position for the clouds
 */
function calculateCloudOffset() {

    setInterval(function () {

        cloudOffset = cloudOffset + 0.5;

    }, 50);
}

function restartGame() {
    location.reload();
}

/**
 * Calls every function that draws something on the canvas
 */
function draw() {

    drawBackground();
    drawFinalBoss();
    updateCharacter();
    drawChicken();
    drawBottles();
    drawCoins();
    drawBottleThrow();
    drawUI();

    if (gameFinished) {
        drawFinalScreen();
        clearIntervals();
    }

    requestAnimationFrame(draw);

}

/**
 * Stops the game calculations by stopping all intervals and changing specific variables
 */
function clearIntervals() {

    for (let i = 0; i < intervals.length; i++) {

        clearInterval(intervals[i]);

    }

    isMovingLeft = false;
    isMovingRight = false;
    AUDIO_RUNNING.pause();

}

/**
 * Handles the jump drawing
 */
function drawJump() {

    currentCharacterImage = images[48];

}

/**
 * Handles the final screen drawing when the game is finished
 */
function drawFinalScreen() {

    if (characterLostAt > 0) {
        drawBackgroundObject(images[49], 0, 0, 0.534, 0.534, 1);
    }

    if (characterLostAt == 0) {
        ctx.font = '80px Bradley Hand ITC';
        ctx.fillText('YOU WON!', 320, 200);
    }

}

/**
 * Handles the final boss drawing
 */
function drawFinalBoss() {

    for (let i = 80; i >= 0; i = i - 20) {

        if (finalBossLives > i && bossDefeatedAt == 0) {
            let index = (i * (1 / 20)) + 13;
            drawBackgroundObject(images[index], finalBossPositionX - backgroundPosition, finalBossPositionY + 30, 0.4, 0.4, 1);
            break;
        }

    }

    drawFinalBossGraphic();

    ctx.font = '30px Bradley Hand ITC';
    ctx.fillText(finalBossLives, finalBossPositionX + 100 - backgroundPosition, finalBossPositionY + 80);

}

/**
 * Draws the final boss
 */
function drawFinalBossGraphic() {

    let currentTime = new Date().getTime();

    if (finalBossLives > 0 && finalBossSpeed > 0 && (currentTime - finalBossHurtAt > 500)) {
        drawBackgroundObject(finalBossGraphics[finalBossGraphicsIndex], finalBossPositionX - backgroundPosition, finalBossPositionY, 0.45, 0.45, 1);
    }
    else if (finalBossLives > 0 && finalBossSpeed < 0 && (currentTime - finalBossHurtAt > 500)) {
        let base_image = finalBossGraphics[finalBossGraphicsIndex];

        drawBackgroundObjectReverse(base_image, -finalBossPositionX + backgroundPosition, finalBossPositionY, 0.45, 0.45, 0.4, 1);
    }
    else if ((currentTime - finalBossHurtAt > 500)) {
        drawBackgroundObject(images[20], finalBossPositionX - backgroundPosition, finalBossPositionY, 0.4, 0.4, 1);

        let timePassed = new Date().getTime() - bossDefeatedAt;
        finalBossPositionX += (timePassed / 100);
        finalBossPositionY -= (timePassed / 100);
    }
    else if ((currentTime - finalBossHurtAt < 500)) {
        drawBackgroundObject(images[19], finalBossPositionX - backgroundPosition, finalBossPositionY, 0.4, 0.4, 1);
    }

}

/**
 * Handles the thrown bottle drawing
 */
function drawBottleThrow() {
    if (bottleThrowTime > 0) {
        let timePassedSinceThrow = new Date().getTime() - bottleThrowTime;
        let gravity = Math.pow(9.81, timePassedSinceThrow / 300);
        thrownBottleX = characterX + 100 + (timePassedSinceThrow);
        thrownBottleY = 360 - (timePassedSinceThrow * 0.4 - gravity);

        drawBackgroundObject(images[11], thrownBottleX, thrownBottleY, 0.25, 0.25, 1);
    }
}

/**
 * Handles the tabasco bottle drawing when on the ground
 */
function drawBottles() {

    for (let i = 0; i < placedBottles.length; i++) {

        let bottle_x = placedBottles[i];

        drawBackgroundObject(images[11], bottle_x - backgroundPosition, 420, 0.25, 0.25, 1);

    }

}

/**
 * Handles the coin drawing
 */
function drawCoins() {

    for (let i = 0; i < placedCoinsX.length; i++) {

        let coin_x = placedCoinsX[i];
        let coin_y = placedCoinsY[i];

        drawBackgroundObject(images[51], coin_x - backgroundPosition, coin_y, 0.5, 0.5, 1);

    }

}

/**
 * Handles the background drawing
 */
function drawBackground() {

    drawBackgroundObject(images[4], 0, 0, 0.534, 0.534, 1);

    for (let i = 0; i < 5; i = i + 2) {
        drawBackgroundObject(images[3], (0 - cloudOffset) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject(images[2], (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject(images[1], (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject(images[0], (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
    }
}

/**
 * Help function for drawing
 * 
 * @param {string} src - The path to the image
 * @param {number} offsetX - The x position
 * @param {number} offsetY - The y position
 * @param {number} scaleX - The x scale
 * @param {number} scaleY - The y scale
 * @param {number} opacity - The opacity of the drawn image
 */
function drawBackgroundObject(src, offsetX, offsetY, scaleX, scaleY, opacity) {

    if (opacity != undefined) {
        ctx.globalAlpha = opacity;
    }

    let base_image = src;
    if (base_image.complete) {
        ctx.drawImage(base_image, offsetX, offsetY, base_image.width * scaleX, base_image.height * scaleY);
    };

    ctx.globalAlpha = 1;

}

/**
 * Help function for drawing images with horizontal axis flipped
 * 
 * @param {string} src - The path to the image
 * @param {number} offsetX - The x position
 * @param {number} offsetY - The y position
 * @param {number} scaleX - The x scale
 * @param {number} scaleY - The y scale
 * @param {number} translateX - The translation of the image in x direction
 * @param {number} opacity - The opacity of the drawn image
 */
function drawBackgroundObjectReverse(src, offsetX, offsetY, scaleX, scaleY, translateX, opacity) {

    if (opacity != undefined) {
        ctx.globalAlpha = opacity;
    }

    let base_image = src;
    if (base_image.complete) {
        ctx.setTransform(-1, 0, 0, 1, base_image.width * translateX, 0);
        ctx.drawImage(base_image, offsetX, offsetY, base_image.width * scaleX, base_image.height * scaleY);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    ctx.globalAlpha = 1;

}

/**
 * Handles the chicken drawing
 */
function drawChicken() {

    for (let i = 0; i < chickens.length; i++) {

        let chicken = chickens[i];

        if (chicken.type == 1 && chicken.speed > 0) {
            drawBackgroundObject(chickenType1Graphics[chicken.graphInd], chicken.position_x - backgroundPosition, chicken.position_y, chicken.scaleX, chicken.scaleY, 1);
        }
        else if (chicken.type == 1 && chicken.speed < 0) {
            let base_image = chickenType1Graphics[chicken.graphInd];

            drawBackgroundObjectReverse(base_image, -chicken.position_x + backgroundPosition, chicken.position_y, chicken.scaleX, chicken.scaleY, 0.4, 1);
        }

        if (chicken.type == 2 && chicken.speed > 0) {
            drawBackgroundObject(chickenType2Graphics[chicken.graphInd], chicken.position_x - backgroundPosition, chicken.position_y, chicken.scaleX, chicken.scaleY, 1);
        }
        else if (chicken.type == 2 && chicken.speed < 0) {
            let base_image = chickenType2Graphics[chicken.graphInd];

            drawBackgroundObjectReverse(base_image, -chicken.position_x + backgroundPosition, chicken.position_y, chicken.scaleX, chicken.scaleY, 0.4, 1);
        }
    }
}

/**
 * Creates and returns JSON for the chickens array
 * 
 * @param {number} type - The chicken type
 * @param {number} position_x - The x position the chicken should spawn
 * @param {number} position_y - The y position the chicken should spawn
 * @returns JSON
 */
function createChicken(type, position_x, position_y) {
    return {
        'type': type,
        'position_x': position_x,
        'position_y': position_y,
        'scaleX': 0.4,
        'scaleY': 0.4,
        'speed': (Math.random() * 5) + 1,
        'graphInd': 0
    }
}

/**
 * Handles the UI drawing
 */
function drawUI() {

    drawUICharacterLives();
    drawUITabascoJuice();
    drawUICoins();

}

/**
 * Handles the UI for the character lives
 */
function drawUICharacterLives() {

    for (let i = 80; i >= 0; i = i - 20) {

        if (characterLives > i) {
            let index = (i * (1 / 20)) + 30;
            drawBackgroundObject(images[index], 10, 0, 0.4, 0.4, 1);
            break;
        }

    }

    if (characterLives <= 0) {
        drawBackgroundObject(images[29], 10, 0, 0.4, 0.4, 1);
    }

    ctx.font = '30px Bradley Hand ITC';
    ctx.fillText(characterLives, 120, 50);

}

/**
 * Handles the UI for the tabasco juice
 */
function drawUITabascoJuice() {

    if (tabascoJuice <= 4) {
        let index = tabascoJuice + 5;
        drawBackgroundObject(images[index], 10, 60, 0.4, 0.4, 1);
    }
    else {
        drawBackgroundObject(images[10], 10, 60, 0.4, 0.4, 1);
    }

    ctx.font = '30px Bradley Hand ITC';
    ctx.fillText(tabascoJuice, 120, 110);

}

/**
 * Handles the UI for the coins
 */
function drawUICoins() {

    if (coinValue <= 4) {
        let index = coinValue + 52;
        drawBackgroundObject(images[index], 10, 120, 0.4, 0.4, 1);
    }
    else {
        drawBackgroundObject(images[57], 10, 120, 0.4, 0.4, 1);
    }

    ctx.font = '30px Bradley Hand ITC';
    ctx.fillText(coinValue, 120, 170);



}

/**
 * Listens for pressed keys to control the game
 */
function listenForKeys() {

    document.addEventListener('keydown', e => {

        e.preventDefault();

        const k = e.key;

        if (k == 'ArrowRight' && gameFinished == false) {
            isMovingRight = true;
        }

        if (k == 'ArrowLeft' && gameFinished == false) {
            isMovingLeft = true;
        }

        if (k == 'd' && gameFinished == false) {
            if (tabascoJuice > 0) {
                let timePassed = new Date().getTime() - bottleThrowTime;
                if (timePassed > 1000) {
                    tabascoJuice--;
                    bottleThrowTime = new Date().getTime();
                }
            }
        }

        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;

        if (e.code == 'Space' && characterY == 150 && gameFinished == false) {
            AUDIO_JUMPING.play();
            lastJumpStarted = new Date().getTime();
            jumpsHigher = true;
        }

    });

    document.addEventListener('keyup', e => {

        const k = e.key;

        if (k == 'ArrowRight') {
            isMovingRight = false;
        }

        if (k == 'ArrowLeft') {
            isMovingLeft = false;
        }

    });

    let element = document.getElementById('canvas');
    element.addEventListener('touchstart', handleGame);
    element.addEventListener('touchend', handleStop);
    element.addEventListener('touchmove', handleMove);

}

/**
 * This handles the game for the touch version
 * 
 * @param {event} e - The event to recognize a touch
 */
function handleGame(e) {

    e.preventDefault();

    if (e.touches) {

        let currentTime = new Date().getTime();
        let timePassedSinceJump = currentTime - lastJumpStarted;

        for (let i = 0; i < e.touches.length; i++) {
            
            if (e.targetTouches[i].clientY < (screen.height / 2)) {
                if (tabascoJuice > 0) {
                    let timePassed = new Date().getTime() - bottleThrowTime;
                    if (timePassed > 1000) {
                        tabascoJuice--;
                        bottleThrowTime = new Date().getTime();
                    }
                }
            }

            if (!isMovingRight && (e.targetTouches[i].clientX < (screen.width / 2) && e.targetTouches[i].clientY > (screen.height / 2))) {
                isMovingLeft = true;
            }

            if (!isMovingLeft && (e.targetTouches[i].clientX > (screen.width / 2) && e.targetTouches[i].clientY > (screen.height / 2))) {
                isMovingRight = true;
            }
            
        }

    }

}

/**
 * This handles the moving in the touch version
 * 
 * @param {event} e - The event to recognize a touch
 */
function handleMove(e) {

    e.preventDefault();

    let currentTime = new Date().getTime();
    let timePassedSinceJump = currentTime - lastJumpStarted;

    for (let i = 0; i < e.touches.length; i++) {
        touchPosY.push(e.touches[i].pageY);
    }

    if (touchPosY[0] > touchPosY[touchPosY.length - 1] + 50) {

        for (let j = 0; j < e.touches.length; j++) {

            if (characterY == 150 && gameFinished == false) {
                AUDIO_JUMPING.play();
                lastJumpStarted = new Date().getTime();
                jumpsHigher = true;
            }

        }
    }
    
}

/**
 * This handles the stoppage in the touch version
 * 
 * @param {event} e - The event to recognize a touch
 */
function handleStop(e) {

    e.preventDefault();

    touchPosY = [];

    if (e.touches) {

        if (e.touches.length == 0) {

            isMovingLeft = false;
            isMovingRight = false;

        }

        else if (e.touches.length > 0 ) {

            for (let i = 0; i < e.touches.length; i++) {

                if((e.targetTouches[i].clientX > (screen.width / 2) && e.targetTouches[i].clientY > (screen.height / 2))) {
                    isMovingLeft = false;
                    isMovingRight = true;
                }

                if ((e.targetTouches[i].clientX < (screen.width / 2) && e.targetTouches[i].clientY > (screen.height / 2))) {

                    isMovingRight = false;
                    isMovingLeft = true;
        
                }
                
            }

        }

    }

}