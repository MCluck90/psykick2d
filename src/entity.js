'use strict';

/**
 * A collection of components which make up an object in the world
 * @constructor
 * @param {number} id   Unique ID assigned by the World
 */
var Entity = function(id) {
    this.id = id;
    this.components = {};
};

/**
 * Add a new component to the Entity
 * @param {object} component
 */
Entity.prototype.addComponent = function(component) {
    this.components[component.NAME] = component;
};

/**
 * Adds a component marked as a given type
 * This can be used to use one component for multiple things i.e. physics body and a rectangle
 * @param {object} component
 * @param {string} componentType Type to mark it as
 */
Entity.prototype.addComponentAs = function(component, componentType) {
    this.components[componentType] = component;
};

/**
 * Removes a component from the Entity
 * @param {object} component
 */
Entity.prototype.removeComponent = function(component) {
    var componentName = '';
    if (typeof component === 'string') {
        componentName = component;
    } else {
        componentName = component.NAME;
    }

    delete this.components[componentName];
};

/**
 * Returns the component with the matching name
 * @param {string} componentName
 * @return {object|null}
 */
Entity.prototype.getComponent = function(componentName) {
    return this.components[componentName] || null;
};

/**
 * Determine if an Entity has a given component type
 * @param {string} componentName
 * @return {boolean}
 */
Entity.prototype.hasComponent = function(componentName) {
    return this.getComponent(componentName) !== null;
};

/**
 * Provide a more descriptive toString message
 * @returns {string}
 */
Entity.prototype.toString = function() {
    return '[object Entity:' + this.id + ']';
};

module.exports = Entity;