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
    this.requiredComponents = ['SpriteSheet', 'Rectangle'];
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
            rect = entity.getComponent('Rectangle');
        if (!spriteSheet.loaded) {
            continue;
        }

        c.save();
        if (spriteSheet.repeat) {
            c.translate(rect.x, rect.y);
            c.rotate(rect.rotation);
            var patternCanvas = document.createElement('canvas');
            patternCanvas.width = spriteSheet.frameWidth;
            patternCanvas.height = spriteSheet.frameHeight;
            var patternContext = patternCanvas.getContext('2d');
            patternContext.drawImage(
                spriteSheet.img,
                spriteSheet.xOffset,
                spriteSheet.yOffset,
                spriteSheet.frameWidth,
                spriteSheet.frameHeight,
                0,
                0,
                spriteSheet.frameWidth,
                spriteSheet.frameHeight
            );
            c.fillStyle = c.createPattern(patternCanvas, spriteSheet.repeat);
            c.fillRect(
                0,
                0,
                rect.w,
                rect.h
            );
        } else {
            c.translate(rect.x + rect.w / 2, rect.y + rect.h / 2);
            c.rotate(rect.rotation);
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
        }
        c.restore();
    }
};

module.exports = Sprite;