'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

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

Helper.inherit(RectPhysicsBody, Component);

module.exports = RectPhysicsBody;