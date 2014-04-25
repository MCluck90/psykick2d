(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        if (this.actionOrder.indexOf(entity) === -1) {
            this.actionOrder.push(entity);
            return true;
        }
    }
    return false;
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
},{"./helper.js":12,"./system.js":19}],2:[function(require,module,exports){
'use strict';

window.Psykick2D = require('./index.js');
},{"./index.js":15}],3:[function(require,module,exports){
'use strict';

/**
 * A basic camera
 * @constructor
 */
var Camera = function() {
    this.x = 0;
    this.y = 0;
};

/**
 * Called before every draw phase
 * @param {CanvasRenderingContext2D} c
 */
Camera.prototype.render = function(c) {
    c.translate(-this.x, -this.y);
};

Camera.prototype.toString = function() {
    return '[object Camera]';
};

module.exports = Camera;
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"../../component.js":4,"../../helper.js":12}],6:[function(require,module,exports){
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
},{"../../component.js":4,"../../helper.js":12}],7:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * Defines a sprite sheet
 * @constructor
 * @inherit Component
 * @param {Object} options
 * @param {String} [options.src=null]      Path to the image
 * @param {number} [options.width=0]       Width of the sprite sheet
 * @param {number} [options.height=0]      Height of the sprite sheet
 * @param {number} [options.frameWidth=0]  Width of the individual frames
 * @param {number} [options.frameHeight=0] Height of the individual frames
 * @param {number} [options.xOffset=0]     Initial x offset
 * @param {number} [options.yOffset=0]     Initial y offset
 * @param {string} [options.repeat=null]   Type of repeating pattern to use
 */
var SpriteSheet = function(options) {
    // Unique name for reference in Entities
    this.NAME = 'SpriteSheet';

    var self = this,
        defaults = {
            src: null,
            frameWidth: 0,
            frameHeight: 0,
            xOffset: 0,
            yOffset: 0,
            repeat: null
        };

    options = Helper.defaults(options, defaults);
    this.img = new Image();
    this.img.src = options.src;
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.xOffset = options.xOffset;
    this.yOffset = options.yOffset;
    this.repeat = options.repeat;

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
},{"../../component.js":4,"../../helper.js":12}],8:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

var RectPhysicsBody = function(options) {
    this.NAME = 'RectPhysicsBody';

    var defaults = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        velocity: {
            x: 0,
            y: 0
        },
        mass: 0,
        bounciness: 0,
        solid: true
    };

    options = Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
    this.velocity = options.velocity;
    this.mass = options.mass;
    this.bounciness = options.bounciness;
    this.solid = options.solid;
};

Helper.inherit(RectPhysicsBody, Component);

