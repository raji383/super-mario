const back = document.getElementById('background');
const mario = document.getElementById('player');
const marioim = document.getElementById('player-img');
const enmys = document.getElementById('enmy-img');
const coinEl = document.getElementById('coin');
const over = document.getElementById('gameover')
const win = document.getElementById('win')

class Coin {
    constructor(element, game) {
        this.element = element;
        this.game = game;
        this.collected = false;
        this.positionX = 1000;
        this.positionY = 395;
    }

    checkCollision() {
        const player = this.game.player;
        const distance = Math.abs((this.positionX - this.game.background.positionX) - player.positionX);
        if (distance < 40 && !this.collected) {
            this.collect();
        }
    }

    collect() {
        this.collected = true;
        this.element.style.display = "none";
        this.game.score++;
        document.getElementById("score").textContent = `Score: ${this.game.score}`;
    }

    draw() {
        if (!this.collected) {
            const offset = this.positionX - this.game.background.positionX;
            this.element.style.left = `${offset}px`;
            this.element.style.top = `${this.positionY}px`;
        }
    }
}

class Background {
    constructor(element, game) {
        this.game = game;
        this.element = element;
        this.positionX = 0;
        this.positionY = 0;
        this.speed = 0;
        this.maxScroll = 7038 - 900;
        this.sund= new Audio('clear.wav');
    }

    draw() {
        this.positionX += this.speed;
        if (this.positionX >= this.maxScroll) {
            this.positionX = this.maxScroll;
            this.game.gameOver = true
            this.game.win = true
            this.sund.currentTime = 0;
            this.sund.play();
        }
        if (this.positionX < 0) {
            this.positionX = 0;
        }
        this.element.style.left = `-${this.positionX}px`;
        this.element.style.top = `-${this.positionY}%`;
    }
}

class Player {
    constructor(element, game, marioim) {
        this.game = game;
        this.width = 50;
        this.height = 70;
        this.element = element;
        this.marioim = marioim;
        this.positionX = 300;
        this.positionY = 390;
        this.speed = 2;
        this.jumpSpeed = 13;
        this.gravity = 0.5;
        this.frameTimer = 0;
        this.frameInterval = 100;
        this.frameX = 0;
        this.ground = 390;
        this.isJumping = false;
        this.velocityY = 0;
        this.moveright = true;
        this.fulling = false
        this.next = false
        this.pass = false
        this.jumpSound = new Audio('jump.wav');

    }
    moveDown() {

        if (
            this.next
        ) {
            this.pass = true

            this.positionX = 350;
            this.positionY = 0;
            this.game.background.positionY = 100;

        }
    }
    moveLeft(deltaTime) {

        this.moveright = false;
        if (!this.isJumping) {
            this.marioim.style.top = '0';
        }

        if (this.positionX > 200) {
            this.positionX -= this.speed;
        } else if (this.game.background.positionX > 0) {
            this.game.background.positionX -= this.speed;
        }
        if (!this.isJumping) {
            this.frameTimer += deltaTime
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
                if (this.frameX < 450) {
                    this.frameX = 850
                } else {
                    this.frameX -= 150;
                }
            }
            this.marioim.style.left = `-${this.frameX}%`;
        }

    }

    moveRight(deltaTime) {


        this.moveright = true;

        if (!this.isJumping) {
            this.marioim.style.top = '-650%';
        }

        if (this.positionX < 600) {
            this.positionX += this.speed;
        } else if (this.game.background.positionX < this.game.background.maxScroll) {
            this.game.background.positionX += this.speed;
        }

        if (!this.isJumping) {
            this.frameTimer += deltaTime;
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
                if (this.frameX >= 300) {
                    this.frameX = 0;
                } else {
                    this.frameX += 150;
                }
            }
            this.marioim.style.left = `-${this.frameX}%`;
        }
    }


    jump() {

        if (!this.isJumping) {
            this.jumpSound.currentTime = 0;
            this.jumpSound.play();

            this.isJumping = true;
            this.velocityY = -this.jumpSpeed;
            this.positionY += this.velocityY;

            if (this.moveright) {
                this.marioim.style.left = '-720%'
            } else {
                this.marioim.style.left = '-150%';
            }
        }
    }


    applyGravity() {
        if (this.isJumping || this.fulling) {
            this.velocityY += this.gravity;
            this.positionY += this.velocityY;

            if (this.moveright) {
                this.marioim.style.top = '-650%';
                this.marioim.style.left = '-720%';
            } else {
                this.marioim.style.top = '0';
                this.marioim.style.left = '-150%';
            }

            if (this.positionY >= this.ground) {
                if (!this.moveright) {
                    this.positionY = this.ground;
                } else {
                    this.positionY = this.ground;
                }

                this.isJumping = false;
                this.fulling = false
                this.velocityY = 0;
                this.marioim.style.left = this.moveright ? '0' : '-850%';
            }
        }
    }



    draw() {
        if (this.positionY + 5 <= this.ground) {
            this.fulling = true

        }
        if (!this.game.fulling) {
            this.element.style.left = `${this.positionX}px`;
        }

        this.element.style.top = `${this.positionY}px`;


    }
}

