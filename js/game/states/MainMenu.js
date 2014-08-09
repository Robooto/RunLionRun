BasicGame.MainMenu = function(game) {

};

BasicGame.MainMenu.prototype = {

    create: function() {

        this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
        this.background.autoScroll(-200, 0);

        this.ground = this.game.add.tileSprite(0, this.game.world.height - 65, this.game.width, 65, 'ground');
        this.ground.autoScroll(-400, 0); // ground moves faster for paralaxx effect
        game.physics.arcade.enable(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;
        this.ground.body.setSize(game.world.width, 50, 0, 18);

        // add in lion
        this.lion = game.add.sprite(100, this.game.world.height - 100, 'lion');
        this.lion.scale.setTo(2, 2);
        this.lion.anchor.setTo(0.5);
        game.physics.arcade.enable(this.lion);
        this.lion.animations.add('run', [9, 10, 11, 12, 13, 14], 15, true);
        this.lion.animations.play('run');

        // add in candy
        this.candy = game.add.sprite(this.game.width - 100, this.game.height - 81, 'candy3');
        game.physics.arcade.enable(this.candy);
        this.candy.animations.add('passive');
        this.candy.animations.play('passive', 15, true);
        this.candy.anchor.setTo(0.5, 0.5);
        this.candy.scale.setTo(2, 2);

        // add in clouds
        // group for clouds
        this.clouds = this.game.add.group();
        this.addCloud();

        // Add a cloud every 4.8 seconds
        game.time.events.loop(4800, this.addCloud, this);

        // style
        var style = {
            font: '25px Arial',
            fill: '#ffffff',
            stroke: '#CECECE',
            strokeThickness: 4
        };

        // add in music
        BasicGame.music = this.add.audio('backgroundMusic');
        BasicGame.music.play('', 0, 0.3, true);

        this.selectSound = this.add.audio('selectSound');

        // Name of the game
        var nameLabel = game.add.bitmapText(game.world.centerX, -100, '4d', 'Run Lion Run', 60);
        nameLabel.x = this.game.width / 2 - (nameLabel.textWidth / 2);
        game.add.tween(nameLabel).to({ y: 70 }, 1000, Phaser.Easing.Bounce.Out).start();

        if (game.device.desktop) {
            var text = 'Press w or up arrow to play';
        } else {
            var text = 'Tap the screen to play';
        }

        // group for fists
        this.fists = this.game.add.group();
        game.time.events.loop(4800, function () {this.addFist(startLabel)}, this);

        // How to start the game
        var startLabel = game.add.text(game.world.centerX, game.world.centerY + 25, text, style);

        startLabel.anchor.setTo(0.5, 0.5);
        startLabel.alpha = 0;
        game.add.tween(startLabel).delay(500).to({ alpha: 1}, 1000).start();
        game.add.tween(startLabel).to({
            angle: -2
        }, 500).to({
            angle: 2
        }, 500).loop().start();

        var scoreName = localStorage.getItem('runLionName');

        var highScore = false;

        if(highScore) {
            var highScoreText = game.add.text(game.world.centerX, game.world.centerY-50, 'Top Score: ' + highScore, style);
            highScoreText.anchor.setTo(0.5, 0.5);
        }

        // Add a mute button
        this.muteButton = game.add.button(game.world.width - 60, 20, 'mute', this.toggleSound, this);
        this.muteButton.input.useHandCursor = true;

        if (!BasicGame.music.isPlaying) {
            this.muteButton.frame = 1;
        }

if (game.device.desktop) {
        // Start the game when the up arrow key is pressed
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        upKey.onDown.addOnce(this.start, this);
        wKey.onDown.addOnce(this.start, this);
    } else {
        this.game.input.onDown.addOnce(this.start, this);
    }

    },

    toggleSound: function() {
            if (this.muteButton.frame === 0) {
            this.muteButton.frame = 1;
            BasicGame.music.pause(); // music is global so it will stay off
        } else {
            this.muteButton.frame = 0;
            BasicGame.music.resume();
        }
    },

    addCloud: function() {

        // Get a cloud from the group
        var cloud = this.clouds.getFirstExists(false);

        if (!cloud) {
            cloud = new Clouds(this.game, 0, 0);
            this.clouds.add(cloud);
        }

        cloud.reset(game.world.width, this.game.rnd.integerInRange(80, 150));
        cloud.revive();

    },

    addFist: function(location) {
        // creating our fists
        var x = game.rnd.pick([0, game.world.width]); // puts the fist on the right side
        var y = this.game.rnd.integerInRange(50, game.world.height - 80); // between top and above ground

        // grab first dead fist and if no fist is dead create one calling our prefab
        var fist = this.fists.getFirstExists(false);
        if (!fist) {
            fist = new Fist(this.game, 0, 0, location); // will set x and y later
            this.fists.add(fist); // add fist to the fists group
        }

        fist.reset(x, y); // playce the fist on the screen
        fist.revive(); // revive the fist which calls our on revive method

    },

    start: function() {
        this.selectSound.play();
        game.state.start('Game');
    }

};