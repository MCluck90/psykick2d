'use strict';

var Helper = require('../../../../src/index.js').Helper,
    BehaviorSystem = require('../../../../src/index.js').BehaviorSystem,

    INIT_BALL_SPEED = 200;

var Score = function(ball, player, enemy) {
    BehaviorSystem.call(this);
    this.ballRect = ball.getComponent('Rectangle');
    this.player = player;
    this.enemy = enemy;
};

Helper.inherit(Score, BehaviorSystem);

Score.prototype.update = function() {
    // Collide with the side of the level
    var collideLeft = (this.ballRect.x < 0),
        collideRight = (this.ballRect.x + this.ballRect.w > 800);
    if (collideLeft || collideRight) {
        this.ballRect.x = 395;
        this.ballRect.y = 295;
        var yVelocity = Math.min(Math.random(), 0.8),
            xVelocity = 1 - yVelocity,
            xSign = (this.ballRect.velocity.x > 0) ? 1 : -1;
        this.ballRect.velocity = {
            x: xVelocity * INIT_BALL_SPEED * xSign,
            y: yVelocity * INIT_BALL_SPEED
        };

        var scoringPlayer = (collideLeft) ? this.enemy : this.player,
            score = scoringPlayer.getComponent('Text');
        score.text = parseInt(score.text, 10) + 1;
    }
};

module.exports = Score;