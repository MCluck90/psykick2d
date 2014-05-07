'use strict';

var Helper = require('../../helper.js');

/**
 * A rectangular physics body
 * @param {object}  [options]
 * @param {number}  [options.x=0]
 * @param {number}  [options.y=0]
 * @param {number}  [options.w=0]            Width
 * @param {number}  [options.h=0]            Height
 * @param {object}  [options.velocity]
 * @param {number}  [options.velocity.x=0]
 * @param {number}  [options.velocity.y=0]
 * @param {number}  [options.mass=0]
 * @param {number}  [options.bounciness=0]
 * @param {boolean} [options.solid=true]
 * @param {number}  [options.rotation=0]
 * @constructor
 */
var RectPhysicsBody = function(options) {
    this.NAME = 'RectPhysicsBody';

    var defaults = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        velocity: {
            x: 0,
            y: 0
        },
        mass: 0,
        bounciness: 0,
        solid: true,
        rotation: 0
    };

    options = Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
    this.velocity = options.velocity;
    this.mass = options.mass;
    this.bounciness = options.bounciness;
    this.solid = options.solid;
    this.rotation = options.rotation;
};

module.exports = RectPhysicsBody;