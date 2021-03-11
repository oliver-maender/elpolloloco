let canvas;
let ctx;
let character_x = 100;
let character_y = 150;
let character_lives = 100;
let tabasco_juice = 0;
let isMovingRight = false;
let isMovingLeft = false;
let lastMove = 'right';
let lastJumpStarted = 0;
let currentCharacterImage = './img/pepe/idle/I-1.png';
let characterGraphics = ['./img/pepe/idle/I-1.png', './img/pepe/walking/W-22.png', './img/pepe/walking/W-25.png'];
let characterGraphicsIndex = 0;
let cloudOffset = 0;
let backgroundPosition = 0;
let bottleThrowTime = 0;
let thrownBottleX = 0;
let thrownBottleY = 0;
let final_boss_position_x = 4000;
let final_boss_position_y = 0;
let final_boss_lives = 100;
let bossDefeatedAt = 0;
let game_finished = false;
let character_lost_at = 0;

let chickenType1 = './img/gallinita/gallinita_centro.png';
let chickenType2 = './img/pollito/pollito_centro.png';
let chickens = [];
let placedBottles = [500, 900, 1400, 1700, 2200, 2500];

// Game config

let JUMP_TIME = 300; // in ms
let GAME_SPEED = 0.5;
let AUDIO_RUNNING = new Audio('./audio/running.mp3');
let AUDIO_JUMPING = new Audio('./audio/jumping.mp3');
let AUDIO_BOTTLE = new Audio('./audio/bottle_beta.mp3');

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

        // Check Chicken
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            let chicken_x = chicken.position_x - backgroundPosition;

            if ((chicken_x - 100) < character_x && (chicken_x + 0) > character_x) {
                if (character_y > 110) {
                    if (character_lives > 0) {
                        character_lives -= 10;
                    }
                    else {
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

        // Check final boss
        if (thrownBottleX + backgroundPosition > final_boss_position_x - 100 && thrownBottleX + backgroundPosition < final_boss_position_x + 100) {

            if (final_boss_lives > 0) {
                final_boss_lives -= 10;
            }

            if (final_boss_lives == 0 && bossDefeatedAt == 0) {
                bossDefeatedAt = new Date().getTime();
                finishLevel();
            }

        }

    }, 100);

}

function finishLevel() {

    setTimeout(function () {
        AUDIO_BOTTLE.play();
    }, 1000);

    game_finished = true;

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
        createChicken(chickenType1, 700, 410),
        createChicken(chickenType2, 9000, 420),
        createChicken(chickenType1, 1200, 410),
        createChicken(chickenType1, 1500, 410),
        createChicken(chickenType2, 2000, 410),
        createChicken(chickenType2, 2200, 410),
        createChicken(chickenType1, 2800, 410),
        createChicken(chickenType1, 3000, 410)
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
    drawFinalBoss();

    if (game_finished) {
        drawFinalScreen();
    } else {
        updateCharacter();
        drawChicken();
        drawBottles();
        drawBottleThrow();
        drawUI();
    }

    requestAnimationFrame(draw);

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
            drawBackgroundObject('./img/caminata/lives/lives_' + (i + 20) + '.png', final_boss_position_x - backgroundPosition, final_boss_position_y, 0.4, 0.4, 1);
            break;
        }

    }

    // if (final_boss_lives > 80 && bossDefeatedAt == 0) {
    //     drawBackgroundObject('./img/caminata/lives/lives_100.png', final_boss_position_x - backgroundPosition, final_boss_position_y, 0.4, 0.4, 1);
    // }
    // else if (final_boss_lives > 60 && bossDefeatedAt == 0) {
    //     drawBackgroundObject('./img/caminata/lives/lives_80.png', final_boss_position_x - backgroundPosition, final_boss_position_y, 0.4, 0.4, 1);
    // }
    // else if (final_boss_lives > 40 && bossDefeatedAt == 0) {
    //     drawBackgroundObject('./img/caminata/lives/lives_60.png', final_boss_position_x - backgroundPosition, final_boss_position_y, 0.4, 0.4, 1);
    // }
    // else if (final_boss_lives > 20 && bossDefeatedAt == 0) {
    //     drawBackgroundObject('./img/caminata/lives/lives_40.png', final_boss_position_x - backgroundPosition, final_boss_position_y, 0.4, 0.4, 1);
    // }
    // else if (final_boss_lives > 0 && bossDefeatedAt == 0) {
    //     drawBackgroundObject('./img/caminata/lives/lives_20.png', final_boss_position_x - backgroundPosition, final_boss_position_y, 0.4, 0.4, 1);
    // }

    if (final_boss_lives > 0) {
        drawBackgroundObject('./img/caminata/G2.png', final_boss_position_x - backgroundPosition, final_boss_position_y, 0.45, 0.45, 1);
    } else {
        drawBackgroundObject('./img/caminata/G26.png', final_boss_position_x - backgroundPosition, final_boss_position_y, 0.4, 0.4, 1);

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

        drawBackgroundObject('./img/bottle/bottle.png', thrownBottleX, thrownBottleY, 0.25, 0.25, 1);
    }
}

