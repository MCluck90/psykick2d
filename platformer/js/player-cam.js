'use strict';

var Camera = require('psykick2d').Camera,
    Helper = require('psykick2d').Helper;

var PlayerCam = function(player, width, height) {
    this.playerBody = player.getComponent('Rectangle');
    this._cacheX = this.playerBody.x;
    this._cacheY = this.playerBody.y;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;

    // Put the camera just a little bit ahead of the player
    this.playerXOffset = this.playerBody.width / 1.1;
    this.playerYOffset = this.playerBody.height / 2;
};

Helper.inherit(PlayerCam, Camera);

/**
 * Moves the camera to stay focused on the player
 * @param {Stage} stage
 * @param {number} delta
 */
PlayerCam.prototype.render = function(stage, delta) {
    var x = this.playerBody.x - this.halfWidth + this.playerXOffset,
        y = this.playerBody.y - this.halfHeight + this.playerYOffset;

    // Make sure the screen doesn't scroll too far to the left
    if (x !== this._cacheX) {
        if (x > 0 && this._cacheX < 0) {
            stage.x = 0;
            this._cacheX = 0;
        } else if (x > 0) {
            stage.x = -x;
            this._cacheX = x;
        }
    }

    // Make sure the screen doesn't go below the bottom of the level
    if (y !== this._cacheY) {
        if (y > 0 && this._cacheY < 0) {
            stage.y = 0;
            this._cacheY = 0;
        } else if (y < 0) {
            stage.y = -y;
            this._cacheY = y;
        }
    }
};

module.exports = PlayerCam;