'use strict';

var Helper = require('../../../../src/index.js').Helper,
    BehaviorSystem = require('../../../../src/index.js').BehaviorSystem,

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