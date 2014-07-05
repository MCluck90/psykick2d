'use strict';

var Helper = require('../../../helper.js'),
    BehaviorSystem = require('../../../behavior-system.js'),
    QuadTree = require('../../../data-structures/quad-tree.js');

/**
 * Handles basic platformer physics
 * @param {object} options
 * @param {number} [options.x=0]            X position of the collidable zone
 * @param {number} [options.y=0]            Y position of the collidable zone
 * @param {number} options.width            Width of the collidable zone
 * @param {number} options.height           Height of collidable
 * @param {number} [options.gravity=9.8]    Force of gravity
 * @constructor
 * @extends BehaviorSystem
 */
var Platformer = function(options) {
    BehaviorSystem.call(this);
    this.requiredComponents = ['RectPhysicsBody'];
    var defaults = {
        x: 0,
        y: 0,
        gravity: 9.8
    };
    options = Helper.defaults(options, defaults);

    this.gravity = options.gravity;

    options.componentType = 'RectPhysicsBody';
    this.collisionStructure = new QuadTree(options);
    this._collisionHandlers = [];
};

Helper.inherit(Platformer, BehaviorSystem);

/**
 * Adds an entity to the collision system
 * @param {Entity} entity
 * @returns {boolean}
 */
Platformer.prototype.addEntity = function(entity) {
    if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
        this.collisionStructure.addEntity(entity);
        return true;
    }
    return false;
};

/**
 * Removes an entity from the collision system
 * @param {Entity} entity
 * @returns {boolean}
 */
Platformer.prototype.removeEntity = function(entity) {
    if (typeof entity === 'number') {
        entity = this.entities[entity];
        this.collisionStructure.removeEntity(entity);
        return true;
    }
    return false;
};

/**
 * Adds a listener for when a collision occurs
 * @param {function(Entity, Entity)} callback
 */
Platformer.prototype.addCollisionListener = function(callback) {
    if (this._collisionHandlers.indexOf(callback) === -1) {
        this._collisionHandlers.push(callback);
    }
};

/**
 * Removes a collision listener
 * @param {function(Entity, Entity)} callback
 */
Platformer.prototype.removeCollisionListener = function(callback) {
    var index = this._collisionHandlers.indexOf(callback);
    if (index !== -1) {
        this._collisionHandlers.splice(index, 1);
    }
};

/**
 * Alerts listeners about a collision
 * @param {Entity} a
 * @param {Entity} b
 * @private
 */
Platformer.prototype._emit = function(a, b) {
    var handlers = this._collisionHandlers,
        numOfHandlers = handlers.length;
    for (var i = 0; i < numOfHandlers; i++) {
        handlers[i](a, b);
    }
};

/**
 * Deals with all of the collisions
 * @param {number} delta
 */
Platformer.prototype.update = function(delta) {
    for (var i = 0, len = this.actionOrder.length; i < len; i++) {
        var entity = this.actionOrder[i],
            body = entity.getComponent('RectPhysicsBody');
        if (body.immovable) {
            continue;
        }

        body.velocity.y += this.gravity * body.mass * delta;
        this.collisionStructure.moveEntity(entity, body.velocity);

        var bodyBottom = body.y + Math.abs(body.height),
            bodyRight = body.x + Math.abs(body.width),
            collisions = this.collisionStructure.getCollisions(entity, body),
            numOfCollisions = collisions.length,
            friction = null,
            j;
        for (j = 0; j < numOfCollisions; j++) {
            var other = collisions[j],
                otherBody = other.getComponent('RectPhysicsBody');
            if (!otherBody.solid) {
                continue;
            }

            if (otherBody.immovable) {
                if (friction === null) {
                    friction = [otherBody.friction];
                } else {
                    friction.push(otherBody.friction);
                }
            }

            this._emit(entity, other);

            var deltaPosition = { x: 0, y: 0 },
                otherBottom = otherBody.y + Math.abs(otherBody.height),
                otherRight = otherBody.x + Math.abs(otherBody.width),
                onTop = bodyBottom - otherBody.y,
                onBottom = otherBottom - body.y,
                onLeft = bodyRight - otherBody.x,
                onRight = otherRight - body.x,
                verticalCollision = Math.min(onTop, onBottom),
                horizontalCollision = Math.min(onLeft, onRight);
            if (verticalCollision < horizontalCollision) {
                body.velocity.y = 0;
                if (onTop < onBottom) {
                    deltaPosition.y = -verticalCollision;
                } else {
                    deltaPosition.y = verticalCollision;
                }
            } else {
                body.velocity.x = 0;
                if (onLeft < onRight) {
                    deltaPosition.x = -horizontalCollision;
                } else {
                    deltaPosition.x = horizontalCollision;
                }
            }

            this.collisionStructure.moveEntity(entity, deltaPosition);
        }

        if (friction && body.friction) {
            var frictionForce = 0,
                numOfContactPoints = friction.length;
            for (j = 0; j < numOfContactPoints; j++) {
                frictionForce += friction[j];
            }
            frictionForce /= numOfContactPoints * body.friction;
            var frictionDirection = (body.velocity.x) ? ((body.velocity.x < 0) ? 1 : -1) : 0;
            body.velocity.x += frictionForce * body.mass * frictionDirection * delta;
            if (body.velocity.x / Math.abs(body.velocity.x) === frictionDirection) {
                body.velocity.x = 0;
            }
        }
    }
};

module.exports = Platformer;