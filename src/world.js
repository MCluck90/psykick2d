'use strict';

var AssetManager = require('./asset-manager.js'),
    Entity = require('./entity.js'),
    Helper = require('./helper.js'),
    Input = require('./input.js'),
    Layer = require('./layer.js'),


    // Contains all of the canvases
    canvasContainer,

    // Reference to the actual game loop
    gameLoop,

    // Entity ID counter
    nextEntityID = 0,

    // Layer ID counter
    nextLayerID = 0,

    // Layers in the order they will be drawn/updated
    layersInDrawOrder = [],

    // Container for event handlers
    eventHandlers = {
        beforeUpdate: [],
        afterUpdate: [],
        beforeDraw: [],
        afterDraw: []
    },

    // If true, will not access the window or DOM
    serverMode = false,

    // Maximum amount of time between each step i.e. the minimum fps
    maxTimeStep = 1 / 30;

var World = {
    /**
     * Initializes the World
     * @param {Object} options
     * @param {Element|String}  options.canvasContainer
     * @param {number}          [options.width=window.innerWidth]
     * @param {number}          [options.height=window.innerHeight]
     * @param {String}          [options.backgroundColor='#000']
     * @param {object?}         [options.preload=null]              Collection of resources to load before starting
     * @param {string|string[]} [options.preload.spriteSheets]      Spritesheets in JSON format
     */
    init: function(options) {
        var self = this,
            gameTime = new Date(),
            defaults = {
                canvasContainer: null,
                width: 800,
                height: 600,
                backgroundColor: '#000',
                serverMode: false,
                minFPS: 30,
                preload: null
            },
            backgroundEl,
            requestAnimationFrame;

        options = Helper.defaults(options, defaults);
        maxTimeStep = 1 / options.minFPS;
        serverMode = options.serverMode;
        if (!serverMode) {
            backgroundEl = document.createElement('div');
            if (options.canvasContainer === null) {
                options.canvasContainer = document.getElementById('psykick');
            } else if (typeof options.canvasContainer === 'string') {
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

            requestAnimationFrame = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame;

            Input._init(canvasContainer);
        } else {
            requestAnimationFrame = function(callback) {
                setTimeout(callback, 1000 / 60);
            };
        }

        gameLoop = function() {
            var delta = Math.min((new Date() - gameTime) / 1000, maxTimeStep);
            self.update(delta);
            self.draw(delta);
            gameTime = new Date();
            requestAnimationFrame(gameLoop);
        };
        if (!options.preload) {
            requestAnimationFrame(gameLoop);
        } else {
            var spriteSheets = options.preload.spriteSheets;
            if (spriteSheets) {
                AssetManager.SpriteSheet.addLoadListener(function startGame() {
                    AssetManager.SpriteSheet.removeLoadListener(startGame);
                    requestAnimationFrame(gameLoop);
                });
                AssetManager.SpriteSheet.load(spriteSheets);
            }
        }
    },

    /**
     * Creates a new Entity
     * @returns {Entity}
     */
    createEntity: function() {
        return new Entity(nextEntityID++);
    },

    /**
     * Creates a new Layer
     * @returns {Layer}
     */
    createLayer: function() {
        return new Layer({
            id: nextLayerID++,
            container: canvasContainer,
            serverMode: serverMode
        });
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
            if (!serverMode) {
                layer.setZIndex(layersInDrawOrder.length);
                layer.restoreCanvas();
            }
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
        if (!serverMode) {
            top.removeCanvas();
        }
        return top;
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
                Input.Mouse.setRelativePosition(layer.scene);
                layer.update(delta);
            }
        }

        for (i = 0, len = afterUpdate.length; i < len; i++) {
            afterUpdate[i](delta);
        }
    },

    /**
     * Draws the World
     * @param {number} delta    Time since previous update
     */
    draw: function(delta) {
        var beforeDraw = eventHandlers.beforeDraw,
            afterDraw = eventHandlers.afterDraw,
            i, len;

        for (i = 0, len = beforeDraw.length; i < len; i++) {
            beforeDraw[i]();
        }

        for (i = 0, len = layersInDrawOrder.length; i < len; i++) {
            var layer = layersInDrawOrder[i];
            if (layer.visible) {
                layersInDrawOrder[i].draw(delta);
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

        if ((eventType === 'resize' || eventType === 'blur') && !serverMode) {
            window.addEventListener(eventType, listener, false);
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

        if ((eventType === 'resize' || eventType === 'blur') && !serverMode) {
            window.removeEventListener(eventType, listener);
        }
    },

    /**
     * Remove all listeners for a given event
     * @param {string} eventType    Event to no longer listen for
     */
    removeAllListeners: function(eventType) {
        if ((eventType === 'resize' || eventType === 'blur') && !serverMode) {
            var listeners = eventHandlers[eventType];
            for (var i = 0, len = listeners.length; i < len; i++) {
                window.removeEventListener(eventType, listeners[i]);
            }
        }
        eventHandlers[eventType] = [];
    },

    /**
     * Resets the state of the world
     * All Layers are removed
     * ID counters return to 0
     */
    reset: function() {
        while (this.popLayer()) {}
        layersInDrawOrder = [];
        nextEntityID = 0;
        nextLayerID = 0;
    }
};

module.exports = World;