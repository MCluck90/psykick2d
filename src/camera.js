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
 * Call before every render step
 * @param {Stage} stage
 * @param {number} delta
 */
Camera.prototype.render = function(stage, delta) {
    stage.x = -this.x;
    stage.y = -this.y;
};

Camera.prototype.toString = function() {
    return '[object Camera]';
};

module.exports = Camera;