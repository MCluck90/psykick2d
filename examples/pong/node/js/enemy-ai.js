'use strict';

var Helper = require('../../../../src/index.js').Helper,
    BehaviorSystem = require('../../../../src/index.js').BehaviorSystem,

    SPEED = 200;

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
    var distance = Math.abs(Math.abs(this.enemyRect.y + (this.enemyRect.h / 2)) - Math.abs(this.ballRect.y)),
        sign = (this.enemyRect.y < this.ballRect.y) ? 1 : -1;
    if (distance >= this.enemyRect.h / 4) {
        this.enemyRect.velocity.y = SPEED * sign;
    }
};

module.exports = EnemyAI;