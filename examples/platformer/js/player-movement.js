'use strict';

var Helper = require('psykick2d').Helper,
    Keyboard = require('psykick2d').Input.Keyboard,
    Keys = require('psykick2d').Keys,
    BehaviorSystem = require('psykick2d').BehaviorSystem,

    RUN_SPEED = 10,
    JUMP_SPEED = 12;

var PlayerMovement = function(player) {
    BehaviorSystem.call(this);
    this.player = player;
};

Helper.inherit(PlayerMovement, BehaviorSystem);

PlayerMovement.prototype.update = function(delta) {
    var body = this.player.getComponent('RectPhysicsBody'),
        sprite = this.player.getComponent('Sprite');
    if (Keyboard.isKeyDown(Keys.Left)) {
        if (body.velocity.x > 0) {
            body.friction = 1.2;
        } else {
            body.friction = 0;
        }
        this.player.addComponent(this.player.getComponent('WalkAnimation'));
        body.velocity.x -= RUN_SPEED * delta;
        if (body.velocity.x < -RUN_SPEED) {
            body.velocity.x = -RUN_SPEED;
        }
        sprite.pivot.x = 128;
        sprite.scale.x = -1;
    } else if (Keyboard.isKeyDown(Keys.Right)) {
        if (body.velocity.x < 0) {
            body.friction = 1.2;
        } else {
            body.friction = 0;
        }
        this.player.addComponent(this.player.getComponent('WalkAnimation'));
        body.velocity.x += RUN_SPEED * delta;
        if (body.velocity.x > RUN_SPEED) {
            body.velocity.x = RUN_SPEED;
        }
        sprite.pivot.x = 0;
        sprite.scale.x = 1;
    } else {
        body.friction = 1;
    }

    if (Keyboard.isKeyDown(Keys.Up) && this.player.onGround) {
        this.player.onGround = false;
        body.velocity.y = -JUMP_SPEED;
    }

    if (body.velocity.x === 0) {
        this.player.addComponent(this.player.getComponent('StandAnimation'));
        body.velocity.x = 0;
    }
};

module.exports = PlayerMovement;