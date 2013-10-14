'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Defines a simple circle
 * @constructor
 * @inherit Component
 * @param   {Object}    options
 * @param   {number}    [options.x=0]   Center x coordinate
 * @param   {number}    [options.y=0]   Center y coordinate
 * @param   {number}    [options.r=0]   Radius
 */
var Circle = function(options) {
    this.NAME = 'Circle';

    var defaults = {
        x: 0,
        y: 0,
        r: 0
    };

    options = Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
    this.r = options.r;
};

Helper.inherit(Circle, Component);

module.exports = Circle;