class Input {
    constructor(game) {
        this.game = game;
        this.keys = [];
        
        // Keyboard controls
        window.addEventListener('keydown', e => {
            if (['ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'p'].includes(e.key) && !this.keys.includes(e.key)) {
                this.keys.push(e.key);
            }
        });
        
        window.addEventListener('keyup', e => {
            if (['ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'p'].includes(e.key)) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
                if (this.game.player.moveright) {
                    this.game.player.marioim.style.left = '0'
                } else {
                    this.game.player.marioim.style.left = '-850%';
                }
            }
        });

        // Touch controls
        this.setupTouchControls();
    }

    setupTouchControls() {
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');

        // Helper function for touch events
        const handleTouch = (btn, key, event) => {
            event.preventDefault();
            if (event.type === 'touchstart' && !this.keys.includes(key)) {
                this.keys.push(key);
                btn.style.opacity = '0.7';
            } else if (event.type === 'touchend') {
                this.keys = this.keys.filter(k => k !== key);
                btn.style.opacity = '1';
                if (this.game.player.moveright) {
                    this.game.player.marioim.style.left = '0'
                } else {
                    this.game.player.marioim.style.left = '-850%';
                }
            }
        };

        // Left button
        btnLeft.addEventListener('touchstart', e => handleTouch(btnLeft, 'ArrowLeft', e));
        btnLeft.addEventListener('touchend', e => handleTouch(btnLeft, 'ArrowLeft', e));

        // Right button
        btnRight.addEventListener('touchstart', e => handleTouch(btnRight, 'ArrowRight', e));
        btnRight.addEventListener('touchend', e => handleTouch(btnRight, 'ArrowRight', e));

        // Jump button
        btnJump.addEventListener('touchstart', e => handleTouch(btnJump, ' ', e));
        btnJump.addEventListener('touchend', e => handleTouch(btnJump, ' ', e));
    }
}

class Map {
    constructor(game, background, player) {
        this.game = game;
        this.background = background;
        this.player = player;

        this.holes = [
            { startX: 2290, endX: 2385, yPosition: 500 },
            { startX: 2850, endX: 2990, yPosition: 500 },
            { startX: 5100, endX: 5190, yPosition: 500 },
        ];

        this.bloks = [
            ///anabib
            /*onpop1*/ { startX: 930, endX: 990, startY: 395, endY: 395, box: false, x: false },
            /*onpop2*/ { startX: 1280, endX: 1325, startY: 365, endY: 395, box: false, x: false },
            /*onpop3*/ { startX: 1545, endX: 1590, startY: 330, endY: 395, box: false, x: false },
            /*onpop4*/ { startX: 1915, endX: 1940, startY: 330, endY: 395, box: false, x: true },
            /*onpop4*/ { startX: 5450, endX: 5500, startY: 395, endY: 395, box: false, x: false },
            /*onpop4*/ { startX: 5975, endX: 6020, startY: 395, endY: 395, box: false, x: false },


            ////daraj
            //draj1
            { startX: 4480, endX: 4490, startY: 425, endY: 395, box: false, x: false },
            { startX: 4520, endX: 4540, startY: 390, endY: 395, box: false, x: false },
            { startX: 4550, endX: 4580, startY: 355, endY: 395, box: false, x: false },
            { startX: 4590, endX: 4600, startY: 325, endY: 395, box: false, x: false },
            //draj2
            { startX: 4680, endX: 4695, startY: 330, endY: 395, box: false, x: false },
            { startX: 4770, endX: 4785, startY: 430, endY: 395, box: false, x: false },
            { startX: 4740, endX: 4755, startY: 395, endY: 395, box: false, x: false },
            { startX: 4710, endX: 4725, startY: 360, endY: 395, box: false, x: false },
            //draj3
            { startX: 4953, endX: 4960, startY: 425, endY: 395, box: false, x: false },
            { startX: 4993, endX: 5010, startY: 390, endY: 395, box: false, x: false },
            { startX: 5023, endX: 5050, startY: 355, endY: 395, box: false, x: false },
            { startX: 5063, endX: 5100, startY: 325, endY: 395, box: false, x: false },
            //draj4
            { startX: 5270, endX: 5285, startY: 430, endY: 395, box: false, x: false },
            { startX: 5240, endX: 5255, startY: 395, endY: 395, box: false, x: false },
            { startX: 5210, endX: 5225, startY: 360, endY: 395, box: false, x: false },
            { startX: 5180, endX: 5195, startY: 330, endY: 395, box: false, x: false },
            //darj final
            { startX: 6030, endX: 6050, startY: 425, endY: 395, box: false, x: false },
            { startX: 6080, endX: 6100, startY: 390, endY: 395, box: false, x: false },
            { startX: 6110, endX: 6140, startY: 355, endY: 395, box: false, x: false },
            { startX: 6150, endX: 6170, startY: 325, endY: 395, box: false, x: false },
            { startX: 6180, endX: 6200, startY: 290, endY: 395, box: false, x: false },
            { startX: 6210, endX: 6230, startY: 255, endY: 395, box: false, x: false },
            { startX: 6240, endX: 6270, startY: 225, endY: 395, box: false, x: false },
            { startX: 6280, endX: 6330, startY: 190, endY: 395, box: false, x: false },


            ///solo bock
            /*1*/ { startX: 545, endX: 560, startY: 325, endY: 302, box: true, x: false },
            /*2*/ { startX: 745, endX: 759, startY: 190, endY: 202, box: true, x: false },
            /*3*/{ startX: 710, endX: 745, startY: 325, endY: 302, box: true, x: false },
             /*4*/{ startX: 780, endX: 810, startY: 325, endY: 302, box: true, x: false },
              /*3*/{ startX: 2613, endX: 2628, startY: 325, endY: 302, box: true, x: false },
              /*3*/{ startX: 3145, endX: 3160, startY: 190, endY: 202, box: true, x: false },
            /*3*/ { startX: 3145, endX: 3160, startY: 325, endY: 302, box: false, x: false },
            /*4*/ { startX: 3545, endX: 3570, startY: 325, endY: 302, box: true, x: false },
            /*5*/ { startX: 3645, endX: 3670, startY: 325, endY: 302, box: true, x: false },
            /*5-2*/ { startX: 3645, endX: 3670, startY: 190, endY: 202, box: true, x: false },
            /*6*/ { startX: 3745, endX: 3770, startY: 325, endY: 302, box: true, x: false },
            /*7*/ { startX: 3930, endX: 3970, startY: 325, endY: 302, box: false, x: false },
            /*8*/{ startX: 4315, endX: 4335, startY: 190, endY: 202, box: true, x: false },
            /*9*/{ startX: 4348, endX: 4363, startY: 190, endY: 202, box: true, x: false },
            /*10*/{ startX: 5680, endX: 5700, startY: 325, endY: 302, box: true, x: false },


            //till bolck
            /*tall1*/{ startX: 680, endX: 840, startY: 325, endY: 302, box: false, x: false },
            /*tall2*/{ startX: 2570, endX: 2670, startY: 325, endY: 302, box: false, x: false },
            /*tall3*/{ startX: 2680, endX: 2920, startY: 190, endY: 202, box: false, x: false },
            /*tall3*/{ startX: 3060, endX: 3160, startY: 190, endY: 202, box: false, x: false },
            /*tall3*/{ startX: 3340, endX: 3400, startY: 325, endY: 302, box: false, x: false },
            /*tall4*/{ startX: 4020, endX: 4125, startY: 190, endY: 202, box: false, x: false },
            /*tall5*/{ startX: 4270, endX: 4405, startY: 190, endY: 202, box: false, x: false },
            /*tall5-2*/{ startX: 4320, endX: 4375, startY: 325, endY: 302, box: false, x: false },
            /*tall6*/{ startX: 5600, endX: 5730, startY: 325, endY: 302, box: false, x: false },
        ];
    }

    getPlayerHitbox() {
        return {
            top: this.player.positionY,
            bottom: this.player.positionY + this.player.height,
            left: this.player.positionX + this.background.positionX,
            right: this.player.positionX + this.background.positionX + this.player.width,
        };
    }

    update() {
        const playerBox = this.getPlayerHitbox();
        let onBlock = false;

        this.holes.forEach(hole => {
            if (
                this.player.positionY >= 380 &&
                playerBox.left > hole.startX &&
                playerBox.right < hole.endX &&
                !this.player.isJumping
            ) {
                if (this.player.positionY < hole.yPosition) {
                    this.player.positionY += this.player.speed;
                    this.player.marioim.style.left = '0';
                    this.player.marioim.style.top = '0';
                    this.game.fulling = true;
                }
            }
        });

        this.bloks.forEach(blok => {
            const blokBox = {
                top: blok.startY,
                bottom: blok.endY,
                left: blok.startX,
                right: blok.endX
            };

            // Bottom collision (hitting block from below)
            if (
                !this.player.pass &&
                this.player.velocityY < 0 &&
                playerBox.top < blokBox.bottom &&
                playerBox.bottom > blokBox.top &&
                playerBox.right > blokBox.left &&
                playerBox.left < blokBox.right
            ) {
                if (blok.box) {

                    this.game.coin.collect();
                    const newDiv = document.createElement('div');
                    newDiv.style.width = '32px';
                    newDiv.style.height = '32px';
                    newDiv.style.backgroundImage = "url('block.png')";
                    newDiv.style.backgroundSize = 'cover';
                    newDiv.style.position = 'absolute';
                    newDiv.style.top = (blokBox.top - 24) + 'px';
                    newDiv.style.left = (blokBox.left - 11) + 'px';
                    newDiv.style.zIndex = "10";
                    document.getElementById('background').appendChild(newDiv);

                    const newDiv2 = document.createElement('div');
                    newDiv2.style.width = '32px';
                    newDiv2.style.height = '32px';
                    newDiv2.style.backgroundImage = "url('coin.png')";
                    newDiv2.style.backgroundSize = 'cover';
                    newDiv2.style.position = 'absolute';
                    newDiv2.style.top = (blokBox.top - 60) + 'px';
                    newDiv2.style.left = (blokBox.left - 11) + 'px';
                    newDiv2.style.zIndex = "10";
                    document.getElementById('background').appendChild(newDiv2);
                    blok.box = false;
                    const sund = document.createElement('audio');
                    sund.src = 'coin.mp3';
                    sund.play();
                    setTimeout(() => {
                        newDiv2.remove();
                    }, 500);
                }
                this.player.velocityY = 0;
                this.player.positionY = blokBox.bottom;
                this.player.isJumping = true;
            }

            // Top collision (landing on block)
            if (
                !this.player.pass &&
                playerBox.bottom >= blokBox.top &&
                playerBox.bottom <= blokBox.top + 10 &&
                playerBox.right > blokBox.left &&
                playerBox.left < blokBox.right &&
                this.player.velocityY >= 0
            ) {
               
                if (blok.x) {
                    this.player.next = true;

                } else {
                    this.player.next = false;
                }
                this.player.ground = blokBox.top - this.player.height;
                onBlock = true;
                // this.player.isJumping = false;
                // this.player.fulling = false;
                this.player.velocityY = 0;
            }

            // Side collision
            if (
                !this.player.pass &&
                playerBox.bottom > blokBox.top + 10 &&
                playerBox.top < blokBox.bottom &&
                playerBox.right > blokBox.left &&
                playerBox.left < blokBox.right &&
                !this.player.isJumping
            ) {
                this.player.positionX = this.player.moveright
                    ? blokBox.left - this.background.positionX - this.player.width
                    : blokBox.right - this.background.positionX;
            }
        });

        // Special pipe collision handling
        if (this.player.pass) {
            const pipeBoxes = [
                { top: 360, bottom: 400, left: 1735, right: 1940, x: false },
                { top: 390, bottom: 400, left: 2050, right: 2100, x: true },
                { top: 100, bottom: 400, left: 2100, right: 2200, x: false },
            ];

            pipeBoxes.forEach(pipeBox => {
                if (
                    playerBox.bottom >= pipeBox.top &&
                    playerBox.bottom <= pipeBox.bottom &&
                    playerBox.right > pipeBox.left &&
                    playerBox.left < pipeBox.right &&
                    this.player.velocityY >= 0
                ) {
                    this.player.ground = pipeBox.top - this.player.height;
                    onBlock = true;
                    this.player.velocityY = 0;
                }

                // Side collision with pipe
                if (
                    playerBox.bottom > pipeBox.top &&
                    playerBox.top < pipeBox.bottom &&
                    playerBox.right > pipeBox.left &&
                    playerBox.left < pipeBox.right &&
                    !this.player.isJumping
                ) {
                    this.player.positionX = this.player.moveright
                        ? pipeBox.left - this.background.positionX - this.player.width
                        : pipeBox.right - this.background.positionX;
                    if (pipeBox.x) {
                        this.player.next = false;
                        this.player.pass = false
                        this.game.background.positionY = 0;
                        this.game.background.positionX = 5070;
                        this.player.positionY = 310;
                        this.player.positionX = 380;

                    }
                }



            });
        }


        if (!onBlock && this.player.positionY < 390) {
            this.player.ground = 390;
            this.player.next = false;
            if (!this.player.isJumping) {
                this.player.fulling = true;
            }
        }
    }
}
class Enmy {
    constructor(game, background, player, startX) {
        this.game = game;
        this.background = background;
        this.player = player;
        this.positionX = startX - this.background.positionX;
        this.positionY = 390;
        this.speed = 2;

        this.frameTimer = 0;
        this.frameInterval = 1000;
        this.frameX = 0;
        this.enmyDed = false;

        // Create unique enemy element
        this.enmy = document.createElement('div');
        this.enmy.className = 'enemy';
        this.enmyImg = document.createElement('div');
        this.enmyImg.className = 'enemy-img';
        this.enmy.appendChild(this.enmyImg);
        this.sund= new Audio('mariodie.wav');
        document.getElementById('background').appendChild(this.enmy);
    }
    enmysfulling() {
        this.game.map.holes.forEach(hole => {
            if (
                this.positionY >= 390 &&
                this.positionX > hole.startX &&
                this.positionX + 50 < hole.endX &&
                !this.player.isJumping
            ) {
                /*if (this.positionY < hole.yPosition) {
                    this.enmy.remove();
                }
                this.positionY += this.speed;*/
                this.speed = -this.speed;


            }
        });
    }
    enmyMove(deltaTime) {
        //this.enmysfulling()

        this.positionX -= this.speed;

        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX >= 120) {
                this.frameX = 0;
            } else {
                this.frameX += 120;
            }
        }
        this.enmyImg.style.left = `-${this.frameX}%`;
        if (this.enmyDed) {
            this.enmyImg.style.left = '-250%';

        }

        this.checkObstacles();

        this.enmy.style.left = `${this.positionX}px`;
        this.enmy.style.top = `${this.positionY}px`;
    }

