'use strict';

var Helper = require('../../helper.js'),
    RenderSystem = require('../../render-system.js');

/**
 * Renders text
 * @constructor
 * @extends {RenderSystem}
 */
var Text = function() {
    RenderSystem.call(this);
    this.requiredComponents = ['Text'];
};

Helper.inherit(Text, RenderSystem);

/**
 * Adds the PIXI.Text objects to the scene
 * @param {Entity} entity
 * @returns {boolean}
 */
Text.prototype.addEntity = function(entity) {
    if (RenderSystem.prototype.addEntity.call(this, entity)) {
        this.objectContainer.addChild(entity.getComponent('Text'));
        return true;
    }
    return false;
};

/**
 * Removes an entity and the matching Text object
 * @param {Entity|number} entity
 * @returns {boolean}
 */
Text.prototype.removeEntity = function(entity) {
    if (typeof entity === 'number') {
        entity = this.entities[entity];
    }

    if (RenderSystem.prototype.removeEntity.call(this, entity)) {
        this.objectContainer.removeChild(entity.getComponent('Text'));
        return true;
    }
    return false;
};

module.exports = Text;