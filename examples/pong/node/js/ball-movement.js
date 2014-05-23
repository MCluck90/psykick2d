'use strict';

var Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,

    MAX_SPEED = 300;

var BallMovement = function(ball) {
    BehaviorSystem.call(this);
    this.ballRect = ball.getComponent('Rectangle');
};

Helper.inherit(BallMovement, BehaviorSystem);

BallMovement.prototype.update = function(delta) {
    this.ballRect.x += this.ballRect.velocity.x * delta;
    this.ballRect.y += this.ballRect.velocity.y * delta;
};

module.exports = BallMovement;