module.exports = RectPhysicsBody;
},{"../../component.js":4,"../../helper.js":12}],9:[function(require,module,exports){
'use strict';

var Component = require('../../component.js'),
    Helper = require('../../helper.js');

/**
 * A generic rectangle
 * @constructor
 * @param {Object}  options
 */
var Rectangle = function(options) {
    this.NAME = 'Rectangle';

    var defaults = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        rotation: 0
    };

    options = Helper.defaults(options, defaults);
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
    this.rotation = options.rotation;
};

Helper.inherit(Rectangle, Component);

module.exports = Rectangle;
},{"../../component.js":4,"../../helper.js":12}],10:[function(require,module,exports){
'use strict';

var Component = require('../component.js'),
    Helper = require('../helper.js');

/**
 * Represents some text
 * @param {object} [options]
 * @param {string} [options.text]
 * @param {number} [options.x]
 * @param {number} [options.y]
 * @param {string} [options.font]
 * @param {string} [options.size]
 * @inherit Component
 * @constructor
 */
var Text = function(options) {
    this.NAME = 'Text';
    var defaults = {
        text: '',
        x: 0,
        y: 0,
        font: '',
        size: '0px'
    };
    Helper.extend(this, defaults, options);
};

Helper.inherit(Text, Component);

module.exports = Text;
},{"../component.js":4,"../helper.js":12}],11:[function(require,module,exports){
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
 * Adds a Component marked as a given type
 * This can be used to use one component for multiple things i.e. physics body and a rectangle
 * @param {Component} component
 * @param {string} componentType Type to mark it as
 */
Entity.prototype.addComponentAs = function(component, componentType) {
    if (component instanceof Component) {
        this.components[componentType] = component;
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
},{"./component.js":4}],12:[function(require,module,exports){
/* jshint strict: false */
var
    // Determine if we're running in a server environment or now
    win = window || null,

    // Save bytes in the minified version (see Underscore.js)
    ArrayProto          = Array.prototype,
    ObjProto            = Object.prototype,

    // Quick references for common core functions
    slice               = ArrayProto.slice,
    hasOwnProp          = ObjProto.hasOwnProperty,

    // Store the currently pressed keys
    keysDown = {};

// Capture keyboard events
if (win) {
    win.addEventListener('keydown', function(e) {
        keysDown[e.keyCode] = {
            pressed: true,
            shift:   e.shiftKey,
            ctrl:    e.ctrlKey,
            alt:     e.altKey
        };
    });

    win.addEventListener('keyup', function(e) {
        if (keysDown.hasOwnProperty(e.keyCode)) {
            keysDown[e.keyCode].pressed = false;
        }
    });
}

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
     * Adds or replaces properties on an object
     * @param {T, ...[Object]} obj
     * @returns {T}
     * @template T
     */
    extend: function(obj) {
        for (var i = 1, len = arguments.length; i < len; i++) {
            var source = arguments[i];
            for (var key in source) {
                var current = obj[key],
                    prop = source[key];
                if (this.isObject(prop) && this.isObject(current)) {
                    obj[key] = this.extend(current, prop);
                } else {
                    obj[key] = prop;
                }
            }
        }

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
        modifiers = this.defaults(modifiers, defaultModifiers);
        return (keysDown.hasOwnProperty(keyCode) &&
            keysDown[keyCode].pressed &&
            !(modifiers.shift && !keysDown[keyCode].shift) &&
            !(modifiers.ctrl && !keysDown[keyCode].ctrl) &&
            !(modifiers.alt && !keysDown[keyCode].alt));
    },

    /**
     * Determines if the argument is an object
     * @param obj
     * @returns {boolean}
     */
    isObject: function(obj) {
        return ObjProto.toString.call(obj) === '[object Object]';
    },

    /**
     * Returns all of the keys currently pressed
     * @return {Array}
     */
    getKeysDown: function() {
        var keys = [];
        for (var keyCode in keysDown) {
            if (this.has(keysDown, keyCode) && keysDown[keyCode].pressed) {
                keys.push(keyCode);
            }
        }
        return keys;
    }
};

module.exports = Helper;
},{}],13:[function(require,module,exports){
'use strict';

/**
 * Determines if two objects are colliding
 * @param {Rectangle} a
 * @param {Rectangle} b
 * @returns {boolean}
 */
function isColliding(a, b) {
    var topA = a.y,
        bottomA = a.y + a.h,
        leftA = a.x,
        rightA = a.x + a.w,

        topB = b.y,
        bottomB = b.y + b.h,
        leftB = b.x,
        rightB = b.x + b.w,

        verticalIntersect = (topA <= bottomB && bottomA >= bottomB) ||
            (topB <= bottomA && bottomB >= bottomA),
        horizontalIntersect = (leftA <= rightB && rightA >= rightB) ||
            (leftB <= rightA && rightB >= rightA);

    return (verticalIntersect && horizontalIntersect);
}

/**
 * A simple grid for finding any collisions
 * Best used for tiled game worlds with defined boundaries
 * @param {object} options
 * @param {number} options.width        Width of the game world
 * @param {number} options.height       Height of the game world
 * @param {number} options.cellWidth    Width of a cell. May use cellSize instead
 * @param {number} options.cellHeight   Height of a cell. May use cellSize instead
 * @param {number} [options.cellSize]   Set this if you want width and height to be the same
 * @constructor
 */
var CollisionGrid = function(options) {
    this.width = options.width;
    this.height = options.height;
    if (options.cellSize) {
        this.cellWidth = options.cellSize;
        this.cellHeight = options.cellSize;
    } else {
        this.cellWidth = options.cellWidth || 100;
        this.cellHeight = options.cellHeight || 100;
    }

    var maxX = ~~(this.width / this.cellWidth),
        maxY = ~~(this.height / this.cellHeight);
    this._grid = new Array(maxX);
    for (var x = 0; x < maxX; x++) {
        this._grid[x] = new Array(maxY);
        for (var y = 0; y < maxY; y++) {
            this._grid[x][y] = [];
        }
    }
};

/**
 * Adds an entity to the grid
 * Entity must have a Rectangle component
 * @param {Entity} entity
 */
CollisionGrid.prototype.addEntity = function(entity) {
    var rect = entity.getComponent('Rectangle'),
        minX = ~~(rect.x / this.cellWidth),
        maxX = ~~( (rect.x + rect.w) / this.cellWidth ),
        minY = ~~(rect.y / this.cellHeight),
        maxY = ~~( (rect.y + rect.h) / this.cellHeight );
    for (var x = minX; x < maxX; x++) {
        for (var y = minY; y < maxY; y++) {
            var collection = this._grid[x][y];
            if (collection.indexOf(entity) === -1) {
                collection.push(entity);
            }
        }
    }
};

/**
 * Removes an entity from the grid
 * @param {Entity} entity
 */
CollisionGrid.prototype.removeEntity = function(entity) {
    var rect = entity.getComponent('Rectangle'),
        minX = ~~(rect.x / this.cellWidth),
        maxX = ~~( (rect.x + rect.w) / this.cellWidth ),
        minY = ~~(rect.y / this.cellHeight),
        maxY = ~~( (rect.y + rect.h) / this.cellHeight );
    for (var x = minX; x < maxX; x++) {
        for (var y = minY; y < maxY; y++) {
            var collection = this._grid[x][y],
                entityIndex = collection.indexOf(entity);
            if (entityIndex !== -1) {
                collection.splice(entityIndex, 1);
            }
        }
    }
};

/**
 * Moves an Entity and updates it's position in the grid
 * @param {Entity} entity
 * @param {{ x: number, y: number }} deltaPosition
 */
CollisionGrid.prototype.moveEntity = function(entity, deltaPosition) {
    var rect = entity.getComponent('Rectangle'),
        newRect = {
            minX: rect.x + deltaPosition.x,
            maxX: rect.x + rect.w + deltaPosition.x,
            minY: rect.y + deltaPosition.y,
            maxY: rect.y + rect.h + deltaPosition.y
        },
        oldCells = {
            minX: ~~(rect.x / this.cellWidth),
            maxX: ~~( (rect.x + rect.w) / this.cellWidth ),
            minY: ~~(rect.y / this.cellHeight),
            maxY: ~~( (rect.y + rect.h) / this.cellHeight )
        },
        newCells = {
            minX: ~~(newRect.minX / this.cellWidth),
            maxX: ~~(newRect.maxX / this.cellWidth),
            minY: ~~(newRect.minY / this.cellHeight),
            maxY: ~~(newRect.maxY / this.cellHeight)
        };
    if (oldCells.minX !== newCells.minX ||
        oldCells.maxX !== newCells.maxX ||
        oldCells.minY !== newCells.minY ||
        oldCells.maxY !== newCells.maxY) {
        this.removeEntity(entity);
        rect.x += deltaPosition.x;
        rect.y += deltaPosition.y;
        this.addEntity(entity);
    } else {
        rect.x += deltaPosition.x;
        rect.y += deltaPosition.y;
    }
};

/**
 * Gets the collisions for a given Entity
 * @param {Entity} entity
 * @returns {Entity[]}
 */
CollisionGrid.prototype.getCollisions = function(entity) {
    var rect = entity.getComponent('Rectangle'),
        minX = ~~(rect.x / this.cellWidth),
        maxX = ~~( (rect.x + rect.w) / this.cellWidth ),
        minY = ~~(rect.y / this.cellHeight),
        maxY = ~~( (rect.y + rect.h) / this.cellHeight ),
        results = [];

    for (var x = minX; x <= maxX; x++) {
        if (!this._grid[x]) {
            continue;
        }
        for (var y = minY; y <= maxY; y++) {
            if (!this._grid[x][y]) {
                continue;
            }
            var collection = this._grid[x][y];
            for (var i = 0, len = collection.length; i < len; i++) {
                var other = collection[i];
                if (other !== entity && isColliding(other.getComponent('Rectangle'), rect)) {
                    if (results.indexOf(other) === -1) {
                        results.push(other);
                    }
                }
            }
        }
    }

    return results;
};

module.exports = CollisionGrid;
},{}],14:[function(require,module,exports){
'use strict';

/**
 * Determines if two objects are colliding
 * @param {RectPhysicsBody} a
 * @param {RectPhysicsBody} b
 * @returns {boolean}
 */
function isColliding(a, b) {
    var topA = a.y,
        bottomA = a.y + a.h,
        leftA = a.x,
        rightA = a.x + a.w,

        topB = b.y,
        bottomB = b.y + b.h,
        leftB = b.x,
        rightB = b.x + b.w,

        verticalIntersect = (topA <= bottomB && bottomA >= bottomB) ||
            (topB <= bottomA && bottomB >= bottomA),
        horizontalIntersect = (leftA <= rightB && rightA >= rightB) ||
            (leftB <= rightA && rightB >= rightA);

    return (verticalIntersect && horizontalIntersect);
}

/**
 * Keeps track of all the physical objects in space
 * @param {object} options
 * @param {number} options.x        X position
 * @param {number} options.y        Y position
 * @param {number} options.w        Width
 * @param {number} options.h        Height
 * @param {number} options.cellSize Size of a cell
 * @constructor
 */
var QuadTree = function(options) {
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
    this.cellSize = options.cellSize || 100;
    this.children = new Array(4);
    this.entities = [];
};

/**
 * Adds an entity to the tree
 * @param {Entity} entity
 * @param {RectPhysicsBody} [body]
 */
QuadTree.prototype.addEntity = function(entity, body) {
    if (this.entities.indexOf(entity) !== -1) {
        return;
    }
    if (this.w <= this.cellSize || this.h <= this.cellSize) {
        this.entities.push(entity);
    } else {
        body = body || entity.getComponent('RectPhysicsBody');
        var top    = body.y,
            bottom = body.y + body.h,
            left   = body.x,
            right  = body.x + body.w,
            inUpper = (top <= this.y + this.h / 2),
            inLower = (bottom >= this.y + this.h / 2),
            inLeft = (left <= this.x + this.w / 2),
            inRight = (right >= this.x + this.w / 2),
            nodeOptions = {
                w: this.w / 2,
                h: this.h / 2,
                cellSize: this.cellSize
            };

        if (inUpper && inLeft) {
            if (!this.children[0]) {
                nodeOptions.x = this.x;
                nodeOptions.y = this.y;
                this.children[0] = new QuadTree(nodeOptions);
            }
            this.children[0].addEntity(entity, body);
        }
        if (inUpper && inRight) {
            if (!this.children[1]) {
                nodeOptions.x = this.x + this.w / 2;
                nodeOptions.y = this.y;
                this.children[1] = new QuadTree(nodeOptions);
            }
            this.children[1].addEntity(entity, body);
        }
        if (inLower && inRight) {
            if (!this.children[2]) {
                nodeOptions.x = this.x + this.w / 2;
                nodeOptions.y = this.y + this.h / 2;
                this.children[2] = new QuadTree(nodeOptions);
            }
            this.children[2].addEntity(entity, body);
        }
        if (inLower && inLeft) {
            if (!this.children[3]) {
                nodeOptions.x = this.x;
                nodeOptions.y = this.y + this.h / 2;
                this.children[3] = new QuadTree(nodeOptions);
            }
            this.children[3].addEntity(entity, body);
        }
    }
};

/**
 * Removes an Entity from the tree
 * @param {Entity} entity
 * @param {RectPhysicsBody} [body]
 */
QuadTree.prototype.removeEntity = function(entity, body) {
    var entityIndex = this.entities.indexOf(entity);
    if (entityIndex !== -1) {
        this.entities.splice(entityIndex, 1);
        return;
    }

    body = body || entity.getComponent('RectPhysicsBody');
    var top    = body.y,
        bottom = body.y + body.h,
        left   = body.x,
        right  = body.x + body.w,
        inUpper = (top <= this.y + this.h / 2),
        inLower = (bottom >= this.y + this.h / 2),
        inLeft = (left <= this.x + this.w / 2),
        inRight = (right >= this.x + this.w / 2);

    if (inUpper && inLeft && this.children[0]) {
        this.children[0].removeEntity(entity, body);
    }
    if (inUpper && inRight && this.children[1]) {
        this.children[1].removeEntity(entity, body);
    }
    if (inLower && inRight && this.children[2]) {
        this.children[2].removeEntity(entity, body);
    }
    if (inLower && inLeft && this.children[3]) {
        this.children[3].removeEntity(entity, body);
    }
};

/**
 * Moves an Entity and updates it's position in the tree
 * @param {Entity} entity
 * @param {{ x: number, y: number }} deltaPosition
 */
QuadTree.prototype.moveEntity = function(entity, deltaPosition) {
    var body = entity.getComponent('RectPhysicsBody'),
        hasMoved = (Math.abs(deltaPosition.x) + Math.abs(deltaPosition.y)) > 0;

    // TODO: Do a smart check to see if it's changed cells
    if (hasMoved) {
        this.removeEntity(entity, body);
        body.x += deltaPosition.x;
        body.y += deltaPosition.y;
        this.addEntity(entity, body);
    }
};

/**
 * Returns all entities the given entity is colliding with
 * @param {Entity} entity
 * @param {RectPhysicsBody} [body]
 * @returns {Entity[]}
 */
QuadTree.prototype.getCollisions = function(entity, body) {
    var result = [];
    if (this.entities.indexOf(entity) === -1) {
        body = body || entity.getComponent('RectPhysicsBody');
        var top    = body.y,
            bottom = body.y + body.h,
            left   = body.x,
            right  = body.x + body.w,
            inUpper = (top <= this.y + this.h / 2),
            inLower = (bottom >= this.y + this.h / 2),
            inLeft = (left <= this.x + this.w / 2),
            inRight = (right >= this.x + this.w / 2);

        if (inUpper && inLeft && this.children[0]) {
            result = result.concat(this.children[0].getCollisions(entity, body));
        }
        if (inUpper && inRight && this.children[1]) {
            result = result.concat(this.children[1].getCollisions(entity, body));
        }
        if (inLower && inRight && this.children[2]) {
            result = result.concat(this.children[2].getCollisions(entity, body));
        }
        if (inLower && inLeft && this.children[3]) {
            result = result.concat(this.children[3].getCollisions(entity, body));
        }
    } else {
        for (var i = 0, len = this.entities.length; i < len; i++) {
            var other = this.entities[i];
            if (other === entity) {
                continue;
            }
            if (isColliding(body, other.getComponent('RectPhysicsBody'))) {
                result.push(other);
            }
        }
    }

    return result.filter(function(elem, pos) {
        return result.indexOf(elem) === pos;
    });
};

module.exports = QuadTree;
},{}],15:[function(require,module,exports){
module.exports = {
    BehaviorSystem: require('./behavior-system.js'),
    Camera: require('./camera.js'),
    Component: require('./component.js'),
    Components: {
        GFX: {
            Animation: require('./components/gfx/animation.js'),
            Color: require('./components/gfx/color.js'),
            SpriteSheet: require('./components/gfx/sprite-sheet.js')
        },
        Physics: {
            RectPhysicsBody: require('./components/physics/rect-physics-body.js')
        },
        Shape: {
            Rectangle: require('./components/shape/rectangle.js')
        },
        Text: require('./components/text.js')
    },
    Entity: require('./entity.js'),
    Helper: require('./helper.js'),
    Helpers: {
        CollisionGrid: require('./helpers/collision-grid.js'),
        QuadTree: require('./helpers/quad-tree.js')
    },
    Keys: require('./keys.js'),
    Layer: require('./layer.js'),
    RenderSystem: require('./render-system.js'),
    System: require('./system.js'),
    Systems: {
        Behavior: {
            Animate: require('./systems/behavior/animate.js'),
            Physics: {
                Platformer: require('./systems/behavior/physics/platformer.js')
            }
        },
        Render: {
            ColoredRect: require('./systems/render/colored-rect.js'),
            Sprite: require('./systems/render/sprite.js'),
            Text: require('./systems/render/text.js')
        }
    },
    World: require('./world.js')
};
},{"./behavior-system.js":1,"./camera.js":3,"./component.js":4,"./components/gfx/animation.js":5,"./components/gfx/color.js":6,"./components/gfx/sprite-sheet.js":7,"./components/physics/rect-physics-body.js":8,"./components/shape/rectangle.js":9,"./components/text.js":10,"./entity.js":11,"./helper.js":12,"./helpers/collision-grid.js":13,"./helpers/quad-tree.js":14,"./keys.js":16,"./layer.js":17,"./render-system.js":18,"./system.js":19,"./systems/behavior/animate.js":20,"./systems/behavior/physics/platformer.js":21,"./systems/render/colored-rect.js":22,"./systems/render/sprite.js":23,"./systems/render/text.js":24,"./world.js":25}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
 * @param {boolean} options.serverMode  - If true, a canvas will not be made
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
    if (!options.serverMode) {
    var canvas = document.createElement('canvas');
        canvas.width = parseInt(options.container.style.width, 10);
        canvas.height = parseInt(options.container.style.height, 10);
        canvas.setAttribute('id', 'psykick-layer-' + options.id);
        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.zIndex = 0;

        this.c = canvas.getContext('2d');
    }
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
    // If the node doesn't exist, don't even try to draw
    if (!this.c || this.c.canvas.parentNode === null) {
        return;
    }

    this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);

    // If the layer has a camera, use it
    if (this.camera !== null) {
        this.c.save();
        this.camera.render(this.c);
    }

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
};

