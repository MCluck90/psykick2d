'use strict';

var Helper = require('../../helper.js'),
    PIXI = require('pixi.js');

var Sprite = function(options) {
    this.NAME = 'Sprite';

    var defaults = {
        src: '',
        position: {
            x: 0,
            y: 0
        },
        rotation: 0
    };
    options = Helper.defaults(options, defaults);
    PIXI.Sprite.call(this, PIXI.Texture.fromImage(options.src));
    this.position = options.position;
    this.rotation = options.rotation;
};

Helper.inherit(Sprite, PIXI.Sprite);

module.exports = Sprite;