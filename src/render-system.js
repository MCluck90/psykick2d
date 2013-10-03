'use strict';

var System = require('./system.js'),
    Helper = require('./helper.js');

/**
 * Controls how Entities are displayed.
 * Called during the "draw" stage of a frame
 * @constructor
 * @inherit System
 */
var RenderSystem = function() {
    System.call(this);
    this.drawOrder = [];
};

Helper.inherit(RenderSystem, System);

/**
 * Add a new Entity to the collection and make it the last one to be drawn
 * @param {Entity|Number} entity
 */
RenderSystem.prototype.addEntity = function(entity) {
    if (System.prototype.addEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            entity = this.entities[entity];
        }
        if (this.drawOrder.indexOf(entity) === -1) {
            this.drawOrder.push(entity);
        }
    }
};

/**
 * Removes an Entity
 * @param {Entity|Number} entity
 * @return {Boolean}
 */
RenderSystem.prototype.removeEntity = function(entity) {
    if (System.prototype.removeEntity.call(this, entity)) {
        if (entity instanceof Entity) {
            var index = this.drawOrder.indexOf(entity);
            if (index !== -1) {
                this.drawOrder.splice(index, 1);
            }
        } else {
            for (var i = 0, len = this.drawOrder.length; i < len; i++) {
                if (this.drawOrder[i].id === entity) {
                    this.drawOrder.splice(i, 1);
                    break;
                }
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
 * @param {CanvasRenderingContext2D} c
 */
RenderSystem.prototype.draw = function() {};

module.exports = RenderSystem;