'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * A generic container for color information
 * @constructor
 * @param {Object}      options
 * @param {String[]}    [options.colors=[]] CSS-compatible color codes
 */
var Color = function(options) {
    this.NAME = 'Color';

    var defaults = {
        colors: []
    };

    options = Helper.defaults(options, defaults);
    this.colors = options.colors;
};

Helper.inherit(Color, Component);

module.exports = Color;