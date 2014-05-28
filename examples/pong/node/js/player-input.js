'use strict';

var BehaviorSystem = require('../../../../src/index.js').BehaviorSystem,
    Helper = require('../../../../src/index.js').Helper,
    Keyboard = require('../../../../src/index.js').Input.Keyboard,
    Keys = require('../../../../src/index.js').Keys,

    SPEED = 200;

/**
 * Controls the player
 * @param {Entity} player   The player
 * @constructor
 */
var PlayerInput = function(player) {
    BehaviorSystem.call(this);
    this._playerRect = player.getComponent('RectPhysicsBody');
};

Helper.inherit(PlayerInput, BehaviorSystem);

/**
 * Updates the player's position
 * @param {number} delta    Time change
 */
PlayerInput.prototype.update = function() {
    var isUpPressed = Keyboard.isKeyDown(Keys.Up),
        isDownPressed = Keyboard.isKeyDown(Keys.Down);
    if (isUpPressed) {
        this._playerRect.velocity.y = -SPEED;
    }
    if (isDownPressed) {
        this._playerRect.velocity.y = SPEED;
    }
    if (!isUpPressed && !isDownPressed) {
        this._playerRect.velocity.y = 0;
    }
};

module.exports = PlayerInput;