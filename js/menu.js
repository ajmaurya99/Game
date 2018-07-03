Product.Menu = function (game) {
};
var storage = Storages.localStorage;
Product.Menu.prototype = {
    preload: function () {
    },
    create: function () {
        // game.input.onDown.add(gofull, this);
        var tastyTreatLogo = this.add.image(this.world.centerX, this.world.centerY - 375, 'tastyTreatLogo2');
        tastyTreatLogo.anchor.set(0.5, 0.5);

        var gameLogo = this.add.image(this.world.centerX, this.world.centerY - 210, 'gameLogo2');
        gameLogo.anchor.set(0.5, 0.5);

        var chabaoText = this.add.image(this.world.centerX, this.world.centerY - 23, 'chabaoText', Product._fontStyle);
        chabaoText.anchor.set(0.5, 0.5);

        this.time.events.add(Phaser.Timer.SECOND * 0.2, function () {
            var text = this.add.text(this.world.centerX, this.world.centerY + 70, 'Many more prizes up for grabs!');
            text.font = 'Luckiest Guy, cursive';
            text.fontSize = 30;
            text.fontWeight = 'normal';
            text.fill = '#ed1c24';
            text.align = 'center';
            text.smoothed = true;
            text.anchor.set(0.5, 0.5);
        }, this);

        var playButton = this.add.button(this.world.centerX, this.world.centerY + 170, 'playButton', this.play, this);
        playButton.anchor.set(0.5, 0.5);

        var howToButton = this.add.button(this.world.centerX, this.world.centerY + 290, 'howToButton', this.howToPlay, this);
        howToButton.anchor.set(0.5, 0.5);

        var logout = game.add.text(game.world.centerX, game.world.centerY + 360, 'Logout', Product._fontStyleLogout);
        logout.anchor.set(0.5, 0.5);
        logout.inputEnabled = true;
        logout.input.useHandCursor = true;
        logout.events.onInputDown.add(this.logOut, this);
        var underline = this.game.add.graphics(logout.left, logout.bottom - 6);
        /*Specify the line (size, color)*/
        underline.lineStyle(2, 0xE21838);
        /*Location to start drawing the line (x, y)*/
        underline.moveTo(0, 0);
        /*Draw a line the width of objectText's string*/
        underline.lineTo(logout.width, 0);

        /*var logOutButton = this.add.button(this.world.centerX, this.world.centerY + 370, 'logout', this.logOut, this);
         logOutButton.anchor.set(0.5, 0.5);*/
        fullHeight();

    },
    howToPlay: function () {
        custom_event('HowToPlayClick', 'How To Play');
        this.state.start('howToPlay');
    },
    play: function () {
        custom_event('PlayClick', 'Play');
        this.state.start('play', true, false);
    },
    logOut: function () {
        custom_event('LogOutClick', 'Log Out');
        storage.remove('bestScore');
        storage.remove('user');
        location.reload();
    }
};
/*
 Add height 100vh to body
 */
function fullHeight() {
    var bg = document.getElementById("body");
    bg.className += " full-height";
}

function custom_event($event, $category) {
    dataLayer.push({
        'event': $event,
        'formName': $category
    });
}