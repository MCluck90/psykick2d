'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * A generic rectangle
 * @constructor
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
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
};

Helper.inherit(Rectangle, Component);

module.exports = Rectangle;