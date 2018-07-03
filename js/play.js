Product.Play = function (game) {
    // define needed variables for Product.Play
    this._productGroup = null;
    this._spawnCornTimer = 0;
    this._reset = false;
    Product._score = 0;
    Product._fontStyle = {
        font: "30px Luckiest Guy, cursive",
        fill: "#ed1c24",
        align: "left",
        smoothed: "true"
    };
    Product._fontStyleThick = {
        font: "40px Luckiest Guy, cursive",
        fill: "#ed1c24",
        align: "left",
        smoothed: "true",
        strokeThickness: "8",
        stroke: "#000000"
    };
    Product._fontStyleCommentary = {
        font: "30px Luckiest Guy, cursive",
        fill: "#ed1c24",
        align: "left",
        smoothed: "true",
        strokeThickness: "5",
        stroke: "#000000"
    };
    Product._fontStyleLogout = {
        font: "20px Luckiest Guy, cursive",
        fontWeight:'normal',
        fill: "#ed1c24",
        align: "center",
        smoothed: "true"
    };
};

var player;
var bgMusic = null;
var collectMusic;
var bombMusic;
var products;
var volumeOn;
var volumeOff;
var musicOff;
var musicOn;
var musicStatus = true;
var statusChanged;
var pauseClick = false;
var isZoom;
var _century = false;
var _doubleCentury = false;
var _tripleCentury = false;
var _forthCentury = false;
var _fifthCentury = false;
var gameGesture;
var clouds;
var ret, fullScreenButton;
Product.Play.prototype = {
    preload: function () {
    },
    create: function () {
        /* Bg Image Animation
         * http://www.html5gamedevs.com/topic/3763-looping-background-image/
         */
        clouds = game.add.tileSprite(0, 0, 640, 600, "clouds");
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        Product._pausedOverlay = null;
        Product._gameOver = false;
        // define Candy variables to reuse them in Product.item functions
        Product._scoreText = null;
        Product._score = 0;
        Product._health = 0;
        Product._velocity_speed = 500;
        Product._deltaTime = 0;
        Product._velocity = 150;
        Product._velocityMax = 700;
        Product._BhujiyaProduct = ['alooBhujiya', 'periPeriBhujiya', 'barbequeBhujiya'];
        Product._PopcornProduct = ['seaSaltAndPepperPopcorn', 'cheesePopcorn'];
        Product._JuiceProduct = ['mixedFruitJuice', 'appleJuice'];
        Product._BiscuitProduct = ['chocolateCream', 'digestive', 'marie'];
        Product._productType = Product._BhujiyaProduct.concat(Product._PopcornProduct, Product._JuiceProduct, Product._BiscuitProduct);
        Product._bombType = ['bat', 'boll', 'bells'];
        Product._specialProductType = ['glow1', 'glow2'];
        Product._audioType = ['chak1', 'chak2', 'chak3', 'chak4'];
        Product._checkSpecialProduct = false;
        Product.specialProduct = false;
        Product._checkTimeForSpecial = 0;
        Product._checkTimeForBomb = 0;
        Product._specialTimer = 0;
        Product._specialBombTimer = 0;
        Product._firstLimit = 150;
        Product._lastLimit = 200;
        Product._SpecialTime = 1;
        Product._SpecialTime2 = 3;
        Product._bgMusic = null;
        if (storage.isEmpty('bestScore') == true) {
            storage.set("bestScore", 0);
        }
        this.scale.refresh();
        this.time.advancedTiming = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 0;

        Product._pausedOverlay = this.add.sprite(0, 0, 'screenOverlay');
        Product._pausedOverlay.visible = false;

        var pauseBtn = this.add.button(Product.GAME_WIDTH - 600, Product.GAME_HEIGHT - 60, 'pauseButton', this.managePause, this);

        volumeOn = this.add.button(Product.GAME_WIDTH - 530, Product.GAME_HEIGHT - 60, "volumeOn", function () {
            this.manageMute(true);
        }, this);

        this._spawnCornTimer = 0;
        this.add.text(Product.GAME_WIDTH - 180, Product.GAME_HEIGHT - 60, "SCORE", Product._fontStyle);
        Product._scoreText = this.add.text(Product.GAME_WIDTH - 85, Product.GAME_HEIGHT - 60, "0", Product._fontStyle);
        Product._health = 10;
        this._productGroup = this.add.group();
        this._productGroup.enableBody = true;
        this._productGroup.physicsBodyType = Phaser.Physics.ARCADE;


        /* Chabao game */


        // The player and its settings
        player = this.add.sprite(0, Product.GAME_HEIGHT - 300, 'denture');
        player.anchor.setTo(0, 0);

        //  We need to enable physics on the player
        game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;

        // Player frame default set to frame 1
        player.animations.add('move', [1], 10, true);
        player.frame = 1;

        /* Product Item Music */
        this.music(false);
        Product._bgMusic = game.add.audio('bgsound');
        Product._bgMusic.volume = 0.7;
        Product._bgMusic.play();

        addBgImages();
        if (is_register == true) {
            gameGesture = game.add.sprite(Product.GAME_WIDTH - 400, Product.GAME_HEIGHT - 550, 'gesture');
            gameGesture.anchor.set(0.5, 0.5);
            gameGesture.animations.add('zoom', [0, 1, 2], 0.1, true);
            gameGesture.animations.play('zoom');
        }
    },
    managePause: function () {
        console.log('managePause click');
        console.log(pauseClick);
        if (pauseClick == false) {
            custom_event('PauseButtonClick', 'Pause Button');
            pauseClick = true;
            this.game.paused = true;
            Product._pausedOverlay.visible = true;
            Product._pausedOverlay.bringToTop();
            var pausedText = this.add.sprite(this.world.centerX, this.world.centerY - 200, 'pausedText');
            pausedText.anchor.set(0.5, 0.5);

            var resumeButton = this.add.sprite(this.world.centerX, this.world.centerY - 100, 'resumeButton');
            resumeButton.inputEnabled = true;
            resumeButton.anchor.set(0.5, 0.5);

            /*Music button on pause*/
            if (!musicStatus == true) {
                musicOff = this.add.button(this.world.centerX, this.world.centerY + 20, "musicOff", function () {
                    this.manageMusic(false);
                }, this);
                musicOff.anchor.set(0.5, 0.5);
            } else {
                musicOn = this.add.button(this.world.centerX, this.world.centerY + 20, "musicOn", function () {
                    this.manageMusic(true);
                }, this);
                musicOn.anchor.set(0.5, 0.5);
            }
            var home = this.add.button(this.world.centerX, this.world.centerY + 130, "home",function () {
                custom_event('HomeButtonClick', 'Home Button');
                pauseClick = false;
                Product._pausedOverlay.visible = false;
                this.game.paused = false;
                game.state.start('menu', true, false);
            }, this);
            home.anchor.set(0.5, 0.5);
            // set event listener for the user's click/tap the screen
            resumeButton.events.onInputDown.add(function () {
                custom_event('ResumeButtonClick', 'Resume Button');
                pauseClick = false;
                // remove the pause text
                pausedText.destroy();
                resumeButton.destroy();
                home.destroy();
                if (musicStatus == true) {
                    musicOn.destroy();
                } else {
                    musicOff.destroy();
                }
                Product._pausedOverlay.visible = false;
                this.game.paused = false;
                if (statusChanged == true) {
                    this.manageMute(!musicStatus);
                }
            }, this);
        }
    },
    update: function () {
        /*Gesture animation*/
        if (is_register == true) {
            Product._pausedOverlay.visible = true;
            player.visible = false;
            if (gameGesture.x == 220) {
                gameGesture.x += 2;
                ret = true;
            }
            if ((gameGesture.x + gameGesture.width) == 701) {
                gameGesture.x -= 2;
                ret = false;
            }
            if (ret == true) {
                gameGesture.x += 2;
            } else {
                gameGesture.x -= 2;
            }
            game.time.events.add(Phaser.Timer.SECOND * 3, function () {
                Product._pausedOverlay.visible = false;
                gameGesture.destroy();
                player.visible = true;
                is_register = false;
            }, this);
        } else {
            if (this._reset) {
                this._spawnCornTimer = 0;
                Product._score = 0;
                Product._scoreText.setText(Product._score);
                Product._deltaTime = 0;
                Product._checkSpecialProduct = false;
                Product._checkTimeForSpecial = 0;
                Product._checkTimeForBomb = 0;
                Product._specialTimer = 0;
                Product._specialBombTimer = 0;
                Product.specialProduct = false;
                this._reset = false;
            }
            if (Product._gameOver) {
                updateScore();
            }
            /*update timer every frame*/
            this._spawnCornTimer += this.time.elapsed;
            Product._specialTimer += this.time.elapsed;
            Product._specialBombTimer += this.time.elapsed;

            if (Product._checkTimeForSpecial === 0) {
                if (Product._checkSpecialProduct) {
                    Product._checkTimeForSpecial = getRandomInt(Product._SpecialTime, Product._SpecialTime2) * 1000;
                } else {
                    Product._checkTimeForSpecial = getRandomInt(Product._SpecialTime, Product._SpecialTime2) * 1000;
                }
            }

            if (Product._checkTimeForBomb === 0) {
                Product._checkTimeForBomb = getRandomInt(3, 5) * 1000;
            }

            var timer = 1500;
            if (Product._score > 30) {
                timer = getRandomInt(500, 1250);
            } else if (Product._score > 50) {
                timer = getRandomInt(500, 800);
            }
            if (this._spawnCornTimer > timer && Product._health) {
                this._spawnCornTimer = 0;
                Product.item.spawnCorn(this);
            }
            // loop through all products on the screen
            this._productGroup.forEachAlive(function (product) {
                // to rotate them accordingly
                product.angle = product.rotateMe;
            }, this);

            /* Chabao Game */
            /**
             * catch product when touches to player
             */
            game.physics.arcade.overlap(player, this._productGroup, collectPackets, null, this);
            //  Reset the players velocity (movement)
            player.body.velocity.x = 0;

            /*if the health of the player drops to 0, the player dies = game over*/
            if (!Product._health) {

                var denturePosx = player.x;
                var denturePosy = player.y;

                player.scale.setTo(1, 1);
                player.frame = 0;
                this._productGroup.forEachAlive(function (product) {
                    product.body.velocity.y = 0;
                    product.body.allowGravity = false;
                }, this);

                var out = game.add.sprite(denturePosx, denturePosy, 'out');
                var zoom = out.animations.add('zoom', [4, 3, 2, 1, 0], 10, false);
                out.animations.play('zoom');

                game.time.events.add(Phaser.Timer.SECOND * 1.5, function () {
                    Product._gameOver = true;
                    this.music(true);
                }, this);

                document.getElementById("body").classList.remove("bganimate");
            } else {
                this.mouseAnimation();
            }

            clouds.tilePosition.x += 0.8;
        }
    },
    mouseAnimation: function () {
        player.anchor.set(0, 0);
        var palyerWidth = 160;
        if (game.input.y < game.height - 100) {
            player.x = game.input.x;
        }
        if (isZoom == 1) {
            palyerWidth = 235;
        }
        if (player.x < 10) {
            player.x = 10;
        }
        else if (player.x > game.width - palyerWidth) {
            player.x = game.width - palyerWidth;
        }
    },
    manageMute: function (value) {
        if (pauseClick == false) {
            if (value == true) {
                volumeOn.destroy();
                volumeOff = this.add.button(Product.GAME_WIDTH - 530, Product.GAME_HEIGHT - 60, "volumeOff", function () {
                    this.manageMute(false);
                }, this);
                musicStatus = false;
            }
            else {
                volumeOff.destroy();
                volumeOn = this.add.button(Product.GAME_WIDTH - 530, Product.GAME_HEIGHT - 60, "volumeOn", function () {
                    this.manageMute(true);
                }, this);

                musicStatus = true;
            }
            this.toggleMute(value);

        }
    },
    manageMusic: function (value) {
        if (value == true && musicStatus == true) {
            musicOff = this.add.button(this.world.centerX, this.world.centerY + 20, "musicOff", function () {
                this.manageMusic(false);
            }, this);
            musicStatus = false;
            musicOff.anchor.set(0.5, 0.5);
            musicOn.destroy();
        }
        else {

            musicOn = this.add.button(this.world.centerX, this.world.centerY + 20, "musicOn", function () {
                this.manageMusic(true);
            }, this);
            musicStatus = true;
            musicOn.anchor.set(0.5, 0.5);
            musicOff.destroy();
        }
        statusChanged = true;
    },
    toggleMute: function (value) {
        custom_event('MusicButtonClick', 'Music Button');
        if (value) {
            game.sound.volume = 0;
        } else {
            game.sound.volume = 0.7;
        }
    },
    music: function (value) {
        game.sound.mute = value;
    }
};