    checkObstacles() {
        const enmyBox = {
            top: this.positionY,
            bottom: this.positionY + 50,
            left: this.positionX,
            right: this.positionX + 50
        };

        // Check for holes first
        const holes = this.game.map.holes;
        let inHole = false;

        holes.forEach(hole => {
            if (enmyBox.left + 50 > hole.startX && enmyBox.right < hole.endX) {
                inHole = true;
                /*if (this.positionY < hole.yPosition) {
                    this.positionY += 8;  // Faster falling speed
                    if (this.positionY >= hole.yPosition - 50) {
                        this.enmyDed = true;
                        this.enmy.style.transition = 'opacity 0.5s';
                        this.enmy.style.opacity = '0';
                        setTimeout(() => this.enmy.remove(), 500);
                    }
                }*/
                this.speed = -this.speed;
            }
        });

        if (inHole) return;

        // Check block collisions
        const bloks = this.game.map.bloks;
        let onBlock = false;

        bloks.forEach(blok => {
            const blokBox = {
                top: blok.startY,
                bottom: blok.endY,
                left: blok.startX,
                right: blok.endX
            };

            if (
                enmyBox.bottom >= blokBox.top &&
                enmyBox.bottom <= blokBox.top + 10 &&
                enmyBox.right > blokBox.left &&
                enmyBox.left < blokBox.right
            ) {
                this.positionY = blokBox.top - 50;
                onBlock = true;
            }

            if (
                enmyBox.bottom > blokBox.top &&
                enmyBox.top < blokBox.bottom &&
                enmyBox.right > blokBox.left &&
                enmyBox.left < blokBox.right
            ) {
                this.speed = -this.speed;
            }
        });

        if (!onBlock && !inHole && this.positionY < 390) {
            this.positionY += 5;
        }
    }

