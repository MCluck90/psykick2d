'use strict';

var Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,

    MAX_SPEED = 300;

var BallMovement = function(ball) {
    BehaviorSystem.call(this);
    this.speed = MAX_SPEED / 2;
    this.ballRect = ball.getComponent('Rectangle');
};

Helper.inherit(BallMovement, BehaviorSystem);

BallMovement.prototype.update = function(delta) {
};

module.exports = BallMovement;