Product.item = {
    spawnCorn: function (game) {
        // calculate drop position (from 0 to game width) on the x axis
        var dropPos = getRandomInt(70, Product.GAME_WIDTH - 150);

        // define the offset for every candy
        var dropOffset = -25;

        // randomize candy type
        var cornType = 0;

        // create new candy
        products = null;
        /*Generate Bomb*/
        if ((Product._specialBombTimer > Product._checkTimeForBomb ) && !Product.specialProduct) {
            cornType = getRandomInt(0, (Product._bombType.length - 1));
            products = game.add.sprite(dropPos, dropOffset, Product._bombType[cornType]);
            Product._checkTimeForBomb = 0;
            Product._specialBombTimer = 0;
        } else if ((Product._specialTimer > Product._checkTimeForSpecial && !Product._checkSpecialProduct && Product._score > 50 )) {
            /*Generate Special Product*/
            cornType = getRandomInt(0, (Product._specialProductType.length - 1));
            products = game.add.sprite(dropPos, dropOffset, Product._specialProductType[cornType]);
            /*Blink animation*/
            var blink = products.animations.add('blink');
            products.animations.play('blink', 30, true);
            updateSpecialProductData(true);
            Product._SpecialTime = 15;
            Product._SpecialTime2 = 25;
        } else {
            // Generate Product
            cornType = getRandomInt(0, (Product._productType.length - 2));
            products = game.add.sprite(dropPos, dropOffset, Product._productType[cornType]);
        }
        // enable candy body for physic engine
        game.physics.enable(products, Phaser.Physics.ARCADE);
        products.anchor.setTo(0, 0);
        products.cornType = cornType;

        // enable candy to be clicked/tapped
        products.inputEnabled = false;
        products.body.gravity.y = getRandomInt(Product._firstLimit, Product._lastLimit);

        // product.body.acceleration.y = game._acceleration;
        Product._deltaTime = (game.time.elapsedMS * game.time.fps) / Product._velocity_speed;
        Product._velocity = Product._velocity + Product._deltaTime;

        // check if speed is more
        products.body.velocity.y = (Product._velocity < Product._velocityMax) ? Product._velocity : Product._velocityMax;

        // be sure that the candy will fire an event when it goes out of the screen
        products.checkWorldBounds = true;

        // reset candy when it goes out of screen
        products.events.onOutOfBounds.add(this.removeCorn, this);

        // set the random rotation value
        // console.log((Math.random()* 4));
        products.rotateMe = getRandomInt(-45, 45);


        // add candy to the group
        game._productGroup.add(products);
        products.enableBody = true;
    },
    removeCorn: function (product) {
        /*decrease player's health*/
        if (Product._bombType.indexOf(product.key) != -1 || Product._specialProductType.indexOf(product.key) != -1) {
            Product._health = 1;
            if (Product._specialProductType.indexOf(product.key) != -1) {
                updateSpecialProductData(false);
            }
        } else {
            removeMusic();
            Product._health = 0;
            bombMusic = game.add.audio('explosion');
            bombMusic.play();
            var message = game.add.text(Product.GAME_WIDTH - 450, Product.GAME_HEIGHT - 400, 'You missed a snack!', Product._fontStyleCommentary);
            game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                message.destroy();
            }, this);
        }
    },
    killBomb: function () {
        Product._health = 0;
    },
    updateScore: function (score) {
        // add points to the score
        Product._score += (Product.specialProduct == true) ? 6 : score;

        // update score text
        if ((Product._score % 30) == 0) {
            Product._firstLimit = Product._lastLimit;
            Product._lastLimit += 50;
        }
        Product._scoreText.setText(Product._score);
        scoreCommentary();
    }
};


