(function(P2D, Game) {
    var GRAVITY = 9.8,
        GROUND_FRICTION = 10;

    /**
     * Returns the sides of a body
     * @param {Physics} body
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
    var Physics = function() {
        P2D.BehaviorSystem.call(this);
        this._quadTree = new Game.QuadTree({
            x: 0,
            y: 0,
            w: 800,
            h: 600
        });
        this.requiredComponents = ['Rectangle', 'Physics'];
    };

    P2D.Helper.inherit(Physics, P2D.BehaviorSystem);

    Physics.prototype.addEntity = function(entity) {
        if (P2D.BehaviorSystem.prototype.addEntity.call(this, entity)) {
            if (typeof entity === 'number') {
                entity = this.entities[entity];
            }
            this._quadTree.addEntity(entity);
            return true;
        } else {
            return false;
        }
    };

    Physics.prototype.removeEntity = function(entity) {
        if (P2D.BehaviorSystem.prototype.removeEntity.call(this, entity)) {
            this._quadTree.removeEntity(entity);
            return true;
        } else {
            return false;
        }
    };

    Physics.prototype.update = function(delta) {
        for (var i = 0, len = this.actionOrder.length; i < len; i++) {
            /*
            var entity = this.actionOrder[i],
                rect = entity.getComponent('Rectangle'),
                color = entity.getComponent('Color'),
                physics = entity.getComponent('Physics'),
                velocityXSign = (physics.velocity.x > 0) ? 1 : -1;
            physics.velocity.y += physics.mass * GRAVITY * delta;

            physics.velocity.x += GROUND_FRICTION * delta * velocityXSign * -1;

            var oldXCell = Math.floor(physics.x / Game.QuadTree.CELL_SIZE),
                oldYCell = Math.floor(physics.y / Game.QuadTree.CELL_SIZE),
                newXCell = Math.floor((physics.x + physics.velocity.x) / Game.QuadTree.CELL_SIZE),
                newYCell = Math.floor((physics.y + physics.velocity.y) / Game.QuadTree.CELL_SIZE);

            if (oldXCell !== newXCell || oldYCell !== newYCell) {
                this._quadTree.removeEntity(entity);
            }
            physics.x += physics.velocity.x;
            rect.x = physics.x;
            physics.y += physics.velocity.y;
            rect.y = physics.y;
            if (oldXCell !== newXCell || oldYCell !== newYCell) {
                this._quadTree.addEntity(entity);
            }

            var collisions = this._quadTree.getCollisions(entity);
            for (var j = 0, len2 = collisions.length; j < len2; j++) {
                var other = collisions[j],
                    otherBody = other.getComponent('Physics'),
                    mA = physics.mass,
                    mB = otherBody.mass,
                    vAX = physics.velocity.x,
                    vBX = otherBody.velocity.x,
                    vAY = physics.velocity.y,
                    vBY = otherBody.velocity.y,
                    bodyA = {
                        top: physics.y,
                        bottom: physics.y + physics.h,
                        left: physics.x,
                        right: physics.x + physics.w,
                        centerX: physics.x + physics.w / 2,
                        centerY: physics.y + physics.h / 2
                    },
                    bodyB = {
                        top: otherBody.y,
                        bottom: otherBody.y + otherBody.h,
                        left: otherBody.x,
                        right: otherBody.x + otherBody.w,
                        centerX: otherBody.x + otherBody.w / 2,
                        centerY: otherBody.y + otherBody.h / 2
                    },
                    yDiff = bodyA.bottom - bodyB.top,
                    onTop = bodyA.top < bodyB.top && yDiff <= 5;

                // If we're on top
                if (onTop) {
                    physics.y = bodyB.top - physics.h;
                } else {
                    if (bodyA.left < bodyB.left) {
                        physics.x = bodyB.left - physics.w - 1;
                    } else {
                        physics.x = bodyB.right + 1;
                    }
                }

                if (!onTop) {
                    physics.velocity.x = ((2 * mB * vBX + vAX * (mA - mB)) / (mA + mB)) * physics.bounciness;
                    otherBody.velocity.x = ((2 * mA * vAX + vBX * (mA - mB)) / (mA + mB)) * otherBody.bounciness;

                    if (Math.abs(otherBody.velocity.x) <= 0.5) {
                        otherBody.velocity.x = 0;
                    }
                    if (Math.abs(otherBody.velocity.x) <= 0.5) {
                        physics.velocity.x = 0;
                    }

                    physics.x += physics.velocity.x;
                    otherBody.x += otherBody.velocity.x;
                }

                physics.velocity.y = ((2 * mB * vBY + vAY * (mA - mB)) / (mA + mB)) * physics.bounciness;
                otherBody.velocity.y = ((2 * mA * vAY + vBY * (mA - mB)) / (mA + mB)) * otherBody.bounciness;

                if (Math.abs(otherBody.velocity.y) <= 1) {
                    otherBody.velocity.y = 0;
                }
                if (Math.abs(otherBody.velocity.y) <= 1) {
                    physics.velocity.y = 0;
                }

                physics.y += physics.velocity.y;
                otherBody.y += otherBody.velocity.y;

                bodyA.top = physics.y;
                bodyB.top = otherBody.y;
                bodyA.bottom = physics.y + physics.h;
                bodyA.left = physics.x;
                bodyB.left = otherBody.x;
                bodyB.right = otherBody.x + otherBody.w;
                yDiff = bodyA.bottom - bodyB.top;
                onTop = bodyA.top < bodyB.top && yDiff <= 5;
                if (onTop) {
                    physics.y = bodyB.top - physics.h;
                } else {
                    if (bodyA.left < bodyB.left) {
                        physics.x = bodyB.left - physics.w - 1;
                    } else {
                        physics.x = bodyB.right + 1;
                    }
                }
            }
            */

            // Update it's position
            var entity = this.actionOrder[i],
                rect = entity.getComponent('Rectangle'),
                body = entity.getComponent('Physics'),
                vXSign = (body.velocity.x) ? (body.velocity.x < 0) ? -1 : 1 : 0,
                frictionForce = delta * GROUND_FRICTION * body.mass * vXSign,
                gravityForce = delta * GRAVITY * body.mass;

            body.velocity.x -= frictionForce;
            body.velocity.y += gravityForce;
            if (Math.abs(body.velocity.x) < frictionForce) {
                body.velocity.x = 0;
            }
            if (Math.abs(body.velocity.y) < gravityForce) {
                body.velocity.y = 0;
            }
            this._quadTree.moveEntity(entity, body.velocity);

            // Resolve any collisions
            var collisions = this._quadTree.getCollisions(entity),
                entityIsMoving = (body.velocity.x !== 0 || body.velocity.y !== 0),
                entitySides = getSides(body);
            for (var j = 0, len2 = collisions.length; j < len2; j++) {
                var other = collisions[j],
                    otherBody = other.getComponent('Physics'),
                    otherIsMoving = (otherBody.velocity.x !== 0 || otherBody.velocity.y !== 0),
                    otherSides = getSides(otherBody),
                    bothMoving = (entityIsMoving && otherIsMoving);

                if (!bothMoving) {
                    var movingEntity = (entityIsMoving) ? entity : other,
                        movingBody = (entityIsMoving) ? body : otherBody,
                        movingSides = (entityIsMoving) ? entitySides : otherSides,
                        staticSides = (entityIsMoving) ? otherSides : entitySides,
                        deltaPosition = {
                            x: 0,
                            y: 0
                        };
                    if (movingSides.bottom > staticSides.top && movingSides.top < staticSides.top
                        && Math.abs(movingSides.bottom - staticSides.top) <= movingBody.velocity.y + gravityForce) {
                        // Dropping from above
                        deltaPosition.y = -(movingSides.bottom - staticSides.top);
                        movingBody.velocity.y = 0;
                    } else if (movingSides.top < staticSides.bottom && movingSides.bottom > staticSides.bottom
                        && Math.abs(-(staticSides.bottom - movingSides.top)) <= movingBody.velocity.y) {
                        // Coming from below
                        deltaPosition.y = staticSides.bottom - movingSides.top;
                        movingBody.velocity.y = 0;
                    } else if (movingSides.right > staticSides.left && movingSides.left < staticSides.left
                        && movingBody.velocity.x > 0) {
                        // Coming from the left
                        deltaPosition.x = -(movingSides.right - staticSides.left);
                        movingBody.velocity.x = 0;
                    } else if (movingSides.left < staticSides.right && movingSides.right > staticSides.left
                        && movingBody.velocity.x < 0) {
                        // Coming from the right
                        deltaPosition.x = staticSides.right - movingSides.left;
                        movingBody.velocity.x = 0;
                    }

                    this._quadTree.moveEntity(movingEntity, deltaPosition);
                }
            }

            // Synchronize the drawing rectangle
            rect.x = body.x;
            rect.y = body.y;

            // Keep it inside of the box for the time being
            if (rect.y < 0) {
                body.y = rect.y = 0;
                body.velocity.y = -body.velocity.y * body.bounciness;
            } else if (rect.y + rect.h > 600) {
                body.y = rect.y = 600 - rect.h;
                body.velocity.y = -body.velocity.y * body.bounciness;
            }
            if (rect.x < 0) {
                body.x = rect.x = 0;
                body.velocity.x = -body.velocity.x * body.bounciness;
            } else if (rect.x + rect.w > 800) {
                body.x = rect.x = 800 - rect.w;
                body.velocity.x = -body.velocity.x * body.bounciness;
            }
        }
    };

    Game.Systems = Game.Systems || {};
    Game.Systems.Physics = Physics;
})(Psykick2D, Game = window.Game || {});