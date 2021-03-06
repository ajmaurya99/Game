var storage = Storages.localStorage;
Product.Load = function (game) {
    Product.GAME_WIDTH = 640;
    Product.GAME_HEIGHT = 960;
    this.ready = false;
    this.loaderStyle={
        font: "40px Luckiest Guy, cursive",
        fill: "#ed1c24",
        align: "left",
        smoothed: "true"
    };
};
var text;
Product.Load.prototype = {
    preload: function () {
        text = game.add.text(this.world.centerX-100 , this.world.centerY + 120, '', this.loaderStyle);
        this.load.onFileComplete.add(this.fileComplete, this);
        this.load.onLoadComplete.add(this.loadComplete, this);

        preloadSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
        this.physics.arcade.enable(preloadSprite);
        preloadSprite.anchor.set(0.5, 0.5);
        preloadSprite.animations.add('load');
        preloadSprite.animations.play('load', 6, true);
        this.load.image('bg2', 'images/bg-2.jpg');
        this.load.image('bg3', 'images/bg-3.jpg');
        this.load.image('gameLogo', 'images/game-logo.png');
        this.load.image('gameLogo2', 'images/game-logo2.png');
        this.load.image('tastyTreatLogo', 'images/tasty-treat-logo.png');
        this.load.image('tastyTreatLogo2', 'images/tasty-treat-logo2.png');
        this.load.image('home', 'images/home.png');
        this.load.image('playButton', 'images/play-button.png');
        this.load.image('howToButton', 'images/how-to-play.png');
        this.load.image('pauseButton', 'images/pause.png');
        this.load.image('resumeButton', 'images/resume-button.png');
        this.load.image('restartButton', 'images/restart-button.png');
        this.load.image('screenOverlay', 'images/screen-overlay.png');
        this.load.image('close', 'images/close.png');
        this.load.image('ground', 'images/platform.png');
        this.load.image('alooBhujiya', 'images/Aloo-Bhujiya.png');
        this.load.image('appleJuice', 'images/AppleJuice.png');
        this.load.image('barbequeBhujiya', 'images/Barbeque-Bhujiya.png');
        this.load.image('cheesePopcorn', 'images/Cheese-Popcorn.png');
        this.load.image('chocolateCream', 'images/Chocolate-cream.png');
        this.load.image('digestive', 'images/Digestive.png');
        this.load.image('marie', 'images/Marie.png');
        this.load.image('mixedFruitJuice', 'images/MixedFruitJuice.png');
        this.load.image('periPeriBhujiya', 'images/Peri-Peri-Bhujiya.png');
        this.load.image('seaSaltAndPepperPopcorn', 'images/Sea-Salt-and-Pepper-Popcorn.png');
        this.load.image('bat', 'images/bat.png');
        this.load.image('bells', 'images/bells.png');
        this.load.image('boll', 'images/boll.png');
        this.load.spritesheet('denture', 'images/denture.png', 150, 150);
        this.load.audio('bgsound', 'audio/background-sound.mp3');
        this.load.audio('chak1', 'audio/Chak-1.mp3');
        this.load.audio('chak2', 'audio/Chak-2.mp3');
        this.load.audio('chak3', 'audio/Chak-3.mp3');
        this.load.audio('chak4', 'audio/Chak-4.mp3');

        this.load.audio('explosion', 'audio/bomb.mp3');
        this.load.image('volumeOn', 'images/volume-on.png');
        this.load.image('volumeOff', 'images/volume-off.png');
        this.load.image('chabaoText', 'images/chabao-text.png');
        this.load.image('howToPlayImage', 'images/howToPlayImage.png');
        this.load.image('gameOverText', 'images/game-over-text.png');
        this.load.image('replay', 'images/replay.png');
        this.load.image('home', 'images/home.png');
        this.load.image('musicOn', 'images/music-on.png');
        this.load.image('musicOff', 'images/music-off.png');
        this.load.image('pausedText', 'images/paused-text.png');
        this.load.spritesheet('specialProduct1', 'images/specialProduct1.png', 100, 100, 3);
        this.load.spritesheet('specialProduct2', 'images/specialProduct2.png', 100, 100, 3);
        this.load.spritesheet('glow1', 'images/glow1.png', 100, 100, 3);
        this.load.spritesheet('glow2', 'images/glow2.png', 100, 100, 3);
        this.load.spritesheet('out', 'images/Out.png', 150, 150,5);
        this.load.spritesheet('gesture', 'images/gesture.png', 293,150,5);

        this.load.image('greeting1', 'images/greeting1.png');
        this.load.image('greeting2', 'images/greeting2.png');
        this.load.image('greeting3', 'images/greeting3.png');
        this.load.image('greeting4', 'images/greeting4.png');
        this.load.image('greeting5', 'images/greeting5.png');
        this.load.image('greeting6', 'images/greeting6.png');
        this.load.image("clouds", "images/clouds.png");
        this.load.image("leaderBoard", "images/leaderBoard.png");
    },
    fileComplete: function(progress) {
        text.setText("Loading  "+progress + "%");
    },
    loadComplete: function(){
        this.ready = true;
    },
    create: function () {
        if(this.ready === true)
        {
            game.state.start('menu', true, false);
        }

    }
};
