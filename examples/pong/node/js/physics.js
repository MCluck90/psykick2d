'use strict';

var Helper = require('../../../../src/index.js').Helper,
    BehaviorSystem = require('../../../../src/index.js').BehaviorSystem,
    CollisionGrid = require('../../../../src/index.js').DataStructures.CollisionGrid;

var Physics = function(ball) {
    BehaviorSystem.call(this);
    this.requiredComponents = ['Rectangle', 'RectPhysicsBody'];
    this.ball = ball;
    this.ballRect = ball.getComponent('RectPhysicsBody');
    this.grid = new CollisionGrid({
        width: 800,
        height: 600,
        cellSize: 10
    });
    this.addEntity(ball);
};

Helper.inherit(Physics, BehaviorSystem);

Physics.prototype.addEntity = function(entity) {
    if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
        this.grid.addEntity(entity);
        return true;
    }
    return false;
};

Physics.prototype.removeEntity = function(entity) {
    if (BehaviorSystem.prototype.removeEntity.call(this, entity)) {
        this.grid.removeEntity(entity);
        return true;
    }
    return false;
};

Physics.prototype.update = function(delta) {
    for (var i = 0, len = this.actionOrder.length; i < len; i++) {
        var entity = this.actionOrder[i],
            physicsBody = entity.getComponent('RectPhysicsBody');
        this.grid.moveEntity(entity, {
            x: physicsBody.velocity.x * delta,
            y: physicsBody.velocity.y * delta
        });

        if (physicsBody !== this.ballRect) {
            if (physicsBody.y < 0) {
                this.grid.removeEntity(entity);
                physicsBody.y = 0;
                this.grid.addEntity(entity);
            } else if (physicsBody.y + physicsBody.h > 600) {
                this.grid.removeEntity(entity);
                physicsBody.y = 600 - physicsBody.h;
                this.grid.addEntity(entity);
            }
        }
    }

    // Collide with the side of the level
    if (this.ballRect.x > 800 || this.ballRect.x < 0) {
        this.ballRect.x = 395;
        this.ballRect.y = 295;
    }

    // Collide with the top or bottom of the level
    var hitBottom = (this.ballRect.y + this.ballRect.h >= 600),
        hitTop = (this.ballRect.y <= 0);
    if (hitTop || hitBottom) {
        this.ballRect.velocity.y *= -1;
        if (hitTop) {
            this.ballRect.y = 0;
        } else {
            this.ballRect.y = 600 - this.ballRect.h;
        }
    }

    var collisions = this.grid.getCollisions(this.ball);
    if (collisions.length > 0) {
        this.ballRect.velocity.x *= -1;
    }
};

module.exports = Physics;