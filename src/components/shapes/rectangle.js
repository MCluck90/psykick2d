'use strict';

var Helper = require('../../helper.js'),
    Shape = require('../shape.js');

/**
 * A generic rectangle
 * @constructor
 * @extends {Shape}
 * @param {Object}  options
 */
var Rectangle = function(options) {
    this.NAME = 'Rectangle';

    var defaults = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };

    options = Helper.defaults(options, defaults);
    Shape.call(this, options);

    this.x = options.x;
    this.y = options.y;
    this._w = 0;
    this.w = options.w;
    this._h = 0;
    this.h = options.h;
};

Helper.inherit(Rectangle, Shape);

Object.defineProperties(Rectangle.prototype, {
    w: {
        get: function() {
            return this._w;
        },
        set: function(val) {
            this._w = val;
            this._setShape();
        }
    },
    h: {
        get: function() {
            return this._h;
        },
        set: function(val) {
            this._h = val;
            this._setShape();
        }
    }
});

Rectangle.prototype._setShape = function() {
    if (this._color !== null) {
        this.beginFill(this.color);
        this.drawRect(this.x, this.y, this.w, this.w);
        this.endFill();
    }
};

module.exports = Rectangle;