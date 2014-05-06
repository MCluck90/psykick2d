'use strict';

var Helper = require('../helper.js'),
    PIXI = require('pixi.js');

var Shape = function(options) {
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