'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Define a rectangle (often used in collisions)
 * @constructor
 * @inherit Component
 * @param   {Object}    options
 * @param   {Number}    [options.x=0]   X coordinate
 * @param   {Number}    [options.y=0]   Y coordinate
 * @param   {Number}    [options.w=0]   Width
 * @param   {Number}    [options.h=0]   Height
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

