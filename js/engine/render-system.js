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
        if (Psykick.System.prototype.addEntity.call(this, entity)) {
            if (this.DrawOrder.indexOf(entity) === -1) {
                this.DrawOrder.push(entity);
            }
        }
    };

    /**
     * Removes an Entity
     * @param {Psykick.Entity} entity
     * @return {Boolean}
     */
    Psykick.RenderSystem.prototype.removeEntity = function(entity) {
        if (Psykick.System.prototype.removeEntity.call(this, entity)) {
            if (entity instanceof Psykick.Entity) {
                var index = this.DrawOrder.indexOf(entity);
                if (index !== -1) {
                    this.DrawOrder.splice(index, 1);
                }
            } else {
                for (var i = 0, len = this.DrawOrder.length; i < len; i++) {
                    if (this.DrawOrder[i].ID === entity) {
                        this.DrawOrder.splice(i, 1);
                        break;
                    }
                }
            }

            return true;
        } else {
            return false;
        }
    };

    /**
     * Draw all of the entities.
     * Should be defined for every RenderSystem
     * @param {CanvasRenderingContext2D} c
     */
    Psykick.RenderSystem.prototype.draw = function(c) {};

})();