'use strict';

var Helper = require('../../helper.js'),
    PIXI = require('pixi.js');

/**
 * Optimized for rendering tiled sprites
 * @param options
 * @constructor
 * @implements {Sprite}
 * @extends {TilingSprite}
 */
var TiledSprite = function(options) {
    this.NAME = 'TiledSprite';
    var defaults = {
        src: null,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        frame: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
    };

    options = Helper.defaults(options, defaults);
    this.frame = new PIXI.Rectangle(
        options.frame.x,
        options.frame.y,
        options.frame.width,
        options.frame.height
    );
    this._src = options.src;
    var texture = PIXI.Texture.fromImage(options.src);
    PIXI.TilingSprite.call(this, texture, options.width, options.height);
    this.tilePosition.x = -this.frame.x;
    this.tilePosition.y = -this.frame.y;
    var self = this;
    this.texture.baseTexture.on('loaded', function() {
        self.texture.setFrame(self.frame);
        self.generateTilingTexture();
    });
};

Helper.inherit(TiledSprite, PIXI.TilingSprite);

// Update the texture when the image is changed
Object.defineProperty(TiledSprite.prototype, 'src', {
    get: function() {
        return this._src;
    },
    set: function(src) {
        this._src = src;
        var texture = PIXI.Texture.fromImage(src);
        texture.setFrame(this.frame);
    }
});

/**
 * Update the tile frame
 * @param {object} options
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {number} [options.width]
 * @param {number} [options.height]
 */
TiledSprite.prototype.setFrame = function(options) {
    var defaults = {
        x: this.frame.x,
        y: this.frame.y,
        width: this.frame.width,
        height: this.frame.height
    };
    options = Helper.defaults(options, defaults);
    this.frame.x = options.x;
    this.frame.y = options.y;
    this.frame.width = options.width;
    this.frame.height = options.height;
    this.tilePosition.x = -options.x;
    this.tilePosition.y = -options.y;

    // Make sure the texture gets updated
    this.src = this._src;
};

module.exports = TiledSprite;