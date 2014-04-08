'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Defines a sprite sheet
 * @constructor
 * @inherit Component
 * @param {Object} options
 * @param {String} [options.src=null]      Path to the image
 * @param {number} [options.width=0]       Width of the sprite sheet
 * @param {number} [options.height=0]      Height of the sprite sheet
 * @param {number} [options.frameWidth=0]  Width of the individual frames
 * @param {number} [options.frameHeight=0] Height of the individual frames
 * @param {number} [options.xOffset=0]     Initial x offset
 * @param {number} [options.yOffset=0]     Initial y offset
 * @param {string} [options.repeat=null]   Type of repeating pattern to use
 */
var SpriteSheet = function(options) {
    // Unique name for reference in Entities
    this.NAME = 'SpriteSheet';

    var self = this,
        defaults = {
            src: null,
            frameWidth: 0,
            frameHeight: 0,
            xOffset: 0,
            yOffset: 0,
            repeat: null
        };

    options = Helper.defaults(options, defaults);
    this.img = new Image();
    this.img.src = options.src;
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.xOffset = options.xOffset;
    this.yOffset = options.yOffset;
    this.repeat = options.repeat;

    // Flag when the image has been loaded
    this.loaded = false;
    this.img.onload = function() {
        self.loaded = true;
    };
};

Helper.inherit(SpriteSheet, Component);

/**
 * Returns the width of the sheet
 * @return {number}
 */
SpriteSheet.prototype.getWidth = function() {
    return this.img.width;
};

/**
 * Returns the height of the sheet
 * @return {number}
 */
SpriteSheet.prototype.getHeight = function() {
    return this.img.height;
};

/**
 * Sets the width of the sheet
 * @param {number} width
 */
SpriteSheet.prototype.setWidth = function(width) {
    this.img.width = width;
};

/**
 * Sets the height of the sheet
 * @param {number} height
 */
SpriteSheet.prototype.setHeight = function(height) {
    this.img.height = height;
};

/**
 * Changes the sheet image
 * @param {String} path
 */
SpriteSheet.prototype.changeImage = function(path) {
    this.img.src = path;
};

/**
 * Returns the offset for a given frame
 * @param {number}  [frameX=0]
 * @param {number}  [frameY=0]
 * @return {{x:number, y:number}}
 */
SpriteSheet.prototype.getOffset = function(frameX, frameY) {
    if (this.img.src === null) {
        return null;
    }

    frameX = frameX || 0;
    frameY = frameY || 0;

    var offsetX = (this.frameWidth * frameX) + this.xOffset,
        offsetY = (this.frameHeight * frameY) + this.yOffset;

    if (offsetX > this.img.width || offsetY > this.img.height) {
        return null;
    } else {
        return {
            x: offsetX,
            y: offsetY
        };
    }
};

module.exports = SpriteSheet;