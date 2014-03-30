(function(P2D, Game) {
    var PlayerInput = function() {
        P2D.BehaviorSystem.call(this);
        this.requiredComponents = ['Rectangle', 'Color'];
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
            playerRect = this.actionOrder[0].getComponent('Rectangle');

        var deltaX = 200 * delta * ((isPressingLeft) ? -1 : (isPressingRight) ? 1 : 0),
            deltaY = 200 * delta * ((isPressingUp)   ? -1 : (isPressingDown)  ? 1 : 0);
        playerRect.x += deltaX;
        playerRect.y += deltaY;
    };

    Game.Systems = Game.Systems || {};
    Game.Systems.PlayerInput = PlayerInput;
})(Psykick2D, Game = window.Game || {});