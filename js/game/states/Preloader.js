BasicGame.Preloader = function(game) {

    this.ready = false;

};

BasicGame.Preloader.prototype = {

    preload: function() {

        // Add a loading label 
        var loadingLabel = this.add.text(this.game.world.centerX, game.world.centerY - 50, 'loading...', {
            font: '30px Arial',
            fill: '#ffffff'
        });
        loadingLabel.anchor.setTo(0.5, 0.5);

        // Add a progress bar
        var progressBar = this.add.sprite(this.game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        progressBar.scale.setTo(2);
        this.load.setPreloadSprite(progressBar);

        // Load all assets
        this.load.spritesheet('mute', 'assets/images/muteButton.png', 28, 22);
        this.load.image('ground', 'assets/images/ground.png'); // ground

        //	Lion assets
        this.game.load.spritesheet('lion', 'assets/images/LionSpriteSheet_64_47_18.png', 64, 47, 18); // name , location
        this.game.load.image('lionpixel', 'assets/images/lionpixel.png');

        // wounded lion
        this.game.load.spritesheet('hurtlion', 'assets/images/woundedlion.png', 80, 49);

        this.game.load.image('walltest', 'assets/images/walltest.png'); // short wall
        this.game.load.image('medWall', 'assets/images/medWall.png');
        this.game.load.image('tallWall', 'assets/images/tallWall.png');

        // Candy Assets
        this.game.load.spritesheet('candy1', 'assets/images/MintyMan_32_32_5.png', 32, 32, 5);
        this.game.load.spritesheet('candy2', 'assets/images/CandyCorn_32_32_5.png', 32, 32, 5);
        this.game.load.spritesheet('candy3', 'assets/images/JellyBean_32_32_5.png', 32, 32, 5);
        this.game.load.spritesheet('candypixel', 'assets/images/candypixel.png', 5, 5, 2);

        // explosion
        this.game.load.image('pixel', 'assets/images/pixel.png');

        // fist
        this.game.load.image('fist', 'assets/images/punch.png');

        // fist particles
        this.game.load.image('fistpixel', 'assets/images/fistpixel.png');

        //clouds
        this.game.load.image('clouds', 'assets/images/cloud_3.png');

        //background
        this.game.load.image('background', 'assets/images/bg_desert2.png');

        //hud
        this.game.load.image('hud', 'assets/images/hud.png');

        // touch buttons

        this.game.load.image('jumpButton', 'assets/images/jumpButton.png');
        this.game.load.image('rightButton', 'assets/images/rightButton.png');
        this.game.load.image('leftButton', 'assets/images/leftButton.png');

        // leaderboard button
        this.game.load.spritesheet('leaderboard', 'assets/images/leaderboard_164_48_2.png', 164, 48, 2);

        // fonts
        this.load.bitmapFont('4d', 'assets/fonts/belion.png', 'assets/fonts/belion.fnt');

        // sounds
        this.game.load.audio('wall', ['assets/sounds/Explosion_21.mp3', 'assets/sounds/Explosion_21.ogg']);
        this.game.load.audio('fistExplode', ['assets/sounds/Explosion_22.mp3', 'assets/sounds/Explosion_22.ogg']);
        this.game.load.audio('fistHit', ['assets/sounds/Hit-hurt_9.mp3', 'assets/sounds/Hit-hurt_9.ogg']);
        this.game.load.audio('jump', ['assets/sounds/Jump_5.mp3', 'assets/sounds/Jump_5.ogg']);
        this.game.load.audio('rescue', ['assets/sounds/Pickup-coin_25.mp3', 'assets/sounds/Pickup-coin_25.ogg']);
        this.game.load.audio('candy1', ['assets/sounds/Powerup_17.mp3', 'assets/sounds/Powerup_17.ogg']);
        this.game.load.audio('candy2', ['assets/sounds/Powerup_5.mp3', 'assets/sounds/Powerup_5.ogg']);
        this.game.load.audio('candy3', ['assets/sounds/Powerup_7.mp3', 'assets/sounds/Powerup_7.ogg']);
        this.game.load.audio('lionKill', ['assets/sounds/Explosion_63.mp3', 'assets/sounds/Explosion_63.ogg']);
        this.game.load.audio('selectSound', ['assets/sounds/Pickup-coin_43.mp3', 'assets/sounds/Pickup-coin_43.ogg']);

        // music
        this.game.load.audio('backgroundMusic', ['assets/sounds/This_Isnt_Science.mp3', 'assets/sounds/This_Isnt_Science.ogg']);

    },

    create: function() {

        //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        //this.preloadBar.cropEnabled = false;

    },

    update: function() {

        //	You don't actually need to do this, but I find it gives a much smoother game experience.
        //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
        //	You can jump right into the menu if you want and still play the music, but you'll have a few
        //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
        //	it's best to wait for it to decode here first, then carry on.

        //	If you don't have any music in your game then put the game.state.start line into the create function and delete
        //	the update function completely.

        if ( this.cache.isSoundDecoded('backgroundMusic') &&  this.ready == false) {
            this.ready = true;
            this.state.start('MainMenu'); // straight into game for now
        }

    }

};