    checkCollision(deltaTime) {
        this.enmyMove(deltaTime);
        const player = this.game.player;

        const playerBox = {
            top: player.positionY,
            bottom: player.positionY + player.height,
            left: player.positionX + this.background.positionX,
            right: player.positionX + player.width + this.background.positionX
        };

        const enemyBox = {
            top: this.positionY + 15,
            bottom: this.positionY + 46,
            left: this.positionX,
            right: this.positionX + 30
        };



        if (
            (this.game.player.isJumping || this.game.player.fulling) &&
            playerBox.bottom >= enemyBox.top &&
            playerBox.right > enemyBox.left &&
            playerBox.left < enemyBox.right &&
            !this.enmyDed &&
            !this.game.player.pass
        ) {
            this.game.score++;
            this.game.coin.collect();
            this.enmyDed = true;
            this.enmyImg.style.left = '-250%';
            this.game.player.velocityY = -5;


            setTimeout(() => {
                this.enmy.remove();
            }, 500);

        } else if (
            !this.game.player.fulling &&
            enemyBox.bottom > playerBox.top &&
            enemyBox.top < playerBox.bottom &&
            playerBox.right > enemyBox.left &&
            playerBox.left < enemyBox.right &&
            this.enmyDed == false &&
            !this.game.player.pass
        ) {
            this.sund.currentTime = 0;
            this.sund.play();
            this.game.gameOver = true;

        }
        
    }

}

