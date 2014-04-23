(function(P2D, Game) {
    var BehaviorSystem = P2D.BehaviorSystem,
        Helper = P2D.Helper,
        QuadTree = P2D.Helpers.QuadTree;

    var PongPhysics = function() {
        BehaviorSystem.call(this);
        this.requiredComponents = ['RectPhysicsBody'];
        this.quadTree = new QuadTree({
            x: 0,
            y: 0,
            w: 800,
            h: 600,
            cellSize: 100
        });
    };

    Helper.inherit(PongPhysics, BehaviorSystem);

    /**
     * Make sure each of the entities are in the quad tree
     * @param entity
     */
    PongPhysics.prototype.addEntity = function(entity) {
        if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
            this.quadTree.addEntity(entity);
        }
    };

    /**
     * Handles moving and bouncing the ball
     * @param delta
     */
    PongPhysics.prototype.update = function(delta) {
        for (var i = 0, len = this.actionOrder.length; i < len; i++) {
            var entity = this.actionOrder[i],
                body = entity.getComponent('RectPhysicsBody');

            this.quadTree.moveEntity(entity, {
                x: body.velocity.x * delta,
                y: body.velocity.y * delta
            });

            if (body.velocity.x !== 0) {
                var collisions = this.quadTree.getCollisions(entity);
                for (var j = 0, len2 = collisions.length; j < len2; j++) {
                    var other = collisions[j],
                        otherBody = other.getComponent('RectPhysicsBody');
                    if (otherBody.x < body.x || otherBody.x > body.x) {
                        body.velocity.x *= -1.25;
                        body.velocity.y *= 1.25;
                        if (otherBody.x < body.x) {
                            body.x = otherBody.x + otherBody.w;
                        } else {
                            body.x = otherBody.x - body.w;
                        }
                        if (Math.abs(body.velocity.x) > 500) {
                            var xSign = (body.velocity.x > 0) ? 1 : -1;
                            body.velocity.x = 500 * xSign;
                        }
                        if (Math.abs(body.velocity.y) > 500) {
                            var ySign = (body.velocity.y > 0) ? 1 : -1;
                            body.velocity.y = 500 * ySign;
                        }
                        break;
                    }
                }
            }

            // Keep it inside of the room
            if (body.x < 0 || body.x + body.w > 800) {
                body.x = (body.x < 0) ? 0 : 800 - body.w;
                body.velocity.x *= -1;
            }
            if (body.y < 0 || body.y + body.h > 600) {
                body.y = (body.y < 0) ? 0 : 600 - body.h;
                body.velocity.y *= -1;
            }
        }
    };

    Game.PongPhysics = PongPhysics;
})(Psykick2D, window.Game);