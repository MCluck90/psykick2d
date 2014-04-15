'use strict';

var System = require('./system.js'),
    BehaviorSystem = require('./behavior-system.js'),
    RenderSystem = require('./render-system.js');

/**
 * A layer houses a set of systems which are updated/drawn on each frame
 * @constructor
 * @param {Object}  options
 * @param {number}  options.id          - Unique ID assigned by the World
 * @param {Element} options.container   - Element which houses the Layer
 */
var Layer = function(options) {
    this.id = options.id;
    this.container = options.container;
    this.camera = null;
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
 * @param {number} zIndex
 */
Layer.prototype.setZIndex = function(zIndex) {
    this.c.canvas.style.zIndex = zIndex;
};

/**
 * Add a new system to the layer
 * @param {System} system
 */
Layer.prototype.addSystem = function(system) {
    if (!(system instanceof System)) {
        throw new Error('Invalid argument: \'system\' must be an instance of System');
    }

    if (system.parentLayer === null) {
        system.parentLayer = this;
    } else {
        var err = new Error('System already belongs to another Layer');
        err.system = system;
        throw err;
    }

    if (system instanceof BehaviorSystem && this.behaviorSystems.indexOf(system) === -1) {
        this.behaviorSystems.push(system);
    } else if (system instanceof RenderSystem && this.renderSystems.indexOf(system) === -1) {
        this.renderSystems.push(system);
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

    system.parentLayer = null;

    var systemCollection = (system instanceof BehaviorSystem) ? this.behaviorSystems : this.renderSystems,
        systemIndex = systemCollection.indexOf(system);
    if (systemIndex !== -1) {
        systemCollection.splice(systemIndex, 1);
    }
};

/**
 * Draw the layer
 */
Layer.prototype.draw = function() {
    this.c.save();
    this.c.setTransform(1, 0, 0, 1, 0, 0);
    this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
    this.c.restore();

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

    if (this.camera !== null) {
        this.c.restore();
    }
};

/**
 * Update the layer
 * @param {number} delta    Amount of time since the last update
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

    // If the layer has a camera, use it
    if (this.camera !== null) {
        this.c.save();
        this.camera.render(this.c, delta);
    }
};

module.exports = Layer;