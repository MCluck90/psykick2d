'use strict';

var
    // Determine if we're running in a server environment or now
    win = (typeof window !== 'undefined') ? window : null,

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
    },

    /**
     * Returns 1 if x is positive
     * -1 if x is negative
     * 0 if x is 0
     * @param {number} x
     */
    sign: function(x) {
        return (x > 0) ?  1 :
               (x < 0) ? -1 : 0;
    }
};

module.exports = Helper;