let canvas;
let ctx;
let character_x = 100;
let character_y = 150;
let character_lives = 100;
let tabasco_juice = 50;
let isMovingRight = false;
let isMovingLeft = false;
let lastMove = 'right';
let lastJumpStarted = 0;
let currentCharacterImage;
let characterIdleGraphicsIndex = 0;
let characterWalkingGraphicsIndex = 0;
// let chickenGraphicsIndex = 0;
let animationChangeIndex = 0;
let finalBossGraphicsIndex = 0;
let cloudOffset = 0;
let backgroundPosition = 0;
let bottleThrowTime = 0;
let thrownBottleX;
let thrownBottleY;
let final_boss_position_x = 1000;
let final_boss_position_y = 0;
let final_boss_speed = (Math.random() * 10) + 1;
let final_boss_lives = 100;
let bossDefeatedAt = 0;
let game_finished = false;
let character_hurt_at = 0;
let character_lost_at = 0;
let isJumping = false;

let speedNow = (Math.random() * 10) + 1;
let intervalTime = (Math.random() * 1300) + 200;
let intervals = [];

let imagePaths = ['./img/background/background1/complete.png', './img/background/background2/complete.png', './img/background/background3/complete.png', './img/background/clouds/complete.png', './img/background/sky.png', './img/bottle/juice/juice_0.png', './img/bottle/juice/juice_20.png', './img/bottle/juice/juice_40.png', './img/bottle/juice/juice_60.png', './img/bottle/juice/juice_80.png', './img/bottle/juice/juice_100.png', './img/bottle/bottle.png', './img/caminata/lives/lives_0.png', './img/caminata/lives/lives_20.png', './img/caminata/lives/lives_40.png', './img/caminata/lives/lives_60.png', './img/caminata/lives/lives_80.png', './img/caminata/lives/lives_100.png', './img/caminata/G2.png', './img/caminata/G21.png', './img/caminata/G26.png', './img/gallinita/gallinita_centro.png', './img/gallinita/gallinita_muerte.png', './img/gallinita/gallinita_paso_derecho.png', './img/gallinita/gallinita_paso_izquierdo.png', './img/pepe/idle/I-1.png', './img/pepe/idle/I-4.png', './img/pepe/idle/I-7.png', './img/pepe/idle/I-10.png', './img/pepe/lives/lives_0.png', './img/pepe/lives/lives_20.png', './img/pepe/lives/lives_40.png', './img/pepe/lives/lives_60.png', './img/pepe/lives/lives_80.png', './img/pepe/lives/lives_100.png', './img/pepe/walking/W-21.png', './img/pepe/walking/W-22.png', './img/pepe/walking/W-23.png', './img/pepe/walking/W-24.png', './img/pepe/walking/W-25.png', './img/pepe/walking/W-26.png', './img/pollito/pollito_centro.png', './img/pollito/pollito_muerte.png', './img/pollito/pollito_paso_derecho.png', './img/pollito/pollito_paso_izquierdo.png', './img/caminata/G1.png', './img/caminata/G3.png', './img/pepe/hurt/H-41.png', './img/pepe/jumping/J-33.png'];
let images = [];

let chickens = [];
let placedBottles = [500, 900, 1400, 1700, 2200, 2500];

let characterIdleGraphics = [];
let characterWalkingGraphics = [];
let chickenType1Graphics = [];
let chickenType2Graphics = [];
let finalBossGraphics = [];

// Game config

let JUMP_TIME = 300; // in ms
let GAME_SPEED = 0.5;
let AUDIO_RUNNING = new Audio('./audio/running.mp3');
let AUDIO_JUMPING = new Audio('./audio/jumping.mp3');
let AUDIO_BOTTLE = new Audio('./audio/bottle_beta.mp3');

function init() {

    preloadImages();

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    createChickenList();
    checkForRunning();
    // calculateSpeed();

    draw();

    calculateAnimationChange();

    calculateCloudOffset();
    listenForKeys();
    calculateChickenPosition();
    calculateFinalBossPosition();
    checkForCollision();

}

function calculateSpeed() {

    // setTimeout(function() {

    //     speedNow = (Math.random() * 10) + 1;
    //     intervalTime = (Math.random() * 1300) + 200;
    //     calculateSpeed();

    // }, intervalTime);

    return (Math.random() * 20) - 10;

}

function calculateAnimationChange() {

    intervals.push(setInterval(function () {

        if (animationChangeIndex < 200) {
            animationChangeIndex++;
        }
        else {
            animationChangeIndex = 0;
        }

    }, 50));

}

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

// function checkBackgroundImageCache(src_path) {
//     base_image = images.find(function(img) {
//         return img.src.endsWith(src_path.substring(src_path, src_path.length));
//     })

//     if(!base_image) {
//         base_image = new Image();
//         base_image.src = src_path;
//     }
// }

