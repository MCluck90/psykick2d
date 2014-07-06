'use strict';

var World = require('psykick2d').World,
    MapLoader = require('./map-loader.js'),

    WIDTH = 800,
    HEIGHT = 600;

World.init({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#AAF',
    preload: {
        spriteSheets: [
            'sprites/player.json',
            'sprites/terrain.json',
            'sprites/enemy.json',
            'sprites/flames.json'
        ]
    }
});

MapLoader.load(require('../maps/level1.json'));