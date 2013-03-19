(function() {
    "use strict";

    /**
     * Controls how Entities are displayed.
     * Called during the "draw" stage of a frame
     * @constructor
     * @inherit Psykick.System
     */
    Psykick.RenderSystem = function() {
        Psykick.System.call(this);
        this.DrawOrder = [];
    };

    // Inherit from Psykick.System
    Psykick.RenderSystem.prototype = new Psykick.System();
    Psykick.RenderSystem.constructor = Psykick.RenderSystem;

    /**
     * Add a new Entity to the collection and make it the last one to be drawn
     * @param {Psykick.Entity} entity
     */
    Psykick.RenderSystem.prototype.addEntity = function(entity) {
        Psykick.System.prototype.addEntity.call(this, entity);

        if (this.DrawOrder.indexOf(entity) === -1) {
            this.DrawOrder.push(entity);
        }
    };

    /**
     * Removes an Entity
     * @param {Psykick.Entity} entity
     */
    Psykick.RenderSystem.prototype.removeEntity = function(entity) {
        Psykick.System.prototype.removeEntity.call(this, entity);

        var index = this.DrawOrder.indexOf(entity);
        if (index !== -1) {
            this.DrawOrder.splice(index, 1);
        }
    };

    /**
     * Draw all of the entities.
     * Should be defined for every RenderSystem
     * @param {CanvasRenderingContext2D} c
     */
    Psykick.RenderSystem.prototype.draw = function(c) {};

})();