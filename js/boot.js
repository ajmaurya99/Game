WebFontConfig = {
    google: {
        families: ['Luckiest Guy']
    }

};
var Product = {};
Product.Boot = function (game) {
};
Product.Boot.prototype = {
    preload: function () {
        this.load.spritesheet('loading', 'images/loading.png', 150, 150, 12);
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.load.image('bg1', 'images/bg-1.jpg');
    },
    create: function () {
        this.input.maxPointers = 1;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.updateLayout();
        this.state.start('load');
    },
};