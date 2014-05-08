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
    Space: 32, Enter: 13, Tab: 9, Esc: 27, Backspace: 8,

    // Mouse buttons/wheel
    Mouse: {
        Left: 0,
        Middle: 1,
        Right: 2
    },

    // Gamepad buttons for known pads
    Gamepad: {
        Xbox: {
            A: 0,
            B: 1,
            X: 2,
            Y: 3,
            LeftBumper: 4,
            RightBumper: 5,
            LeftTrigger: 6,
            RightTrigger: 7,
            Back: 8,
            Start: 9,
            DPadUp: 12,
            DPadDown: 13,
            DPadLeft: 14,
            DPadRight: 15,
            LeftStick: {
                Click: 10,
                X: 0,
                Y: 1
            },
            RightStick: {
                Click: 11,
                X: 2,
                Y: 3
            }
        }
    }
};