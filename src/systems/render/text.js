'use strict';

var RenderSystem = require('../../render-system.js'),
    Helper = require('../../helper.js');

/**
 * Renders text
 *
 * @inherit RenderSystem
 * @constructor
 */
var Text = function() {
    RenderSystem.call(this);
    this.requiredComponents = ['Text', 'Color'];
};

Helper.inherit(Text, RenderSystem);

/**
 * Draws all of the text
 * @param {CanvasRenderingContext2D} c
 */
Text.prototype.draw = function(c) {
    for (var i = 0, len = this.drawOrder.length; i < len; i++) {
        var entity = this.drawOrder[i],
            textComponent = entity.getComponent('Text'),
            color = entity.getComponent('Color').colors[0];

        c.font = textComponent.size + ' ' + textComponent.font;
        c.fillStyle = color;
        c.fillText(textComponent.text, textComponent.x, textComponent.y);
    }
};

module.exports = Text;