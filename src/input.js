'use strict';

var Helper = require('./helper.js');

var // Determine if we're running on the server
    win = (typeof window !== 'undefined') ? window : null,

    nav = (typeof navigator !== 'undefined') ? navigator : null,

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
    gamePosition = null,

    // Attempt to add gamepad support
    gamepadSupportAvailable = !!(nav.webkitGetGamepads || nav.getGamepads),
    getGamepads = function() {
        if (!gamepadSupportAvailable) {
            return null;
        }
        if (nav.webkitGetGamepads) {
            return nav.webkitGetGamepads();
        } else if (nav.getGamepads) {
            return nav.getGamepads();
        }
    },

    currentPadIndex = 0;

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
            modifiers = Helper.defaults(modifiers, defaultModifiers);
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
        /**
         * Returns true if gamepad support is available
         * @returns {boolean}
         */
        isSupported: function() {
            return gamepadSupportAvailable;
        },

        /**
         * Returns true if a given gamepad is connected
         * Defaults to the currently selected pad
         * @param {number} [index=currentPadIndex]
         * @returns {boolean}
         */
        isConnected: function(index) {
            if (!gamepadSupportAvailable) {
                return false;
            }

            index = (index === undefined) ? currentPadIndex : index;
            var gamepad = getGamepads()[index];

            return (gamepad && gamepad.connected);
        },

        /**
         * Returns the current gamepad, if it's connected
         * @returns {Gamepad|null}
         */
        current: function() {
            if (!gamepadSupportAvailable) {
                return null;
            }

            var gamepads = getGamepads();
            return gamepads[currentPadIndex] || null;
        },

        /**
         * Moves to the next gamepad in the collection and returns it
         * @returns {Gamepad|null}
         */
        next: function() {
            if (!gamepadSupportAvailable) {
                return null;
            }

            currentPadIndex += 1;
            var gamepads = getGamepads(),
                numOfPossiblePads = gamepads.length;
            while (!gamepads[currentPadIndex]) {
                currentPadIndex += 1;
                if (currentPadIndex === numOfPossiblePads) {
                    currentPadIndex = 0;
                    break;
                }
            }

            return gamepads[currentPadIndex] || null;
        },

        /**
         * Moves to the previous gamepad in the collection and returns it
         * @returns {Gamepad|null}
         */
        prev: function() {
            if (!gamepadSupportAvailable) {
                return null;
            }

            currentPadIndex -= 1;
            var gamepads = getGamepads();
            while (!gamepads[currentPadIndex]) {
                currentPadIndex -= 1;
                if (currentPadIndex === 0) {
                    break;
                }
            }

            return gamepads[currentPadIndex] || null;
        },

        /**
         * Returns the value for a given button input
         * @param {number} buttonID
         * @returns {number}
         */
        getButton: function(buttonID) {
            var gamepad = Input.Gamepad.current(),
                button = (gamepad) ? gamepad.buttons[buttonID] : null;
            if (!button) {
                return 0;
            }

            return button.value || button || 0;
        },

        /**
         * Returns the value for a given axis
         * @param {number} axisID
         * @returns {number}
         */
        getAxis: function(axisID) {
            var gamepad = Input.Gamepad.current(),
                axis = (gamepad) ? gamepad.axes[axisID] : null;
            if (!axis) {
                return 0;
            }

            return axis;
        },

        /**
         * Returns all available gamepads
         * @returns {GamepadList|Array}
         */
        getGamepads: function() {
            if (gamepadSupportAvailable) {
                return getGamepads();
            } else {
                return [];
            }
        }
    }
};

module.exports = Input;