'use strict';

/**
 * A basic camera
 * @constructor
 */
var Camera = function() {
    this.x = 0;
    this.y = 0;
};

/**
 * Called before every draw phase
 * @param {CanvasRenderingContext2D} c
 */
Camera.prototype.render = function(c) {
    c.translate(-this.x, -this.y);
};

Camera.prototype.toString = function() {
    return '[object Camera]';
};

module.exports = Camera;