/**
 *score commentary
 */
function scoreCommentary() {
    var score = Math.floor(Product._score / 100);
    switch (score) {
        case 1 :
            if (!_century)
                showScoreCommentary('Chak Chak Century');
            _century = true;
            break;
        case 2 :
            if (!_doubleCentury)
                showScoreCommentary('Chak Chak Hitman');
            _doubleCentury = true;
            break;
        case 3 :
            if (!_tripleCentury)
                showScoreCommentary('Chak Chak Triple Ton');
            _tripleCentury = true;
            break;
        case 4 :
            if (!_forthCentury)
                showScoreCommentary('Chak Chak Lara');
            _forthCentury = true;
            break;
        case 5 :
            if (!_fifthCentury)
                showScoreCommentary('Chak Chak ✋');
            _fifthCentury = true;
            break;
        default:
    }

}

function showScoreCommentary(text) {
    var message = game.add.text(Product.GAME_WIDTH - 480, Product.GAME_HEIGHT - 800, text, Product._fontStyleThick);
    message.anchor.setTo(0, 0);
    game.time.events.add(Phaser.Timer.SECOND * 3, function () {
        message.destroy();
    }, this);
}

/**
 * Update special product variables
 * @param value
 */
function updateSpecialProductData(value) {
    Product.specialProduct = value;
    Product._checkSpecialProduct = value;
    Product._checkTimeForSpecial = 0;
    Product._specialTimer = 0;
}

