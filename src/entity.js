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
 * Adds a Component marked as a given type
 * This can be used to use one component for multiple things i.e. physics body and a rectangle
 * @param {Component} component
 * @param {string} componentType Type to mark it as
 */
Entity.prototype.addComponentAs = function(component, componentType) {
    if (component instanceof Component) {
        this.components[componentType] = component;
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