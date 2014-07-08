'use strict';

var Camera = require('psykick2d').Camera,
    Helper = require('psykick2d').Helper,

    CONSTANTS = require('./constants.js');

/**
 * Follows the player around the world
 * @param {Entity} player
 * @constructor
 */
var PlayerCam = function(player) {
    // Store the player's body for quick reference
    this.playerBody = player.getComponent('RectPhysicsBody');

    // Save the previous position so we don't bother moving the camera too much
    this._cacheX = this.playerBody.x;
    this._cacheY = this.playerBody.y;
    this.halfWidth = CONSTANTS.SCREEN_WIDTH / 2;
    this.halfHeight = CONSTANTS.SCREEN_HEIGHT / 2;

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
    // Calculate where the camera should be looking
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