function checkForCollision() {

    intervals.push(setInterval(function () {

        // Check Chicken
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            let chicken_x = chicken.position_x - backgroundPosition;

            if ((chicken_x - 100) < character_x && (chicken_x + 0) > character_x) {
                if (character_y > 110) {
                    if (character_lives > 0) {
                        character_lives -= 10;
                        currentCharacterImage = images[47];
                        character_hurt_at = new Date().getTime();
                    }

                    if (character_lives <= 0) {
                        character_lost_at = new Date().getTime();
                        game_finished = true;
                    }
                }
            }
        }

        // Check Bottle
        for (let i = 0; i < placedBottles.length; i++) {
            let bottle = placedBottles[i];
            let bottle_x = bottle - backgroundPosition;

            if ((bottle_x - 50) < character_x && (bottle_x + 0) > character_x) {
                if (character_y > 110) {
                    placedBottles.splice(i, 1);
                    AUDIO_BOTTLE.play();
                    tabasco_juice++;
                }
            }
        }

        // Check final boss and bottle
        if (thrownBottleX + backgroundPosition > final_boss_position_x && thrownBottleX + backgroundPosition - 200 < final_boss_position_x) {

            if (thrownBottleY + 500 > final_boss_position_y && thrownBottleY - 500 < final_boss_position_y) {

                if (final_boss_lives > 0) {
                    final_boss_lives -= 10;
                }

                if (final_boss_lives == 0 && bossDefeatedAt == 0) {
                    bossDefeatedAt = new Date().getTime();
                    finishLevel();
                }

            }

        }

        // Check final boss and character
        if (character_x + backgroundPosition + 100 > final_boss_position_x && character_x + backgroundPosition - 300 < final_boss_position_x) {

            if (character_lives > 0) {
                character_lives--;
                currentCharacterImage = images[47];
                character_hurt_at = new Date().getTime();
            }

            if (character_lives <= 0) {
                character_lost_at = new Date().getTime();
                game_finished = true;
            }

        }

    }, 100));

}

function finishLevel() {

    setTimeout(function () {
        AUDIO_BOTTLE.play();
    }, 1000);

    game_finished = true;

}

function calculateChickenPosition() {

    let iterations = 0;

    intervals.push(setInterval(function () {

        for (let i = 0; i < chickens.length; i++) {

            let chicken = chickens[i];

            if (iterations == 0) {
                chicken.speed = calculateSpeed();
            }

            chicken.position_x = chicken.position_x - chicken.speed;

            if (animationChangeIndex % (11 - Math.round(Math.abs(chicken.speed))) == 0) {
                chicken.graphInd++;
            }

            chicken.graphInd = chicken.graphInd % chickenType1Graphics.length;

        }

        // chickenGraphicsIndex = chickenGraphicsIndex % chickenType1Graphics.length;

        if (iterations < 50) {
            iterations++;
        } else {
            iterations = 0;
        }

    }, 50));

}

function calculateFinalBossPosition() {

    let iterations = 0;

    intervals.push(setInterval(function () {

        if (iterations == 0) {
            final_boss_speed = calculateSpeed();
        }

        if ((final_boss_position_x > 500 && final_boss_position_x < 2000) || final_boss_speed < 0) {

            final_boss_position_x = final_boss_position_x - final_boss_speed;

        }

        if (animationChangeIndex == 0) {
            finalBossGraphicsIndex++;
        }

        finalBossGraphicsIndex = finalBossGraphicsIndex % finalBossGraphics.length;

        if (iterations < 50) {
            iterations++;
        } else {
            iterations = 0;
        }

    }, 50));

}

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

function updateCharacter() {

    let base_image = currentCharacterImage;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        if (isJumping == false) {
            isJumping = true;
            drawJump();
        }
        character_y = character_y - 4;
    } else {

        if (character_y < 150) {
            character_y = character_y + 4;
        }

    }

    if (base_image.complete) {
        if ((!isMovingRight && !isMovingLeft) && lastMove == 'left') {
            // ctx.save();
            // ctx.translate(base_image.width * 0.6, 0);
            // ctx.scale(-1, 1);
            // ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
            // ctx.restore();

            drawBackgroundObjectReverse(base_image, character_x, character_y, 0.3, 0.3, 0.6, 1);
        }
        if ((!isMovingRight && !isMovingLeft) && lastMove == 'right') {
            ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
        }
        if (isMovingRight) {
            ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
            lastMove = 'right';
        }
        if (isMovingLeft) {
            // ctx.save();
            // ctx.translate(base_image.width * 0.6, 0);
            // ctx.scale(-1, 1);
            // ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.3, base_image.height * 0.3);
            // ctx.restore();

            drawBackgroundObjectReverse(base_image, character_x, character_y, 0.3, 0.3, 0.6, 1);
            lastMove = 'left';
        }
    };

}

