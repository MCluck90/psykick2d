'use strict';

var Helper = require('psykick2d').Helper,
    Keyboard = require('psykick2d').Input.Keyboard,
    Keys = require('psykick2d').Keys,
    BehaviorSystem = require('psykick2d').BehaviorSystem,

    RUN_SPEED = 10;

var PlayerMovement = function(player) {
    BehaviorSystem.call(this);
    this.player = player;
};

Helper.inherit(PlayerMovement, BehaviorSystem);

PlayerMovement.prototype.update = function(delta) {
    var body = this.player.getComponent('RectPhysicsBody'),
        sprite = this.player.getComponent('Sprite');
    if (Keyboard.isKeyDown(Keys.Left)) {
        body.velocity.x = -RUN_SPEED;
        console.log(body.x, body.y, body.width, body.height);
        sprite.pivot.x = 128;
        sprite.scale.x = -1;
    } else if (Keyboard.isKeyDown(Keys.Right)) {
        body.velocity.x = RUN_SPEED;
        sprite.pivot.x = 0;
        sprite.scale.x = 1;
    } else {
        body.velocity.x = 0;
    }
};

module.exports = PlayerMovement;