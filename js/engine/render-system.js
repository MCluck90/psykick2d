Psykick.RenderSystem = function(id) {
    Psykick.System.call(this, id);
    this.DrawOrder = [];
};

// Inherit from Psykick.System
Psykick.RenderSystem.prototype = new Psykick.System();
Psykick.RenderSystem.constructor = Psykick.RenderSystem;

Psykick.RenderSystem.prototype.addEntity = function(entity) {
    Psykick.System.prototype.addEntity.call(this, entity);

    if (this.DrawOrder.indexOf(entity) === -1) {
        this.DrawOrder.push(entity);
    }
};

/**
 * Draw all of the entities.
 * Should be defined for every RenderSystem
 *
 * @param {CanvasRenderingContext2D} c
 */
Psykick.RenderSystem.prototype.draw = function(c) {};