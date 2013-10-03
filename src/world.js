'use strict';

var Entity = require('./entity.js'),
    Helper = require('./helper.js'),
    Layer = require('./layer.js'),


    // Contains all of the canvases
    canvasContainer,

    // Reference to the actual game loop
    gameLoop,

    // Entity ID counter
    nextEntityID = Number.MIN_VALUE,

    // Layer ID counter
    nextLayerID = 0,

    // Collection of entities
    entities = {},

    // Collection of layers
    layers = {},

    // Layers in the order they will be drawn/updated
    layersInDrawOrder = [],

    // Used to remove entities at the beginning of an update phase
    entityRemovalQueue = [];

/**
 * Removes entities at the beginning of a frame
 */
function removeEntities() {
    for (var i = 0, len = entityRemovalQueue.length; i < len; i++) {
        var entity = entityRemovalQueue[i];
        if (typeof entity === 'number') {
            if (typeof entities[entity] === 'undefined') {
                throw 'Invalid entity ID';
            }

            entity = entity[entity];
        }

        if (entity.parentLayer !== null) {
            entity.parentLayer.removeEntity(entity);
        }

        delete entities[entity.id];
    }

    entityRemovalQueue = [];
}

var World = {
    /**
     * Initializes the World
     * @param {Object} options
     * @param {Element|String} options.canvasContainer
     * @param {Number} [options.width=window.innerWidth]
     * @param {Number} [options.height=window.innerHeight]
     * @param {String} [options.backgroundColor='#000']
     */
    init: function(options) {
        var self = this,
            backgroundEl = document.createElement('div'),
            gameTime = new Date(),
            defaults = {
                canvasContainer: document.getElementById('canvas-container'),
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: '#000'
            };

        options = Helper.defaults(options, defaults);
        if (typeof options.canvasContainer === 'string') {
            options.canvasContainer = document.getElementById(options.canvasContainer);
        }

        // Make sure the container will correctly house our canvases
        canvasContainer = options.canvasContainer;
        canvasContainer.style.position = 'relative';
        canvasContainer.style.width = options.width + 'px';
        canvasContainer.style.height = options.height + 'px';
        canvasContainer.style.overflow = 'hidden';

        // Setup a basic element to be the background color
        backgroundEl.setAttribute('id', 'psykick-layer-base');
        backgroundEl.style.position = 'absolute';
        backgroundEl.style.top = '0px';
        backgroundEl.style.left = '0px';
        backgroundEl.style.zIndex = 0;
        backgroundEl.style.width = options.width + 'px';
        backgroundEl.style.height = options.height + 'px';
        backgroundEl.style.backgroundColor = options.backgroundColor;

        canvasContainer.appendChild(backgroundEl);

        var requestAnimationFrame = window.requestAnimationFrame ||
                                    window.mozRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame ||
                                    window.msRequestAnimationFrame;
        gameLoop = function() {
            var delta = (new Date() - gameTime) / 1000;
            self.update(delta);
            self.draw();
            gameTime = new Date();
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    },

    /**
     * Creates a new Entity
     * @returns {Entity}
     */
    createEntity: function() {
        var entity = new Entity(nextEntityID++);
        entities[entity.id] = entity;
        return entity;
    },

    /**
     * Removes an Entity from the World
     * @param {Entity|Number} entity
     */
    removeEntity: function(entity) {
        if (typeof entity == 'number') {
            entity = entities[entity];
        }

        if (entity instanceof Entity) {
            entityRemovalQueue.push(entity);
        }
    },

    /**
     * Returns an Entity based on it's ID
     * @param {Number} entityID
     * @returns {Entity|null}
     */
    getEntity: function(entityID) {
        if (Helper.has(entities, entityID)) {
            return entities[entityID];
        } else {
            return null;
        }
    },

    /**
     * Creats a new Layer
     * @returns {Layer}
     */
    createLayer: function() {
        var self = this,
            layer = new Layer({
                ID: nextLayerID++,
                container: canvasContainer,
                world: self
            });
        layers[layer.id] = layer;
        return layer;
    },

    /**
     * Pushes a Layer to the top of the draw stack
     * @param {Layer} layer
     * @returns {Boolean} True if the push was successful
     */
    pushLayer: function(layer) {
        if (!(layer instanceof Layer)) {
            throw 'Invalid argument: \'layer\' must be instance of Layer';
        }

        if (layersInDrawOrder.indexOf(layer) === -1) {
            layersInDrawOrder.push(layer);
            layer.setZIndex(layersInDrawOrder.length);
            layer.restoreCanvas();
            return true;
        } else {
            return false;
        }
    },

    /**
     * Pops and returns the Layer on the top of the draw stack
     * @returns {Layer|null}
     */
    popLayer: function() {
        if (layersInDrawOrder.length === 0) {
            return null;
        }

        var top = layersInDrawOrder[layersInDrawOrder.length - 1];
        layersInDrawOrder.pop();
        top.removeCanvas();
        return top;
    },

    /**
     * Returns a Layer based on it's ID
     * @param {Number} layerID
     * @returns {Layer|null}
     */
    getLayer: function(layerID) {
        if (Helper.has(layers, layerID)) {
            return layers[layerID];
        } else {
            return null;
        }
    },

    /**
     * Updates the World
     * @param {Number} delta    Time since previous update
     */
    update: function(delta) {
        removeEntities();
        for (var i = 0, len = layersInDrawOrder.length; i < len; i++) {
            var layer = layersInDrawOrder[i];
            if (layer.active) {
                layersInDrawOrder[i].update(delta);
            }
        }
    },

    /**
     * Draws the World
     */
    draw: function() {
        for (var i = 0, len = layersInDrawOrder.length; i < len; i++) {
            var layer = layersInDrawOrder[i];
            if (layer.visible) {
                layersInDrawOrder[i].draw(this.context);
            }
        }
    }
};

module.exports = World;