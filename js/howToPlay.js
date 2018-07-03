Product.HowToPlay = function (game) {
};
Product.HowToPlay.prototype = {
    preload: function () {
        preloadSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
        this.physics.arcade.enable(preloadSprite);
        preloadSprite.anchor.set(0.5, 0.5);
        preloadSprite.animations.add('load');
        preloadSprite.animations.play('load', 6, true);
        // this.load.image('howToPlaySprite', 'images/how-to-play-image.png', 373, 716, 4);
        this.add.image('howToPlayImage', 'images/howToPlayImage.png');
        this.add.image('letsPlayButton', 'images/lets-play.png');

    },
    create: function () {
        this.scale.refresh();
        preloadSprite.kill();
        var sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'howToPlayImage');
        this.physics.arcade.enable(sprite);
        sprite.anchor.set(0.5, 0.6);
        sprite.animations.add('load');
        sprite.animations.play('load', 4, true);

        var letsPlayButton = this.add.button(this.world.centerX, this.world.centerY, 'playButton', this.letsPlayButton, this);
        letsPlayButton.anchor.set(0.5);
        letsPlayButton.y = sprite.y + (sprite.height / 2) + 20;

    },
    letsPlayButton: function () {
        custom_event('PlayClick', 'Play');
        this.state.start('play', true, false);
    }
};