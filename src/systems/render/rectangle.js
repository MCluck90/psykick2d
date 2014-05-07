'use strict';

var Helper = require('../../helper.js'),
    RenderSystem = require('../../render-system.js');

/**
 * Renders rectangles
 * @constructor
 * @extends {RenderSystem}
 */
var Rectangle = function() {
    RenderSystem.call(this);
    this.requiredComponents = ['Rectangle'];
};

Helper.inherit(Rectangle, RenderSystem);

/**
 * Add the rectangles to the scene
 * @param {Entity} entity
 * @returns {boolean}
 */
Rectangle.prototype.addEntity = function(entity) {
    if (RenderSystem.prototype.addEntity.call(this, entity)) {
        this.objectContainer.addChild(entity.getComponent('Rectangle'));
        return true;
    } else {
        return false;
    }
};

/**
 * Remove rectangles from the scene
 * @param {Entity|number} entity
 * @returns {boolean}
 */
Rectangle.prototype.removeEntity = function(entity) {
    if (typeof entity === 'number') {
        entity = this.entities[entity];
    }

    if (RenderSystem.prototype.removeEntity.call(this, entity)) {
        this.objectContainer.removeChild(entity.getComponent('Rectangle'));
        return true;
    } else {
        return false;
    }
};

module.exports = Rectangle;