module.exports = Layer;
},{"./behavior-system.js":1,"./render-system.js":18,"./system.js":19}],18:[function(require,module,exports){
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
        if (this.drawOrder.indexOf(entity) === -1) {
            this.drawOrder.push(entity);
            return true;
        }
    }
    return false;
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
},{"./helper.js":12,"./system.js":19}],19:[function(require,module,exports){
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
        throw new Error('Invalid Argument: \'entity\' must be an instance of Entity');
    }
};

/**
 * Remove an Entity from the collection
 * @param {Entity|number}      entity
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
},{"./entity.js":11,"./helper.js":12}],20:[function(require,module,exports){
'use strict';

var Helper = require('../../helper.js'),
    BehaviorSystem = require('../../behavior-system.js');

/**
 * Updates animations
 *
 * @inherit BehaviorSystem
 * @constructor
 */
var Animate = function() {
    BehaviorSystem.call(this);
    this.requiredComponents = ['Animation'];
};

Helper.inherit(Animate, BehaviorSystem);

/**
 * Updates the animations
 * @param {number} delta
 */
Animate.prototype.update = function(delta) {
    for (var i = 0, len = this.actionOrder.length; i < len; i++) {
        var entity = this.actionOrder[i],
            animation = entity.getComponent('Animation'),
            frameTime = (1000 / animation.fps) / 1000;
        animation.lastFrameTime += delta;
        if (animation.lastFrameTime > frameTime) {
            animation.lastFrameTime = 0;
            animation.currentFrame += 1;
            if (animation.currentFrame > animation.maxFrame) {
                animation.currentFrame = animation.minFrame;
            }
        }
    }
};

