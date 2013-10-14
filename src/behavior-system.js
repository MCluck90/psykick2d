'use strict';

var System = require('./system.js'),
    Helper = require('./helper.js');

/**
 * Controls the behavior of entities.
 * Called during the "update" stage of a frame
 * @constructor
 * @inherit System
 * @property    {Entity[]}  actionOrder Order in which the entites will be acted upon
 */
var BehaviorSystem = function() {
    System.call(this);
    this.actionOrder = [];
};

Helper.inherit(BehaviorSystem, System);

/**
 * Add a new Entity to the collection and make it the last one to be updated
 * @param {Entity} entity
 */
BehaviorSystem.prototype.addEntity = function(entity) {
    if (System.prototype.addEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            entity = this.entities[entity];
        }
        if (this.actionOrder.indexOf(entity) === -1) {
            this.actionOrder.push(entity);
        }

        return true;
    } else {
        return false;
    }
};

/**
 * Removes an Entity from the System
 * @param {Entity|number} entity
 * @returns {boolean}
 */
BehaviorSystem.prototype.removeEntity = function(entity) {
    if (System.prototype.removeEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            for (var i = 0, len = this.actionOrder.length; i < len; i++) {
                if (this.actionOrder[i].id === entity) {
                    this.actionOrder.splice(i, 1);
                    break;
                }
            }
        } else {
            var index = this.actionOrder.indexOf(entity);
            if (index !== -1) {
                this.actionOrder.splice(index, 1);
            }
        }

        return true;
    } else {
        return false;
    }


};

/**
 * Updates all of the entities.
 * Should be redefined in each new instance of a BehaviorSystem
 * @param {number} delta    Amount of time that's passed since the last update
 */
BehaviorSystem.prototype.update = function() {};

module.exports = BehaviorSystem;