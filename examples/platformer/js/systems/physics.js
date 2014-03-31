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
        this.requiredComponents = ['Rectangle', 'Physics'];
    };

    P2D.Helper.inherit(Physics, P2D.BehaviorSystem);

    Physics.prototype.update = function(delta) {
        for (var i = 0, len = this.actionOrder.length; i < len; i++) {
            var entity = this.actionOrder[i],
                rect = entity.getComponent('Rectangle'),
                physics = entity.getComponent('Physics'),
                velocityXSign = (physics.velocity.x > 0) ? 1 : -1;
            physics.velocity.y += physics.mass * GRAVITY * delta;
            physics.y += physics.velocity.y;
            rect.y = physics.y;

            physics.velocity.x += GROUND_FRICTION * delta * velocityXSign * -1;
            physics.x += physics.velocity.x;
            rect.x = physics.x;

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