function checkForRunning() {

    currentCharacterImage = characterIdleGraphics[0];

    intervals.push(setInterval(function () {

        let currentTime = new Date().getTime();

        if ((isMovingRight || isMovingLeft) && (currentTime - character_hurt_at > 500) && isJumping == false) {

            AUDIO_RUNNING.play();

            let index = characterWalkingGraphicsIndex % characterWalkingGraphics.length;

            if (animationChangeIndex == 0) {
                characterWalkingGraphicsIndex++;
            }

            currentCharacterImage = characterWalkingGraphics[index];

        }

        if ((!isMovingRight && !isMovingLeft) && (currentTime - character_hurt_at > 500) && isJumping == false) {
            let index = 0;
            currentCharacterImage = characterIdleGraphics[index];
            characterIdleGraphicsIndex = 0;
            AUDIO_RUNNING.pause();
        }

    }, 50));

}

function calculateCloudOffset() {

    setInterval(function () {

        cloudOffset = cloudOffset + 0.5;

    }, 50);
}

function draw() {

    drawBackground();
    drawFinalBoss();

    if (game_finished) {
        drawFinalScreen();
        clearIntervals();
    }

    updateCharacter();
    drawChicken();
    drawBottles();
    drawBottleThrow();
    drawUI();

    requestAnimationFrame(draw);

}

function clearIntervals() {

    for (let i = 0; i < intervals.length; i++) {

        clearInterval(intervals[i]);

    }

    isMovingLeft = false;
    isMovingRight = false;

}

function drawJump() {

    currentCharacterImage = images[48];

    setTimeout(function () {

        isJumping = false;

    }, 500);

}

function drawFinalScreen() {
    ctx.font = '80px Bradley Hand ITC';
    let msg = 'YOU WON!';

    if (character_lost_at > 0) {
        msg = 'YOU LOST!';
    }

    ctx.fillText(msg, 320, 200);
}

function drawFinalBoss() {

    for (let i = 80; i >= 0; i = i - 20) {

        if (final_boss_lives > i && bossDefeatedAt == 0) {
            let index = (i * (1 / 20)) + 13;
            drawBackgroundObject(images[index], final_boss_position_x - backgroundPosition, final_boss_position_y, 0.4, 0.4, 1);
            break;
        }

    }

    if (final_boss_lives > 0 && final_boss_speed > 0) {
        drawBackgroundObject(finalBossGraphics[finalBossGraphicsIndex], final_boss_position_x - backgroundPosition, final_boss_position_y, 0.45, 0.45, 1);
    }
    else if (final_boss_lives > 0 && final_boss_speed < 0) {
        let base_image = finalBossGraphics[finalBossGraphicsIndex];

        // ctx.save();
        // ctx.translate(base_image.width * 0.4, 0);
        // ctx.scale(-1, 1);
        // ctx.drawImage(base_image, -final_boss_position_x + backgroundPosition, final_boss_position_y, base_image.width * 0.45, base_image.height * 0.45);
        // ctx.restore();

        drawBackgroundObjectReverse(base_image, -final_boss_position_x + backgroundPosition, final_boss_position_y, 0.45, 0.45, 0.4, 1);
    }
    else {
        drawBackgroundObject(images[20], final_boss_position_x - backgroundPosition, final_boss_position_y, 0.4, 0.4, 1);

        let timePassed = new Date().getTime() - bossDefeatedAt;
        final_boss_position_x += (timePassed / 100);
        final_boss_position_y -= (timePassed / 100);
    }

    ctx.font = '30px Bradley Hand ITC';
    ctx.fillText(final_boss_lives, final_boss_position_x + 100 - backgroundPosition, final_boss_position_y + 50);

}

function drawBottleThrow() {
    if (bottleThrowTime > 0) {
        let timePassedSinceThrow = new Date().getTime() - bottleThrowTime;
        let gravity = Math.pow(9.81, timePassedSinceThrow / 300);
        thrownBottleX = character_x + 100 + (timePassedSinceThrow);
        thrownBottleY = 360 - (timePassedSinceThrow * 0.4 - gravity);

        drawBackgroundObject(images[11], thrownBottleX, thrownBottleY, 0.25, 0.25, 1);
    }
}

function drawBottles() {

    for (let i = 0; i < placedBottles.length; i++) {

        let bottle_x = placedBottles[i];

        drawBackgroundObject(images[11], bottle_x - backgroundPosition, 420, 0.25, 0.25, 1);

    }

}

