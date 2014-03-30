'use strict';

var Helper = require('../../helper.js'),
    RenderSystem = require('../../render-system.js');

/**
 * Renders colored rectangles
 * @constructor
 */
var ColoredRect = function() {
    RenderSystem.call(this);
    this.requiredComponents = ['Color', 'Rectangle'];
};

Helper.inherit(ColoredRect, RenderSystem);

/**
 * Draws all the rectangles
 * @param {CanvasRenderingContext2D} c
 */
ColoredRect.prototype.draw = function(c) {
    for (var i = 0, len = this.drawOrder.length; i < len; i++) {
        var entity = this.drawOrder[i],
            color = entity.getComponent('Color').colors[0],
            rect = entity.getComponent('Rectangle');
        c.fillStyle = color;
        c.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
};

module.exports = ColoredRect;