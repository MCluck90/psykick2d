'use strict';

var Helper = require('../../helper.js');

/**
 * A generic container for color information
 * @constructor
 * @param {object}      [options]
 * @param {string[]}    [options.colors=[]] CSS-compatible color codes
 */
var Color = function(options) {
    this.NAME = 'Color';

    var defaults = {
        colors: []
    };

    options = Helper.defaults(options, defaults);
    this.colors = options.colors;
};

module.exports = Color;