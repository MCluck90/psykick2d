/**
 * A layer houses a set of entities to be updated/drawn on each frame
 *
 * @param {Number} id   Unique identifier given by the World
 * @constructor
 */
Psykick.Layer = function(id) {
    this.ID = id;
    this.Entities = {};
    this.RenderSystems = [];
    this.BehaviorSystems = [];
    this.Visible = true;
    this.Active = true;
};

/**
 * Add an entity to the layer
 *
 * @param {Psykick.Entity} entity
 */
Psykick.Layer.prototype.addEntity = function(entity) {
    entity.setParentLayer(this);
    this.Entities[entity.ID] = entity;
};

/**
 * Removes an entity from the layer
 *
 * @param {Number|Psykick.Entity} entityID
 */
Psykick.Layer.prototype.removeEntity = function(entityID) {
    if (entityID instanceof Psykick.Entity) {
        entityID = entityID.ID;
    }

    delete this.Entities[entityID];

    // Delete the entity from any systems
    for (var i = 0, len = this.Systems.length; i < len; i++) {

    }
};

Psykick.Layer.prototype.addSystem = function(system) {
    if (!(system instanceof Psykick.System)) {
        throw "Invalid argument: 'system' must be an instance of Psykick.System";
    }

    if (system instanceof Psykick.BehaviorSystem) {

    }
}

/**
 * Draw the layer
 *
 * @param {CanvasRenderingContext2D} c
 */
Psykick.Layer.prototype.draw = function(c) {
    if (this.Visible && this.RenderSystems.length > 0) {
        for (var i = 0, len = this.RenderSystems.length; i < len; i++) {
            this.RenderSystems[i].draw(c);
        }
    }
};

/**
 * Update the layer
 *
 * @param {Number} delta    Amount of time since the last update
 */
Psykick.Layer.prototype.update = function(delta) {
    if (this.Active && this.BehaviorSystems.length > 0) {
        for (var i = 0, len = this.BehaviorSystems.length; i < len; i++) {
            this.BehaviorSystems[i].update(delta);
        }
    }
};