function drawBackground() {

    drawBackgroundObject(images[4], 0, 0, 0.534, 0.534, 1);

    for (let i = 0; i < 5; i = i + 2) {

        drawBackgroundObject(images[3], (0 - cloudOffset) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject(images[2], (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject(images[1], (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject(images[0], (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);

        if (isMovingLeft) {
            if (backgroundPosition > 0) {
                backgroundPosition = backgroundPosition - GAME_SPEED;
            }
        }

        if (isMovingRight) {
            backgroundPosition = backgroundPosition + GAME_SPEED;
        }

    }

}

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

function drawBackgroundObjectReverse(src, offsetX, offsetY, scaleX, scaleY, translateX, opacity) {

    if (opacity != undefined) {
        ctx.globalAlpha = opacity;
    }

    let base_image = src;
    if (base_image.complete) {
        // ctx.save();
        // ctx.translate(base_image.width * translateX, 0);
        // ctx.scale(-1, 1);
        // ctx.drawImage(base_image, offsetX, offsetY, base_image.width * scaleX, base_image.height * scaleY);
        // ctx.restore();

        // ctx.translate(base_image.width * translateX, 0);
        // ctx.scale(-1, 1);
        ctx.setTransform(-1, 0, 0, 1, base_image.width * translateX, 0);
        ctx.drawImage(base_image, offsetX, offsetY, base_image.width * scaleX, base_image.height * scaleY);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    ctx.globalAlpha = 1;

}

function drawChicken() {

    for (let i = 0; i < chickens.length; i++) {

        let chicken = chickens[i];

        if (chicken.type == 1 && chicken.speed > 0) {
            console.log(chicken.graphInd);
            drawBackgroundObject(chickenType1Graphics[chicken.graphInd], chicken.position_x - backgroundPosition, chicken.position_y, chicken.scaleX, chicken.scaleY, 1);
        }
        else if (chicken.type == 1 && chicken.speed < 0) {
            let base_image = chickenType1Graphics[chicken.graphInd];

            // ctx.save();
            // ctx.translate(base_image.width * 0.4, 0);
            // ctx.scale(-1, 1);
            // ctx.drawImage(base_image, -chicken.position_x + backgroundPosition, chicken.position_y, base_image.width * chicken.scaleX, base_image.height * chicken.scaleY);
            // ctx.restore();

            drawBackgroundObjectReverse(base_image, -chicken.position_x + backgroundPosition, chicken.position_y, chicken.scaleX, chicken.scaleY, 0.4, 1);
        }

        if (chicken.type == 2 && chicken.speed > 0) {
            drawBackgroundObject(chickenType2Graphics[chicken.graphInd], chicken.position_x - backgroundPosition, chicken.position_y, chicken.scaleX, chicken.scaleY, 1);
        }
        else if (chicken.type == 2 && chicken.speed < 0) {
            let base_image = chickenType2Graphics[chicken.graphInd];

            // ctx.save();
            // ctx.translate(base_image.width * 0.4, 0);
            // ctx.scale(-1, 1);
            // ctx.drawImage(base_image, -chicken.position_x + backgroundPosition, chicken.position_y, base_image.width * chicken.scaleX, base_image.height * chicken.scaleY);
            // ctx.restore();

            drawBackgroundObjectReverse(base_image, -chicken.position_x + backgroundPosition, chicken.position_y, chicken.scaleX, chicken.scaleY, 0.4, 1);
        }

    }

}

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

function drawUI() {

    for (let i = 80; i >= 0; i = i - 20) {

        if (character_lives > i) {
            let index = (i * (1 / 20)) + 30;
            drawBackgroundObject(images[index], 10, 0, 0.4, 0.4, 1);
            break;
        }

    }

    if (character_lives <= 0) {
        drawBackgroundObject(images[29], 10, 0, 0.4, 0.4, 1);
    }

    ctx.font = '30px Bradley Hand ITC';
    ctx.fillText(character_lives, 120, 50);

    if (tabasco_juice <= 4) {
        let index = tabasco_juice + 5;
        drawBackgroundObject(images[index], 10, 60, 0.4, 0.4, 1);
    }
    else {
        drawBackgroundObject(images[10], 10, 60, 0.4, 0.4, 1);
    }

    ctx.font = '30px Bradley Hand ITC';
    ctx.fillText(tabasco_juice, 120, 110);

}

function listenForKeys() {

    document.addEventListener('keydown', e => {

        const k = e.key;

        if (k == 'ArrowRight' && game_finished == false) {
            isMovingRight = true;
        }

        if (k == 'ArrowLeft' && game_finished == false) {
            isMovingLeft = true;
        }

        if (k == 'd' && game_finished == false) {
            if (tabasco_juice > 0) {
                let timePassed = new Date().getTime() - bottleThrowTime;
                if (timePassed > 1000) {
                    tabasco_juice--;
                    bottleThrowTime = new Date().getTime();
                }
            }
        }

        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;

        if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2 && game_finished == false) {
            AUDIO_JUMPING.play();
            lastJumpStarted = new Date().getTime();
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

}