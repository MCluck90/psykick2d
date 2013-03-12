/**
 * Setup the Psykick game engine
 *
 * Psykick is made up of:
 *      A World
 *      Components
 *      Entities
 *      Layers
 *      Systems
 *
 * Everything resides in one World instance.
 * Layers house all of the Entities and Systems which make the game work
 * Entities are containers for Components
 * Systems act upon Entities with certain Components to either display something or perform some logic
 */
var Psykick = {};
(function(undefined) {
    "use strict";

    var
        // Contains all of the canvases
        canvasContainer,

        // Reference to the actual game loop
        gameLoop,

        // Entity ID counter
        nextEntityID = -Number.MAX_VALUE,

        // Layer ID counter
        nextLayerID = 0,

        // Collection of entities
        entities = {},

        // Collection of layers
        layers = {},

        // Layers in the order they will be drawn/updated
        layersInDrawOrder = [];

        /**
         * Generates the World instance
         *
         * @param {Object}  options                             Initialization options
         * @param {Element} options.canvasContainer             A div for the canvases to reside in
         * @param {Number}  [options.width=640]                 Width of the container
         * @param {Number}  [options.height=480]                Height of the container
         * @param {String}  [options.backgroundColor="#000"]    Base background color
         * @param {Number}  [options.fps=40]                    Frame per second
         * @constructor
         * @namespace       The core of all interactions
         */
        Psykick.World = function(options) {
            var self = this,
                baseCanvas = document.createElement("canvas"),
                gameTime = new Date(),
                defaults = {
                    canvasContainer: document.getElementById('canvas-container'),
                    width: 640,
                    height: 480,
                    backgroundColor: "#000",
                    fps: 40
                };
            options = Psykick.Helper.defaults(options, defaults);

            // Setup the canvas container (each layer is a canvas)
            canvasContainer = options.canvasContainer;
            canvasContainer.style.position = "relative";
            canvasContainer.style.width = options.width + "px";
            canvasContainer.style.height = options.height + "px";
            canvasContainer.style.overflow = "hidden";

            baseCanvas.setAttribute("id", "psykick-layer-base");
            baseCanvas.style.position = "absolute";
            baseCanvas.style.top = "0px";
            baseCanvas.style.left = "0px";
            baseCanvas.style.zIndex = 0;
            baseCanvas.width = options.width;
            baseCanvas.height = options.height;

            canvasContainer.appendChild(baseCanvas);

            this.context = baseCanvas.getContext("2d");

            // Only fill the background once, each new layer handles it's own clearing
            this.context.fillStyle = options.backgroundColor;
            this.context.fillRect(0, 0, baseCanvas.width, baseCanvas.height);

            gameLoop = setInterval(function() {
                var delta = (new Date() - gameTime) / 1000;
                self.update(delta);
                self.draw();
                gameTime = new Date();
            }, 1000 / options.fps);
        };

    /**
     * Generates a new Entity
     *
     * @return {Psykick.Entity}
     */
    Psykick.World.prototype.createEntity = function() {
        var entity = new Psykick.Entity(nextEntityID++);
        entities[entity.ID] = entity;
        return entity;
    };

    /**
     * Generates a new Layer
     *
     * @return {Psykick.Layer}
     */
    Psykick.World.prototype.createLayer = function() {
        var layer = new Psykick.Layer(nextLayerID++, canvasContainer);
        layers[layer.ID] = layer;
        return layer;
    };

    /**
     * Pushes a layer on to the draw stack
     *
     * @param {Psykick.Layer} layer
     */
    Psykick.World.prototype.pushLayer = function(layer) {
        if (!(layer instanceof Psykick.Layer)) {
            throw "Invalid argument: 'layer' must be instance of Psykick.Layer";
        }

        if (layersInDrawOrder.indexOf(layer) === -1) {
            layersInDrawOrder.push(layer);
            layer.setZIndex(layersInDrawOrder.length);
            layer.restoreCanvas();
        }
    };

    /**
     * Removes and returns the top layer
     *
     * @return {Psykick.Layer|null}
     */
    Psykick.World.prototype.popLayer = function() {
        if (layersInDrawOrder.length == 0) {
            return null;
        }

        var top = layersInDrawOrder[layersInDrawOrder.length - 1];
        layersInDrawOrder.pop();
        top.removeCanvas();
        return top;
    };

    /**
     * Removes an Entity from the world
     *
     * @param {Psykick.Entity} entity
     */
    Psykick.World.prototype.removeEntity = function(entity) {
        if (typeof entity === "number") {
            if (typeof entities[entity] === "undefined") {
                throw "Invalid entity ID";
            }

            entity = entity[entity];
        }

        if (entity.Parent !== null) {
            entity.Parent.removeEntity(entity);
        }

        delete entities[entity.ID];
    };

    /**
     * Draws the world
     */
    Psykick.World.prototype.draw = function() {
        for (var i = 0, len = layersInDrawOrder.length; i < len; i++) {
            layersInDrawOrder[i].draw(this.context);
        }
    };

    /**
     * Updates the world
     *
     * @param {Number} delta    Time since last update
     */
    Psykick.World.prototype.update = function(delta) {
        for (var i = 0, len = layersInDrawOrder.length; i < len; i++) {
            layersInDrawOrder[i].update(delta);
        }
    };


    Psykick.World.prototype.getLayers = function() { return layersInDrawOrder; };

})();