'use strict';

var System = require('./system.js'),
    BehaviorSystem = require('./behavior-system.js'),
    RenderSystem = require('./render-system.js'),

    PIXI = require('pixi.js');

/**
 * A layer houses a set of systems which are updated/drawn on each frame
 * @constructor
 * @param {Object}        options
 * @param {number}        options.id                         - Unique ID assigned by the World
 * @param {Element}       options.container                  - Element which houses the Layer
 * @param {boolean}       [options.serverMode=false]         - If true, a canvas will not be made
 */
var Layer = function(options) {
    this.id = options.id;
    this.container = options.container;
    this.camera = null;
    this.renderSystems = [];
    this.behaviorSystems = [];
    this.active = true;
    this.canvas = null;
    this._serverMode = options.serverMode;

    // Create a new canvas to draw on
    if (!this._serverMode) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = parseInt(options.container.style.width, 10);
        this.canvas.height = parseInt(options.container.style.height, 10);
        this.canvas.setAttribute('id', 'psykick-layer-' + options.id);
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0px';
        this.canvas.style.left = '0px';
        this.canvas.style.zIndex = 0;

        // Create a pixi.js stage and renderer
        this.stage = new PIXI.Stage(0xFFFFFF);
        this.stage.visible = true;
        this.scene = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.scene);
        this.renderer = PIXI.autoDetectRenderer(
            this.canvas.width,
            this.canvas.height,
            this.canvas,
            true
        );
    }

    // Visibility relies on having the stage initialized
    this.visible = true;
};

// Tie in the layer visiblity with the stages visibility
Object.defineProperty(Layer.prototype, 'visible', {
    get: function() {
        return !this._serverMode && this.stage.visible;
    },
    set: function(visible) {
        if (!this._serverMode) {
            this.stage.visible = visible;
            // Make sure the stage is invalidated
            this.renderer.render(this.stage);
        }
    }
});

/**
 * Removes the canvas to ensure no additional drawing is done
 */
Layer.prototype.removeCanvas = function() {
    this.canvas.parentNode.removeChild(this.canvas);
};

/**
 * Puts the layers canvas back in the container if it was removed
 */
Layer.prototype.restoreCanvas = function() {
    if (document.getElementById('psykick-layer-' + this.id) === null) {
        this.container.appendChild(this.canvas);
    }
};

/**
 * Set the depth layer index
 * @param {number} zIndex
 */
Layer.prototype.setZIndex = function(zIndex) {
    this.canvas.style.zIndex = zIndex;
};

/**
 * Add a new system to the layer
 * @param {System} system
 */
Layer.prototype.addSystem = function(system) {
    if (!(system instanceof System)) {
        throw new Error('Invalid argument: \'system\' must be an instance of System');
    }

    if (system instanceof BehaviorSystem && this.behaviorSystems.indexOf(system) === -1) {
        this.behaviorSystems.push(system);
    } else if (system instanceof RenderSystem && this.renderSystems.indexOf(system) === -1) {
        this.renderSystems.push(system);
        if (system.objectContainer) {
            this.scene.addChild(system.objectContainer);
        }
    }
};

/**
 * Removes a system from the layer
 * @param {System} system
 */
Layer.prototype.removeSystem = function(system) {
    if (!(system instanceof System)) {
        throw new Error('Invalid argument: \'system\' must be an instance of System');
    }

    // If applicable, remove the render systems display container
    var isRenderSystem = (system instanceof RenderSystem),
        systemCollection = (isRenderSystem) ? this.renderSystems : this.behaviorSystems,
        systemIndex = systemCollection.indexOf(system);
    if (systemIndex !== -1) {
        systemCollection.splice(systemIndex, 1);
        if (isRenderSystem) {
            this.scene.removeChild(system.objectContainer);
        }
    }
};

/**
 * Will attempt to add an entity to every system
 * @param {Entity} entity
 */
Layer.prototype.addEntity = function(entity) {
    var numOfBehaviorSystems = this.behaviorSystems.length,
        numOfRenderSystems = this.renderSystems.length,
        len = Math.max(numOfBehaviorSystems, numOfRenderSystems);
    for (var i = 0; i < len; i++) {
        if (i < numOfBehaviorSystems) {
            this.behaviorSystems[i].addEntity(entity);
        }
        if (i < numOfRenderSystems) {
            this.renderSystems[i].addEntity(entity);
        }
    }
};

/**
 * Will attempt to remove an entity from every system
 * @param {Entity} entity
 */
Layer.prototype.removeEntity = function(entity) {
    var numOfBehaviorSystems = this.behaviorSystems.length,
        numOfRenderSystems = this.renderSystems.length,
        len = Math.max(numOfBehaviorSystems, numOfRenderSystems);
    for (var i = 0; i < len; i++) {
        if (i < numOfBehaviorSystems) {
            this.behaviorSystems[i].removeEntity(entity);
        }
        if (i < numOfRenderSystems) {
            this.renderSystems[i].removeEntity(entity);
        }
    }
};

/**
 * Will attempt to safely remove an entity from every system
 * @param entity
 */
Layer.prototype.safeRemoveEntity = function(entity) {
    var numOfBehaviorSystems = this.behaviorSystems.length,
        numOfRenderSystems = this.renderSystems.length,
        len = Math.max(numOfBehaviorSystems, numOfRenderSystems);
    for (var i = 0; i < len; i++) {
        if (i < numOfBehaviorSystems) {
            this.behaviorSystems[i].safeRemoveEntity(entity);
        }
        if (i < numOfRenderSystems) {
            this.renderSystems[i].safeRemoveEntity(entity);
        }
    }
};

/**
 * Draw the layer
 * @param {number} delta    Time since previous update
 */
Layer.prototype.draw = function(delta) {
    // If the node doesn't exist, don't even try to draw
    if (!this.canvas || this.canvas.parentNode === null) {
        return;
    }

    // If the layer has a camera, use it
    if (this.camera !== null) {
        this.camera.render(this.scene, delta);
    }

    var numOfRenderSystems = this.renderSystems.length;
    if (this.visible && numOfRenderSystems > 0) {
        for (var i = 0; i < numOfRenderSystems; i++) {
            var system = this.renderSystems[i];
            if (system.visible) {
                system.draw(this);
            }
            system.clearRemovalQueue();
        }
    }

    this.renderer.render(this.stage);
};

/**
 * Update the layer
 * @param {number} delta    Amount of time since the last update
 */
Layer.prototype.update = function(delta) {
    var numOfBehaviorSystems = this.behaviorSystems.length;
    if (this.active && numOfBehaviorSystems > 0) {
        for (var i = 0; i < numOfBehaviorSystems; i++) {
            var system = this.behaviorSystems[i];
            if (system.active) {
                system.update(delta);
            }
            system.clearRemovalQueue();
        }
    }
};

module.exports = Layer;