(function(P2D, Game) {
    /**
     * Handles player input
     * @inherits BehaviorSystem
     * @constructor
     */
    var PlayerInput = function() {
        P2D.BehaviorSystem.call(this);
        this.requiredComponents = ['Physics'];
    };

    P2D.Helper.inherit(PlayerInput, P2D.BehaviorSystem);

    PlayerInput.prototype.update = function(delta) {
        if (this.actionOrder.length === 0) {
            return;
        }

        var isPressingUp = P2D.Helper.isKeyDown(P2D.Keys.Up),
            isPressingDown = P2D.Helper.isKeyDown(P2D.Keys.Down),
            isPressingLeft = P2D.Helper.isKeyDown(P2D.Keys.Left),
            isPressingRight = P2D.Helper.isKeyDown(P2D.Keys.Right),
            physicsBody = this.actionOrder[0].getComponent('Physics');

        var deltaX = 20 * delta * ((isPressingLeft) ? -1 : (isPressingRight) ? 1 : 0),
            deltaY = 20 * delta * ((isPressingUp)   ? -1 : (isPressingDown)  ? 1 : 0);
        physicsBody.velocity.x += deltaX;
        physicsBody.velocity.y += deltaY;
    };

    Game.Systems = Game.Systems || {};
    Game.Systems.PlayerInput = PlayerInput;
})(Psykick2D, Game = window.Game || {});