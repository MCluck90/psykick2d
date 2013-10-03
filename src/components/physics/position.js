'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/***
 * Define a position (of an object)
 * @constructor
 * @inherit Component
 * @param   {Object}    coords
 * @param   {Number}    [coords.x]          X coordinate
 * @param   {number}    [coords.y]          Y coordinate
 * @param   {number}    [coords.rotation]   Rotation
 */

var Position = function(coords){
    this.NAME = 'Position';

    var defaults = {
        x: 0,
        y: 0,
        rotation: 0
    };

    coords = Helper.defaults(coords, defaults);
    this.x = coords.x;
    this.y = coords.y;
    this.rotation = coords.rotation;
};

Helper.inherit(Position, Component);

module.exports = Position;