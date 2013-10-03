'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Defines a single point
 * @constructor
 * @inherit Component
 * @param   {Object}    options
 * @param   {Number}    [options.x=0]   X coordinate
 * @param   {Number}    [options.y=0]   Y coordinate
 */
var Point = function(options) {
    this.NAME = 'Point';

    var defaults = {
        x: 0,
        y: 0
    };

    options = Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
};

Helper.inherit(Point, Component);

module.exports = Point;