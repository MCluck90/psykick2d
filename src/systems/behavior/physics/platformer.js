'use strict';

var Helper = require('../../../helper.js'),
    BehaviorSystem = require('../../../behavior-system.js'),
    QuadTree = require('../../../helpers/quad-tree.js');

var GRAVITY = 9.8,
    FRICTION = 10;

/**
 * Returns the sides of a body
 * @param {RectPhysicsBody} body
 * @returns {{
 *  top: number,
 *  bottom: number,
 *  left: number,
 *  right: number
 * }}
 */
function getSides(body) {
    return {
        top: body.y,
        bottom: body.y + body.h,
        left: body.x,
        right: body.x + body.w
    };
}

/**
 * Handles essential physics
 * @inherits BehaviorSystem
 * @constructor
 */
var Platformer = function() {
    BehaviorSystem.call(this);
    this._quadTree = new QuadTree({
        x: 0,
        y: 0,
        w: 800,
        h: 600
    });
    this.requiredComponents = ['RectPhysicsBody'];
};

Helper.inherit(Platformer, BehaviorSystem);

Platformer.prototype.addEntity = function(entity) {
    if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            entity = this.entities[entity];
        }
        this._quadTree.addEntity(entity);
        return true;
    } else {
        return false;
    }
};

Platformer.prototype.removeEntity = function(entity) {
    if (BehaviorSystem.prototype.removeEntity.call(this, entity)) {
        this._quadTree.removeEntity(entity);
        return true;
    } else {
        return false;
    }
};

Platformer.prototype.update = function(delta) {
    for (var i = 0, len = this.actionOrder.length; i < len; i++) {
        // Update it's position
        var entity = this.actionOrder[i],
            body = entity.getComponent('RectPhysicsBody'),
            vXSign = (body.velocity.x) ? (body.velocity.x < 0) ? -1 : 1 : 0,
            frictionForce = delta * FRICTION * vXSign,
            gravityForce = delta * GRAVITY * body.mass;

        body.velocity.x -= frictionForce;
        body.velocity.y += gravityForce;
        if (Math.abs(body.velocity.x) < Math.abs(frictionForce)) {
            body.velocity.x = 0;
        }
        if (Math.abs(body.velocity.y) < gravityForce) {
            body.velocity.y = 0;
        }
        this._quadTree.moveEntity(entity, body.velocity);

        // Resolve any collisions
        var collisions = (body.solid) ? this._quadTree.getCollisions(entity) : [],
            entityIsMoving = (body.velocity.x !== 0 || body.velocity.y !== 0),
            entitySides = getSides(body);
        for (var j = 0, len2 = collisions.length; j < len2; j++) {
            var other = collisions[j],
                otherBody = other.getComponent('RectPhysicsBody'),
                otherIsMoving = (otherBody.velocity.x !== 0 || otherBody.velocity.y !== 0),
                otherSides = getSides(otherBody),
                bothMoving = (entityIsMoving && otherIsMoving);

            if (!otherBody.solid) {
                continue;
            }

            if (!bothMoving) {
                var movingEntity = (entityIsMoving) ? entity : other,
                    movingBody = (entityIsMoving) ? body : otherBody,
                    movingSides = (entityIsMoving) ? entitySides : otherSides,
                    staticSides = (entityIsMoving) ? otherSides : entitySides,
                    deltaPosition = {
                        x: 0,
                        y: 0
                    },
                    fromAbove = movingSides.bottom - staticSides.top,
                    fromBelow = staticSides.bottom - movingSides.top,
                    fromLeft = movingSides.right - staticSides.left,
                    fromRight = staticSides.right - movingSides.left;
                if (movingSides.bottom >= staticSides.top &&
                    movingSides.top < staticSides.top &&
                    Math.abs(fromAbove).toFixed(6) * 1 <= (movingBody.velocity.y + gravityForce).toFixed(6) * 1) {
                    // Dropping from above
                    deltaPosition.y = -fromAbove;
                    movingBody.velocity.y = 0;
                } else if (movingSides.top <= staticSides.bottom &&
                    movingSides.bottom > staticSides.bottom &&
                    movingBody.velocity.y < 0 &&
                    Math.abs(fromBelow).toFixed(6) * 1 <= Math.abs(movingBody.velocity.y).toFixed(6) * 1) {
                    // Coming from below
                    deltaPosition.y = fromBelow;
                    movingBody.velocity.y = 0;
                } else if (movingSides.right >= staticSides.left &&
                    movingSides.left < staticSides.left &&
                    Math.abs(fromLeft).toFixed(6) * 1 <= Math.abs(movingBody.velocity.x).toFixed(6) * 1) {
                    // Coming from the left
                    deltaPosition.x = -fromLeft;
                    movingBody.velocity.x = 0;
                } else if (movingSides.left <= staticSides.right &&
                    movingSides.right > staticSides.right &&
                    Math.abs(fromRight).toFixed(6) * 1 <= Math.abs(movingBody.velocity.x).toFixed(6) * 1) {
                    // Coming from the right
                    deltaPosition.x = fromRight;
                    movingBody.velocity.x = 0;
                } else {
                    //debugger;
                }

                this._quadTree.moveEntity(movingEntity, deltaPosition);
            }
        }
    }
};

module.exports = Platformer;