class Game {
    constructor() {
        this.start = true
        this.background = new Background(back, this);
        this.player = new Player(mario, this, marioim);
        this.input = new Input(this);
        this.coin = new Coin(coinEl, this);
        this.map = new Map(this, this.background, this.player);

        // Create multiple enemies at strategic positions
        this.enemies = [
            new Enmy(this, this.background, this.player, 800),
            new Enmy(this, this.background, this.player, 1400),
            new Enmy(this, this.background, this.player, 2000),
            new Enmy(this, this.background, this.player, 2600),
            new Enmy(this, this.background, this.player, 3300),
            new Enmy(this, this.background, this.player, 4100),
            new Enmy(this, this.background, this.player, 4800),
            new Enmy(this, this.background, this.player, 5400)
        ];

        this.score = 0;
        this.fulling = false;
        this.gameOver = false;
        this.win = false;
        this.isPaused = false;

        // Create pause overlay
        this.pauseOverlay = document.createElement('div');
        this.pauseOverlay.style.position = 'fixed';
        this.pauseOverlay.style.top = '50%';
        this.pauseOverlay.style.left = '50%';
        this.pauseOverlay.style.transform = 'translate(-50%, -50%)';
        this.pauseOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.pauseOverlay.style.color = 'white';
        this.pauseOverlay.style.padding = '20px';
        this.pauseOverlay.style.fontSize = '24px';
        this.pauseOverlay.style.display = 'none';
        this.pauseOverlay.textContent = 'PAUSED';
        document.body.appendChild(this.pauseOverlay);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseOverlay.style.display = this.isPaused ? 'block' : 'none';
    }

