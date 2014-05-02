'use strict';

var System = require('./system.js'),
    Helper = require('./helper.js'),
    PIXI = require('pixi.js');

/**
 * Controls how Entities are displayed.
 * Called during the "draw" stage of a frame
 * @constructor
 * @inherit System
 */
var RenderSystem = function() {
    System.call(this);
    this.drawOrder = [];
    this.objectContainer = new PIXI.DisplayObjectContainer();
};

Helper.inherit(RenderSystem, System);

/**
 * Add a new Entity to the collection and make it the last one to be drawn
 * @param {Entity|number} entity
 */
RenderSystem.prototype.addEntity = function(entity) {
    if (System.prototype.addEntity.call(this, entity)) {
        if (this.drawOrder.indexOf(entity) === -1) {
            this.drawOrder.push(entity);
            return true;
        }
    }
    return false;
};

/**
 * Removes an Entity
 * @param {Entity|number} entity
 * @return {boolean}
 */
RenderSystem.prototype.removeEntity = function(entity) {
    if (System.prototype.removeEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            for (var i = 0, len = this.drawOrder.length; i < len; i++) {
                if (this.drawOrder[i].id === entity) {
                    this.drawOrder.splice(i, 1);
                    break;
                }
            }
        } else {
            var index = this.drawOrder.indexOf(entity);
            if (index !== -1) {
                this.drawOrder.splice(index, 1);
            }
        }

        return true;
    } else {
        return false;
    }
};

/**
 * Draw all of the entities.
 * Should be defined for every RenderSystem
 * @param {Layer} layer     Layer being drawn
 */
RenderSystem.prototype.draw = function() {};

module.exports = RenderSystem;