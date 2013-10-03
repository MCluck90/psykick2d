'use strict';

var Entity = require('./entity.js'),
    System = require('./system.js'),
    BehaviorSystem = require('./behavior-system.js'),
    RenderSystem = require('./render-system.js');

/**
 * A layer houses a set of entities to be updated/drawn on each frame
 * @constructor
 * @param {Object}  options
 * @param {Number}  options.id          - Unique ID assigned by the World
 * @param {Element} options.container   - Element which houses the Layer
 */
var Layer = function(options) {
    this.id = options.id;
    this.container = options.container;
    this.entities = {};
    this.renderSystems = [];
    this.behaviorSystems = [];
    this.visible = true;
    this.active = true;

    // Create a new canvas to draw on
    var canvas = document.createElement('canvas');
    canvas.width = parseInt(options.container.style.width, 10);
    canvas.height = parseInt(options.container.style.height, 10);
    canvas.setAttribute('id', 'psykick-layer-' + options.id);
    canvas.style.position = 'absolute';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.zIndex = 0;

    this.c = canvas.getContext('2d');
};

/**
 * Removes the canvas to ensure no additional drawing is done
 */
Layer.prototype.removeCanvas = function() {
    this.c.canvas.parentNode.removeChild(this.c.canvas);
};

/**
 * Puts the layers canvas back in the container if it was removed
 */
Layer.prototype.restoreCanvas = function() {
    if (document.getElementById('psykick-layer-' + this.id) === null) {
        this.container.appendChild(this.c.canvas);
    }
};

/**
 * Set the depth layer index
 * @param {Number} zIndex
 */
Layer.prototype.setZIndex = function(zIndex) {
    this.c.canvas.style.zIndex = zIndex;
};

/**
 * Add an entity to the layer
 * @param {Entity}  entity
 * @param {Boolean}         [addToSystems=false]
 */
Layer.prototype.addEntity = function(entity, addToSystems) {
    if (!(entity instanceof Entity)) {
        throw new Error('Invalid argument: \'entity\' must be an instance of Entity');
    }
    addToSystems = addToSystems || false;
    entity.setParentLayer(this);
    this.entities[entity.id] = entity;

    if (addToSystems) {
        var bLen = this.behaviorSystems.length,
            rLen = this.renderSystems.length;
        for (var i = 0; i < bLen || i < rLen; i++) {
            if (i < bLen) {
                this.behaviorSystems[i].addEntity(entity);
            }

            if (i < rLen) {
                this.renderSystems[i].addEntity(entity);
            }
        }
    }
};

/**
 * Removes an entity from the layer
 * @param {Number|Entity} entityID
 */
Layer.prototype.removeEntity = function(entityID) {
    if (entityID instanceof Entity) {
        entityID = entityID.id;
    }

    // Delete the entity from any systems
    for (var i = 0, bLen = this.behaviorSystems.length, rLen = this.renderSystems.length; i < bLen || i < rLen; i++) {
        if (i < bLen) {
            this.behaviorSystems[i].removeEntity(entityID);
        }

        if (i < rLen) {
            this.renderSystems[i].removeEntity(entityID);
        }
    }

    delete this.entities[entityID];
};

/**
 * Add a new system to the layer
 * @param {System} system
 */
Layer.prototype.addSystem = function(system) {
    if (!(system instanceof System)) {
        throw 'Invalid argument: \'system\' must be an instance of System';
    }

    system.setParentLayer(this);

    if (system instanceof BehaviorSystem && this.behaviorSystems.indexOf(system) === -1) {
        this.behaviorSystems.push(system);
    } else if (system instanceof RenderSystem && this.renderSystems.indexOf(system) === -1) {
        this.renderSystems.push(system);
    }
};

/**
 * Returns the collection of entities
 * @return {Entity[]}
 */
Layer.prototype.getEntities = function() {
    return this.entities;
};

/**
 * Returns the entities with the given component names
 * @param {String[]} components
 * @return {Array}
 */
Layer.prototype.getEntitiesByComponents = function(components) {
    var numOfComponents = components.length,
        entities = [];
    for (var id in this.entities) {
        if (this.entities.hasOwnProperty(id)) {
            var entity = this.entities[id],
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
Layer.prototype.draw = function() {
    // If the node doesn't exist, don't even try to draw
    if (this.c.canvas.parentNode === null) {
        return;
    }

    this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);

    // Only draw if "visible" and have some kind of system for rendering
    if (this.visible && this.renderSystems.length > 0) {
        this.c.save();
        for (var i = 0, len = this.renderSystems.length; i < len; i++) {
            var system = this.renderSystems[i];
            if (system.active) {
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
Layer.prototype.update = function(delta) {
    // Only update if the layer is active and we have some systems for doing behavior
    if (this.active && this.behaviorSystems.length > 0) {
        for (var i = 0, len = this.behaviorSystems.length; i < len; i++) {
            var system = this.behaviorSystems[i];
            if (system.active) {
                system.update(delta);
            }
        }
    }
};

module.exports = Layer;