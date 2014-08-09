// Fist constructor  
var Fist = function(game, x, y, lion) {
    Phaser.Sprite.call(this, game, x, y, 'fist');

    this.lion = lion;

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    this.scale.setTo(-0.7, 0.7);

    // Enable physics on the fist
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.enableBody = true;
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    // Define constants that affect motion
    this.SPEED = 500; // fist speed pixels/second

    // when revived aim towards the lion
    this.events.onRevived.add(this.onRevived, this);

    // emitter for fist deaths
    this.fistEmitter = game.add.emitter(0, 0, 50);
    this.fistEmitter.makeParticles('fistpixel');
    this.fistEmitter.setYSpeed(-400, 100);
    this.fistEmitter.setXSpeed(-100, 250);
    this.fistEmitter.minParticleScale = 1;
    this.fistEmitter.maxParticleScale = 2;
    this.fistEmitter.gravity = 300;

};

// Fist will be a type of Phaser.Sprite
Fist.prototype = Object.create(Phaser.Sprite.prototype);
Fist.prototype.constructor = Fist;

Fist.prototype.onRevived = function() {

    // target the lion when spawned
    var targetAngle = this.game.math.angleBetween(
        this.x, this.y,
        this.lion.x + 10, this.lion.y + 25
    );
    this.rotation = targetAngle;
};

Fist.prototype.update = function() {
    // Calculate velocity vector based on this.rotation and this.SPEED
    // fire towards the lion's last known location
    this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
};

Fist.prototype.death = function() {
    // Emitt particles
    this.fistEmitter.x = this.x;
    this.fistEmitter.y = -30 + this.y;
    this.fistEmitter.start(true, 800, null, 30);
};