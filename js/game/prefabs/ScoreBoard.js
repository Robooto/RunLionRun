var Scoreboard = function(game) {
    Phaser.Group.call(this, game);

     this.selectSound = this.game.add.audio('selectSound');
};

// creating a prefab that inherites phaser group methods
Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

// show function accepts score
Scoreboard.prototype.show = function(score, saves, time) {
    var bmd; // for canvas rect
    var background; // for canvas 
    var gameoverText;
    var scoreText;
    var highScoreText;
    var newHighScoreText;
    var startText;
    var savesText;
    var elapsedGameTime;
    var leaderboardButton;

    elapsedGameTime = game.math.floor(game.time.elapsedSecondsSince(time));
    console.log(elapsedGameTime);

    // bitmap data extended canvas that allow drawing (width, height) of drawing canvas
    bmd = this.game.add.bitmapData(this.game.width, this.game.height); // make it the width and height of game
    bmd.ctx.fillStyle = '#000'; // set fill to black
    bmd.ctx.fillRect(0, 0, this.game.width, this.game.height); // filled rectangle

    background = this.game.add.sprite(0, 0, bmd); // background spite of the bitmapdata
    background.alpha = 0.5; // make it see through

    this.add(background);

    var isNewHighScore = false; // flag for high score

    /*  // grab highscore from local storage if it is there
    var highScore = localStorage.getItem('highscore');

    // if highscore is less than high score score is highscore and write to local storage
    if (!highScore || highScore < score) {
        isNewHighScore = true;
        highScore = score;
        localStorage.setItem('highscore', highScore);
    } 

    */

    if (BasicGame.highScore < score) {
        isNewHighScore = true;
        BasicGame.highScore = score;
    }

    var leaderboardName = localStorage.getItem('runLionName');

    if (BasicGame.highScore > 100) {
        this.getName(leaderboardName);


    }

    this.y = this.game.height; // for our tween to come from the top

    // adding in all of our text
    gameoverText = this.game.add.bitmapText(game.world.centerX, 70, '4d', 'Game Over', 40);
    gameoverText.x = this.game.width / 2 - (gameoverText.textWidth / 2);
    this.add(gameoverText);

    savesText = this.game.add.text(game.world.centerX, 150, 'You Saved ' + saves + ' lions.', {
        font: '18px Arial',
        fill: '#ffffff',
        align: 'center'
    });
    savesText.anchor.setTo(0.5, 0.5);
    this.add(savesText);

    scoreText = this.game.add.text(game.world.centerX, 200, 'Your Score: ' + score, {
        font: '18px Arial',
        fill: '#ffffff',
        align: 'center'
    });
    scoreText.anchor.setTo(0.5, 0.5);
    this.add(scoreText);

    highScoreText = this.game.add.text(game.world.centerX, 250, 'Your Top Score: ' + BasicGame.highScore, {
        font: '16px Arial',
        fill: '#ffffff',
        align: 'center'
    });
    highScoreText.anchor.setTo(0.5, 0.5);
    this.add(highScoreText);

    leaderboardButton = this.game.add.button(game.world.centerX - 85, 350, 'leaderboard', this.openLeaderboard, this, 1, 0);
    // if the mouse is over the button, it becomes a hand
    leaderboardButton.input.useHandCursor = true;
    this.add(leaderboardButton);

    if (game.device.desktop) {
        var text = 'Press w or up arrow to play again';
    } else {
        var text = 'Tap the screen to play again';
    }

    startText = this.game.add.text(game.world.centerX, 300, text, {
        font: '18px Arial',
        fill: '#ffffff',
        align: 'center'
    });
    startText.anchor.setTo(0.5, 0.5);
    startText.alpha = 0;
        game.add.tween(startText).delay(500).to({ alpha: 1}, 1000).start();
        game.add.tween(startText).to({
            angle: -2
        }, 500).to({
            angle: 2
        }, 500).loop().start();
    //  startText.x = this.game.width / 2 - (startText.textWidth / 2);
    this.add(startText);

    // if our highscore is new add this text
    if (isNewHighScore) {
        newHighScoreText = this.game.add.text(game.world.centerX + 120, 120, 'New Top Score!', {
            font: '18px Arial',
            fill: '#40ccff'
        });
        newHighScoreText.angle = 45;
        this.add(newHighScoreText);
        var highScoreTween = this.game.add.tween(newHighScoreText.scale).to({
            x: 1.5,
            y: 1.5,
        }, 500).to({
            x: 1,
            y: 1
        }, 500).loop().start();
    }

    this.game.add.tween(this).to({
        y: 0
    }, 2000, Phaser.Easing.Bounce.Out, true);

    if (game.device.desktop) {
        // Start the game when the up arrow key is pressed
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        upKey.onDown.addOnce(this.restart, this);
        wKey.onDown.addOnce(this.restart, this);
    } else {
        this.game.input.onDown.addOnce(this.restart, this);
    }

};

Scoreboard.prototype.restart = function() {
    this.selectSound.play();
    this.game.state.start('Game', true, false);
};

Scoreboard.prototype.getName = function(name) {
    if (!name) {
        name = prompt("Please enter your name for the Leaderboard.", "");
    }

    if (name == '' || name == 'null' || name == null) {
        name = 'Guest' + game.rnd.integer();
    }

    while (name.length > 20) {
        name = prompt("Please enter your name using less than 20 characters.");
    }

    localStorage.setItem('runLionName', name);

};

Scoreboard.prototype.openLeaderboard = function() {
    this.selectSound.play();
    alert("Leaderboard");
};