/**
 * generate random numbers
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Packet Collect
 * @param player
 * @param product
 */
function collectPackets(player, product) {
    var audioType;
    audioType = getRandomInt(0, (Product._audioType.length - 1));
    var x1 = player.getBounds().x;
    var x2 = player.getBounds().x + player.width;
    var product_x1 = product.getBounds().x;
    var product_x2 = product.getBounds().x + product.width;
    if (((x1 <= product_x1 + 10 && product_x1 <= x2) || (x1 <= product_x2 + 10 && product_x2 <= x2)) && (product.getBounds().y >= (player.getBounds().y + 5))) {
        var type;
        if (Product._bombType.indexOf(product.key) != -1) {
            removeMusic();
            bombMusic = game.add.audio('explosion');
            bombMusic.play();
            Product.item.killBomb();
        }
        else if (Product._productType.indexOf(product.key) != -1) {
            setScore(product);
            collectMusic = game.add.audio(Product._audioType[audioType]);
            collectMusic.play();
            type = 'normal';
        }
        else if (Product._specialProductType.indexOf(product.key) != -1) {
            setSpecialScore(product);
            scalePlayer();
            collectMusic = game.add.audio(Product._audioType[audioType]);
            collectMusic.play();
            type = 'special';
            Product.specialProduct = true;
            Product._checkSpecialProduct = true;
            Product._checkTimeForSpecial = 0;
        }
        /*Removes the product from the screen*/
        product.kill();
        player.animations.play('move');
        player.frame = 0;


        var text = "Chabaotastic!";
        if (type == "special") {
            text = 'Kya Chabaya!';
            commentary(product, text);
        } else if (Product._score % 200 == 0) {
            text = 'Chabao Boost!';
            commentary(product, text);
        } else if (Product._score % 80 == 0) {
            commentary(product, text);
        }

    }
    //  console.log('after catch special',Product.specialProduct);
}
/**
 * set score for different products
 */
