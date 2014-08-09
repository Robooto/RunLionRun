var Clouds = function(game, x, y, key, frame) {
    key = 'clouds';
    Phaser.Sprite.call(this, game, x, y, key, frame);

    // Init the cloud
    this.anchor.setTo(0, 0.5);
    // Enable physics on the clouds
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.enableBody = true;

    // Create 3 different size of clouds
    var scale = 0.2 * game.rnd.integerInRange(3, 5);
    this.scale.setTo(scale, scale);


    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;

    this.SPEED = game.rnd.integerInRange(-100, -30);

};

Clouds.prototype = Object.create(Phaser.Sprite.prototype);
Clouds.prototype.constructor = Clouds;

Clouds.prototype.update = function() {

    this.body.velocity.x = this.SPEED;
};