module.exports = Animate;
},{"../../behavior-system.js":1,"../../helper.js":12}],21:[function(require,module,exports){
'use strict';

var Helper = require('../../../helper.js'),
    BehaviorSystem = require('../../../behavior-system.js'),
    QuadTree = require('../../../helpers/quad-tree.js');

var GRAVITY = 9.8,
    FRICTION = 10;

/**
 * Returns the sides of a body
 * @param {RectPhysicsBody} body
 * @returns {{
 *  top: number,
 *  bottom: number,
 *  left: number,
 *  right: number
 * }}
 */
function getSides(body) {
    return {
        top: body.y,
        bottom: body.y + body.h,
        left: body.x,
        right: body.x + body.w
    };
}

function callEventHandlers(entity, other) {
    /* jshint validthis:true */
    var collection = this._collisionHandlers[entity.id] || [];
    for (var i = 0, len = collection.length; i < len; i++) {
        collection[i](other);
    }
}

/**
 * Handles essential physics
 * @inherits BehaviorSystem
 * @constructor
 */
var Platformer = function(options) {
    BehaviorSystem.call(this);
    var defaults = {
        x: 0,
        y: 0,
        w: 800,
        h: 600,
        cellSize: 100
    };
    options = Helper.defaults(options, defaults);
    this._collisionHandlers = {};
    this._quadTree = new QuadTree(options);
    this.requiredComponents = ['RectPhysicsBody'];
};

Helper.inherit(Platformer, BehaviorSystem);

/**
 * Adds a handler for when a given entity encounters a collision
 * @param {Entity} entity
 * @param {function(Entity)} callback
 */
Platformer.prototype.addCollisionHandler = function(entity, callback) {
    var collection = this._collisionHandlers[entity.id];
    if (collection.indexOf(callback) === -1) {
        this._collisionHandlers[entity.id].push(callback);
    }
};

/**
 * Removes a given collision handler for a given entity
 * @param {Entity} entity
 * @param {function} callback
 */
Platformer.prototype.removeCollisionHandler = function(entity, callback) {
    var collection = this._collisionHandlers[entity.id],
        index = (collection) ? collection.indexOf(callback) : -1;
    if (index !== -1) {
        collection.splice(index, 1);
    }
};

Platformer.prototype.addEntity = function(entity) {
    if (BehaviorSystem.prototype.addEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            entity = this.entities[entity];
        }
        this._quadTree.addEntity(entity);
        this._collisionHandlers[entity.id] = [];
        return true;
    } else {
        return false;
    }
};

Platformer.prototype.removeEntity = function(entity) {
    if (BehaviorSystem.prototype.removeEntity.call(this, entity)) {
        this._quadTree.removeEntity(entity);
        delete this._collisionHandlers[entity.id];
        return true;
    } else {
        return false;
    }
};

Platformer.prototype.update = function(delta) {
    for (var i = 0, len = this.actionOrder.length; i < len; i++) {
        // Update it's position
        var entity = this.actionOrder[i],
            body = entity.getComponent('RectPhysicsBody'),
            vXSign = (body.velocity.x) ? (body.velocity.x < 0) ? -1 : 1 : 0,
            frictionForce = delta * FRICTION * vXSign,
            gravityForce = delta * GRAVITY * body.mass;

        body.velocity.x -= frictionForce;
        body.velocity.y += gravityForce;
        if (Math.abs(body.velocity.x) < Math.abs(frictionForce)) {
            body.velocity.x = 0;
        }
        if (Math.abs(body.velocity.y) < gravityForce) {
            body.velocity.y = 0;
        }
        this._quadTree.moveEntity(entity, body.velocity);

        // Resolve any collisions
        var collisions = (body.solid) ? this._quadTree.getCollisions(entity) : [],
            entityIsMoving = (body.velocity.x !== 0 || body.velocity.y !== 0),
            entitySides = getSides(body);
        for (var j = 0, len2 = collisions.length; j < len2; j++) {
            var other = collisions[j],
                otherBody = other.getComponent('RectPhysicsBody'),
                otherIsMoving = (otherBody.velocity.x !== 0 || otherBody.velocity.y !== 0),
                otherSides = getSides(otherBody),
                bothMoving = (entityIsMoving && otherIsMoving);

            callEventHandlers.call(this, entity, other);

            if (!otherBody.solid) {
                continue;
            }

            if (!bothMoving) {
                var movingEntity = (entityIsMoving) ? entity : other,
                    movingBody = (entityIsMoving) ? body : otherBody,
                    movingSides = (entityIsMoving) ? entitySides : otherSides,
                    staticSides = (entityIsMoving) ? otherSides : entitySides,
                    deltaPosition = {
                        x: 0,
                        y: 0
                    },
                    fromAbove = movingSides.bottom - staticSides.top,
                    fromBelow = staticSides.bottom - movingSides.top,
                    fromLeft = movingSides.right - staticSides.left,
                    fromRight = staticSides.right - movingSides.left;
                if (movingSides.bottom >= staticSides.top &&
                    movingSides.top < staticSides.top &&
                    Math.abs(fromAbove).toFixed(6) * 1 <= (movingBody.velocity.y + gravityForce).toFixed(6) * 1) {
                    // Dropping from above
                    deltaPosition.y = -fromAbove;
                    movingBody.velocity.y = 0;
                } else if (movingSides.top <= staticSides.bottom &&
                    movingSides.bottom > staticSides.bottom &&
                    movingBody.velocity.y < 0 &&
                    Math.abs(fromBelow).toFixed(6) * 1 <= Math.abs(movingBody.velocity.y).toFixed(6) * 1) {
                    // Coming from below
                    deltaPosition.y = fromBelow;
                    movingBody.velocity.y = 0;
                } else if (movingSides.right >= staticSides.left &&
                    movingSides.left < staticSides.left &&
                    Math.abs(fromLeft).toFixed(6) * 1 <= Math.abs(movingBody.velocity.x).toFixed(6) * 1) {
                    // Coming from the left
                    deltaPosition.x = -fromLeft;
                    movingBody.velocity.x = 0;
                } else if (movingSides.left <= staticSides.right &&
                    movingSides.right > staticSides.right &&
                    Math.abs(fromRight).toFixed(6) * 1 <= Math.abs(movingBody.velocity.x).toFixed(6) * 1) {
                    // Coming from the right
                    deltaPosition.x = fromRight;
                    movingBody.velocity.x = 0;
                } else {
                    //debugger;
                }

                this._quadTree.moveEntity(movingEntity, deltaPosition);
            }
        }
    }
};

module.exports = Platformer;
},{"../../../behavior-system.js":1,"../../../helper.js":12,"../../../helpers/quad-tree.js":14}],22:[function(require,module,exports){
'use strict';

var Helper = require('../../helper.js'),
    RenderSystem = require('../../render-system.js');

/**
 * Renders colored rectangles
 * @constructor
 */
var ColoredRect = function() {
    RenderSystem.call(this);
    this.requiredComponents = ['Color', 'Rectangle'];
};

Helper.inherit(ColoredRect, RenderSystem);

/**
 * Draws all the rectangles
 * @param {CanvasRenderingContext2D} c
 */
ColoredRect.prototype.draw = function(c) {
    for (var i = 0, len = this.drawOrder.length; i < len; i++) {
        var entity = this.drawOrder[i],
            color = entity.getComponent('Color').colors[0],
            rect = entity.getComponent('Rectangle');
        c.fillStyle = color;
        c.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
};

module.exports = ColoredRect;
},{"../../helper.js":12,"../../render-system.js":18}],23:[function(require,module,exports){
'use strict';

var Helper = require('../../helper.js'),
    RenderSystem = require('../../render-system.js');

/**
 * Renders an animated sprite
 *
 * @inherit RenderSystem
 * @constructor
 */
var Sprite = function() {
    RenderSystem.call(this);
    this.requiredComponents = ['SpriteSheet', 'Rectangle'];
    this._patternCanvases = {};
};

Helper.inherit(Sprite, RenderSystem);

/**
 * Removes an Entity
 * @param {Entity|number} entity
 * @return {boolean}
 */
Sprite.prototype.removeEntity = function(entity) {
    if (RenderSystem.prototype.removeEntity.call(this, entity)) {
        if (typeof entity === 'number') {
            delete this._patternCanvases[entity];
        } else {
            delete this._patternCanvases[entity.id];
        }
        return true;
    } else {
        return false;
    }
};

/**
 * Draw all the sprites
 * @param {CanvasRenderingContext2D} c
 */
Sprite.prototype.draw = function(c) {
    for (var i = 0, len = this.drawOrder.length; i < len; i++) {
        var entity = this.drawOrder[i],
            spriteSheet = entity.getComponent('SpriteSheet'),
            rect = entity.getComponent('Rectangle');
        if (!spriteSheet.loaded) {
            continue;
        }

        c.save();
        if (spriteSheet.repeat) {
            c.translate(rect.x, rect.y);
            c.rotate(rect.rotation);
            var patternCanvas = this._patternCanvases[entity.id];
            if (!patternCanvas) {
                patternCanvas = document.createElement('canvas');
                patternCanvas.width = spriteSheet.frameWidth;
                patternCanvas.height = spriteSheet.frameHeight;
                this._patternCanvases[entity.id] = patternCanvas;
            }
            var patternContext = patternCanvas.getContext('2d');
            patternContext.drawImage(
                spriteSheet.img,
                spriteSheet.xOffset,
                spriteSheet.yOffset,
                spriteSheet.frameWidth,
                spriteSheet.frameHeight,
                0,
                0,
                spriteSheet.frameWidth,
                spriteSheet.frameHeight
            );
            c.fillStyle = c.createPattern(patternCanvas, spriteSheet.repeat);
            c.fillRect(
                0,
                0,
                rect.w,
                rect.h
            );
        } else {
            c.translate(rect.x + rect.w / 2, rect.y + rect.h / 2);
            c.rotate(rect.rotation);
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
        }
        c.restore();
    }
};

module.exports = Sprite;
},{"../../helper.js":12,"../../render-system.js":18}],24:[function(require,module,exports){
'use strict';

var RenderSystem = require('../../render-system.js'),
    Helper = require('../../helper.js');

/**
 * Renders text
 *
 * @inherit RenderSystem
 * @constructor
 */
var Text = function() {
    RenderSystem.call(this);
    this.requiredComponents = ['Text', 'Color'];
};

Helper.inherit(Text, RenderSystem);

/**
 * Draws all of the text
 * @param {CanvasRenderingContext2D} c
 */
Text.prototype.draw = function(c) {
    for (var i = 0, len = this.drawOrder.length; i < len; i++) {
        var entity = this.drawOrder[i],
            textComponent = entity.getComponent('Text'),
            color = entity.getComponent('Color').colors[0];
        
        c.font = textComponent.size + ' ' + textComponent.font;
        c.fillStyle = color;
        c.fillText(textComponent.text, textComponent.x, textComponent.y);
    }
};

module.exports = Text;
},{"../../helper.js":12,"../../render-system.js":18}],25:[function(require,module,exports){
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
    serverMode = false;

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
            gameTime = new Date(),
            defaults = {
                canvasContainer: null,
                width: 800,
                height: 600,
                backgroundColor: '#000',
                serverMode: false
            },
            backgroundEl,
            requestAnimationFrame;

        options = Helper.defaults(options, defaults);
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
        } else {
            requestAnimationFrame = function(callback) {
                setTimeout(callback, 1000 / 60);
            };
        }

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
},{"./entity.js":11,"./helper.js":12,"./layer.js":17}]},{},[2]);