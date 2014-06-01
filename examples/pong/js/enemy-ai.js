'use strict';

var Helper = require('psykick2d').Helper,
    BehaviorSystem = require('psykick2d').BehaviorSystem,

    CONSTANTS = require('./constants.js');

/**
 * Drives the enemy toward victory
 * @param {Entity} enemy
 * @param {Entity} ball
 * @constructor
 */
var EnemyAI = function(enemy, ball) {
    BehaviorSystem.call(this);
    this.enemyRect = enemy.getComponent('RectPhysicsBody');
    this.ballRect = ball.getComponent('Rectangle');
};

Helper.inherit(EnemyAI, BehaviorSystem);

/**
 * Makes the enemy chase the ball
 * @param {number} delta    Time since last update
 */
EnemyAI.prototype.update = function(delta) {
    // Don't chase the ball until it's about to come back
    var leftEdge = 100 + Math.random() * 300,
        rightEdge = 600 + Math.random() * 100;
    if (this.ballRect.velocity.x < 0 && this.ballRect.x > leftEdge && this.ballRect.x < rightEdge) {
        this.enemyRect.velocity.y = 0;
        return;
    }

    var ballCenter = this.ballRect.y + this.ballRect.h / 2,
        enemyCenter = this.enemyRect.y + this.enemyRect.h / 2,
        difference = Math.abs(ballCenter - enemyCenter),
        velocitySign = (ballCenter < enemyCenter) ? -1 : 1;

    if (difference > CONSTANTS.PADDLE_SPEED * delta) {
        this.enemyRect.velocity.y = CONSTANTS.PADDLE_SPEED * velocitySign;
    } else {
        this.enemyRect.velocity.y = 0;
    }
};

module.exports = EnemyAI;