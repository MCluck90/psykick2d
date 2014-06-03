'use strict';

var Helper = require('../../helper.js'),
    Shape = require('../shape.js');

/**
 * A generic rectangle
 * @param {object} [options]
 * @param {number} [options.x=0]
 * @param {number} [options.y=0]
 * @param {number} [options.width=0]
 * @param {number} [options.height=0]
 * @constructor
 * @extends {Shape}
 */
var Rectangle = function(options) {
    this.NAME = 'Rectangle';

    var defaults = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    options = Helper.defaults(options, defaults);
    Shape.call(this, options);

    this.x = options.x;
    this.y = options.y;
    this._width = options.width;
    this._height = options.height;
    this._setShape();
};

Helper.inherit(Rectangle, Shape);

// Update the PIXI shape when the width and height change
Object.defineProperties(Rectangle.prototype, {
    width: {
        get: function() {
            return this._width;
        },
        set: function(value) {
            this._width = value;
            this._setShape();
        }
    },
    height: {
        get: function() {
            return  this._height;
        },
        set: function(value) {
            this._height = value;
            this._setShape();
        }
    }
});

/**
 * Draws a rectangle
 * @private
 */
Rectangle.prototype._setShape = function() {
    if (this._color !== null) {
        this.beginFill(this.color);
        this.drawRect(0, 0, this._width * this.scale.x, this._height * this.scale.y);
        this.endFill();
    }
};

module.exports = Rectangle;