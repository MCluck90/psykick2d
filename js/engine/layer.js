/**
 * A layer houses a set of entities to be updated/drawn on each frame
 * @constructor
 * @param {Object}          options
 * @param {Number}          options.ID
 * @param {DOMElement}      options.container
 * @param {Psykick.World}   options.world
 */
Psykick.Layer = function(options) {
    this.ID = options.ID;
    this.container = options.container;
    this.World = options.world;
    this.Entities = {};
    this.RenderSystems = [];
    this.BehaviorSystems = [];
    this.Visible = true;
    this.Active = true;

    // Create a new canvas to draw on
    var canvas = document.createElement("canvas");
    canvas.width = parseInt(options.container.style.width, 10);
    canvas.height = parseInt(options.container.style.height, 10);
    canvas.setAttribute("id", "psykick-layer-" + options.ID);
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
 * @param {Psykick.Entity}  entity
 * @param {Boolean}         [addToSystems=false]
 */
Psykick.Layer.prototype.addEntity = function(entity, addToSystems) {
    addToSystems = addToSystems || false;
    entity.setParentLayer(this);
    this.Entities[entity.ID] = entity;

    if (addToSystems) {
        var bLen = this.BehaviorSystems.length,
            rLen = this.RenderSystems.length;
        for (var i = 0; i < bLen || i < rLen; i++) {
            if (i < bLen) {
                this.BehaviorSystems[i].addEntity(entity);
            }

            if (i < rLen) {
                this.RenderSystems[i].addEntity(entity);
            }
        }
    }
};

/**
 * Removes an entity from the layer
 * @param {Number|Psykick.Entity} entityID
 */
Psykick.Layer.prototype.removeEntity = function(entityID) {
    if (entityID instanceof Psykick.Entity) {
        entityID = entityID.ID;
    }

    // Delete the entity from any systems
    for (var i = 0, bLen = this.BehaviorSystems.length, rLen = this.RenderSystems.length; i < bLen || i < rLen; i++) {
        if (i < bLen) {
            this.BehaviorSystems[i].removeEntity(entityID);
        }

        if (i < rLen) {
            this.RenderSystems[i].removeEntity(entityID);
        }
    }

    delete this.Entities[entityID];
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
 * Returns the collection of entities
 * @return {Psykick.Entity[]}
 */
Psykick.Layer.prototype.getEntities = function() {
    return this.Entities;
};

/**
 * Returns the entities with the given component names
 * @param {String[]} components
 * @return {Array}
 */
Psykick.Layer.prototype.getEntitiesByComponents = function(components) {
    var numOfComponents = components.length,
        entities = [];
    for (var id in this.Entities) {
        if (this.Entities.hasOwnProperty(id)) {
            var entity = this.Entities[id],
                hasComponents = true;

            for (var i = 0; i < numOfComponents; i++) {
                if (!entity.hasComponent(components[i])) {
                    hasComponents = false;
                    break;
                }
            }

            if (hasComponents) {
                entities.push(entity);
            }
        }
    }

    return entities;
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