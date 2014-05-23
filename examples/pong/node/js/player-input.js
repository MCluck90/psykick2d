'use strict';

var BehaviorSystem = require('psykick2d').BehaviorSystem,
    Helper = require('psykick2d').Helper,
    Keyboard = require('psykick2d').Input.Keyboard,
    Keys = require('psykick2d').Keys,

    SPEED = 200;

/**
 * Controls the player
 * @param {Entity} player   The player
 * @constructor
 */
var PlayerInput = function(player) {
    BehaviorSystem.call(this);
    this._playerRect = player.getComponent('Rectangle');
};

Helper.inherit(PlayerInput, BehaviorSystem);

/**
 * Updates the player's position
 * @param {number} delta    Time change
 */
PlayerInput.prototype.update = function(delta) {
    var deltaSpeed = SPEED * delta;
    if (Keyboard.isKeyDown(Keys.Up)) {
        this._playerRect.y -= deltaSpeed;
    }
    if (Keyboard.isKeyDown(Keys.Down)) {
        this._playerRect.y += deltaSpeed;
    }
};

module.exports = PlayerInput;