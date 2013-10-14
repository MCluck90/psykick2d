'use strict';

var Component = require('./component.js');

/**
 * A collection of Components which make up an object in the world
 * @constructor
 * @param {number} id   Unique ID assigned by the World
 */
var Entity = function(id) {
    this.id = id;
    this.components = {};
    this.parentLayer = null;
};

/**
 * Tells the Entity which Layer owns it.
 * Should only be used by the World
 * @param {Layer} layer
 */
Entity.prototype.setParentLayer = function(layer) {
    if (typeof layer === 'object' && layer.id !== undefined) {
        this.parentLayer = layer;
    } else {
        throw 'Invalid Argument: \'layer\' must be an instance of Layer';
    }
};

/**
 * Add a new Component to the Entity
 * @param {Component|*} component
 */
Entity.prototype.addComponent = function(component) {
    if (component instanceof Component) {
        this.components[component.NAME] = component;
    }
};

/**
 * Removes a Component from the Entity
 * @param {Component} componentName
 */
Entity.prototype.removeComponent = function(componentName) {
    if (componentName instanceof Component) {
        componentName = componentName.NAME;
    }

    delete this.components[componentName];
};

/**
 * Returns the component with the matching name
 * @param {String} componentName
 * @return {Component|null}
 */
Entity.prototype.getComponent = function(componentName) {
    if (componentName in this.components) {
        return this.components[componentName];
    } else {
        return null;
    }
};

/**
 * Determine if an Entity has a given component type
 * @param {String} componentName
 * @return {boolean}
 */
Entity.prototype.hasComponent = function(componentName) {
    return this.getComponent(componentName) !== null;
};

module.exports = Entity;