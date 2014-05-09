'use strict';

var Helper = require('../../helper.js'),
    RenderSystem = require('../../render-system.js');

/**
 * Renders arbitrary shapes
 * @constructor
 * @extends {RenderSystem}
 */
var Shape = function() {
    RenderSystem.call(this);
    this.shapeComponents = ['Shape', 'Rectangle', 'Circle'];
    this._componentTypeByEntity = {};
};

Helper.inherit(Shape, RenderSystem);

/**
 * Add shapes to the scene
 * @param {Entity} entity
 * @returns {boolean}
 */
Shape.prototype.addEntity = function(entity) {
    for (var i = 0, len = this.shapeComponents.length; i < len; i++) {
        var componentType = this.shapeComponents[i],
            component = entity.getComponent(componentType);
        if (component) {
            this._componentTypeByEntity[entity.id] = componentType;
            this.objectContainer.addChild(component);
            this.entities[entity.id] = entity;
            return true;
        }
    }
    return false;
};

/**
 * Remove shapes from the scene
 * @param {Entity|number} entity
 * @returns {boolean}
 */
Shape.prototype.removeEntity = function(entity) {
    if (typeof entity === 'number') {
        entity = this.entities[entity];
    }

    if (RenderSystem.prototype.removeEntity.call(this, entity)) {
        var componentType = this._componentTypeByEntity[entity.id],
            component = entity.getComponent(componentType);
        this.objectContainer.removeChild(component);
        delete this._componentTypeByEntity[entity.id];
        return true;
    } else {
        return false;
    }
};

module.exports = Shape;