(function(P2D, Game) {
    var fallTimeout = 0,
        TOTAL_TIMEOUT = 0.25;

    /**
     * Handles player input
     * @inherits BehaviorSystem
     * @constructor
     */
    var PlayerInput = function() {
        P2D.BehaviorSystem.call(this);
        this.requiredComponents = ['RectPhysicsBody'];
        this._jumpPressed = false;
    };

    P2D.Helper.inherit(PlayerInput, P2D.BehaviorSystem);

    PlayerInput.prototype.update = function(delta) {
        if (this.actionOrder.length === 0) {
            return;
        }

        var isPressingUp = P2D.Helper.isKeyDown(P2D.Keys.Up),
            isPressingLeft = P2D.Helper.isKeyDown(P2D.Keys.Left),
            isPressingRight = P2D.Helper.isKeyDown(P2D.Keys.Right),
            entity = this.actionOrder[0],
            physicsBody = entity.getComponent('RectPhysicsBody');

        var deltaX = 20 * delta * ((isPressingLeft) ? -1 : (isPressingRight) ? 1 : 0),
            jumpVelocity = -15,
            minJumpVelocity = jumpVelocity / 2;
        physicsBody.inContact = physicsBody.inContact && physicsBody.velocity.y === 0;
        physicsBody.velocity.x += deltaX;

        if (physicsBody.inContact && isPressingUp && !this._jumpPressed) {
            physicsBody.velocity.y = jumpVelocity;
        } else if (!isPressingUp && this._jumpPressed && physicsBody.velocity.y < minJumpVelocity) {
            fallTimeout += delta;
            physicsBody.velocity.y = minJumpVelocity * (1 - (fallTimeout / TOTAL_TIMEOUT));
        }

        // Cap out the maximum speeds
        if (Math.abs(physicsBody.velocity.x) > 20) {
            physicsBody.velocity.x = (physicsBody.velocity.x > 0) ? 20 : -20;
        }
        if (physicsBody.velocity.y > 10) {
            physicsBody.velocity.y = 10;
        }

        this._jumpPressed = isPressingUp;
    };

    Game.Systems = Game.Systems || {};
    Game.Systems.PlayerInput = PlayerInput;
})(Psykick2D, Game = window.Game || {});