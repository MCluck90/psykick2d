'use strict';

var Helper = require('../../helper.js'),
    Shape = require('../shape.js');

/**
 * A generic circle
 * @param {object} options
 * @constructor
 * @extends {Shape}
 */
var Circle = function(options) {
    this.NAME = 'Circle';

    var defaults = {
        x: 0,
        y: 0,
        radius: 0
    };

    options = Helper.defaults(options, defaults);
    Shape.call(this, options);

    this.x = options.x;
    this.y = options.y;
    this._radius = 0;
    this.radius = options.radius;
};

Helper.inherit(Circle, Shape);

Object.defineProperty(Circle.prototype, 'radius', {
    get: function() {
        return this._radius;
    },
    set: function(val) {
        this._radius = val;
        this._setShape();
    }
});

Circle.prototype._setShape = function() {
    if (this._color !== null) {
        this.beginFill(this.color);
        this.drawCircle(0, 0, this._radius);
        this.endFill();
    }
};

module.exports = Circle;