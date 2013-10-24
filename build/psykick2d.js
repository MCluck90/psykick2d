;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var System = require('./system.js'),
    Helper = require('./helper.js');

/**
 * Controls the behavior of entities.
 * Called during the "update" stage of a frame
 * @constructor
 * @inherit System
 * @property    {Entity[]}  actionOrder Order in which the entites will be acted upon
 */
var BehaviorSystem = function() {
    System.call(this);
    this.actionOrder = [];
};

Helper.inherit(BehaviorSystem, System);

/**
 * Add a new Entity to the collection and make it the last one to be updated
 * @param {Entity} entity
 */
BehaviorSystem.prototype.addEntity = function(entity) {
    if (System.prototype.addEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            entity = this.entities[entity];
        }
        if (this.actionOrder.indexOf(entity) === -1) {
            this.actionOrder.push(entity);
        }

        return true;
    } else {
        return false;
    }
};

/**
 * Removes an Entity from the System
 * @param {Entity|number} entity
 * @returns {boolean}
 */
BehaviorSystem.prototype.removeEntity = function(entity) {
    if (System.prototype.removeEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            for (var i = 0, len = this.actionOrder.length; i < len; i++) {
                if (this.actionOrder[i].id === entity) {
                    this.actionOrder.splice(i, 1);
                    break;
                }
            }
        } else {
            var index = this.actionOrder.indexOf(entity);
            if (index !== -1) {
                this.actionOrder.splice(index, 1);
            }
        }

        return true;
    } else {
        return false;
    }


};

/**
 * Updates all of the entities.
 * Should be redefined in each new instance of a BehaviorSystem
 * @param {number} delta    Amount of time that's passed since the last update
 */
BehaviorSystem.prototype.update = function() {};

module.exports = BehaviorSystem;
},{"./helper.js":12,"./system.js":17}],2:[function(require,module,exports){
'use strict';

window.Psykick2D = require('./index.js');
},{"./index.js":13}],3:[function(require,module,exports){
'use strict';

/**
 * The most basic component which all components should inherit from.
 * Each new Component should be given a unique name
 * @constructor
 */
var Component = function() {
    this.NAME = 'Component';
};

module.exports = Component;
},{}],4:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * @desc        Used for keeping track of an animation cycle
 * @param       {Object}    options
 * @param       {number}    [options.fps=24]             Frame per second
 * @param       {number}    [options.minFrame=0]         First frame in the animation
 * @param       {number}    [options.maxFrame=0]         Final frame in the animation
 * @param       {number}    [options.currentFrame=0]     Current frame
 * @param       {number}    [options.lastFrameTime]      Time since last frame
 * @constructor
 * @inherit     Component
 */
var Animation = function(options) {
    // Unique name for identifying in Entities
    this.NAME = 'Animation';

    var defaults = {
        fps: 24,
        minFrame: 0,
        maxFrame: 0,
        currentFrame: 0,
        lastFrameTime: 0
    };
    options = Helper.defaults(options, defaults);

    this.fps = options.fps;
    this.minFrame = options.minFrame;
    this.maxFrame = options.maxFrame;
    this.currentFrame = options.currentFrame;
    this.lastFrameTime = options.lastFrameTime;
};

Helper.inherit(Animation, Component);

/**
 * @desc    Updates and returns the current frame
 * @param   {number} delta    Time since last update
 * @return  {number}
 */
Animation.prototype.getFrame = function(delta) {
    this.lastFrameTime += delta;

    if (this.lastFrameTime > 1000 / this.fps) {
        this.lastFrameTime = 0;
        if (++this.currentFrame > this.maxFrame && this.maxFrame > -1) {
            this.currentFrame = this.minFrame;
        }
    }

    return this.currentFrame;
};

module.exports = Animation;
},{"../../component.js":3,"../../helper.js":12}],5:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * A generic container for color information
 * @constructor
 * @param {Object}      options
 * @param {String[]}    [options.colors=[]] CSS-compatible color codes
 */
var Color = function(options) {
    this.NAME = 'Color';

    var defaults = {
        colors: []
    };

    options = Helper.defaults(options, defaults);
    this.colors = options.colors;
};

Helper.inherit(Color, Component);

module.exports = Color;
},{"../../component.js":3,"../../helper.js":12}],6:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Defines a sprite sheet
 * @constructor
 * @inherit Component
 * @param {Object} options
 * @param {String} [options.src=null]       Path to the image
 * @param {number} [options.width=0]        Width of the sprite sheet
 * @param {number} [options.height=0]       Height of the sprite sheet
 * @param {number} [options.frameWidth=0]   Width of the individual frames
 * @param {number} [options.frameHeight=0]  Height of the individual frames
 * @param {number} [options.xOffset=0]      Initial x offset
 * @param {number} [options.yOffset=0]      Initial y offset
 */
