'use strict';

var World = require('psykick2d').World,
    MapLoader = require('./map-loader.js'),
    CONSTANTS = require('./constants.js');

// Initialize the world
World.init({
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT,
    backgroundColor: '#AAF', // Cornflower blue-ish for the sky
    preload: {
        // Make sure all of the sprite sheets are loaded
        spriteSheets: [
            'sprites/player.json',
            'sprites/terrain.json',
            'sprites/enemy.json',
            'sprites/flames.json'
        ]
    }
});

// Load up level 1
MapLoader.load(require('../maps/level1.json'));