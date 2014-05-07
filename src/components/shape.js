'use strict';

var Helper = require('../helper.js'),
    PIXI = require('pixi.js');

/**
 * Base class for any shape components
 * @param {object} [options]
 * @param {string} [options.color=null]
 * @param {number} [options.x=0]
 * @param {number} [options.y=0]
 * @param {number} [options.rotation=0]
 * @constructor
 * @extends {PIXI.Graphics}
 */
var Shape = function(options) {
    // We use _initializing to ensure the color property doesn't mess up during initialization
    this._initializing = true;
    PIXI.Graphics.call(this);
    delete this._initializing;
    var defaults = {
        color: null,
        x: 0,
        y: 0,
        rotation: 0
    };
    options = Helper.defaults(options, defaults);
    this._color = null;
    this.color = options.color;
    this.x = options.x;
    this.y = options.y;
    this.rotation = options.rotation;
};

Helper.inherit(Shape, PIXI.Graphics);

// Update the state of the shape when the color changes
Object.defineProperty(Shape.prototype, 'color', {
    get: function() {
        return this._color;
    },
    set: function(val) {
        if (this._color === val || this._initializing) {
            return;
        }

        this._color = val;
        var colorIsSet = (val !== null);
        if (colorIsSet) {
            this._setShape();
        }
    }
});

module.exports = Shape;