'use strict';

var Helper = require('../../helper.js'),
    PIXI = require('pixi.js');

var Sprite = function(options) {
    this.NAME = 'Sprite';

    var defaults = {
        src: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotation: 0,
        pivot: {
            x: 0,
            y: 0
        }
    };
    options = Helper.defaults(options, defaults);
    PIXI.Sprite.call(this, PIXI.Texture.fromImage(options.src));
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.rotation = options.rotation;
    this.pivot.x = options.pivot.x;
    this.pivot.y = options.pivot.y;
};

Helper.inherit(Sprite, PIXI.Sprite);

module.exports = Sprite;