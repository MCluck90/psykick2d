(function(P2D, Game) {
    var GRAVITY = 9.8,
        GROUND_FRICTION = 1.68;

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

            var collisions = this._quadTree.getCollisions(entity),
                initialXVelocity = physics.velocity.x,
                initialYVelocity = physics.velocity.y;
            for (var j = 0, len2 = collisions.length; j < len2; j++) {
                var otherBody = collisions[j].getComponent('Physics'),
                    mA = physics.mass,
                    mB = otherBody.mass,
                    vAX = initialXVelocity,
                    vBX = otherBody.velocity.x,
                    bodyA = {
                        top: physics.y,
                        bottom: physics.y + physics.h,
                        left: physics.x,
                        right: physics.x + physics.w
                    },
                    bodyB = {
                        top: otherBody.y,
                        bottom: otherBody.y + otherBody.h,
                        left: otherBody.x,
                        right: otherBody.x + otherBody.w
                    };

                if (bodyA.left < bodyB.left && bodyA.right > bodyB.left) {
                    physics.x = otherBody.x - physics.w;
                } else if (bodyA.right > bodyB.right && bodyA.left < bodyB.right) {
                    physics.x = otherBody.x + otherBody.w;
                }

                physics.velocity.x = (2 * mB * vBX + vAX * (mA - mB)) / (mA + mB);
                otherBody.velocity.x = (2 * mA * vAX + vBX * (mA - mB)) / (mA + mB);
            }
            if (collisions.length > 0 && color.colors.length === 1 && entity.id !== 0) {
                color.colors.push('#F0F');
                color.colors = color.colors.reverse();
            } else if (collisions.length === 0 && color.colors.length > 1) {
                color.colors = [color.colors[1]];
            }

            // Keep it inside of that box for the time being
            if (rect.y < 0) {
                physics.y = rect.y = 0;
                physics.velocity.y = -physics.velocity.y / 2;
            } else if (rect.y + rect.h > 600) {
                physics.y = rect.y = 600 - rect.h;
                physics.velocity.y = -physics.velocity.y / 2;
            }
            if (rect.x < 0) {
                physics.x = rect.x = 0;
                physics.velocity.x = -physics.velocity.x / 2;
            } else if (rect.x + rect.w > 800) {
                physics.x = rect.x = 800 - rect.w;
                physics.velocity.x = -physics.velocity.x / 2;
            }
        }
    };

    Game.Systems = Game.Systems || {};
    Game.Systems.Physics = Physics;
})(Psykick2D, Game = window.Game || {});