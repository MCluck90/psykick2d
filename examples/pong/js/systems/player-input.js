window.Game = {};

(function(P2D) {
    var BehaviorSystem = P2D.BehaviorSystem,
        Helper = P2D.Helper,
        Keys = P2D.Keys,

        SPEED = 200;

    var PlayerInput = function() {
        BehaviorSystem.call(this);
        this.requiredComponents = ['Rectangle'];
    };

    Helper.inherit(PlayerInput, BehaviorSystem);

    PlayerInput.prototype.update = function() {
        var player = this.actionOrder[0],
            rect = player.getComponent('RectPhysicsBody');

        if (Helper.isKeyDown(Keys.Up)) {
            rect.velocity.y = -SPEED;
        } else if (Helper.isKeyDown(Keys.Down)) {
            rect.velocity.y = SPEED;
        } else {
            rect.velocity.y = 0;
        }
    };

    Game.PlayerInput = PlayerInput;
})(Psykick2D);