function drawBottles() {

    for (let i = 0; i < placedBottles.length; i++) {

        let bottle_x = placedBottles[i];

        drawBackgroundObject('./img/bottle/bottle.png', bottle_x - backgroundPosition, 420, 0.25, 0.25, 1);

    }

}

function drawBackground() {

    drawBackgroundObject('./img/background/sky.png', 0, 0, 0.534, 0.534, 1);

    for (let i = 0; i < 5; i = i + 2) {

        drawBackgroundObject('./img/background/clouds/complete.png', (0 - cloudOffset) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject('./img/background/background3/complete.png', (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject('./img/background/background2/complete.png', (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);
        drawBackgroundObject('./img/background/background1/complete.png', (0 - backgroundPosition) + canvas.width * i, 0, 0.534, 0.534, 1);

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

    let base_image = new Image();
    base_image.src = src;
    if (base_image.complete) {
        ctx.drawImage(base_image, offsetX, offsetY, base_image.width * scaleX, base_image.height * scaleY);
    };

    ctx.globalAlpha = 1;

}

function drawChicken() {

    for (let i = 0; i < chickens.length; i++) {

        let chicken = chickens[i];

        drawBackgroundObject(chicken.img, chicken.position_x - backgroundPosition, chicken.position_y, chicken.scaleX, chicken.scaleY, 1);

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

    for (let i = 80; i >= 0; i = i - 20) {

        if (character_lives > i) {
            drawBackgroundObject('./img/pepe/lives/lives_' + (i + 20) + '.png', 10, 0, 0.4, 0.4, 1);
            break;
        }

    }

    if (character_lives <= 0) {
        drawBackgroundObject('./img/pepe/lives/lives_0.png', 10, 0, 0.4, 0.4, 1);
    }

    // if (character_lives > 80) {
    //     drawBackgroundObject('./img/pepe/lives/lives_100.png', 10, 0, 0.4, 0.4, 1);
    // }
    // else if (character_lives > 60) {
    //     drawBackgroundObject('./img/pepe/lives/lives_80.png', 10, 0, 0.4, 0.4, 1);
    // }
    // else if (character_lives > 40) {
    //     drawBackgroundObject('./img/pepe/lives/lives_60.png', 10, 0, 0.4, 0.4, 1);
    // }
    // else if (character_lives > 20) {
    //     drawBackgroundObject('./img/pepe/lives/lives_40.png', 10, 0, 0.4, 0.4, 1);
    // }
    // else if (character_lives > 0) {
    //     drawBackgroundObject('./img/pepe/lives/lives_20.png', 10, 0, 0.4, 0.4, 1);
    // }
    // else {
    //     drawBackgroundObject('./img/pepe/lives/lives_0.png', 10, 0, 0.4, 0.4, 1);
    // }

    ctx.font = '30px Bradley Hand ITC';
    ctx.fillText(character_lives, 120, 50);

    if (tabasco_juice <= 4) {
        drawBackgroundObject('./img/bottle/juice/juice_' + (tabasco_juice * 20) + '.png', 10, 60, 0.4, 0.4, 1);
    }
    else {
        drawBackgroundObject('./img/bottle/juice/juice_100.png', 10, 60, 0.4, 0.4, 1);
    }

    ctx.font = '30px Bradley Hand ITC';
    ctx.fillText(tabasco_juice, 120, 110);

}

function listenForKeys() {

    document.addEventListener('keydown', e => {

        const k = e.key;

        if (k == 'ArrowRight') {
            isMovingRight = true;
        }

        if (k == 'ArrowLeft') {
            isMovingLeft = true;
        }

        if (k == 'd') {
            if (tabasco_juice > 0) {
                let timePassed = new Date().getTime() - bottleThrowTime;
                if (timePassed > 1000) {
                    tabasco_juice--;
                    bottleThrowTime = new Date().getTime();
                }
            }
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
        }

        if (k == 'ArrowLeft') {
            isMovingLeft = false;
        }

    });

}