'use strict';

/* global window: true */
var
    window = window || null,
    // Save bytes in the minified version (see Underscore.js)
    ArrayProto          = Array.prototype,
    ObjProto            = Object.prototype,

    // Quick references for common core functions
    slice               = ArrayProto.slice,
    hasOwnProp          = ObjProto.hasOwnProperty,

    // Store the currently pressed keys
    keysDown = {};

// Capture keyboard events
if (window) {
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