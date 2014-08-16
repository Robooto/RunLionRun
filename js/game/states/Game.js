BasicGame.Game = function(game) {


};

BasicGame.Game.prototype = {

    create: function() {

        this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
        this.background.autoScroll(-200, 0);

        this.hud = this.game.add.sprite(0, 0, 'hud');

        // group for clouds
        this.clouds = this.game.add.group();
        this.addCloud();

        this.LION_JUMP = -650;
        this.ACCELERATION = 1500; // pixels/second/second

        this.ground = this.game.add.tileSprite(0, this.game.world.height - 65, this.game.width, 65, 'ground');
        this.ground.autoScroll(-400, 0); // ground moves faster for paralaxx effect
        game.physics.arcade.enable(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;
        this.ground.body.setSize(game.world.width, 50, 0, 18);

        this.lion = game.add.sprite(game.world.width / 2 - 100, this.game.world.height - 200, 'lion');
        this.lion.scale.setTo(2, 2);
        this.lion.anchor.setTo(0.5);
        game.physics.arcade.enable(this.lion);
        this.lion.animations.add('run', [9, 10, 11, 12, 13, 14], 15, true);
        var punch = this.lion.animations.add('punch', [15, 16, 17], 10, false);

        punch.onComplete.add(function() {
            this.lion.animations.play('run');
        }, this);
        this.lion.animations.play('run');
        //this.lion.body.setSize(30, 30, 0, 0);
        this.lion.body.collideWorldBounds = true; // lion stops at world bounds
        this.lion.body.gravity.y = 2600;
        this.lion.body.drag.setTo(0, 0); // x, y
        this.lion.body.maxVelocity.setTo(500, 500 * 10); // x, y
        this.lion.health = 5; // lives

        // Init emitter for lion deaths
        this.lionEmitter = game.add.emitter(0, 0, 50);
        this.lionEmitter.makeParticles('lionpixel');
        this.lionEmitter.setYSpeed(-400, 100);
        this.lionEmitter.setXSpeed(-100, 250);
        this.lionEmitter.minParticleScale = 1;
        this.lionEmitter.maxParticleScale = 2;
        this.lionEmitter.gravity = 300;

        this.lionBonus = 0;
        this.activateDoubleJump = false; // debugging remove when done

        this.jumpAmount = 0;

        this.canVariableJump = true; // flag for variable jumping

        // enemy test
        this.walls = game.add.group();
        this.walls.enableBody = true;
        this.walls.createMultiple(4, 'walltest');
        this.walls.createMultiple(4, 'medWall');
        this.walls.createMultiple(4, 'tallWall');
        this.nextWall = game.time.now + 500; // spawn timer every 1/2 second

        // scores
        // score = 0; // global for top score
        this.score = 0;
        this.lionsSaved = 0;

        // create candy group
        this.candyGroup = this.game.add.group();
        this.game.physics.enable(this.candyGroup, Phaser.Physics.ARCADE);
        this.candyGroup.enableBody = true;
        this.candyGroup.createMultiple(3, 'candy1');
        this.candyGroup.createMultiple(3, 'candy2');
        this.candyGroup.createMultiple(3, 'candy3');

        this.nextCandy = game.time.now + 1000; // spawn timer

        // Init emitter for candy deaths
        this.candyEmitter = game.add.emitter(0, 0, 50);
        this.candyEmitter.makeParticles('candypixel', [0, 1, 2, 3, 4]);
        this.candyEmitter.setYSpeed(-400, 100);
        this.candyEmitter.setXSpeed(-100, 250);
        this.candyEmitter.minParticleScale = 1;
        this.candyEmitter.maxParticleScale = 2;
        this.candyEmitter.gravity = 300;

        // Init emitter for wall explosions
        this.explosionEmitter = game.add.emitter(0, 0, 50);
        this.explosionEmitter.makeParticles('pixel');
        this.explosionEmitter.setYSpeed(-400, 100);
        this.explosionEmitter.setXSpeed(-100, 250);
        this.explosionEmitter.minParticleScale = 1;
        this.explosionEmitter.maxParticleScale = 2;
        this.explosionEmitter.gravity = 300;



        // Add bonus Bar
        this.bonusBar = this.game.add.sprite(game.world.width / 2 + 50, 30, 'progressBar');
        this.bonusBar.anchor.setTo(0.5, 0.5);
        this.bonusBar.scale.setTo(0, 1.5);

        // group for hurt lions
        this.hurtLions = this.game.add.group();
        this.nextHurtLion = game.time.now + 3000;

        // group for fists
        this.fists = this.game.add.group();
        this.nextFist = game.time.now + 2000; // spawn timer

        // Add a cloud every 2.8 seconds
        game.time.events.loop(4800, this.addCloud, this);

        // Add a mute button
        this.muteButton = game.add.button(game.world.width - 60, 15, 'mute', this.toggleSound, this);
        this.muteButton.input.useHandCursor = true;

        if (!BasicGame.music.isPlaying) {
            this.muteButton.frame = 1;
        }


        // Add movement keys
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);

        // capture the wasd keys
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        // add mobile inputs if on mobile
        if (!game.device.desktop) {
            // display the mobile inputs
            this.addMobileInputs();
        }

        this.scoreLabel = game.add.text(20, 20, 'Score: ' + this.score, {
            font: '20px Arial',
            fill: '#ffffff'
        });

        this.savedLabel = game.add.text(150, 20, 'Lions Saved: ' + this.lionsSaved, {
            font: '20px Arial',
            fill: '#ffffff'
        });

        this.livesLabel = game.add.text(320, 20, 'Lives: ' + this.lion.health, {
            font: '20px Arial',
            fill: '#ffffff'
        });

        // increase score as game progresses
        game.time.events.loop(Phaser.Timer.SECOND, function() {
            this.addScore(10);
        }, this);

        // game timer
        this.gameTimer = this.game.time.now;

        // add sounds
        this.wallExplode = this.game.add.audio('wall');
        this.fistExplode = this.game.add.audio('fistExplode');
        this.fistHit = this.game.add.audio('fistHit');
        this.jumpSound = this.game.add.audio('jump');
        this.saveSound = this.game.add.audio('rescue');
        this.candy1Sound = this.game.add.audio('candy1');
        this.candy2Sound = this.game.add.audio('candy2');
        this.candy3Sound = this.game.add.audio('candy3');
        this.lionKillSound = this.game.add.audio('lionKill');

    },

    update: function() {

        // Collisions
        this.game.physics.arcade.collide(this.lion, this.ground);

        game.physics.arcade.collide(this.hurtLions, this.ground);

        game.physics.arcade.overlap(this.lion, this.hurtLions, this.hitHurtLions, null, this);

        game.physics.arcade.overlap(this.lion, this.walls, this.hitWall, null, this);

        game.physics.arcade.overlap(this.lion, this.candyGroup, this.hitCandy, null, this);

        game.physics.arcade.overlap(this.lion, this.fists, this.hitFist, null, this);

        // call jump function
        this.jumpLion2();

        this.moveLion(); // lion movement

        this.bonus(this.lion); // lion bonus

        // Create new enemies faster and faster
        // At first, one every 1.5 second, and finally one evey 800ms
        if (this.nextWall < game.time.now) {
            var start = 3000,
                end = 1700,
                scoreholder = 1000;
            var delay = Math.max(start - (start - end) * this.score / scoreholder, end);

            this.addWall();

            this.nextWall = game.time.now + delay;
        }

        // Add candy bonuses
        if (this.game.time.now > this.nextCandy) {
            this.nextCandy = game.time.now + 13000;
            this.addCandy();
        }

        // Add fists
        if (this.nextFist < game.time.now) {
            var start = 5000,
                end = 2500,
                scoreholder = 1000;
            var delay = Math.max(start - (start - end) * this.score / scoreholder, end);

            this.addFist();
            this.addHurtLion();

            this.nextFist = game.time.now + delay;
        }


    },

    moveLion: function() {

        // move lion left
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.wasd.left.isDown || this.moveLeft) {
            this.lion.body.velocity.x = -300;

            // move lion right
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.wasd.right.isDown || this.moveRight) {
            this.lion.body.velocity.x = 300;
        } else {
            this.lion.body.velocity.x = 0;
        }


    },

    jumpLion2: function() {
    var onTheGround = this.lion.body.touching.down;

    if (this.activateDoubleJump) {
        if (onTheGround) this.jumpAmount = 0;
    } else {
        if (onTheGround) this.jumpAmount = 4;
    }

    // Jump the player if the spacebar is pressed
        // The longer the spacebar is pressed, the longer the jump
        if ((this.input.keyboard.justPressed(Phaser.Keyboard.UP) || this.input.keyboard.justPressed(Phaser.Keyboard.W) || this.game.input.activePointer.justPressed(65)) && this.jumpAmount < 5) {
            this.lion.body.velocity.y = this.LION_JUMP;
            this.timeJump = 0;
            this.jumpAmount++;
        }
        else if ((this.input.keyboard.isDown(Phaser.Keyboard.UP) || this.input.keyboard.isDown(Phaser.Keyboard.W) || this.game.input.activePointer.isDown) && this.timeJump < 8) {
            this.timeJump += 1;
            this.lion.body.velocity.y = this.LION_JUMP;
        }
        else if (this.input.keyboard.justReleased(Phaser.Keyboard.UP) || this.input.keyboard.justReleased(Phaser.Keyboard.W) || this.game.input.activePointer.justReleased()) {
            this.timeJump = 8;
            
            
        }

         // Play the correct animation
        if (this.lion.body.touching.down == false) {
            this.lion.frame = 10;
        }

        // lion rotates while space bar is pressed
        if (this.lion.body.velocity.y < 0) {

            if (this.lion.angle > -20) {
                this.lion.angle -= 2; // player won't rotate less than min angle
            }
        } else {
            if (this.lion.angle < 0) {
                this.lion.angle += 1.5; // reset the angle if below 0
            }
        }



    },

    


    bonus: function(lion) {

        if (this.lionBonus == 0) {
            this.LION_JUMP = -650;
            //   this.lion.body.setSize(40, 30, 20, 25);
            this.activateDoubleJump = false; // disable double jumping
            game.add.tween(lion.scale).to({
                x: 2,
                y: 2
            }, 200).start();
        }

        if (this.lionBonus == 1) {
            this.LION_JUMP = -900;
            //   this.lion.body.setSize(40, 30, 20, 25);
            game.add.tween(lion.scale).to({
                x: 2,
                y: 2
            }, 200).start();
        }

        if (this.lionBonus == 2) {
            //   this.lion.body.setSize(40, 30, 20, 20);
            game.add.tween(lion.scale).to({
                x: 3,
                y: 3
            }, 200).start();
        }

        if (this.lionBonus == 3) {
            this.activateDoubleJump = true; // enable double jumping
            //   this.lion.body.setSize(30, 30, 5, 15);
            game.add.tween(lion.scale).to({
                x: 1,
                y: 1
            }, 200).start();
        }

    },

    addWall: function() {
        // Get an enemy from the group
        var wall = this.walls.getRandom();

        while (wall.alive) {
            wall = this.walls.getRandom();
        }

        wall.reset(game.world.width, game.world.height - 52);

        // Init the wall
        wall.anchor.setTo(0, 1);
        wall.body.velocity.x = -400;

        // Kill the wall when out of the screen
        wall.checkWorldBounds = true;
        wall.outOfBoundsKill = true;

    },

    addCandy: function() {

        // since I have different sprites in this group I am picking a random sprite

        var candy = this.candyGroup.getRandom();

        // if the sprite is alive pick another one
        while (candy.alive) {
            candy = this.candyGroup.getRandom();
        }

        candy.reset(game.world.width /* + 50*/ , game.world.height - 81);
        candy.animations.add('passive');
        candy.animations.play('passive', 15, true);
        candy.anchor.setTo(0.5, 0.5);

        // candy1 has a different orientation
        if (candy.key == 'candy1') {
            candy.scale.setTo(-2, 2);
        } else {
            candy.scale.setTo(2, 2);
        }

        candy.body.velocity.x = -350;

        // Kill the candy when out of the screen
        candy.checkWorldBounds = true;
        candy.outOfBoundsKill = true;
    },

    addFist: function() {
        // creating our fists
        var x = game.rnd.pick([0, game.world.width]); // puts the fist on the right side
        var y = this.game.rnd.integerInRange(50, game.world.height - 80); // between top and above ground

        // grab first dead fist and if no fist is dead create one calling our prefab
        var fist = this.fists.getFirstExists(false);
        if (!fist) {
            fist = new Fist(this.game, 0, 0, this.lion); // will set x and y later
            this.fists.add(fist); // add fist to the fists group
        }

        fist.reset(x, y); // playce the fist on the screen
        fist.revive(); // revive the fist which calls our on revive method

    },

    addHurtLion: function() {
        // add hurt lions
        var x = game.world.width;
        var y = 0;
        // grab first dead lion and if none create a new one
        var hurtLion = this.hurtLions.getFirstExists(false);

        if (!hurtLion) {
            hurtLion = new HurtLion(this.game, 0, 0);
            this.hurtLions.add(hurtLion);
        }

        hurtLion.reset(x, y);
        hurtLion.revive();
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

    hitWall: function(lion, wall) {
        //     console.log(wall.key);

        // if lion isn't big get hurt
        if (this.lionBonus !== 2) { // debugging switch to 2
            this.damageLion(lion);
        }

        // Kill the wall
        wall.kill();
        this.wallExplode.play();

        // Emitt particles
        this.explosionEmitter.x = wall.x;
        this.explosionEmitter.y = -30 + wall.y;
        this.explosionEmitter.start(true, 800, null, 30);

    },

    hitCandy: function(lion, candy) {
        // eating the candy gives the lion a bonus
        var bonus;
        var color;
        if (candy.key == 'candy1') {
            this.lionBonus = 1;
            bonus = 'HIGH JUMP!';
            color = '#CCC900';
            this.candy1Sound.play();
        } else if (candy.key == 'candy2') {
            this.lionBonus = 2;
            bonus = 'LION SMASH!';
            color = '#F20C0C';
            this.candy2Sound.play();
        } else {
            this.lionBonus = 3;
            bonus = 'DOUBLE JUMP!';
            color = '#E8AB1C';
            this.candy3Sound.play();
        }

        var bonusText = game.add.text(lion.x - 50, lion.y - 100, bonus, {
            font: 'bold 26px Arial',
            fill: color
        });

        game.add.tween(bonusText).to({
            alpha: 0
        }, 1000).start();

        this.bonusBar.scale.setTo(1.5, 1.5);
        game.add.tween(this.bonusBar.scale).to({
            x: 0
        }, 10000).start();

        game.time.events.add(10000, function() {
            this.lionBonus = 0;
        }, this);


        // Kill the player
        candy.kill();

        // Emitt particles
        this.candyEmitter.x = candy.x;
        this.candyEmitter.y = candy.y;
        this.candyEmitter.start(true, 800, null, 30);

        this.flyingText(25, lion.x, lion.y);

    },

    hitFist: function(lion, fist) {
        fist.kill();

        // if lion isn't big get hurt
        if (this.lionBonus !== 2) { // debugging switch to 2
            this.damageLion(lion);
            this.fistHit.play();
        } else {
            // call particles
            fist.death();
            this.fistExplode.play();

        }

    },

    hitHurtLions: function(lion, hurtLion) {
        hurtLion.kill();
        this.saveSound.play();

        // save the lions!
        var dummyLion = new HurtLion(this.game, hurtLion.x, hurtLion.y);
        this.game.add.existing(dummyLion);
        dummyLion.frame = 1;

        var saveTween = this.game.add.tween(dummyLion).to({
            x: 220,
            y: 20
        }, 300, Phaser.Easing.Linear.NONE, true);

        saveTween.onComplete.add(function() {
            dummyLion.destroy();
            // add save lion here
            this.savedLabel.text = 'Lions Saved: ' + this.lionsSaved;
        }, this);

        this.lionsSaved++;

        this.flyingText(50, lion.x, lion.y);
    },

    damageLion: function(lion) {
        lion.alpha = 0;

        var tween = this.game.add.tween(lion).to({
            alpha: 1
        }, 50, Phaser.Easing.Linear.NONE, true, 0, 5, true);

        tween.onComplete.add(function() {
            lion.alpha = 1;
        }, this);


        this.flyingText(-1, lion.x, lion.y);
    },

    addScore: function(score) {
        this.score += score; // add to the score

        this.scoreLabel.text = 'Score: ' + this.score; // update the score
    },

    flyingText: function(amount, x, y) {
        var amountDisplay = amount;
        var destination;

        if (amount > 0) {
            amountDisplay = '+' + amount;
        }

        var flyText = game.add.text(x + 15, y - 50, amountDisplay, {
            font: 'bold 26px Arial',
        });

        if (amount < 0) {
            destination = 350;
            flyText.fill = '#ff3737';
        } else {
            destination = 50;
            flyText.fill = '#2cd82c';
        }

        game.add.tween(flyText).to({
            x: destination,
            y: 30
        }, 1000, Phaser.Easing.Quadratic.In, true).onComplete.add(function(text) {
            text.destroy();
            if (amount < 0) {
                this.lion.health--;
                this.livesLabel.text = "Lives: " + this.lion.health;
                // end game condition
                if (this.lion.health == 0) {
                    this.endGame();
                }
            } else {
                this.addScore(amount);
            }
        }, this);


    },

    endGame: function() {
        this.nextWall = Number.MAX_VALUE;
        this.nextCandy = Number.MAX_VALUE;
        this.nextFist = Number.MAX_VALUE;
        this.nextHurtLion = Number.MAX_VALUE;
        this.jumpSound.volume = 0;

        var scoreboard = new Scoreboard(this.game);

        this.lion.kill();
        this.lionKillSound.play();

        // Emitt particles
        this.lionEmitter.x = this.lion.x;
        this.lionEmitter.y = this.lion.y;
        this.lionEmitter.start(true, 800, null, 50);

        // call the 'startMenu' function in 1000ms
        game.time.events.add(2000, scoreboard.show(this.score, this.lionsSaved, this.gameTimer), this);

        game.time.events.removeAll();

        this.walls.destroy();
        this.candyGroup.destroy();
        this.hurtLions.destroy();
        this.fists.destroy();
        this.clouds.destroy();

        this.ground.stopScroll();
        this.background.stopScroll();



    },

    render: function() {
        //  game.debug.body(this.lion);
        //  game.debug.body(this.ground);
        // game.debug.bodyInfo(this.lion, 32, 32);
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

    // adding mobile specific buttons

    addMobileInputs: function() {

        // Add the jump button
        this.jumpButton = this.game.add.sprite(this.game.width - 150, this.game.height - 133, 'jumpButton');
        this.jumpButton.inputEnabled = true;
        this.jumpButton.alpha = 0.5; // slightly transparent

        // this.jumpButton.events.onInputDown.add(this.jumpPlayer, this); // adding jump

        // movement variables
        this.moveLeft = false;
        this.moveRight = false;


        // Add the move left button
        this.leftButton = this.game.add.sprite(50, this.game.height - 133, 'leftButton');
        this.leftButton.inputEnabled = true;
        this.leftButton.alpha = 0.5;
        this.leftButton.events.onInputOver.add(function() {
            this.moveLeft = true;
        }, this);
        this.leftButton.events.onInputOut.add(function() {
            this.moveLeft = false;
        }, this);
        this.leftButton.events.onInputDown.add(function() {
            this.moveLeft = true;
        }, this);
        this.leftButton.events.onInputUp.add(function() {
            this.moveLeft = false;
        }, this);


        // Add the move right button
        this.rightButton = this.game.add.sprite(130, this.game.height - 133, 'rightButton');
        this.rightButton.inputEnabled = true;
        this.rightButton.alpha = 0.5;
        this.rightButton.events.onInputOver.add(function() {
                this.moveRight = true;
            },
            this);
        this.rightButton.events.onInputOut.add(function() {
                this.moveRight = false;
            },
            this);
        this.rightButton.events.onInputDown.add(function() {
            this.moveRight = true;
        }, this);
        this.rightButton.events.onInputUp.add(function() {
                this.moveRight = false;
            },
            this);
    }

};