function setScore(product) {
    var score = 0;
    if (Product._BhujiyaProduct.indexOf(product.key) != -1) {
        score = 1;
    } else if (Product._PopcornProduct.indexOf(product.key) != -1) {
        score = 2;
    } else if (Product._JuiceProduct.indexOf(product.key) != -1) {
        score = 4;
    } else if (Product._BiscuitProduct.indexOf(product.key) != -1) {
        score = 6;
    }
    Product.item.updateScore(score);
    displayScore(product, score);
}

/**
 * set score for Special products
 */
function setSpecialScore(product) {
    var score = 0;
    if (Product._specialProductType.indexOf(product.key) == 0) {
        score = 4;
    }
    else {
        score = 6;
    }
    Product.item.updateScore(score);
    displayScore(product, score);
}

/**
 * Make Denture big for special product
 */
function scalePlayer() {
    // player.scale.setTo(1.3, 1.3);
    /*todo make it zoom fron center */
    player.anchor.setTo(0.5, 0.5);
    // player.alpha = 1;
    // game.add.tween(player).to({ alpha: 0.5}, 100, Phaser.Easing.Back.Out, true); // working
    game.add.tween(player.scale).to({x: 1.5, y: 1.5}, 1800, Phaser.Easing.Bounce.Out, true);

    isZoom = 1;
    game.time.events.add(Phaser.Timer.SECOND * 7, function () {
        game.add.tween(player.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Linear.easeInOut, true);
        isZoom = 0;
        updateSpecialProductData(false);
    }, this);
}

/**
 * Commentary Code
 * @param product
 * @param text
 */
function commentary(product, text) {
    var message = null;
    var width = (product.x > Product.GAME_WIDTH - 250) ? Product.GAME_WIDTH - 250 : product.x;
    message = game.add.text(width, Product.GAME_HEIGHT - 340, text, Product._fontStyleCommentary);
    game.time.events.add(Phaser.Timer.SECOND * 1, function () {
        message.destroy();
    }, this);
}

/**
 * Display Score
 * @param product
 * @param text
 */
function displayScore(product, score) {
    var newScore = (Product.specialProduct == true) ? 6 : score;
    var showScore = game.add.text(product.x, product.y, '+' + newScore, Product._fontStyle);
    game.physics.arcade.enable(showScore);
    showScore.body.gravity.y = 100;
    showScore.anchor.set(-0.5, 3);
    game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {
        showScore.kill();
    }, this);
}

/**
 * Update Score
 */
function updateScore() {
    if (typeof(Storage) !== "undefined") {
        if (Product._score > storage.get("bestScore")) {
            storage.set("bestScore", Product._score);
        }
    }
    game.state.start('gameOver', true, false);
}

/**
 * Add Background Images
 */
function addBgImages() {
    var bg = document.getElementById("body");
    bg.className += " bganimate";
}

function removeMusic() {

    Product._bgMusic.destroy();

}

