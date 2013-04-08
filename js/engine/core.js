/**
 * @namespace   The Psykick framework
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

    function privateRemoveEntities() {
        for (var i = 0, len = entityRemovalQueue.length; i < len; i++) {
            var entity = entityRemovalQueue[i];
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
        }

        entityRemovalQueue = [];
    }

    /**
     * Generates the World instance
     * @constructor
     * @param {Object}               options                             Initialization options
     * @param {Element}              options.canvasContainer             A div for the canvases to reside in
     * @param {Number}               [options.width=640]                 Width of the container
     * @param {Number}               [options.height=480]                Height of the container
     * @param {String}               [options.backgroundColor="#000"]    Base background color
     * @param {Number}               [options.fps=40]                    Frame per second
     * @param {Psykick.Physics|null} [options.physics=null]
     * @param {Function}             [options.onUpdate=Function]         Called on every update
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
                fps: 40,
                physics: null,
                onUpdate: function() {}
            };
        options = Psykick.Helper.defaults(options, defaults);

        this.Physics = options.physics;
        this.PhysicsDrawLayer = null;

        // Setup the canvas container (each layer is a new canvas)
        if (typeof options.canvasContainer === 'string') {
            options.canvasContainer = document.getElementById(options.canvasContainer);
        }
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
            options.onUpdate(delta);
            self.update(delta);
            self.draw();
            gameTime = new Date();
        }, 1000 / options.fps);
    };

    /**
     * Generates a new Entity
     * @return {Psykick.Entity}
     */
    Psykick.World.prototype.createEntity = function() {
        var entity = new Psykick.Entity(nextEntityID++);
        entities[entity.ID] = entity;
        return entity;
    };

    /**
     * Generates a new Layer
     * @return {Psykick.Layer}
     */
    Psykick.World.prototype.createLayer = function() {
        var self = this,
            layer = new Psykick.Layer({
                ID: nextLayerID++,
                container: canvasContainer,
                world: self
            });
        layers[layer.ID] = layer;
        return layer;
    };

    /**
     * Pushes a layer on to the draw stack
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
     * @return {Psykick.Layer|null}
     */
    Psykick.World.prototype.popLayer = function() {
        if (layersInDrawOrder.length === 0) {
            return null;
        }

        var top = layersInDrawOrder[layersInDrawOrder.length - 1];
        layersInDrawOrder.pop();
        top.removeCanvas();
        return top;
    };

    /**
     * Removes an Entity from the world
     * @param {Psykick.Entity} entity
     */
    Psykick.World.prototype.removeEntity = function(entity) {
        entityRemovalQueue.push(entity);
    };

    /**
     * Draws the world
     */
    Psykick.World.prototype.draw = function() {
        for (var i = 0, len = layersInDrawOrder.length; i < len; i++) {
            layersInDrawOrder[i].draw(this.context);
        }

        if (this.Physics !== null && this.Physics.enableDebugDraw) {
            if (this.PhysicsDrawLayer === null) {
                this.PhysicsDrawLayer = this.createLayer();
                this.Physics.debugDrawContext = this.PhysicsDrawLayer.c;
                this.pushLayer(this.PhysicsDrawLayer);
                this.PhysicsDrawLayer.setZIndex(9999999);
                this.PhysicsDrawLayer.Visible = false;
            }

            this.Physics.draw();
        }
    };

    /**
     * Updates the world
     * @param {Number}  delta   Time since last update
     */
    Psykick.World.prototype.update = function(delta) {
        privateRemoveEntities();
        for (var i = 0, len = layersInDrawOrder.length; i < len; i++) {
            layersInDrawOrder[i].update(delta);
        }

        if (this.Physics !== null) {
            this.Physics.update(delta);
        }
    };

    /**
     * Get a layer based on ID
     * @param {Number} layerID
     * @return {Psykick.Layer|null}
     */
    Psykick.World.prototype.getLayer = function(layerID) {
        if (layers.hasOwnProperty(layerID)) {
            return layers[layerID];
        } else {
            return null;
        }
    };

    /**
     * Get an entity based on ID
     * @param {Number} entityID
     * @return {Psykick.Entity|null}
     */
    Psykick.World.prototype.getEntity = function(entityID) {
        if (entities.hasOwnProperty(entityID)) {
            return entities[entityID];
        } else {
            return null;
        }
    };

})();