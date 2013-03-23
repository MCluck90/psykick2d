/**
 * @namespace   Contains a collection of helper function
 */
Psykick.Helper = {};
(function(undefined) {
    "use strict";

    var
        // Establish the object that gets returned to break out of a loop iteration
        breaker = {},

        // Save bytes in the minified version (see Underscore.js)
        ArrayProto          = Array.prototype,
        ObjProto            = Object.prototype,
        FuncProto           = Function.prototype,

        // Quick references for common core functions
        push                = ArrayProto.push,
        slice               = ArrayProto.slice,
        concat              = ArrayProto.concat,
        hasOwnProperty      = ObjProto.hasOwnProperty,

        // Native ECMAScript 5 functions, which are hopefully available
        nativeForEach       = ArrayProto.forEach,

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

    /**
     * Checks to see if an object has a given property (not on the prototype)
     * @param   {Object}          obj
     * @param   {Number|String}   key
     * @return  {Boolean}
     */
    Psykick.Helper.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };

    /**
     * Iterates and acts upon arrays and objects.
     * Largely taken from Underscore.js
     * @param {Object}      obj
     * @param {Function}    iterator
     * @param {Object}      context
     */
    Psykick.Helper.forEach = function(obj, iterator, context) {
        if (obj === null || obj === undefined) {
            return;
        }

        if (nativeForEach && obj.forEach === nativeForEach) {
            // If the native foreach is available, just use that
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            // If the length is equal to the numeric length then this is an array
            for (var i = 0, len = obj.length; i < len; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) {
                    return;
                }
            }
        } else {
            // No native foreach and it's an object
            for (var key in obj) {
                if (Helper.has(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) {
                        return;
                    }
                }
            }
        }
    };

    /**
     * Fill in a given object with default properties
     * @param {Object} obj
     */
    Psykick.Helper.defaults = function(obj) {
        obj = obj || {};
        Psykick.Helper.forEach(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    if (obj[prop] === void 0) {
                        obj[prop] = source[prop];
                    }
                }
            }
        });

        return obj;
    };

    /**
     * Shortcut for extremely simple prototypical inheritance
     * @param {Function} derived    Derived class constructor
     * @param {Function} base       Base class constructor
     */
    Psykick.Helper.extend = function(derived, base) {
        derived.prototype = new base();
        derived.constructor = derived;
    };

    /**
     * Returns if a given key is pressed
     * @param {Number}  keyCode                 Key code. Usually obtained from Psykick.Keys
     * @param {Object}  modifiers
     * @param {Boolean} [modifiers.shift=false] If true, will check if shift was held at the time
     * @param {Boolean} [modifiers.ctrl=false]  If true, will check if control was held at the time
     * @param {Boolean} [modifiers.alt=false]   If true, will check if alt was held at the time
     * @return {Boolean}
     */
    Psykick.Helper.keyDown = function(keyCode, modifiers) {
        modifiers = modifiers || {};
        var defaultModifiers = {
            shift: false,
            ctrl: false,
            alt: false
        };
        modifiers = Psykick.Helper.defaults(modifiers, defaultModifiers);
        return (keysDown.hasOwnProperty(keyCode) &&
                keysDown[keyCode].pressed &&
                !(modifiers.shift && !keysDown[keyCode].shift) &&
                !(modifiers.ctrl && !keysDown[keyCode].ctrl) &&
                !(modifiers.alt && !keysDown[keyCode].alt));
    };

})();