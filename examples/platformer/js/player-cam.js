(function(P2D, Game) {
    /**
     * Follows the player around the screen
     * @constructor
     * @implements {Camera}
     * @param {RectPhysicsBody} playerBody  The player's physics body
     */
    var PlayerCam = function(playerBody) {
        this.playerBody = playerBody;
        this.x = 0;
        this.y = 0;
        this.scale = 0.48;
    };

    /**
     * Move the camera so that it follows the player
     * @param {DisplayObjectContainer} scene
     * @param {number} delta
     */
    PlayerCam.prototype.render = function(scene, delta) {
        if (P2D.Helper.isKeyDown(P2D.Keys.A)) {
            this.scale += 2 * delta;
        }
        if (P2D.Helper.isKeyDown(P2D.Keys.Z)) {
            this.scale -= 2 * delta;
        }
        if (P2D.Helper.isKeyDown(P2D.Keys.R)) {
            this.scale = 1;
        }

        this.x = -this.playerBody.x + (400 / this.scale) - (this.playerBody.w / 2);
        this.y = -this.playerBody.y + (300 / this.scale) - (this.playerBody.h / 2);
        scene.scale.x = this.scale;
        scene.scale.y = this.scale;
        scene.position.x = this.x;
        scene.position.y = this.y;
    };

    Game.PlayerCam = PlayerCam;
})(Psykick2D, Game = window.Game || {});