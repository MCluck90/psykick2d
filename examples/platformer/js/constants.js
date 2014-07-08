'use strict';

/**
 * Defines a set of constants used throughout the game
 */
module.exports = {
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 600,
    WORLD_WIDTH: 10000,
    WORLD_HEIGHT: 10000,
    PLAYER: {
        RUN_SPEED: 8,
        JUMP_SPEED: 15,
        ATTACK_SPEED: 25,
        ATTACK_TIMEOUT: 1 / 4,
        ATTACK_COOLDOWN: 1
    },
    ENEMY: {
        SPEED: 10,
        REGION_MARGIN: 50
    }
};