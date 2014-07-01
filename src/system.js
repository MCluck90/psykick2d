'use strict';

var Entity = require('./entity.js'),
    Helper = require('./helper.js');

/**
 * A system is what defines how entities behave or are rendered
 * @constructor
 */
var System = function() {
    this.entities = {};
    this.requiredComponents = [];
    this.active = true;
    this._removalQueue = [];
};

/**
 * Add a new Entity to the collection
 * @param {Entity}      entity
 * @returns {boolean}   Returns true if Entity could be added
 */
System.prototype.addEntity = function(entity) {
    if (entity instanceof Entity) {
        // Only add entities with required components
        for (var i = 0, len = this.requiredComponents.length; i < len; i++) {
            if (!(this.requiredComponents[i] in entity.components)) {
                return false;
            }
        }
        this.entities[entity.id] = entity;
        return true;
    } else {
        throw new Error('Invalid Argument: \'entity\' must be an instance of Entity');
    }
};

/**
 * Remove an Entity from the collection
 * @param {Entity|number}      entity
 * @return {boolean}    True if the entity was removed
 */
System.prototype.removeEntity = function(entity) {
    var entityID = entity;
    if (entity instanceof Entity) {
        entityID = entity.id;
    }

    if (Helper.has(this.entities, entityID)) {
        delete this.entities[entityID];
        return true;
    }

    return false;
};

/**
 * Marks an Entity for removal at the end of the update or draw phase
 * @param {Entity|number} entityID
 */
System.prototype.safeRemoveEntity = function(entityID) {
    if (entityID instanceof Entity) {
        entityID = entityID.id;
    }

    if (this._removalQueue.indexOf(entityID) === -1) {
        this._removalQueue.push(entityID);
    }
};

/**
 * Removes all Entity's in the removal queue
 */
System.prototype.clearRemovalQueue = function() {
    for (var i = 0, len = this._removalQueue.length; i < len; i++) {
        this.removeEntity(this._removalQueue[i]);
    }
    this._removalQueue = [];
};

module.exports = System;