var SpriteSheet = function(options) {
    // Unique name for reference in Entities
    this.NAME = 'SpriteSheet';

    var self = this,
        defaults = {
            src: null,
            width: 0,
            height: 0,
            frameWidth: 0,
            frameHeight: 0,
            xOffset: 0,
            yOffset: 0
        };

    options = Helper.defaults(options, defaults);
    this.img = new Image();
    this.img.src = options.src;
    this.img.width = options.width;
    this.img.height = options.height;
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.xOffset = options.xOffset;
    this.yOffset = options.yOffset;

    // Flag when the image has been loaded
    this.loaded = false;
    this.img.onload = function() {
        self.loaded = true;
    };
};

Helper.inherit(SpriteSheet, Component);

/**
 * Returns the width of the sheet
 * @return {number}
 */
SpriteSheet.prototype.getWidth = function() {
    return this.img.width;
};

/**
 * Returns the height of the sheet
 * @return {number}
 */
SpriteSheet.prototype.getHeight = function() {
    return this.img.height;
};

/**
 * Sets the width of the sheet
 * @param {number} width
 */
SpriteSheet.prototype.setWidth = function(width) {
    this.img.width = width;
};

/**
 * Sets the height of the sheet
 * @param {number} height
 */
SpriteSheet.prototype.setHeight = function(height) {
    this.img.height = height;
};

/**
 * Changes the sheet image
 * @param {String} path
 */
SpriteSheet.prototype.changeImage = function(path) {
    this.img.src = path;
};

/**
 * Returns the offset for a given frame
 * @param {number}  [frameX=0]
 * @param {number}  [frameY=0]
 * @return {{x:number, y:number}}
 */
SpriteSheet.prototype.getOffset = function(frameX, frameY) {
    if (this.img.src === null) {
        return null;
    }

    frameX = frameX || 0;
    frameY = frameY || 0;

    var offsetX = (this.frameWidth * frameX) + this.xOffset,
        offsetY = (this.frameHeight * frameY) + this.yOffset;

    if (offsetX > this.img.width || offsetY > this.img.height) {
        return null;
    } else {
        return {
            x: offsetX,
            y: offsetY
        };
    }
};

module.exports = SpriteSheet;
},{"../../component.js":3,"../../helper.js":12}],7:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Defines a simple circle
 * @constructor
 * @inherit Component
 * @param   {Object}    options
 * @param   {number}    [options.x=0]   Center x coordinate
 * @param   {number}    [options.y=0]   Center y coordinate
 * @param   {number}    [options.r=0]   Radius
 */
var Circle = function(options) {
    this.NAME = 'Circle';

    var defaults = {
        x: 0,
        y: 0,
        r: 0
    };

    options = Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
    this.r = options.r;
};

Helper.inherit(Circle, Component);

module.exports = Circle;
},{"../../component.js":3,"../../helper.js":12}],8:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Defines a single point
 * @constructor
 * @inherit Component
 * @param   {Object}    options
 * @param   {number}    [options.x=0]   X coordinate
 * @param   {number}    [options.y=0]   Y coordinate
 */
var Point = function(options) {
    this.NAME = 'Point';

    var defaults = {
        x: 0,
        y: 0
    };

    options = Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
};

Helper.inherit(Point, Component);

module.exports = Point;
},{"../../component.js":3,"../../helper.js":12}],9:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/***
 * Define a position (of an object)
 * @constructor
 * @inherit Component
 * @param   {Object}    coords
 * @param   {number}    [coords.x]          X coordinate
 * @param   {number}    [coords.y]          Y coordinate
 * @param   {number}    [coords.rotation]   Rotation
 */

var Position = function(coords){
    this.NAME = 'Position';

    var defaults = {
        x: 0,
        y: 0,
        rotation: 0
    };

    coords = Helper.defaults(coords, defaults);
    this.x = coords.x;
    this.y = coords.y;
    this.rotation = coords.rotation;
};

Helper.inherit(Position, Component);

module.exports = Position;
},{"../../component.js":3,"../../helper.js":12}],10:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Define a rectangle (often used in collisions)
 * @constructor
 * @inherit Component
 * @param   {Object}    options
 * @param   {number}    [options.x=0]   X coordinate
 * @param   {number}    [options.y=0]   Y coordinate
 * @param   {number}    [options.w=0]   Width
 * @param   {number}    [options.h=0]   Height
 */
