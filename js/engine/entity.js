(function() {
    "use strict";

    /**
     * A collection of Components which make up an object in the world
     * @constructor
     * @param {Number} id   Unique ID assigned by the World
     */
    Psykick.Entity = function(id) {
        this.ID = id;
        this.Components = {};
        this.Parent = null;
    };

    /**
     * Tells the Entity which Layer owns it.
     * Should only be used by the World
     * @param {Psykick.Layer} layer
     */
    Psykick.Entity.prototype.setParentLayer = function(layer) {
        if (layer instanceof Psykick.Layer) {
            this.Parent = layer;
        } else {
            throw "Invalid Argument: 'layer' must be an instance of Psykick.Layer";
        }
    };

    /**
     * Add a new Component to the Entity
     * @param {Psykick.Component|*} component
     */
    Psykick.Entity.prototype.addComponent = function(component) {
        if (component instanceof Psykick.Component) {
            this.Components[component.Name] = component;
        }
    };

    /**
     * Removes a Component from the Entity
     * @param {Psykick.Component} componentName
     */
    Psykick.Entity.prototype.removeComponent = function(componentName) {
        if (componentName instanceof Psykick.Component) {
            componentName = componentName.Name;
        }

        delete this.Components[componentName];
    };

    /**
     * Returns the component with the matching name
     * @param {String} componentName
     * @return {Psykick.Component|null}
     */
    Psykick.Entity.prototype.getComponent = function(componentName) {
        if (componentName in this.Components) {
            return this.Components[componentName];
        } else {
            return null;
        }
    };

    /**
     * Determine if an Entity has a given component type
     * @param {String} componentName
     * @return {Boolean}
     */
    Psykick.Entity.prototype.hasComponent = function(componentName) {
        return this.getComponent(componentName) !== null;
    };

})();