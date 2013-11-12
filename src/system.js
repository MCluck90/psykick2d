'use strict';

var Entity = require('./entity.js'),
    Helper = require('./helper.js');

/**
 * A system is what defines how entities behave or are rendered
 * @constructor
 */
var System = function() {
    this.entities = {};
    this.parentLayer = null;
    this.requiredComponents = [];
    this.active = true;
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
        throw 'Invalid Argument: \'entity\' must be an instance of Entity';
    }
};

/**
 * Remove an Entity from the collection
 * @param {Entity}      entity
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
    } else {
        return false;
    }
};

module.exports = System;