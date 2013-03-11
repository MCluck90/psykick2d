(function() {
    "use strict";

    /**
     * A system is what defines how entities behave or are rendered
     *
     * @param {Number} id
     * @constructor
     */
    Psykick.System = function(id) {
        this.ID = id;
        this.Entities = {};
        this.Parent = null;
    };

    /**
     * Sets which layer this system belongs to
     *
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
     *
     * @param {Psykick.Entity} entity
     */
    Psykick.System.prototype.addEntity = function(entity) {
        if (entity instanceof Psykick.Entity) {
            this.Entities[entity.ID] = entity;
        } else {
            throw "Invalid Argument: 'entity' must be an instance of Psykick.Entity";
        }
    };

    /**
     * Remove an Entity from the collection
     *
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