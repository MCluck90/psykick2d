'use strict';

var Entity = require('./entity.js'),
    Helper = require('./helper.js'),
    Layer = require('./layer.js'),


    // Contains all of the canvases
    canvasContainer,

    // Reference to the actual game loop
    gameLoop,

    // Entity ID counter
    nextEntityID = 0,

    // Layer ID counter
    nextLayerID = 0,

    // Collection of layers
    layers = {},

    // Layers in the order they will be drawn/updated
    layersInDrawOrder = [],

    // Container for event handlers
    eventHandlers = {
        beforeUpdate: [],
        afterUpdate: [],
        beforeDraw: [],
        afterDraw: []
    };

var World = {
    /**
     * Initializes the World
     * @param {Object} options
     * @param {Element|String} options.canvasContainer
     * @param {number} [options.width=window.innerWidth]
     * @param {number} [options.height=window.innerHeight]
     * @param {String} [options.backgroundColor='#000']
     */
    init: function(options) {
        var self = this,
            backgroundEl = document.createElement('div'),
            gameTime = new Date(),
            defaults = {
                canvasContainer: document.getElementById('psykick'),
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
        return new Entity(nextEntityID++);
    },

    /**
     * Creats a new Layer
     * @returns {Layer}
     */
    createLayer: function() {
        var self = this,
            layer = new Layer({
                id: nextLayerID++,
                container: canvasContainer,
                world: self
            });
        layers[layer.id] = layer;
        return layer;
    },

    /**
     * Pushes a Layer to the top of the draw stack
     * @param {Layer} layer
     * @returns {boolean} True if the push was successful
     */
    pushLayer: function(layer) {
        if (!(layer instanceof Layer)) {
            throw new Error('Invalid argument: \'layer\' must be instance of Layer');
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
     * @param {number} layerID
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
     * @param {number} delta    Time since previous update
     */
    update: function(delta) {
        var beforeUpdate = eventHandlers.beforeUpdate,
            afterUpdate = eventHandlers.afterUpdate,
            i, len;

        for (i = 0, len = beforeUpdate.length; i < len; i++) {
            beforeUpdate[i](delta);
        }

        for (i = 0, len = layersInDrawOrder.length; i < len; i++) {
            var layer = layersInDrawOrder[i];
            if (layer.active) {
                layersInDrawOrder[i].update(delta);
            }
        }

        for (i = 0, len = afterUpdate.length; i < len; i++) {
            afterUpdate[i](delta);
        }
    },

    /**
     * Draws the World
     */
    draw: function() {
        var beforeDraw = eventHandlers.beforeDraw,
            afterDraw = eventHandlers.afterDraw,
            i, len;

        for (i = 0, len = beforeDraw.length; i < len; i++) {
            beforeDraw[i]();
        }

        for (i = 0, len = layersInDrawOrder.length; i < len; i++) {
            var layer = layersInDrawOrder[i];
            if (layer.visible) {
                layersInDrawOrder[i].draw(this.context);
            }
        }

        for (i = 0, len = afterDraw.length; i < len; i++) {
            afterDraw[i]();
        }
    },

    /**
     * Adds a new event listener
     * @param {string}      eventType   Event to listen for
     * @param {function}    listener    Callback
     */
    addEventListener: function(eventType, listener) {
        if (!eventHandlers[eventType]) {
            eventHandlers[eventType] = [];
        }

        var listenerList = eventHandlers[eventType];
        if (listenerList.indexOf(listener) === -1) {
            listenerList.push(listener);
        }
    },

    /**
     * Removes an event listener
     * @param {string}      eventType   Event to listen for
     * @param {function}    listener    Callback
     */
    removeEventListener: function(eventType, listener) {
        if (!eventHandlers[eventType]) {
            return;
        }

        var index = eventHandlers[eventType].indexOf(listener);
        if (index !== -1) {
            eventHandlers[eventType].splice(index, 1);
        }
    },

    /**
     * Remove all listeners for a given event
     * @param {string} eventType    Event to no longer listen for
     */
    removeAllListeners: function(eventType) {
        eventHandlers[eventType] = [];
    }
};

module.exports = World;