'use strict';

var AssetManager = require('../../asset-manager.js'),
    Helper = require('../../helper.js'),
    PIXI = require('pixi.js');

/**
 * Represents a sprite
 * @param {object}       [options]
 * @param {string}       [options.src]        Source of the texture
 * @param {string}       [options.frameName]  Name of a preloaded frame
 * @param {PIXI.Texture} [options.texture]    A PIXI texture
 * @param {number}       [options.x=0]
 * @param {number}       [options.y=0]
 * @param {number}       [options.width=0]
 * @param {number}       [options.height=0]
 * @param {number}       [options.rotation=0]
 * @param {object}       [options.pivot]      Origin point
 * @param {number}       [options.pivot.x=0]
 * @param {number}       [options.pivot.y=0]
 * @constructor
 * @extends {PIXI.Sprite}
 */
var Sprite = function(options) {
    this.NAME = 'Sprite';

    var defaults = {
        src: '',
        frameName: '',
        texture: '',
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
    var texture;
    if (options.src) {
        texture = PIXI.Texture.fromImage(options.src);
    } else if (options.frameName) {
        texture = AssetManager.SpriteSheet.getFrame(options.frameName);
    } else if (options.texture) {
        texture = options.texture;
    } else {
        throw new Error(this.NAME + ': Must provide src, frame, or texture');
    }
    PIXI.Sprite.call(this, texture);
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