var Psykick = {};
Psykick.World = (function(undefined) {

    var
        // Entity ID counter
        nextEntityID = -Number.MAX_VALUE,

        // Layer ID counter
        nextLayerID = -Number.MAX_VALUE,

        // Collection of entities
        entities = {},

        // Collection of layers
        layers = {},

        // Layers in the order they will be drawn/updated
        layersInDrawOrder = [],

        // Instance of the world
        World = function(canvasEl) {
            this.c = canvasEl.getContext("2d");
        };

    World.prototype.createEntity = function() {
        var entity = new Psykick.Entity(nextEntityID++);
        entities[entity.ID] = entity;
        return entity;
    };

    World.prototype.createLayer = function() {
        var layer = new Psykick.Layer(nextLayerID++);
        layers[layer.ID] = layer;
        return layer;
    };

    World.prototype.pushLayer = function(layer) {
        if (!(layer instanceof Psykick.Layer)) {
            throw "Invalid argument: 'layer' must be instance of Psykick.Layer";
        }

        if (layersInDrawOrder.indexOf(layer) === -1) {
            layersInDrawOrder.push(layer);
        }
    };

    World.prototype.popLayer = function() {
        if (layersInDrawOrder.length == 0) {
            return null;
        }

        var top = layersInDrawOrder[layersInDrawOrder.length - 1];
        layersInDrawOrder.pop();
        return top;
    };

    World.prototype.removeEntity = function(entity) {
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

    World.prototype.draw = function() {
        for (var i = 0, len = layersInDrawOrder.length; i < len; i++) {
            layersInDrawOrder[i].draw(this.c);
        }
    };

    World.prototype.update = function(delta) {
        for (var i = 0, len = layersInDrawOrder.length; i < len; i++) {
            layersInDrawOrder[i].update(delta);
        }
    };


    World.prototype.getLayers = function() { return layersInDrawOrder; };

    return World;

})();