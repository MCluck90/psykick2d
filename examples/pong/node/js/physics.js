'use strict';

var Helper = require('../../../../src/index.js').Helper,
    BehaviorSystem = require('../../../../src/index.js').BehaviorSystem,
    CollisionGrid = require('../../../../src/index.js').DataStructures.CollisionGrid;

/**
 * Takes care of the basic physics of the game
 * @param {Entity}  ball    The ball entity
 * @constructor
 * @extends {BehaviorSystem}
 */
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

/**
 * Adds an entity to the physics system
 * @param {Entity} entity
 * @returns {boolean}
 */
Physics.prototype.addEntity = function(entity) {
    if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
        this.grid.addEntity(entity);
        return true;
    }
    return false;
};

/**
 * Removes an entity from the physics system
 * @param {Entity} entity
 * @returns {boolean}
 */
Physics.prototype.removeEntity = function(entity) {
    if (BehaviorSystem.prototype.removeEntity.call(this, entity)) {
        this.grid.removeEntity(entity);
        return true;
    }
    return false;
};

/**
 * Updates the state of the world
 * @param {number}  delta   Time since last update
 */
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
        // Make sure the ball only bounces when it hits the side of a paddle
        var collider = collisions[0].getComponent('Rectangle');
        if ((this.ballRect.x > collider.x && this.ballRect.x + this.ballRect.w > collider.x + collider.w) ||
            (this.ballRect.x < collider.x && this.ballRect.x + this.ballRect.w < collider.x + collider.w)) {
            this.ballRect.velocity.x *= -1;
        }
    }
};

module.exports = Physics;