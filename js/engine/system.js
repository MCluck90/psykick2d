/**
 * @namespace   Collection of built-in Systems
 */
Psykick.Systems = {};

(function() {
    "use strict";

    /**
     * A system is what defines how entities behave or are rendered
     * @constructor
     * @property    {Object}                Entities            Collection of associated Entities
     * @property    {Psykick.Layer|null}    Parent              Owner of the System
     * @property    {String[]}              RequiredComponents  Names of needed Components
     * @property    {Boolean}               Active              If true, the System will be used
     */
    Psykick.System = function() {
        this.Entities = {};
        this.Parent = null;
        this.RequiredComponents = [];
        this.Active = true;
    };

    /**
     * Sets which layer this system belongs to
     * @param {Psykick.Layer} layer
     */
    Psykick.System.prototype.setParentLayer = function(layer) {
        if (layer instanceof Psykick.Layer) {
            this.Parent = layer;
        } else {
            throw "Invalid argument: 'layer' must be an instance of Psykick.Layer";
        }
    };

    /**
     * Add a new Entity to the collection
     * @param {Psykick.Entity} entity
     */
    Psykick.System.prototype.addEntity = function(entity) {
        if (entity instanceof Psykick.Entity) {
            // Only add entities with required components
            for (var i = 0, len = this.RequiredComponents.length; i < len; i++) {
                if (!(this.RequiredComponents[i] in entity.Components)) {
                    return;
                }
            }
            this.Entities[entity.ID] = entity;
        } else {
            throw "Invalid Argument: 'entity' must be an instance of Psykick.Entity";
        }
    };

    /**
     * Remove an Entity from the collection
     * @param {Psykick.Entity} entity
     */
    Psykick.System.prototype.removeEntity = function(entity) {
        if (entity instanceof Psykick.Entity) {
            delete this.Entities[entity.ID];
        } else {
            throw "Invalid Argument: 'entity' must be an instance of Psykick.Entity";
        }
    };

})();