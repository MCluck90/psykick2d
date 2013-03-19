/**
 * A layer houses a set of entities to be updated/drawn on each frame
 * @constructor
 * @param {Number}  id          Unique identifier given by the World
 * @param {Element} container   Layer container
 */
Psykick.Layer = function(id, container) {
    this.ID = id;
    this.Entities = {};
    this.RenderSystems = [];
    this.BehaviorSystems = [];
    this.Visible = true;
    this.Active = true;
    this.container = container;

    // Create a new canvas to draw on
    var canvas = document.createElement("canvas");
    canvas.width = parseInt(container.style.width);
    canvas.height = parseInt(container.style.height);
    canvas.setAttribute("id", "psykick-layer-" + id);
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.zIndex = 0;

    this.c = canvas.getContext("2d");
};

/**
 * Removes the canvas to ensure no additional drawing is done
 */
Psykick.Layer.prototype.removeCanvas = function() {
    this.c.canvas.parentNode.removeChild(this.c.canvas);
};

/**
 * Puts the layers canvas back in the container if it was removed
 */
Psykick.Layer.prototype.restoreCanvas = function() {
    if (document.getElementById("psykick-layer-" + this.ID) === null) {
        this.container.appendChild(this.c.canvas);
    }
};

/**
 * Set the depth layer index
 * @param {Number} zIndex
 */
Psykick.Layer.prototype.setZIndex = function(zIndex) {
    this.c.canvas.style.zIndex = zIndex;
};

/**
 * Add an entity to the layer
 * @param {Psykick.Entity} entity
 */
Psykick.Layer.prototype.addEntity = function(entity) {
    entity.setParentLayer(this);
    this.Entities[entity.ID] = entity;
};

/**
 * Removes an entity from the layer
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

/**
 * Add a new system to the layer
 * @param {Psykick.System} system
 */
Psykick.Layer.prototype.addSystem = function(system) {
    if (!(system instanceof Psykick.System)) {
        throw "Invalid argument: 'system' must be an instance of Psykick.System";
    }

    system.setParentLayer(this);

    if (system instanceof Psykick.BehaviorSystem && this.BehaviorSystems.indexOf(system) === -1) {
        this.BehaviorSystems.push(system);
    } else if (system instanceof Psykick.RenderSystem && this.RenderSystems.indexOf(system) === -1) {
        this.RenderSystems.push(system);
    }
};

/**
 * Draw the layer
 */
Psykick.Layer.prototype.draw = function() {
    // If the node doesn't exist, don't even try to draw
    if (this.c.canvas.parentNode === null) {
        return;
    }

    this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);

    // Only draw if "visible" and have some kind of system for rendering
    if (this.Visible && this.RenderSystems.length > 0) {
        this.c.save();
        for (var i = 0, len = this.RenderSystems.length; i < len; i++) {
            var system = this.RenderSystems[i];
            if (system.Active) {
                system.draw(this.c);
            }
        }
        this.c.restore();
    }
};

/**
 * Update the layer
 * @param {Number} delta    Amount of time since the last update
 */
Psykick.Layer.prototype.update = function(delta) {
    // Only update if the layer is active and we have some systems for doing behavior
    if (this.Active && this.BehaviorSystems.length > 0) {

        for (var i = 0, len = this.BehaviorSystems.length; i < len; i++) {
            var system = this.BehaviorSystems[i];
            if (system.Active) {
                system.update(delta);
            }
        }
    }
};