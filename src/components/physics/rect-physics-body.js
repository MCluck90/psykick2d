'use strict';

var Helper = require('../../helper.js');

/**
 * A rectangular physics body
 * @param {object}  [options]
 * @param {number}  [options.x=0]
 * @param {number}  [options.y=0]
 * @param {number}  [options.width=0]
 * @param {number}  [options.height=0]
 * @param {object}  [options.velocity]
 * @param {number}  [options.velocity.x=0]
 * @param {number}  [options.velocity.y=0]
 * @param {boolean} [options.immovable=false]
 * @param {number}  [options.mass=0]
 * @param {number}  [options.bounciness=0]
 * @param {boolean} [options.solid=true]
 * @param {number}  [options.rotation=0]
 * @param {number}  [options.friction=1]
 * @constructor
 */
var RectPhysicsBody = function(options) {
    this.NAME = 'RectPhysicsBody';

    var defaults = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        velocity: {
            x: 0,
            y: 0
        },
        immovable: false,
        mass: 0,
        bounciness: 0,
        solid: true,
        rotation: 0,
        friction: 1
    };

    options = Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.velocity = options.velocity;
    this.mass = options.mass;
    this.bounciness = options.bounciness;
    this.solid = options.solid;
    this.rotation = options.rotation;
    this.friction = options.friction;
};

module.exports = RectPhysicsBody;