var HurtLion = function(game, x, y, key, frame) {
    key = 'hurtlion';
    Phaser.Sprite.call(this, game, x, y, key, frame);


    this.scale.set(1.2);
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = true;

    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;

    this.events.onKilled.add(this.onKilled, this);

    this.body.gravity.y = this.game.rnd.integerInRange(50, 250);

    this.WOBBLE_LIMIT = 10; // degrees
    this.WOBBLE_SPEED = 250; // milliseconds
    // -this.WOBBLE_LIMIT and +this.WOBBLE_LIMIT forever
    this.wobble = this.WOBBLE_LIMIT;

    this.tween = this.game.add.tween(this)
        .to({
                wobble: -this.WOBBLE_LIMIT
            },
            this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0,
            Number.POSITIVE_INFINITY, true
    );

};

HurtLion.prototype = Object.create(Phaser.Sprite.prototype);
HurtLion.prototype.constructor = HurtLion;

HurtLion.prototype.update = function() {

    this.rotation = this.game.math.degToRad(this.wobble);


    // give the cage a nice wobble as it falls to the earth
    this.body.velocity.x = Math.cos(this.rotation) * -300;
    //this.body.velocity.y = Math.sin(this.rotation) * 100;

    // stop the wobble when the cage is on the ground then start it up again if it is in the air
    if (this.y > game.world.height - 100) {
        this.tween.pause();
    } else {
        this.tween.resume();
    }



};

HurtLion.prototype.onKilled = function() {
    //  this.frame = 1;
};