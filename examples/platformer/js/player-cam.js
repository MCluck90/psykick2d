(function(P2D, Game) {
    /**
     * Follows the player around the screen
     * @constructor
     * @implements {Camera}
     * @param {RectPhysicsBody} playerBody  The player's physics body
     */
    var PlayerCam = function(playerBody) {
        this.playerBody = playerBody;
    };

    /**
     * Move the camera so that it follows the player
     * @param {CanvasRenderingContext2D} c
     */
    PlayerCam.prototype.render = function(c) {
        var halfWidth = this.playerBody.w / 2,
            halfHeight = this.playerBody.h / 2;
        c.translate(-this.playerBody.x + 400 - halfWidth, -this.playerBody.y + 300 - halfHeight);
    };

    Game.PlayerCam = PlayerCam;
})(Psykick2D, Game = window.Game || {});