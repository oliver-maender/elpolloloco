let canvas;
let ctx;
let character_x = 0;
let character_y = 300;
let isMovingRight = false;
let isMovingLeft = false;
let lastJumpStarted = 0;
let bg_elements = 0;

// Game config

let JUMP_TIME = 300; // in ms

function init() {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");

    draw();

    listenForKeys();

}

function updateCharacter() {

    let base_image = new Image();
    base_image.src = './img/character_1.png';

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        character_y = character_y - 4;
    } else {

        if (character_y < 300) {
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
        ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.5, base_image.height * 0.5);
    };

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

}

function drawGround() {

    ctx.fillStyle = "#ddbc00";
    ctx.fillRect(0, canvas.height, canvas.width, -100);

    if (isMovingLeft) {
        bg_elements = bg_elements + 2;
    }

    if (isMovingRight) {
        bg_elements = bg_elements - 2;
    }

    let base_image1 = new Image();
    base_image1.src = './img/bg_elem_1.png';
    if (base_image1.complete) {
        ctx.drawImage(base_image1, bg_elements, 235, base_image1.width * 0.8, base_image1.height * 0.8);
    };

    let base_image2 = new Image();
    base_image2.src = './img/bg_elem_2.png';
    if (base_image2.complete) {
        ctx.drawImage(base_image2, bg_elements + 600, 135, base_image2.width * 0.8, base_image2.height * 0.8);
    };

}

function listenForKeys() {

    document.addEventListener('keydown', e => {

        const k = e.key;

        console.log(k);

        if (k == 'ArrowRight') {
            isMovingRight = true;
            character_x = character_x + 10;
        }

        if (k == 'ArrowLeft') {
            isMovingLeft = true;
            character_x = character_x - 10;
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