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
        nativeForEach       = ArrayProto.forEach;

    /**
     * Checks to see if an object has a given property (not on the prototype)
     *
     * @param {Object} obj
     * @param {Number|String} key
     * @return {Boolean}
     */
    Psykick.Helper.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };

    /**
     * Iterates and acts upon arrays and objects.
     * Largely taken from Underscore.js
     *
     * @param {Object} obj
     * @param {Function} iterator
     * @param {Object} context
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
     *
     * @param obj
     */
    Psykick.Helper.defaults = function(obj) {
        Helper.forEach(slice.call(arguments, 1), function(source) {
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

})();