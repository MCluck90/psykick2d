'use strict';

var AssetManager = require('../../asset-manager.js'),
    Helper = require('../../helper.js'),
    PIXI = require('pixi.js');

/**
 * Optimized for rendering tiled sprites
 * @param {object} options
 * @constructor
 * @extends {PIXI.TilingSprite}
 */
var TiledSprite = function(options) {
    this.NAME = 'TiledSprite';
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
        },
        frame: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
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

    PIXI.TilingSprite.call(this, texture, options.width, options.height);

    if (options.src) {
        var self = this;
        this.texture.baseTexture.on('loaded', function() {
            self.texture.setFrame(new PIXI.Rectangle(
                options.frame.x,
                options.frame.y,
                options.frame.width,
                options.frame.height
            ));
            self.generateTilingTexture();
        });
    }

    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.rotation = options.rotation;
    this.pivot.x = options.pivot.x;
    this.pivot.y = options.pivot.y;
};

Helper.inherit(TiledSprite, PIXI.TilingSprite);

module.exports = TiledSprite;