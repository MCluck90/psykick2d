'use strict';

var Helper = require('../../helper.js'),
    RenderSystem = require('../../render-system.js');

/**
 * Renders an animated sprite
 *
 * @inherit RenderSystem
 * @constructor
 */
var Sprite = function() {
    RenderSystem.call(this);
    this.requiredComponents = ['SpriteSheet', 'Position'];
};

Helper.inherit(Sprite, RenderSystem);

/**
 * Draw all the sprites
 * @param {CanvasRenderingContext2D} c
 */
Sprite.prototype.draw = function(c) {
    for (var i = 0, len = this.drawOrder.length; i < len; i++) {
        var entity = this.drawOrder[i],
            spriteSheet = entity.getComponent('SpriteSheet'),
            position = entity.getComponent('Position');

        c.save();
        c.translate(position.x, position.y);
        c.rotate(position.rotation);
        c.drawImage(
            spriteSheet.img,
            spriteSheet.xOffset,
            spriteSheet.yOffset,
            spriteSheet.frameWidth,
            spriteSheet.frameHeight,
            -spriteSheet.frameWidth / 2,
            -spriteSheet.frameHeight / 2,
            spriteSheet.frameWidth,
            spriteSheet.frameHeight
        );
        c.restore();
    }
};

module.exports = Sprite;