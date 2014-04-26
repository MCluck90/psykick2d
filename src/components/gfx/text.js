'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Represents some text
 * @param {object} [options]
 * @param {string} [options.text]
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {string} [options.font]
 * @param {string} [options.size]
 * @inherit Component
 * @constructor
 */
var Text = function(options) {
    this.NAME = 'Text';
    var defaults = {
        text: '',
        x: 0,
        y: 0,
        font: '',
        size: '0px'
    };
    Helper.extend(this, defaults, options);
};

Helper.inherit(Text, Component);

module.exports = Text;