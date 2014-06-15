'use strict';

var World = require('psykick2d').World,
    MapLoader = require('./map-loader.js'),

    WIDTH = 800,
    HEIGHT = 600;

World.init({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#000',
    preload: {
        spriteSheets: ['sprites/player.json']
    }
});

MapLoader.load(require('../maps/level1.json'));