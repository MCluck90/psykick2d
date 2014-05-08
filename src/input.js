'use strict';

var // Determine if we're running on the server
    win = (typeof window !== 'undefined') ? window : null,

    // Store the keys current pressed
    keysPressed = {},

    // Store the state of the mouse
    globalMouseState = null,

    // Stores the position relative to the active layer
    layerMousePosition = {
        x: 0,
        y: 0
    },

    // Contains the position of the game window
    gamePosition = null;

/**
 * Keeps track of all user input
 */
var Input = {
    /**
     * Initializes the event handlers
     * @param {HTMLElement} gameContainer
     * @private
     */
    _init: function(gameContainer) {
        if (!win) {
            return;
        }
        keysPressed = {};

        var rect = gameContainer.getBoundingClientRect();
        gamePosition = {
            x: Math.ceil(rect.left),
            y: Math.ceil(rect.top)
        };

        // Setup mouse tracking
        function onMouseMove(evt) {
            evt.preventDefault();
            globalMouseState = globalMouseState || {
                x: 0,
                y: 0,
                buttons: []
            };
            globalMouseState.x = evt.clientX - gamePosition.x;
            globalMouseState.y = evt.clientY - gamePosition.y;
        }

        gameContainer.addEventListener('mousemove', onMouseMove);
        gameContainer.addEventListener('mouseover', onMouseMove);

        gameContainer.addEventListener('mouseleave', function() {
            globalMouseState = null;
        });

        gameContainer.addEventListener('mousedown', function(evt) {
            var button = evt.button,
                index = globalMouseState.buttons.indexOf(button);
            if (index === -1) {
                globalMouseState.buttons.push(button);
            }
        });

        gameContainer.addEventListener('mouseup', function(evt) {
            var button = evt.button,
                index = globalMouseState.buttons.indexOf(button);
            if (index !== -1) {
                globalMouseState.buttons.splice(index, 1);
            }
        });

        // Setup keyboard tracking
        gameContainer.addEventListener('keydown', function(evt) {
            keysPressed[evt.keyCode] = {
                pressed: true,
                shift:   evt.shiftKey,
                ctrl:    evt.ctrlKey,
                alt:     evt.altKey
            };
        });

        gameContainer.addEventListener('keyup', function(evt) {
            var keyCode = evt.keyCode;
            if (keysPressed[keyCode]) {
                keysPressed[keyCode].pressed = false;
            }
        });
    },
    Mouse: {
        /**
         * Adjusts the mouse position relative to a container
         * @param {DisplayObjectContainer} objectContainer
         */
        setRelativePosition: function(objectContainer) {
            if (globalMouseState) {
                layerMousePosition.x = globalMouseState.x - objectContainer.x;
                layerMousePosition.y = globalMouseState.y - objectContainer.y;
            }
        },

        /**
         * X position
         * @returns {number}
         */
        get X() {
            return (globalMouseState !== null) ? layerMousePosition.x : null;
        },

        /**
         * Y position
         * @returns {number}
         */
        get Y() {
            return (globalMouseState !== null) ? layerMousePosition.y : null;
        },

        /**
         * Checks to see if a mouse button is clicked
         * @param {number} button
         * @returns {boolean}
         */
        isButtonDown: function(button) {
            return (globalMouseState !== null && globalMouseState.buttons.indexOf(button) !== -1);
        }
    },
    Keyboard: {
        /**
         * Returns if a given key is pressed
         * @param {number}   keyCode                Key code. Usually obtained from Keys
         * @param {object}  [modifiers]
         * @param {boolean} [modifiers.shift=false] If true, will check if shift was held at the time
         * @param {boolean} [modifiers.ctrl=false]  If true, will check if control was held at the time
         * @param {boolean} [modifiers.alt=false]   If true, will check if alt was held at the time
         * @returns {boolean}
         */
        isKeyDown: function(keyCode, modifiers) {
            modifiers = modifiers || {};
            var defaultModifiers = {
                    shift: false,
                    ctrl: false,
                    alt: false
                },
                keyInfo = keysPressed[keyCode];
            modifiers = this.defaults(modifiers, defaultModifiers);
            return  (keyInfo && keyInfo.pressed)        &&
                   !(modifiers.shift && !keyInfo.shift) &&
                   !(modifiers.ctrl  && !keyInfo.ctrl)  &&
                   !(modifiers.alt   && !keyInfo.alt);
        },

        /**
         * Returns all of the keys current pressed
         * @returns {number[]}
         */
        getKeysDown: function() {
            var keys = [];
            for (var keyCode in keysPressed) {
                if (keysPressed[keyCode].pressed) {
                    keys.push(keyCode);
                }
            }
            return keys;
        }
    },
    Gamepad: {

    }
};

module.exports = Input;