var Rectangle = function(options) {
    this.NAME = 'Rectangle';

    var defaults = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };

    options = Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
};

Helper.inherit(Rectangle, Component);

module.exports = Rectangle;


},{"../../component.js":3,"../../helper.js":12}],11:[function(require,module,exports){
'use strict';

var Component = require('./component.js');

/**
 * A collection of Components which make up an object in the world
 * @constructor
 * @param {number} id   Unique ID assigned by the World
 */
var Entity = function(id) {
    this.id = id;
    this.components = {};
    this.parentLayer = null;
};

/**
 * Tells the Entity which Layer owns it.
 * Should only be used by the World
 * @param {Layer} layer
 */
Entity.prototype.setParentLayer = function(layer) {
    if (typeof layer === 'object' && layer.id !== undefined) {
        this.parentLayer = layer;
    } else {
        throw 'Invalid Argument: \'layer\' must be an instance of Layer';
    }
};

/**
 * Add a new Component to the Entity
 * @param {Component|*} component
 */
Entity.prototype.addComponent = function(component) {
    if (component instanceof Component) {
        this.components[component.NAME] = component;
    }
};

/**
 * Removes a Component from the Entity
 * @param {Component} componentName
 */
Entity.prototype.removeComponent = function(componentName) {
    if (componentName instanceof Component) {
        componentName = componentName.NAME;
    }

    delete this.components[componentName];
};

/**
 * Returns the component with the matching name
 * @param {String} componentName
 * @return {Component|null}
 */
Entity.prototype.getComponent = function(componentName) {
    if (componentName in this.components) {
        return this.components[componentName];
    } else {
        return null;
    }
};

/**
 * Determine if an Entity has a given component type
 * @param {String} componentName
 * @return {boolean}
 */
Entity.prototype.hasComponent = function(componentName) {
    return this.getComponent(componentName) !== null;
};

module.exports = Entity;
},{"./component.js":3}],12:[function(require,module,exports){
'use strict';

var
    // Save bytes in the minified version (see Underscore.js)
    ArrayProto          = Array.prototype,
    ObjProto            = Object.prototype,

    // Quick references for common core functions
    slice               = ArrayProto.slice,
    hasOwnProp          = ObjProto.hasOwnProperty,

    // Store the currently pressed keys
    keysDown = {};

// Capture keyboard events
window.onkeydown = function(e) {
    keysDown[e.keyCode] = {
        pressed: true,
        shift:   e.shiftKey,
        ctrl:    e.ctrlKey,
        alt:     e.altKey
    };
};

window.onkeyup = function(e) {
    if (keysDown.hasOwnProperty(e.keyCode)) {
        keysDown[e.keyCode].pressed = false;
    }
};

var Helper = {
    /**
     * Determine if an object has a property (not on the prototype chain)
     * @param {Object} obj
     * @param {*}      key
     * @returns {boolean}
     */
    has: function(obj, key) {
        return hasOwnProp.call(obj, key);
    },

    /**
     * Adds default properties to an object
     * @param {...Object} obj
     * @returns {Object}
     */
    defaults: function(obj) {
        obj = obj || {};
        slice.call(arguments, 1).forEach(function(source) {
            if (source) {
                for (var prop in source) {
                    if (obj[prop] === void 0) {
                        obj[prop] = source[prop];
                    }
                }
            }
        });

        return obj;
    },

    /**
     * Does very basic inheritance for a class
     * @param {Function} Derived    - Class to do the inheriting
     * @param {Function} Base       - Base class
     */
    inherit: function(Derived, Base) {
        Derived.prototype = new Base();
        Derived.constructor = Derived;
    },

    /**
     * Returns if a given key is pressed
     * @param {number}  keyCode                 Key code. Usually obtained from Keys
     * @param {Object}  modifiers
     * @param {boolean} [modifiers.shift=false] If true, will check if shift was held at the time
     * @param {boolean} [modifiers.ctrl=false]  If true, will check if control was held at the time
     * @param {boolean} [modifiers.alt=false]   If true, will check if alt was held at the time
     * @return {boolean}
     */
    isKeyDown: function(keyCode, modifiers) {
        modifiers = modifiers || {};
        var defaultModifiers = {
            shift: false,
            ctrl: false,
            alt: false
        };
        modifiers = Helper.defaults(modifiers, defaultModifiers);
        return (keysDown.hasOwnProperty(keyCode) &&
            keysDown[keyCode].pressed &&
            !(modifiers.shift && !keysDown[keyCode].shift) &&
            !(modifiers.ctrl && !keysDown[keyCode].ctrl) &&
            !(modifiers.alt && !keysDown[keyCode].alt));
    },

    /**
     * Returns all of the keys currently pressed
     * @return {Array}
     */
    getKeysDown: function() {
        var keys = [];
        for (var keyCode in keysDown) {
            if (Helper.has(keysDown, keyCode) && keysDown[keyCode].pressed) {
                keys.push(keyCode);
            }
        }
        return keys;
    }
};

module.exports = Helper;
},{}],13:[function(require,module,exports){
'use strict';

module.exports = {
    World: require('./world.js'),
    Component: require('./component.js'),
    Entity: require('./entity.js'),
    Layer: require('./layer.js'),
    System: require('./system.js'),
    RenderSystem: require('./render-system.js'),
    BehaviorSystem: require('./behavior-system.js'),

    Helper: require('./helper.js'),
    Keys: require('./keys.js'),

    Components: {
        GFX: {
            Animation: require('./components/gfx/animation.js'),
            Color: require('./components/gfx/color.js'),
            SpriteSheet: require('./components/gfx/sprite-sheet.js')
        },

        Physics: {
            Circle: require('./components/physics/circle.js'),
            Point: require('./components/physics/point.js'),
            Position: require('./components/physics/position.js'),
            Rectangle: require('./components/physics/rectangle.js')
        }
    },

    Systems: {
        Sprite: require('./systems/sprite.js')
    }
};
},{"./behavior-system.js":1,"./component.js":3,"./components/gfx/animation.js":4,"./components/gfx/color.js":5,"./components/gfx/sprite-sheet.js":6,"./components/physics/circle.js":7,"./components/physics/point.js":8,"./components/physics/position.js":9,"./components/physics/rectangle.js":10,"./entity.js":11,"./helper.js":12,"./keys.js":14,"./layer.js":15,"./render-system.js":16,"./system.js":17,"./systems/sprite.js":18,"./world.js":19}],14:[function(require,module,exports){
/**
 * A simple reference point for key codes
 * @type {Object}
 */
module.exports = {
    // Alphabet
    A: 65, B: 66, C: 67, D: 68, E: 69,
    F: 70, G: 71, H: 72, I: 73, J: 74,
    K: 75, L: 76, M: 77, N: 78, O: 79,
    P: 80, Q: 81, R: 82, S: 83, T: 84,
    U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,

    // Modifiers
    Shift:    16, Ctrl:    17, Alt: 18,
    CapsLock: 20, NumLock: 144,

    // numbers
    Zero: 48, One: 49, Two:   50, Three: 51, Four: 52,
    Five: 53, Six: 54, Seven: 55, Eight: 56, Nine: 57,

    // Arrow keys
    Left: 37, Up: 38, Right: 39, Down: 40,

    // Common keys
    Space: 32, Enter: 13, Tab: 9, Esc: 27, Backspace: 8
};
},{}],15:[function(require,module,exports){
'use strict';

var Entity = require('./entity.js'),
    System = require('./system.js'),
    BehaviorSystem = require('./behavior-system.js'),
    RenderSystem = require('./render-system.js');

/**
 * A layer houses a set of entities to be updated/drawn on each frame
 * @constructor
 * @param {Object}  options
 * @param {number}  options.id          - Unique ID assigned by the World
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
 * @param {number} zIndex
 */
Layer.prototype.setZIndex = function(zIndex) {
    this.c.canvas.style.zIndex = zIndex;
};

/**
 * Add an entity to the layer
 * @param {Entity}  entity
 * @param {boolean}         [addToSystems=false]
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
 * @param {number|Entity} entityID
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
};

module.exports = Layer;
},{"./behavior-system.js":1,"./entity.js":11,"./render-system.js":16,"./system.js":17}],16:[function(require,module,exports){
'use strict';

var System = require('./system.js'),
    Helper = require('./helper.js');

/**
 * Controls how Entities are displayed.
 * Called during the "draw" stage of a frame
 * @constructor
 * @inherit System
 */
var RenderSystem = function() {
    System.call(this);
    this.drawOrder = [];
};

Helper.inherit(RenderSystem, System);

/**
 * Add a new Entity to the collection and make it the last one to be drawn
 * @param {Entity|number} entity
 */
RenderSystem.prototype.addEntity = function(entity) {
    if (System.prototype.addEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            entity = this.entities[entity];
        }
        if (this.drawOrder.indexOf(entity) === -1) {
            this.drawOrder.push(entity);
        }
    }
};

/**
 * Removes an Entity
 * @param {Entity|number} entity
 * @return {boolean}
 */
RenderSystem.prototype.removeEntity = function(entity) {
    if (System.prototype.removeEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            for (var i = 0, len = this.drawOrder.length; i < len; i++) {
                if (this.drawOrder[i].id === entity) {
                    this.drawOrder.splice(i, 1);
                    break;
                }
            }
        } else {
            var index = this.drawOrder.indexOf(entity);
            if (index !== -1) {
                this.drawOrder.splice(index, 1);
            }
        }

        return true;
    } else {
        return false;
    }
};