    updateInput(deltaTime) {
        const keys = this.input.keys;
        if (keys.includes('p')) {
            keys.splice(keys.indexOf('p'), 1); // Remove to prevent multiple toggles
            this.togglePause();
        }
        if (!this.isPaused) {
            if (keys.includes(' ')) this.player.jump(deltaTime);
            if (keys.includes('ArrowLeft')) this.player.moveLeft(deltaTime);
            if (keys.includes('ArrowRight')) this.player.moveRight(deltaTime);
            if (keys.includes('ArrowDown')) this.player.moveDown();
        }
    }


    draw(deltaTime) {
        if (this.start) {
            const start = document.createElement('audio');
            start.src = 'mario.mp3';
            start.play();
            this.start = false;

        }


        this.background.draw();
        this.map.update();

        this.updateInput(deltaTime);

        this.player.applyGravity(deltaTime);
        this.player.draw();

        this.coin.draw();

        this.enemies.forEach(enemy => {
            enemy.checkCollision(deltaTime);
        });

        if (this.player.positionY > 430) {
            this.gameOver = true;
            this.enemies.forEach(enemy => {
                enemy.sund.play();
            });
        }
    }

}

// Replace the animation function with this version
function animation(timeStamp) {
   
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;


    if (!game.gameOver) {
        game.updateInput(deltaTime);
        if (!game.isPaused) {
            game.draw(deltaTime);
        }
        requestAnimationFrame(animation);
    } else {
        if (game.win) {
            win.style.display = 'block';
        } else {
            over.style.display = 'block';
        }
    }
}

const game = new Game();
let lastTime = 0;
animation(0);