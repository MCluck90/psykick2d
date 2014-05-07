'use strict';

var Helper = require('../../helper.js'),
    RenderSystem = require('../../render-system.js');

/**
 * Renders sprites
 * @constructor
 * @extends {RenderSystem}
 */
var Sprite = function() {
    RenderSystem.call(this);
    this.requiredComponents = ['Sprite'];
};

Helper.inherit(Sprite, RenderSystem);

/**
 * Adds a sprite to the display container
 * @param {Entity} entity
 * @returns {boolean}
 */
Sprite.prototype.addEntity = function(entity) {
    if (RenderSystem.prototype.addEntity.call(this, entity)) {
        this.objectContainer.addChild(entity.getComponent('Sprite'));
        return true;
    } else {
        return false;
    }
};

/**
 * Remove a sprite
 * @param {Entity|number} entity
 * @return {boolean}
 */
Sprite.prototype.removeEntity = function(entity) {
    if (typeof entity === 'number') {
        entity = this.entities[entity];
    }

    if (RenderSystem.prototype.removeEntity.call(this, entity)) {
        this.objectContainer.removeChild(entity.getComponent('Sprite'));
        return true;
    } else {
        return false;
    }
};

module.exports = Sprite;