/**
 * Draw all of the entities.
 * Should be defined for every RenderSystem
 * @param {CanvasRenderingContext2D} c
 */
RenderSystem.prototype.draw = function() {};

module.exports = RenderSystem;
},{"./helper.js":12,"./system.js":17}],17:[function(require,module,exports){
'use strict';

var Entity = require('./entity.js'),
    Helper = require('./helper.js');

/**
 * A system is what defines how entities behave or are rendered
 * @constructor
 */
var System = function() {
    this.entities = {};
    this.parentLayer = null;
    this.requiredComponents = [];
    this.active = true;
};

/**
 * Sets which layer this system belongs to
 * @param {Layer} layer
 */
System.prototype.setParentLayer = function(layer) {
    if (typeof layer === 'object' && Helper.has(layer, 'id')) {
        this.parentLayer = layer;
    } else {
        throw 'Invalid argument: \'layer\' must be an instance of Layer';
    }
};

/**
 * Add a new Entity to the collection
 * @param {Entity}      entity
 * @returns {boolean}   Returns true if Entity could be added
 */
System.prototype.addEntity = function(entity) {
    if (entity instanceof Entity) {
        // Only add entities with required components
        for (var i = 0, len = this.requiredComponents.length; i < len; i++) {
            if (!(this.requiredComponents[i] in entity.components)) {
                return false;
            }
        }
        this.entities[entity.id] = entity;
        return true;
    } else {
        throw 'Invalid Argument: \'entity\' must be an instance of Entity';
    }
};

/**
 * Remove an Entity from the collection
 * @param {Entity}      entity
 * @return {boolean}    True if the entity was removed
 */
System.prototype.removeEntity = function(entity) {
    var entityID = entity;
    if (entity instanceof Entity) {
        entityID = entity.id;
    }

    if (Helper.has(this.entities, entityID)) {
        delete this.entities[entityID];
        return true;
    } else {
        return false;
    }
};

module.exports = System;
},{"./entity.js":11,"./helper.js":12}],18:[function(require,module,exports){
'use strict';

var Helper = require('../helper.js'),
    RenderSystem = require('../render-system.js');

/**
 * Renders an animated sprite
 *
 * @inherit RenderSystem
 * @constructor
 */
var Sprite = function() {
    RenderSystem.call(this);
    this.RequiredComponents = ['SpriteSheet', 'Position'];
};

Helper.inherit(Sprite, RenderSystem);

/**
 * Draw all the sprites
 * @param {CanvasRenderingContext2D} c
 */
Sprite.prototype.draw = function(c) {
    for (var i = 0, len = this.DrawOrder.length; i < len; i++) {
        var entity = this.drawOrder[i],
            spriteSheet = entity.getComponent('SpriteSheet'),
            position = entity.getComponent('Position');

        c.save();
        c.translate(position.x, position.y);
        c.rotate(position.rotation);
        c.drawImage(
            spriteSheet.img,
            spriteSheet.xOffset,
            spriteSheet.yOffset,
            spriteSheet.frameWidth,
            spriteSheet.frameHeight,
            -spriteSheet.frameWidth / 2,
            -spriteSheet.frameHeight / 2,
            spriteSheet.frameWidth,
            spriteSheet.frameHeight
        );
        c.restore();
    }
};

module.exports = Sprite;
},{"../helper.js":12,"../render-system.js":16}],19:[function(require,module,exports){
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
     * @param {number} [options.width=window.innerWidth]
     * @param {number} [options.height=window.innerHeight]
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
     * @param {Entity|number} entity
     */
    removeEntity: function(entity) {
        if (typeof entity === 'number') {
            entity = entities[entity];
        }

        if (entity instanceof Entity) {
            entityRemovalQueue.push(entity);
        }
    },

    /**
     * Returns an Entity based on it's ID
     * @param {number} entityID
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
},{"./entity.js":11,"./helper.js":12,"./layer.js":15}]},{},[2])
;